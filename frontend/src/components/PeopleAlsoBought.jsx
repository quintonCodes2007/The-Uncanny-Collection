import { useEffect } from "react"
import { useState } from "react"
import axios from "../lib/axios"
import ProductCard from "./ProductCard"
import toast from "react-hot-toast"
import LoadingSpinner from "./LoadingSpinner"




const PeopleAlsoBought = () => {

  const  [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      
      try {
        const res = await axios.get('/products/recommendations')
        setRecommendations(res.data)
      } 
      catch (error) {
        toast.error(error.response?.data?.error || 'Something went wrong in fetching recommendations')
      } 
      finally {
          setIsLoading(false)
      }
    };
    fetchRecommendations()
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return  (<div className='mt-8'>
    <h3 className='text-2xl font-semibold text-red-400'>People Also Bought</h3>
    <div className='mt-6 grid grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4'>
      {recommendations?.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>

  </div>);
  
}

export default PeopleAlsoBought