import { motion } from 'framer-motion';
import { Trash, Star, Pencil } from 'lucide-react';
import { useProductStore } from '../stores/useProductStore';
import { useState } from 'react';

const ProductsList = () => {

  const { deleteProduct, toggleFeaturedProduct, updateProductStock, products } = useProductStore();



  console.log("products", products);

  const [editingProduct, setEditingProduct] = useState(null);
  const [stockQuantity, setStockQuantity] = useState('');

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
            <tr key={product._id} className="hover:bg-red-700/10">

              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 shrink-0 rounded-lg object-cover border border-red-400/30"
                  />

                  <span className="text-sm font-medium text-gray-300">
                    {product.name}
                  </span>
                </div>
              </td>

              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm text-gray-300'>${product.price.toFixed(2)}</div>
              </td>

              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm text-gray-300'>

                  <div className="flex flex-col gap-1">
                    <span className="text-gray-300">
                      {product.inventoryQuantity} items
                    </span>

                    <span
                      className={`text-xs font-medium ${
                        product.inventoryQuantity === 0
                          ? "text-red-500"
                          : product.inventoryQuantity <= 3
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      {product.inventoryQuantity === 0
                        ? "Sold Out"
                        : product.inventoryQuantity <= 3
                        ? "Low Stock"
                        : "In Stock"}
                    </span>
                  </div>
                  
                  </div>
              </td>

              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='text-sm text-gray-300'>{product.category?.name ?? "Uncategorized"}</div>
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
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                    setEditingProduct(product._id);
                    setStockQuantity(String(product.inventoryQuantity));
                  }}
                  >
                    <Pencil className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="text-red-600 hover:text-red-400"
                    title="Delete product"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
                {editingProduct === product._id && (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(e.target.value)}
                      className="w-20 rounded border border-red-400/40 bg-gray-900 p-2 text-white"
                    />

                    <button
                      onClick={async () => {
                      const quantity = Number(stockQuantity);

                      if (
                        stockQuantity.trim() === "" ||
                        !Number.isSafeInteger(quantity) ||
                        quantity < 0
                      ) {
                        alert("Please enter a valid stock quantity");
                        return;
                      }

                      const success = await updateProductStock(
                        product._id,
                        quantity
                      );

                      if (success) {
                        setEditingProduct(null);
                      }
                    }}
                      className="text-green-400"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingProduct(null)}
                      className="text-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                )}
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