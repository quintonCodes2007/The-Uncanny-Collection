import Product from '../models/product.model.js';
import mongoose from "mongoose";
import User from "../models/user.model.js";

import { expireReservations } from "../lib/reservation.service.js";
import Reservation from "../models/reservation.model.js";
import { reserveStock, updateReservedQuantity, } from "../lib/reservation.service.js";

export const getCartProducts = async (req, res) => {
  try {
    await expireReservations();

    const products = await Product.find({
      _id: {
        $in: req.user.cartItems.map((item) => item.product),
      },
    });

    // Fetch reservations BEFORE products.map()
    const reservations = await Reservation.find({
      user: req.user._id,
      status: "active",
      expiresAt: { $gt: new Date() },
    });

    const reservationMap = new Map(
      reservations.map((reservation) => [
        reservation.product.toString(),
        reservation.expiresAt,
      ])
    );

    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) =>
          cartItem.product.toString() === product._id.toString()
      );

      return {
        ...product.toJSON(),
        quantity: item.quantity,
        expiresAt: reservationMap.get(product._id.toString()) ?? null,
      };
    });

    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({
      message: "Failed to fetch cart items",
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const cartItems = await mongoose.connection.transaction(
      async (session) => {
        const user = await User.findById(userId).session(session);

        if (!user) {
          throw new Error("User not found");
        }

        const existingItem = user.cartItems.find(
          (item) => item.product.toString() === productId
        );

        const reservation = await Reservation.findOne({
          user: userId,
          product: productId,
          status: "active",
        }).session(session);

        if (existingItem && !reservation) {
          throw new Error(
            "Existing cart item has no reservation. Cart migration required."
          );
        }

        if (reservation && reservation.expiresAt <= new Date()) {
          throw new Error("Reservation expired");
        }

        if (existingItem) {
          await updateReservedQuantity(
            userId,
            productId,
            existingItem.quantity + 1,
            session
          );

          existingItem.quantity += 1;
        } else {
          if (reservation) {
            throw new Error("Cart and reservation are out of sync");
          }

          await reserveStock(userId, productId, 1, session);

          user.cartItems.push({
            product: productId,
            quantity: 1,
          });
        }

        await User.updateOne(
          { _id: userId },
          { $set: { cartItems: user.cartItems } },
          { session }
        );

        return user.cartItems;
      }
    );

    res.json(cartItems);
  } catch (error) {
    console.error("Error adding to cart:", error);

    res.status(400).json({
      message: error.message || "Failed to add product to cart",
    });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body ?? {};
    const userId = req.user._id;

    const cartItems = await mongoose.connection.transaction(
      async (session) => {
        const user = await User.findById(userId).session(session);

        if (!user) {
          throw new Error("User not found");
        }

        const itemsToRemove = productId
          ? user.cartItems.filter(
              (item) => item.product.toString() === productId
            )
          : user.cartItems;

        for (const item of itemsToRemove) {
          const reservation = await Reservation.findOne({
            user: userId,
            product: item.product,
            status: "active",
          }).session(session);

          if (reservation) {
            const released = await Reservation.findOneAndUpdate(
              {
                _id: reservation._id,
                status: "active",
              },
              { $set: { status: "cancelled" } },
              { session, returnDocument: "after" }
            );

            if (released) {
              await Product.updateOne(
                { _id: item.product },
                {
                  $inc: {
                    inventoryQuantity: released.quantity,
                  },
                },
                { session }
              );
            }
          }
        }

        const remainingItems = productId
          ? user.cartItems.filter(
              (item) => item.product.toString() !== productId
            )
          : [];

        await User.updateOne(
          { _id: userId },
          { $set: { cartItems: remainingItems } },
          { session }
        );

        return remainingItems;
      }
    );

    res.json(cartItems);
  } catch (error) {
    console.error("Error removing cart items:", error);

    res.status(500).json({
      message: "Failed to remove cart items",
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (
      !mongoose.isValidObjectId(productId) ||
      !Number.isSafeInteger(quantity) ||
      quantity < 0
    ) {
      return res.status(400).json({
        message: "Invalid product or quantity",
      });
    }

    const cartItems = await mongoose.connection.transaction(
      async (session) => {
        const user = await User.findById(userId).session(session);

        if (!user) {
          throw new Error("User not found");
        }

        const existingItem = user.cartItems.find(
          (item) => item.product.toString() === productId
        );

        if (!existingItem) {
          throw new Error("Product not found in cart");
        }

        // Updates reserved inventory in the same transaction
        await updateReservedQuantity(
          userId,
          productId,
          quantity,
          session
        );

        if (quantity === 0) {
          user.cartItems = user.cartItems.filter(
            (item) => item.product.toString() !== productId
          );
        } else {
          existingItem.quantity = quantity;
        }

        await User.updateOne(
          { _id: userId },
          { $set: { cartItems: user.cartItems } },
          { session }
        );

        return user.cartItems;
      }
    );

    res.json(cartItems);
  } catch (error) {
    console.error("Error updating cart quantity:", error);

    res.status(400).json({
      message: error.message || "Failed to update cart",
    });
  }
};

