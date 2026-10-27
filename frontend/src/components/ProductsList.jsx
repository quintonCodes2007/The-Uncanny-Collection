import { motion } from 'framer-motion';
import { Trash, Star } from 'lucide-react';
import { useProductStore } from '../stores/useProductStore';

const ProductsList = () => {

  const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();



  console.log("products", products);

  return (
    <motion.div
  className="w-full min-w-0 max-w-7xl mx-auto rounded-lg bg-red-300/10 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Scrollable table container */}
    <div className="w-full overflow-x-auto rounded-lg">


      <table className='min-w-full divide-y divide-red-500 table-fixed'>
        <thead className='bg-gray-800'>
          <tr>
            <th scope="col" className='px-9 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Product</th> 

            <th scope="col" className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Price</th>

            <th scope="col" className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Inventory Quantity</th>

            <th scope="col" className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Category</th>

            <th scope="col" className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Featured</th>

            <th scope="col" className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Actions</th>
          </tr>
        </thead>

        <tbody className='bg-red-300/10 divide-y divide-gray-200'>
          {products?.map((product) => (
            <tr key={product.id} className='hover:bg-red-700/10'>

              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='flex items-center'>
                  <div className='flex-0 h-10 w-10'>
                    <img 
                      className='h-10 w-10 rounded-full object-cover' 
                      src={product.image}
                      alt={product.name} 
                    />
                  </div>
                  <div className='ml-4'>
                    <div className='text-sm font-medium text-gray-300'>{product.name}</div>
                  </div>
                </div>
              </td>

              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm text-gray-300'>${product.price.toFixed(2)}</div>
              </td>

              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm text-gray-300'>{product.inventoryQuantity} items</div>
              </td>

              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm text-gray-300'>{product.category}</div>
              </td>

              <td className='px-6 py-4 whitespace-nowrap'>
                <button
                  onClick={() => toggleFeaturedProduct(product._id)}
                  className={`p-1 rounded-full ${
                    product.isFeatured ? 'bg-yellow-500 text-gray-900' : 'bg-gray-600 hover:bg-yellow-600'
                  } text-gray-300 transition-colors duration-200`}
                >
                  <Star className='h-5 w-5'/>
                </button>
              </td>

              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                <button
                  onClick={() => deleteProduct(product._id)}
                  className='text-red-600 hover:text-red-900'
                >
                  <Trash className='h-5 w-5'/>
                </button>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
    </motion.div>
  )
}

export default ProductsList;