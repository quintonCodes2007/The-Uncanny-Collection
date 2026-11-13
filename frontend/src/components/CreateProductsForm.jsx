import React from 'react'

import { motion } from 'framer-motion';
import { PlusCircle, Upload, Loader } from 'lucide-react';
import { useProductStore } from '../stores/useProductStore';
import { useState, useEffect } from "react";
import axios from "../lib/axios";
import toast from "react-hot-toast";




const CreateProductsForm = () => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    inventoryQuantity: "",
    category: "",
    image: "",
  });

  const { createProduct, loading } = useProductStore();

  // Fetch categories from MongoDB when the form opens
  useEffect(() => {
    let active = true;

    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");

        if (active) {
          setCategories(response.data.categories || []);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
        toast.error("Could not load product categories");
      } finally {
        if (active) {
          setCategoriesLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      active = false;
    };
  }, []);




    const handleSubmit = async(e) => {
        e.preventDefault();
    try {
         await createProduct(newProduct);
         setNewProduct({
  name: "",
  description: "",
  price: "",
  inventoryQuantity: "",
  category: "",
  image: "",
  isHot: false,
  isNewArrival: false,
});
    } catch (error) {
        console.error('Error creating product:', error);
    }
        
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProduct({ ...newProduct, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

  return (
    <motion.div
        className='bg-red-300/10 shadow-lg rounded-lg p-8 max-w-xl mx-auto'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
    >
        <h2 className='text-2xl font-extrabold mb-4  text-red-400 text-center'>Create a new product</h2>
 
        <form className='space-y-4' onSubmit={handleSubmit}>
            <div>
                {/* <label htmlFor="name" className='block text-sm font-medium text-gray-300'>Product Name</label> */}
                <input
                    id='name'
                    type='text'
                    name='name'
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className='mt-1 block w-full border border-red-400/40 rounded-md  shadow-sm py-2 px-3 focus:border-red-400 focus:ring-1 focus:ring-red-500 focus:outline-none'
                    required placeholder='Product name'
                />
            </div>
        
            <div>
                {/* <label htmlFor="name" className='block text-sm font-medium text-gray-300'>Product Name</label> */}
                <textarea
                    id='description'
                    name='description'
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className='mt-1 block w-full border border-red-400/40 rounded-md  shadow-sm py-2 px-3 focus:border-red-400 focus:ring-1 focus:ring-red-500 focus:outline-none'
                    required placeholder='Product description'
                />
            </div>

            <div>
                {/* <label htmlFor="name" className='block text-sm font-medium text-gray-300'>Product Name</label> */}
                <input
                    id='price'
                    type='number'
                    name='price'
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    step='0.01'
                    className='mt-1 block w-full border border-red-400/40 rounded-md  shadow-sm py-2 px-3 focus:border-red-400 focus:ring-1 focus:ring-red-500 focus:outline-none'
                    required placeholder='Product price'
                />
            </div>

                <div className="grid grid-cols-2 gap-2">

                    
                <input
                id="inventoryQuantity"
                type="number"
                name="inventoryQuantity"
                min="0"
                step="1"
                required
                value={newProduct.inventoryQuantity}
                onChange={(e) =>
                    setNewProduct({
                    ...newProduct,
                    inventoryQuantity: e.target.value
                    })
                }
                className="mt-1 block w-full rounded-md border border-red-400/40 px-3 py-2 shadow-sm focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="Number of items in stock"
                />


                {/* <label htmlFor="name" className='block text-sm font-medium text-gray-300'>Product Category</label> */}
                
                <select
                id="category"
                name="category"
                value={newProduct.category}
                onChange={(e) =>
                    setNewProduct({
                    ...newProduct,
                    category: e.target.value,
                    })
                }
                className="mt-1 w-full rounded-md border border-red-400/40 bg-[#21151f] px-3 py-2 text-gray-200 focus:border-red-400 focus:outline-none"
                required
                disabled={categoriesLoading || categories.length === 0}
                >
                <option value="">
                    {categoriesLoading
                    ? "Loading categories..."
                    : "Select a category"}
                </option>

                {categories.map((category) => (
                    <option
                    key={category._id}
                    value={category._id}
                    >
                    {category.name}
                    </option>
                ))}
                </select>




{/* Promotional badges */}
<div className="flex w-full items-center gap-3 whitespace-nowrap">
  <span className="shrink-0 text-xs font-medium text-gray-300 sm:text-sm">
    Promotional Badges:
  </span>

  <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs text-gray-300 sm:text-sm">
    <span>🔥 Hot</span>
    <input
      type="checkbox"
      name="isHot"
      checked={newProduct.isHot}
      onChange={(e) =>
        setNewProduct((prev) => ({
          ...prev,
          isHot: e.target.checked,
        }))
      }
      className="h-4 w-4 cursor-pointer accent-orange-500"
    />
  </label>

  <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs text-gray-300 sm:text-sm">
    <span>✦ New</span>
    <input
      type="checkbox"
      name="isNewArrival"
      checked={newProduct.isNewArrival}
      onChange={(e) =>
        setNewProduct((prev) => ({
          ...prev,
          isNewArrival: e.target.checked,
        }))
      }
      className="h-4 w-4 cursor-pointer accent-green-500"
    />
  </label>
</div>




            </div>

            <div className='mt-1 flex items-center'>
                <input type="file" id='image' className='sr-only' accept='image/*'
                onChange={handleImageChange}
                />
                <label htmlFor="image" className='cursor-pointer  py-2 block mb-3 w-full text-center border border-red-400/40 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-400 hover:bg-red-800/30 focus:outline-none focus:ring-1 focus:ring-offset  focus:ring-red-500'
                >
                    {newProduct.image ? (
                        "Change image"
                    ) : (
                        <>
                            <Upload className="h-5 w-5 inline-block mr-2" />
                            Upload an image
                        </>
                    )}
                </label>

            </div>

            <button 
                type='submit' className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-800/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out disabled:opacity-50' disabled={loading}
            >
                {loading ? (
                    <>
                        <Loader className='mr-2 h-5 w-5 animate-spin'aria-hidden='true' />
                        Loading...
                    </>
                    ) : (
                    <>
                        <PlusCircle className='mr-2 h-5 w-5' aria-hidden='true' />
                        Create product
                    </>
                )}


            </button>


        </form>
    </motion.div>
  );
};

export default CreateProductsForm;