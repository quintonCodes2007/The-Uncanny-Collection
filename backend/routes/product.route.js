import express from 'express';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProducts,
  getHomePageProducts,
  toggleFeaturedProduct,
  updateProductStock,
  searchProducts,
  getProductById,updateProductDetails
} from '../controllers/product.controller.js';
import {
  getProductReviews,
  getMyReview,
  createReview,
  updateMyReview,
  deleteMyReview,
} from "../controllers/review.controller.js";
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/search", searchProducts);
router.get("/",protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.get("/homepageProducts", getHomePageProducts);
// Product reviews
router.get("/:productId/reviews", getProductReviews);

router.get(
  "/:productId/reviews/mine",
  protectRoute,
  getMyReview
);

router.post(
  "/:productId/reviews",
  protectRoute,
  createReview
);

router.put(
  "/:productId/reviews/mine",
  protectRoute,
  updateMyReview
);

router.delete(
  "/:productId/reviews/mine",
  protectRoute,
  deleteMyReview
);
router.get("/:id", getProductById);
router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);
router.patch("/:id/stock", protectRoute, adminRoute, updateProductStock);
router.patch("/:id/details", protectRoute, adminRoute, updateProductDetails);




export default router;