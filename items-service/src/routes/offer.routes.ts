import { Router } from "express";
import { validate, validateParams } from "../middleware/validate.middleware";
import { 
  offerSchema, 
  updateOfferSchema, 
  offerItemSchema, 
  updateOfferItemSchema 
} from "../validators/offer.validator";
import { idParamSchema } from "../validators/item-schema.validator";
import {
  createOffer,
  getOffers,
  getOffer,
  updateOffer,
  deleteOffer,
  addOfferItem,
  removeOfferItem,
  updateOfferItem,
  getOfferItems,
  getOfferItem
} from "../controllers/offer.controller";

const router = Router();

// Offer Routes
router.post("/offers", validate(offerSchema), createOffer);
router.get("/offers", getOffers);
router.get("/offers/:id", validateParams(idParamSchema), getOffer);
router.put("/offers/:id", validateParams(idParamSchema), validate(updateOfferSchema), updateOffer);
router.delete("/offers/:id", validateParams(idParamSchema), deleteOffer);

// Offer Item Routes
router.post("/offer-items", validate(offerItemSchema), addOfferItem);
router.get("/offer-items", getOfferItems);
router.get("/offer-items/:id", validateParams(idParamSchema), getOfferItem);
router.put("/offer-items/:id", validateParams(idParamSchema), validate(updateOfferItemSchema), updateOfferItem);
router.delete("/offer-items/:id", validateParams(idParamSchema), removeOfferItem);

export default router;
