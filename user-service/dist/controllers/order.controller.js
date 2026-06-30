"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrderStatus = exports.getOrder = exports.getOrders = exports.createOrder = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const axios_1 = __importDefault(require("axios"));
const order_model_1 = __importDefault(require("../models/order.model"));
const order_item_model_1 = __importDefault(require("../models/order-item.model"));
const dining_table_model_1 = __importDefault(require("../models/dining-table.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const delivery_model_1 = __importDefault(require("../models/delivery.model"));
const publisher_1 = require("../events/publisher");
exports.createOrder = (0, express_async_handler_1.default)(async (req, res) => {
    const { orderItems, ...orderData } = req.body;
    let orderSubtotal = 0;
    let orderTotalTax = 0;
    const ITEMS_SERVICE_URL = process.env.ITEMS_SERVICE_URL || "http://localhost:3001/api/item";
    if (orderItems && Array.isArray(orderItems) && orderItems.length > 0) {
        for (const item of orderItems) {
            try {
                const response = await axios_1.default.get(`${ITEMS_SERVICE_URL}/${item.item_id}`, {
                    validateStatus: (status) => status < 500, // Handle 404s manually instead of throwing
                });
                if (response.status !== 200) {
                    res.status(404).json({ success: false, message: `Item ID ${item.item_id} not found in items-service.` });
                    return;
                }
                const responseData = response.data;
                const realItem = responseData.data;
                // Base price and tax
                item.price = Number(realItem.price) || 0;
                item.tax_name = realItem.tax?.name || "Standard";
                item.tax_rate = Number(realItem.tax?.tax_rate) || 0;
                // Variations Calculation
                let variationTotal = 0;
                if (Array.isArray(item.item_variations)) {
                    const verifiedVariations = [];
                    for (const clientVar of item.item_variations) {
                        const varId = clientVar.id || clientVar.variation_id;
                        const realVar = realItem.variations?.find((v) => v.id === varId);
                        if (realVar) {
                            variationTotal += Number(realVar.price) || 0;
                            verifiedVariations.push({
                                id: realVar.id,
                                name: realVar.name,
                                price: Number(realVar.price),
                                attribute: realVar.attribute?.name
                            });
                        }
                    }
                    item.item_variations = verifiedVariations;
                }
                item.item_variation_total = variationTotal;
                // Extras Calculation
                let extraTotal = 0;
                if (Array.isArray(item.item_extras)) {
                    const verifiedExtras = [];
                    for (const clientExtra of item.item_extras) {
                        const extraId = clientExtra.id || clientExtra.extra_id;
                        const realExtra = realItem.extras?.find((e) => e.id === extraId);
                        if (realExtra) {
                            extraTotal += Number(realExtra.price) || 0;
                            verifiedExtras.push({
                                id: realExtra.id,
                                name: realExtra.name,
                                price: Number(realExtra.price)
                            });
                        }
                    }
                    item.item_extras = verifiedExtras;
                }
                item.item_extra_total = extraTotal;
                // Subtotals, taxes, and discounts
                const quantity = Number(item.quantity) || 1;
                item.quantity = quantity;
                const itemSubtotal = (item.price + variationTotal + extraTotal) * quantity;
                item.tax_amount = (itemSubtotal * item.tax_rate) / 100;
                const discount = Number(item.discount) || 0;
                item.discount = discount;
                item.total_price = itemSubtotal + item.tax_amount - discount;
                orderSubtotal += itemSubtotal;
                orderTotalTax += item.tax_amount;
            }
            catch (error) {
                res.status(500).json({ success: false, message: `Error verifying item pricing: ${error.message}` });
                return;
            }
        }
    }
    // Calculate Order Grand Totals
    orderData.subtotal = orderSubtotal;
    orderData.total_tax = orderTotalTax;
    const orderDiscount = Number(orderData.discount) || 0;
    // Calculate Delivery Charge if provided by frontend
    let orderDeliveryCharge = Number(orderData.delivery_charge) || 0;
    if (req.body.delivery && req.body.delivery.calculated_delivery_charge !== undefined) {
        orderDeliveryCharge = Number(req.body.delivery.calculated_delivery_charge);
        orderData.delivery_charge = orderDeliveryCharge;
        const km = Number(req.body.delivery.distance_km) || 0;
        // Derived rate (if distance_km > 0)
        req.body.delivery.delivery_rate_per_km = km > 0 ? (orderDeliveryCharge / km) : 0;
    }
    orderData.total = orderSubtotal + orderTotalTax + orderDeliveryCharge - orderDiscount;
    const order = await order_model_1.default.create({ ...orderData, orderItems, delivery: req.body.delivery }, {
        include: [
            { model: order_item_model_1.default, as: "orderItems" },
            { model: delivery_model_1.default, as: "delivery" }
        ],
    });
    try {
        await (0, publisher_1.publishEvent)("user_events", "ORDER_CREATED", {
            orderId: order.id,
            userId: order.user_id,
            branchId: order.branch_id,
        });
    }
    catch (err) {
        console.error("Failed to publish ORDER_CREATED event:", { error: err.message });
    }
    res.status(201).json({ success: true, data: order });
});
// Helper to cleanly stitch cross-microservice data (Item & Branch) onto orders
const populateOrderRelations = async (orders) => {
    const ITEMS_URL = process.env.ITEMS_SERVICE_URL || "http://localhost:3001/api/item";
    // Assuming your company/branch service runs on a specific URL (Port 3003 example)
    const BRANCH_URL = process.env.COMPANY_SERVICE_URL || "http://localhost:3003/api/branch";
    const isArray = Array.isArray(orders);
    const ordersList = isArray ? orders : [orders];
    const populated = await Promise.all(ordersList.map(async (order) => {
        const orderJson = order.toJSON ? order.toJSON() : order;
        // 1. Fetch Branch Virtual Association
        if (orderJson.branch_id) {
            try {
                const branchReq = await axios_1.default.get(`${BRANCH_URL}/${orderJson.branch_id}`, { validateStatus: () => true });
                if (branchReq.status === 200)
                    orderJson.branch = branchReq.data.data;
            }
            catch (e) {
                orderJson.branch = null; // Failed to fetch branch
            }
        }
        // 2. Fetch Item Virtual Association for each OrderItem
        if (orderJson.orderItems && Array.isArray(orderJson.orderItems)) {
            orderJson.orderItems = await Promise.all(orderJson.orderItems.map(async (item) => {
                if (item.item_id) {
                    try {
                        const itemReq = await axios_1.default.get(`${ITEMS_URL}/${item.item_id}`, { validateStatus: () => true });
                        if (itemReq.status === 200)
                            item.item = itemReq.data.data;
                    }
                    catch (e) {
                        item.item = null;
                    }
                }
                return item;
            }));
        }
        return orderJson;
    }));
    return isArray ? populated : populated[0];
};
exports.getOrders = (0, express_async_handler_1.default)(async (req, res) => {
    const where = {};
    if (req.query.user_id)
        where.user_id = req.query.user_id;
    if (req.query.branch_id)
        where.branch_id = req.query.branch_id;
    if (req.query.status)
        where.status = req.query.status;
    const orders = await order_model_1.default.findAll({
        where,
        include: [
            { model: order_item_model_1.default, as: "orderItems" },
            { model: delivery_model_1.default, as: "delivery" },
            { model: dining_table_model_1.default, as: "diningTable", attributes: ["name"] },
            { model: user_model_1.default, as: "user", attributes: ["name", "email", "phone"] },
            { model: user_model_1.default, as: "deliveryBoy", attributes: ["name", "email", "phone"] },
        ],
        order: [["createdAt", "DESC"]],
    });
    const populatedOrders = await populateOrderRelations(orders);
    res.status(200).json({ success: true, data: populatedOrders });
});
exports.getOrder = (0, express_async_handler_1.default)(async (req, res) => {
    const order = await order_model_1.default.findByPk(req.params.id, {
        include: [
            { model: order_item_model_1.default, as: "orderItems" },
            { model: delivery_model_1.default, as: "delivery" },
            { model: dining_table_model_1.default, as: "diningTable" },
            { model: user_model_1.default, as: "user", attributes: ["name", "email", "phone"] },
            { model: user_model_1.default, as: "deliveryBoy", attributes: ["name", "email", "phone"] },
        ],
    });
    if (!order) {
        res.status(404).json({ success: false, message: "Order not found" });
        return;
    }
    const populatedOrder = await populateOrderRelations(order);
    res.status(200).json({ success: true, data: populatedOrder });
});
exports.updateOrderStatus = (0, express_async_handler_1.default)(async (req, res) => {
    const { status, payment_status } = req.body;
    const order = await order_model_1.default.findByPk(req.params.id);
    if (!order) {
        res.status(404).json({ success: false, message: "Order not found" });
        return;
    }
    const updateData = {};
    if (status !== undefined)
        updateData.status = status;
    if (payment_status !== undefined)
        updateData.payment_status = payment_status;
    await order.update(updateData);
    try {
        await (0, publisher_1.publishEvent)("user_events", "ORDER_STATUS_UPDATED", {
            orderId: order.id,
            status: order.status,
            paymentStatus: order.payment_status,
        });
    }
    catch (err) {
        console.error("Failed to publish ORDER_STATUS_UPDATED event:", { error: err.message });
    }
    res.status(200).json({ success: true, message: "Order updated successfully", data: order });
});
exports.deleteOrder = (0, express_async_handler_1.default)(async (req, res) => {
    const order = await order_model_1.default.findByPk(req.params.id);
    if (!order) {
        res.status(404).json({ success: false, message: "Order not found" });
        return;
    }
    await order.destroy();
    try {
        await (0, publisher_1.publishEvent)("user_events", "ORDER_DELETED", {
            orderId: order.id,
        });
    }
    catch (err) {
        console.error("Failed to publish ORDER_DELETED event:", { error: err.message });
    }
    res.status(200).json({ success: true, message: "Order deleted successfully" });
});
//# sourceMappingURL=order.controller.js.map