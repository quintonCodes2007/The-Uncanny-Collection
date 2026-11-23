
import mongoose from "mongoose";

import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";

// Validate review input before saving
const validateReview = (body, allowLegacyComment = false) => {
  const { rating, title, comment } = body;

  if (
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return "Select a rating between 1 and 5 stars";
  }

  if (
    typeof title !== "string" ||
    title.trim().length < 3 ||
    title.trim().length > 100
  ) {
    return "Review title must contain 3–100 characters";
  }

  if (
    typeof comment !== "string" ||
    comment.trim().length < 10 ||
    (comment.trim().length > 500 && !allowLegacyComment)
  ) {
    return "Review comment must contain 10–500 characters";
  }

  return null;
};


const updateProductRating = async (productId) => {
  const [stats] = await Review.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
      },
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  await Product.findByIdAndUpdate(productId, {
    rating: stats
      ? Math.round(stats.averageRating * 10) / 10
      : 0,
    reviewCount: stats?.reviewCount ?? 0,
  });

  // Featured products are cached separately.
  try {
    await redis.del("featuredProducts");
  } catch (error) {
    console.error("Could not refresh featured cache:", error);
  }
};


export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid artifact ID",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      isVisible: { $ne: false },
    }).select("_id");

    if (!product) {
      return res.status(404).json({
        message: "Artifact not found",
      });
    }

    const requestedLimit = Number(req.query.limit);
    const requestedPage = Number(req.query.page);

    const limit =
      Number.isSafeInteger(requestedLimit) && requestedLimit >= 1
        ? Math.min(requestedLimit, 20)
        : 2;

    const page =
      Number.isSafeInteger(requestedPage) && requestedPage >= 1
        ? requestedPage
        : 1;

    const reviews = await Review.find({
      product: productId,
    })
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "username name")
      .lean();

      const reviewCount = await Review.countDocuments({
        product: productId,
      });

    return res.status(200).json({
      reviews,
      reviewCount});
  } catch (error) {
    console.error("Error fetching reviews:", error);

    return res.status(500).json({
      message: "Failed to retrieve reviews",
    });
  }
};


export const getMyReview = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid artifact ID",
      });
    }

    const review = await Review.findOne({
      product: productId,
      user: req.user._id,
    })
      .populate("user", "username name")
      .lean();

    return res.status(200).json({
      review: review ?? null,
    });
  } catch (error) {
    console.error("Error fetching user's review:", error);

    return res.status(500).json({
      message: "Failed to retrieve your review",
    });
  }
};


export const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const error = validateReview(req.body);

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid artifact ID",
      });
    }

    if (error) {
      return res.status(400).json({ message: error });
    }

    const product = await Product.findOne({
      _id: productId,
      isVisible: { $ne: false },
    });

    if (!product) {
      return res.status(404).json({
        message: "Artifact not found",
      });
    }

    const existingReview = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(409).json({
        message: "You have already reviewed this artifact",
      });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating: req.body.rating,
      title: req.body.title.trim(),
      comment: req.body.comment.trim(),
    });

    await updateProductRating(productId);

    await review.populate("user", "username name");

    return res.status(201).json({
      message: "Your review has been summoned!",
      review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already reviewed this artifact",
      });
    }

    console.error("Error creating review:", error);

    return res.status(500).json({
      message: "Failed to submit review",
    });
  }
};


export const updateMyReview = async (req, res) => {
  try {
    const { productId } = req.params;
    

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid artifact ID",
      });
    }


    const review = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        message: "You have not reviewed this artifact yet",
      });
    }


  /*
  * REVIEW LIMIT — LEGACY COMPATIBILITY
  *
  * Existing reviews longer than 500 characters remain valid
  * if the original comment has not been changed.
  *
  * Newly written or modified comments must be 500 characters
  * or fewer.
  */
  const allowLegacyComment =
    typeof req.body.comment === "string" &&
    review.comment.length > 500 &&
    req.body.comment.trim() === review.comment;

  const error = validateReview(
    req.body,
    allowLegacyComment
  );

  if (error) {
    return res.status(400).json({ message: error });
  }


    review.rating = req.body.rating;
    review.title = req.body.title.trim();
    review.comment = req.body.comment.trim();

    await review.save();

    await updateProductRating(productId);

    await review.populate("user", "username name");

    return res.status(200).json({
      message: "Your review has been updated",
      review,
    });
  } catch (error) {
    console.error("Error updating review:", error);

    return res.status(500).json({
      message: "Failed to update review",
    });
  }
};


export const deleteMyReview = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid artifact ID",
      });
    }

    const review = await Review.findOneAndDelete({
      product: productId,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        message: "You have not reviewed this artifact yet",
      });
    }

    await updateProductRating(productId);

    return res.status(200).json({
      message: "Your review has vanished into the void",
    });
  } catch (error) {
    console.error("Error deleting review:", error);

    return res.status(500).json({
      message: "Failed to delete review",
    });
  }
};
