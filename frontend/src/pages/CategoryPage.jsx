import { useProductStore } from '../stores/useProductStore'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';


const CategoryPage = () => {
    const { fetchProductsByCategory, products } = useProductStore();

    const { category } = useParams();

    useEffect(() => {
        fetchProductsByCategory(category);
    }, [fetchProductsByCategory, category])

    console.log("products:", products);

    return (
        <div className='min-h-screen'>
            <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                <motion.div
                    className="mb-6 px-2 text-center text-2xl font-bold leading-tight text-red-600 wrap-break-word sm:mb-8 sm:text-4xl lg:text-5xl"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }} 
                >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.div>

                <motion.div
                    
                    className="grid grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-4 lg:gap-6"

                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {products?.length === 0 && (
                    <h2 className="col-span-full py-10 text-center text-base font-semibold text-gray-300 sm:text-2xl lg:text-3xl">
                        No products found in this category.
                    </h2>    
                    )}

                    {products?.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}

                </motion.div>

                

            </div>
        </div> 
    );
}

export default CategoryPage