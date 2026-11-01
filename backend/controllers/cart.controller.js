import Product from '../models/product.model.js';
import User from "../models/user.model.js";

export const getCartProducts = async (req, res) => {
    try {
        const products = await Product.find({
            _id: {
                $in: req.user.cartItems.map(item => item.product)
            }
        });

        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find(
                cartItem =>
                    cartItem.product.toString() === product._id.toString()
            );

            return {
                ...product.toJSON(),
                quantity: item.quantity
            };
        });

        res.json(cartItems);

    } catch (error) {
        console.error(
            "Error in getCartProducts controller:",
            error.message
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        const product = await Product.findById(productId);

        if (
        !product ||
        product.isVisible === false ||
        product.inventoryQuantity <= 0
        ) {
        return res.status(400).json({
            message: "This product is unavailable",
        });
        }

        const cartItem = user.cartItems.find(
        item => item.product.toString() === productId
        );

        const currentQuantity = cartItem?.quantity || 0;

        if (currentQuantity >= product.inventoryQuantity) {
        return res.status(400).json({
            message: `Only ${product.inventoryQuantity} items available in stock`,
        });
        }

        const existingItem = user.cartItems.find(
            item =>
                item.product.toString() === productId.toString()
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push({
                product: productId,
                quantity: 1
            });
        }

        await user.save();

        res.json(user.cartItems);

    } catch (error) {
        console.error(
            "Error in addToCart controller:",
            error.message
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body ?? {};

    const update = productId
      ? {
          $pull: {
            cartItems: { product: productId }
          }
        }
      : {
          $set: { cartItems: [] }
        };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      update,
      { returnDocument: "after" }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user.cartItems);
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      message: "Failed to clear cart"
    });
  }
};


export const updateQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const user = req.user;

        if (!Number.isSafeInteger(quantity) || quantity < 0) {
            return res.status(400).json({
                message: "Quantity must be a non-negative whole number",
            });
            }

            const product = await Product.findById(productId);

            if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
            }

            if (quantity > 0 && product.isVisible === false) {
            return res.status(400).json({
                message: "This product is unavailable",
            });
            }

            if (quantity > product.inventoryQuantity) {
            return res.status(400).json({
                message: `Only ${product.inventoryQuantity} items available in stock`,
            });
            }

        const existingItem = user.cartItems.find(
            item =>
                item.product.toString() === productId.toString()
        );

        if (!existingItem) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }

        if (quantity <= 0) {
            user.cartItems = user.cartItems.filter(
                item =>
                    item.product.toString() !== productId.toString()
            );
        } else {
            existingItem.quantity = quantity;
        }

        await user.save();

        res.json(user.cartItems);

    } catch (error) {
        console.error(
            "Error in updateQuantity controller:",
            error.message
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
