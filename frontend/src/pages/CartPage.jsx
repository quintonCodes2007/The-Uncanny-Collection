import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import CartItem from '../components/CartItem';
import PeopleAlsoBought from '../components/PeopleAlsoBought';
import OrderSummary from '../components/OrderSummary';
import GiftCouponCard from '../components/GiftCouponCard';

const CartPage = () => {

const { cartItems } = useCartStore();
  console.log("CART:", cartItems);

  return (
    <div className='py-8 md:py-1'>
      <div className='mx-auto max-w-7xl px-4 2xl:px-0'>
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start xl:gap-8">
          <motion.div
              className="w-full min-w-0 lg:flex-1"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay:0.5}}
          >
            {cartItems?.length === 0 ? (
              <EmptyCartUI />
            ) : (
              <div className='space-y-6'>
                {cartItems?.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
            )}
            {cartItems?.length > 0 && <PeopleAlsoBought />}
          </motion.div>

          {cartItems?.length > 0 && (

            <motion.div
              className="w-full min-w-0 space-y-6 lg:w-80 lg:shrink-0 xl:w-96"
              initial={{ opacity: 0, y: 20 }}  
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}  
            >
              <OrderSummary />
              <GiftCouponCard/>
            </motion.div> 

          )}
          </div>
      </div>
    </div>
  );
};

export default CartPage;

const EmptyCartUI = () => (
  <motion.div 
    className='flex flex-col items-center justify-center space-y-4 py-16'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5}}
  >
    <ShoppingCart className='h-24 w-24 text-gray-400' />
    <h3 className="text-center text-xl font-semibold sm:text-2xl">
  Your cart is empty
</h3>
    <p className="max-w-sm px-4 text-center text-sm text-gray-400 sm:text-lg">Go ahead and add some items to your cart.</p>
    
    <Link to='/' className='mt-4 text-gray-500 hover:text-gray-600'>
      <span className='text-1xl px-1'>Browse products</span>
      <span className='text-gray-500 text-sm'>&rarr;</span>
    </Link>
    
  </motion.div>
);

