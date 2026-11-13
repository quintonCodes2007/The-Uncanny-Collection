import { redis } from '../lib/redis.js';
import cloudinary from '../lib/cloudinary.js';
import Product from '../models/product.model.js';
import Category from "../models/category.model.js";
import mongoose from "mongoose";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({})
        .populate("category", "name slug")
        .lean();
        res.json({products});
    } catch (error) {
        console.log("Error in getAllProducts controller:", error.message);
        res.status(500).json({message: "Server error", error:error.message});
    }
}; 

export const getFeaturedProducts = async (req, res) => {
    try{
        let featuredProducts = await redis.get("featuredProducts");
        if(featuredProducts) {
            return res.json(JSON.parse(featuredProducts));
        }

        //if not in redis, fetch from database
        //.lean() is used to return plain JavaScript objects instead of Mongoose documents, which can improve performance when you don't need the full Mongoose document functionality.
        
        featuredProducts = await Product.find({
            isFeatured: true,
            isVisible: { $ne: false },
            inventoryQuantity: { $gt: 0 }
            }).lean();

        if(!featuredProducts) {
            return res.status(404).json({message: "No featured products found"});
        }

        //store in redis for 1 hour
        await redis.set("featuredProducts", JSON.stringify(featuredProducts), "EX", 3600);

        res.json(featuredProducts);
    } catch(error){
        console.log("Error in getFeaturedProducts controller:", error.message);
        res.status(500).json({message: "Server error", error:error.message});
    }

};


export const createProduct = async (req, res) => {
  try {
    const {
  name,
  description,
  price,
  inventoryQuantity,
  image,
  category,
  isHot = false,
  isNewArrival = false,
} = req.body;

    const quantity = Number(inventoryQuantity);

    if (!Number.isSafeInteger(quantity) || quantity < 0) {
      return res.status(400).json({
        message: "Inventory must be a non-negative whole number",
      });
    }

    if (!mongoose.isValidObjectId(category)) {
      return res.status(400).json({
        message: "Please select a valid product category",
      });
    }

    const existingCategory = await Category.findOne({
      _id: category,
      isActive: true,
    });

    if (!existingCategory) {
      return res.status(404).json({
        message: "Selected category does not exist",
      });
    }

    if (!name?.trim() || !description?.trim()) {
      return res.status(400).json({
        message: "Product name and description are required",
      });
    }

    const numericPrice = Number(price);

    if (
      price === "" ||
      price == null ||
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      return res.status(400).json({
        message: "Please enter a valid product price",
      });
    }

    if (!image) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      image,
      { folder: "products" }
    );

    const product = await Product.create({
  name: name.trim(),
  description: description.trim(),
  price: numericPrice,
  inventoryQuantity: quantity,
  image: cloudinaryResponse.secure_url,
  category: existingCategory._id,
  isHot: isHot === true,
  isNewArrival: isNewArrival === true,
});

    await product.populate("category", "name slug");

    return res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);

    return res.status(500).json({
      message: "Failed to create product",
    });
  }
};


export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if(!product) {
            return res.status(404).json({message: "Product not found"});
        }

        if(product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log(`Image ${publicId} deleted from Cloudinary`);
            } catch (error) {
                console.error(`Error deleting image ${publicId} from Cloudinary:`, error);
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Product deleted successfully from database and Cloudinary"});
    } catch (error) {
        console.error("Error in deleteProduct controller:", error.message);
        res.status(500).json({message: "Server error", error:error.message});
    }
};

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            { 
                $sample: { size: 3 } 
            }, 
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1
                }
            }
        ]); // Get 3 random products
        res.json(products);
    } catch (error) {
        console.error("Error in getRecommendedProducts controller:", error.message);
        res.status(500).json({message: "Server error", error:error.message});
    }
};

export const getHomePageProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $match: {
                    isVisible: { $ne: false },
                    inventoryQuantity: { $gt: 0 }
                }
            },
            {
                $sample: { size: 15 } // Use 3 for recommendations
            }, 
            {
              $project: {
                _id: 1,
                name: 1,
                description: 1,
                image: 1,
                price: 1,
                originalPrice: 1,
                discountPercentage: 1,
                inventoryQuantity: 1,
                isFeatured: 1,
                isHot: 1,
                isNewArrival: 1,
                rating: 1,
                reviewCount: 1,
              }
            }
        ]); // Get 3 random products
        res.json(products);
    } catch (error) {
        console.error("Error in getRecommendedProducts controller:", error.message);
        res.status(500).json({message: "Server error", error:error.message});
    }
};


export const getProductsByCategory = async (req, res) => {
  try {
    const { category: slug } = req.params;

    const category = await Category.findOne({
      slug,
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        products: [],
      });
    }

    const products = await Product.find({
      category: category._id,
      isVisible: { $ne: false },
      inventoryQuantity: { $gt: 0 },
    })
      .populate("category", "name slug")
      .lean();

    return res.status(200).json({
      category: {
        _id: category._id,
        name: category.name,
        slug: category.slug,
      },
      products,
    });
  } catch (error) {
    console.error("Error fetching category products:", error);

    return res.status(500).json({
      message: "Failed to fetch category products",
    });
  }
};


export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product) {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFeaturedProductsCache();
            res.json(updatedProduct);
        } else {
            res.status(404).json({message: "Product not found"});
        }
    } catch (error) {
        console.error("Error in toggleFeaturedProduct controller:", error.message);
        res.status(500).json({message: "Server error", error:error.message});
    }
};

async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({
            isFeatured: true,
            isVisible: { $ne: false },
            inventoryQuantity: { $gt: 0 }
            }).lean();
        await redis.set("featuredProducts", JSON.stringify(featuredProducts));
    } catch (error) {
        console.error("Error updating featured products cache:", error.message);
    }
};

export const updateProductStock = async (req, res) => {
  try {
    const { inventoryQuantity } = req.body;
    const quantity = Number(inventoryQuantity);

    if (
      !Number.isSafeInteger(quantity) ||
      quantity < 0 ||
      inventoryQuantity === "" ||
      inventoryQuantity == null
    ) {
      return res.status(400).json({
        message: "Stock must be a non-negative whole number",
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { inventoryQuantity: quantity },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await redis.del("featuredProducts");

    res.json(product);
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({
      message: "Failed to update stock",
    });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const query = req.query.q?.trim();

    if (!query || query.length < 2 || query.length > 100) {
      return res.status(400).json({
        message: "Search must contain between 2 and 100 characters",
      });
    }

    // Escape special characters for safe regex searching
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const products = await Product.find({
      $or: [
        { name: { $regex: escapedQuery, $options: "i" } },
        { description: { $regex: escapedQuery, $options: "i" } },
      ],
      isVisible: { $ne: false },
      inventoryQuantity: { $gt: 0 },
    })
      .limit(30)
      .lean();

    return res.status(200).json(products);
  } catch (error) {
    console.error("Product search error:", error);

    return res.status(500).json({
      message: "Failed to search products",
    });
  }
};


