import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Reservation from "../models/reservation.model.js";
import { getReservationExpiry } from "./reservation.config.js";


export const reserveStock = async (userId, productId, quantity) => {
  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    throw new Error("Invalid reservation quantity");
  }

  return mongoose.connection.transaction(async (session) => {
    // Check for an existing active reservation
    const existingReservation = await Reservation.findOne({
      user: userId,
      product: productId,
      status: "active",
    }).session(session);

    if (existingReservation) {
      throw new Error("Product already reserved");
    }

    // Atomically deduct available inventory
    const product = await Product.findOneAndUpdate(
      {
        _id: productId,
        isVisible: { $ne: false },
        inventoryQuantity: { $gte: quantity },
      },
      {
        $inc: { inventoryQuantity: -quantity },
      },
      {
        returnDocument: "after",
        session,
      }
    );

    if (!product) {
      throw new Error("Insufficient stock or product unavailable");
    }

    // Create the reservation within the same transaction
    const [reservation] = await Reservation.create(
      [
        {
          user: userId,
          product: productId,
          quantity,
          expiresAt: getReservationExpiry(),
          status: "active",
        },
      ],
      { session }
    );

    return reservation;
  });
};

export const releaseReservation = async (reservationId) => {
  return mongoose.connection.transaction(async (session) => {
    // Claim the reservation so it cannot be released twice
    const reservation = await Reservation.findOneAndUpdate(
      {
        _id: reservationId,
        status: "active",
      },
      {
        $set: { status: "cancelled" },
      },
      {
        returnDocument: "after",
        session,
      }
    );

    if (!reservation) {
      return null;
    }

    // Return reserved items to available inventory
    await Product.updateOne(
      { _id: reservation.product },
      {
        $inc: {
          inventoryQuantity: reservation.quantity,
        },
      },
      { session }
    );

    return reservation;
  });
};

export const updateReservedQuantity = async (
  userId,
  productId,
  newQuantity
) => {
  if (!Number.isSafeInteger(newQuantity) || newQuantity < 0) {
    throw new Error("Invalid reservation quantity");
  }

  return mongoose.connection.transaction(async (session) => {
    const reservation = await Reservation.findOne({
      user: userId,
      product: productId,
      status: "active",
      expiresAt: { $gt: new Date() },
    }).session(session);

    if (!reservation) {
      throw new Error("Active reservation not found");
    }

    const difference = newQuantity - reservation.quantity;

    if (difference > 0) {
      // Reserve additional stock
      const product = await Product.findOneAndUpdate(
        {
          _id: productId,
          isVisible: { $ne: false },
          inventoryQuantity: { $gte: difference },
        },
        { $inc: { inventoryQuantity: -difference } },
        { session, returnDocument: "after" }
      );

      if (!product) {
        throw new Error("Insufficient stock");
      }
    } else if (difference < 0) {
      // Return excess reserved stock
      await Product.updateOne(
        { _id: productId },
        { $inc: { inventoryQuantity: -difference } },
        { session }
      );
    }

    if (newQuantity === 0) {
      await Reservation.updateOne(
        { _id: reservation._id, status: "active" },
        { $set: { status: "cancelled" } },
        { session }
      );

      return null;
    }

    reservation.quantity = newQuantity;
    await reservation.save({ session });

    return reservation;
  });
};

export const expireReservations = async () => {
  const expiredReservations = await Reservation.find({
    status: "active",
    expiresAt: { $lte: new Date() },
  }).select("_id");

  let expiredCount = 0;

  for (const item of expiredReservations) {
    await mongoose.connection.transaction(async (session) => {
      const reservation = await Reservation.findOneAndUpdate(
        {
          _id: item._id,
          status: "active",
          expiresAt: { $lte: new Date() },
        },
        { $set: { status: "expired" } },
        { session, returnDocument: "after" }
      );

      if (!reservation) return;

      await Product.updateOne(
        { _id: reservation.product },
        {
          $inc: {
            inventoryQuantity: reservation.quantity,
          },
        },
        { session }
      );

      expiredCount++;
    });
  }

  return expiredCount;
};



