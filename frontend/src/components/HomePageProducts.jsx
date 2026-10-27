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


  return  (<div className='mt-20'>
    <h1 className='text-5xl font-semibold text-center  text-red-400'>Discover Something Uncanny</h1>
    <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'>
      {homepageProducts?.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>

  </div>);
}

export default HomePageProducts