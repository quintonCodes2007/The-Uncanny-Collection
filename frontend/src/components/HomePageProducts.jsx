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
    <h1 className='text-center text-3xl font-bold sm:text-5xl lg:text-6xl text-red-400 mb-4'>Discover Something Uncanny</h1>
    

<div className="mt-6 grid grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
  {homepageProducts?.map((product) => (
    <ProductCard key={product._id} product={product} />
  ))}
</div>



  </div>);
}

export default HomePageProducts