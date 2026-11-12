
import Category from "../models/category.model.js";

// GET /api/categories
// Return all active categories.
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
    })
      .sort({ displayOrder: 1 })
      .lean();

    return res.status(200).json({
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);

    return res.status(500).json({
      message: "Failed to fetch categories",
    });
  }
};

// GET /api/categories/:slug
// Return one category using its URL slug.
export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
      isActive: true,
    }).lean();

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.status(200).json({
      category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);

    return res.status(500).json({
      message: "Failed to fetch category",
    });
  }
};
