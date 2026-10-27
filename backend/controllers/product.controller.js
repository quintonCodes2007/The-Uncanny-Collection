import { redis } from '../lib/redis.js';
import cloudinary from '../lib/cloudinary.js';
import Product from '../models/product.model.js';

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});//find all products in the database
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
        
        featuredProducts = await Product.find({isFeatured: true}).lean();

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
        const { name, description, price, inventoryQuantity, image, category} = req.body;
        let cloudinaryResponse = null;

        if(image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {folder: "products"});
        }

        const product = await Product.create({
            name,
            description,
            price,
            inventoryQuantity,
            image: cloudinaryResponse?.secure_url ?  cloudinaryResponse.secure_url : "",
            category
        });

        res.status(201).json(product);
    } catch (error) {
        console.log("Error in createProduct controller:", error.message);
        res.status(500).json({message: "Server error", error:error.message});
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
                $sample: { size: 15 } 
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

export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category });
        res.json({products});
    } catch (error) {
        console.error("Error in getProductsByCategory controller:", error.message);
        res.status(500).json({message: "Server error", error:error.message});
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
        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        await redis.set("featuredProducts", JSON.stringify(featuredProducts));
    } catch (error) {
        console.error("Error updating featured products cache:", error.message);
    }
};
