
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import axios from "../lib/axios";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
  const { category: slug } = useParams();

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchCategoryProducts = async () => {
      setLoading(true);
      setError("");
      setProducts([]);
      setCategoryName("");

      try {
        const response = await axios.get(
          `/products/category/${encodeURIComponent(slug)}`
        );

        if (!active) return;

        setProducts(response.data.products ?? []);
        setCategoryName(response.data.category?.name ?? slug);
      } catch (error) {
        if (!active) return;

        console.error("Failed to fetch category:", error);

        setError(
          error.response?.data?.message ||
          "Something went wrong loading this category."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchCategoryProducts();

    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <div className="min-h-screen">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        <motion.h1
          className="mb-8 text-center text-2xl font-bold text-red-500 sm:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {categoryName || "The Uncanny Collection"}
        </motion.h1>

        {loading ? (
          <p className="py-16 text-center text-gray-400">
            Unearthing forbidden artifacts...
          </p>
        ) : error ? (
          <div className="py-16 text-center">
            <h2 className="mb-3 text-xl font-bold text-red-400">
              The portal has malfunctioned.
            </h2>

            <p className="text-gray-400">
              {error}
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="mb-3 text-2xl font-bold text-red-400">
              Nothing Has Been Summoned Yet.
            </h2>

            <p className="text-gray-400">
              This category is currently empty.
              Even the ghosts are disappointed.
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default CategoryPage;
