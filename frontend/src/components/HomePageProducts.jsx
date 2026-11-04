import { useEffect } from "react"
import { useState } from "react"
import axios from "../lib/axios"
import ProductCard from "./ProductCard"
import toast from "react-hot-toast"
import LoadingSpinner from "./LoadingSpinner"

const HomePageProducts = () => {

  const  [homepageProducts, setHomePageProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHomePageProducts = async () => {
      
      try {
        const res = await axios.get('/products/homepageProducts')
        setHomePageProducts(res.data)
      } 
      catch (error) {
        toast.error(error.response?.data?.error || 'Something went wrong in fetching recommendations')
      } 
      finally {
          setIsLoading(false)
      }
    };
    fetchHomePageProducts()
  }, []);

  if (isLoading) return <LoadingSpinner />;


return (
  <section className="mt-6 w-full min-w-0">
    {/* Section heading */}
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold text-red-400 sm:text-2xl">
          Recommended for Your Downfall
        </h2>

        <p className="mt-1 text-xs text-gray-400 sm:text-sm">
          Handpicked artifacts that seem to have a mind of their own.
        </p>
      </div>

      <span className="text-xs text-red-400">
        More cursed discoveries await...
      </span>
    </div>

    {/* Product recommendations */}
    {homepageProducts.length > 0 ? (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {homepageProducts.slice(0, 5).map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>
    ) : (
      <p className="py-8 text-center text-sm text-gray-400">
        No cursed artifacts available right now.
      </p>
    )}
  </section>
);
}

export default HomePageProducts