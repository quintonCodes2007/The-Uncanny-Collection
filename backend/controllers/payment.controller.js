
import crypto from "node:crypto";
import mongoose from "mongoose";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";

export const demoCheckout = async (req, res) => {
  try {
    const { products, couponCode, demoReference } = req.body;
    const userId = req.user._id;

    



    if (
      typeof demoReference !== "string" ||
      !/^DEMO-[A-Za-z0-9-]{8,80}$/.test(demoReference)
    ) {
      return res.status(400).json({
        message: "Invalid demo reference",
      });
    }

    // Prevent retrying the same checkout twice.
    const existingOrder = await Order.findOne({
      demoReference,
      user: userId,
    });

    if (existingOrder) {
      return res.status(200).json({
        success: true,
        orderId: existingOrder._id,
        totalAmount: existingOrder.totalAmount,
        demoReference,
      });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty",
      });
    }

    const ids = products.map((item) => item._id);

    if (
      new Set(ids).size !== ids.length ||
      !ids.every((id) => mongoose.isValidObjectId(id)) ||
      !products.every(
        (item) =>
          Number.isSafeInteger(item.quantity) &&
          item.quantity > 0 &&
          item.quantity <= 100
      )
    ) {
      return res.status(400).json({
        message: "Invalid cart items",
      });
    }

    // Always use database prices, never frontend prices.
    const dbProducts = await Product.find({
      _id: { $in: ids },
    });

    if (dbProducts.length !== ids.length) {
      return res.status(400).json({
        message: "Some products are unavailable",
      });
    }

    const productMap = new Map(
      dbProducts.map((product) => [
        product._id.toString(),
        product,
      ])
    );

    let subtotalCents = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = productMap.get(item._id);

      if (
        !product ||
        !Number.isFinite(product.price) ||
        product.price < 0
      ) {
        return res.status(400).json({
          message: "Invalid product price",
        });
      }

      const priceCents = Math.round(product.price * 100);

      subtotalCents += priceCents * item.quantity;

      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: priceCents / 100,
      });
    }

    let discountPercentage = 0;
    let appliedCoupon = null;

    if (couponCode) {
      appliedCoupon = await Coupon.findOne({
        code: couponCode,
        userId,
        isActive: true,
        expirationDate: { $gt: new Date() },
      });

      if (!appliedCoupon) {
        return res.status(400).json({
          message: "Invalid or expired coupon",
        });
      }

      discountPercentage = appliedCoupon.discountPercentage;
    }

    const discountCents = Math.round(
      (subtotalCents * discountPercentage) / 100
    );

    const totalCents = subtotalCents - discountCents;
    const totalAmount = totalCents / 100;

    // This records a simulation, not a verified payment.
        let order;

    try {
      await mongoose.connection.transaction(async (session) => {
        // Deduct stock for every purchased product
        for (const item of orderProducts) {
          const updatedProduct = await Product.findOneAndUpdate(
            {
              _id: item.product,
              inventoryQuantity: { $gte: item.quantity },
              isVisible: { $ne: false },
            },
            {
              $inc: { inventoryQuantity: -item.quantity },
            },
            { new: true, session }
          );

          if (!updatedProduct) {
            throw new Error(
              "INSUFFICIENT_STOCK"
            );
          }
        }

        // Create the order in the same transaction
        const [createdOrder] = await Order.create(
          [
            {
              user: userId,
              products: orderProducts,
              totalAmount,
              paymentMethod: "demo",
              paymentStatus: "simulated",
              demoReference,
            },
          ],
          { session }
        );

        order = createdOrder;
      });
    } catch (error) {
      if (error.message === "INSUFFICIENT_STOCK") {
        return res.status(409).json({
          message: "Some items are sold out or no longer available.",
        });
      }

      throw error;
    }

    try {
        await redis.del("featuredProducts");
      } catch (error) {
        console.error("Failed to refresh featured products cache:", error);
      }

      let newCoupon = null;
      try {
        if (appliedCoupon) {
          await Coupon.updateOne(
            { _id: appliedCoupon._id },
            { $set: { isActive: false } }
          );
        }

        // Reward demo orders worth $200 or more.
        

        if (totalCents >= 20000) {
          const code =
            "GIFT" + crypto.randomBytes(4).toString("hex").toUpperCase();

          newCoupon = await Coupon.findOneAndUpdate(
            { userId },
            {
              $set: {
                code,
                discountPercentage: 10,
                isActive: true,
                expirationDate: new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000
                ),
              },
            },
            { upsert: true, new: true, runValidators: true }
          );
        }
    } catch (couponError) {
  console.error(
    "Order saved, but coupon processing failed:",
    couponError
  );
}

    return res.status(200).json({
      success: true,
      message: "Demo checkout completed",
      orderId: order._id,
      demoReference,
      totalAmount,
      newCoupon: newCoupon?.code ?? null,
    });
  } catch (error) {
    console.error("CHECKOUT ERROR:", {
    code: error.code,
    keyPattern: error.keyPattern,
    keyValue: error.keyValue,
    message: error.message,
});
    if (error.code === 11000) {
      const existingOrder = await Order.findOne({
        demoReference: req.body.demoReference,
        user: req.user._id,
      });

      if (existingOrder) {
        return res.status(200).json({
          success: true,
          orderId: existingOrder._id,
          totalAmount: existingOrder.totalAmount,
          demoReference: existingOrder.demoReference,
        });
      }

      return res.status(409).json({
        message: "Checkout reference already exists.",
      });
    }

    console.error("Demo checkout error:", error);

    return res.status(500).json({
      message: "Demo checkout failed",
    });
  }
};
