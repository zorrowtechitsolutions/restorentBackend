import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Offer from "../models/offer.model";
import OfferItem from "../models/offer-item.model";
import Item from "../models/item.model";
import { publishEvent } from "../events/publisher";

// --- OFFERS ---
export const createOffer: any = asyncHandler(async (req: Request, res: Response) => {
  const offer = await Offer.create(req.body);

  try {
    await publishEvent("item_events", "OFFER_CREATED", {
      offerId: offer.id,
    });
  } catch (err: any) {
    console.error("Failed to publish OFFER_CREATED event:", { error: err.message });
  }

  res.status(201).json({ success: true, data: offer });
});

export const getOffers: any = asyncHandler(async (req: Request, res: Response) => {
  const offers = await Offer.findAll({
    include: [{ model: OfferItem, as: "items", include: [{ model: Item, as: "item" }] }]
  });
  res.status(200).json({ success: true, data: offers });
});

export const getOffer: any = asyncHandler(async (req: Request, res: Response) => {
  const offer = await Offer.findByPk(req.params.id, {
    include: [{ model: OfferItem, as: "items", include: [{ model: Item, as: "item" }] }]
  });
  if (!offer) {
    res.status(404).json({ success: false, message: "Offer not found" });
    return;
  }
  res.status(200).json({ success: true, data: offer });
});

export const updateOffer: any = asyncHandler(async (req: Request, res: Response) => {
  const offer = await Offer.findByPk(req.params.id);
  if (!offer) {
    res.status(404).json({ success: false, message: "Offer not found" });
    return;
  }
  await offer.update(req.body);

  try {
    await publishEvent("item_events", "OFFER_UPDATED", {
      offerId: offer.id,
    });
  } catch (err: any) {
    console.error("Failed to publish OFFER_UPDATED event:", { error: err.message });
  }

  res.status(200).json({ success: true, data: offer });
});

export const deleteOffer: any = asyncHandler(async (req: Request, res: Response) => {
  const offer = await Offer.findByPk(req.params.id);
  if (!offer) {
    res.status(404).json({ success: false, message: "Offer not found" });
    return;
  }
  await offer.destroy();

  try {
    await publishEvent("item_events", "OFFER_DELETED", {
      offerId: offer.id,
    });
  } catch (err: any) {
    console.error("Failed to publish OFFER_DELETED event:", { error: err.message });
  }

  res.status(200).json({ success: true, message: "Offer deleted successfully" });
});

// --- OFFER ITEMS ---
export const addOfferItem: any = asyncHandler(async (req: Request, res: Response) => {
  const offerItem = await OfferItem.create(req.body);
  res.status(201).json({ success: true, data: offerItem });
});

export const removeOfferItem: any = asyncHandler(async (req: Request, res: Response) => {
  const offerItem = await OfferItem.findByPk(req.params.id);
  if (!offerItem) {
    res.status(404).json({ success: false, message: "Offer item not found" });
    return;
  }
  await offerItem.destroy();
  res.status(200).json({ success: true, message: "Offer item removed successfully" });
});

export const updateOfferItem: any = asyncHandler(async (req: Request, res: Response) => {
    const offerItem = await OfferItem.findByPk(req.params.id);
    if (!offerItem) {
      res.status(404).json({ success: false, message: "Offer item not found" });
      return;
    }
    await offerItem.update(req.body);
    res.status(200).json({ success: true, data: offerItem });
  });
  
export const getOfferItems: any = asyncHandler(async (req: Request, res: Response) => {
  const offerItems = await OfferItem.findAll({
    where: req.query.offer_id ? { offer_id: req.query.offer_id } : {},
    include: [{ model: Item, as: "item" }]
  });
  res.status(200).json({ success: true, data: offerItems });
});

export const getOfferItem: any = asyncHandler(async (req: Request, res: Response) => {
  const offerItem = await OfferItem.findByPk(req.params.id, {
    include: [{ model: Item, as: "item" }]
  });
  if (!offerItem) {
    res.status(404).json({ success: false, message: "Offer item not found" });
    return;
  }
  res.status(200).json({ success: true, data: offerItem });
});