import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import CartItem from '../components/CartItem';
import PeopleAlsoBought from '../components/PeopleAlsoBought';
import OrderSummary from '../components/OrderSummary';
import GiftCouponCard from '../components/GiftCouponCard';
import { useEffect } from "react";
import ReservationCountdown from "../components/ReservationCountdown";
import DeliveryDestination from "../components/DeliveryDestination";

const CartPage = () => {

const { cartItems } = useCartStore();
  console.log("CART:", cartItems);

  const getCartItems = useCartStore((state) => state.getCartItems);

    useEffect(() => {
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          getCartItems();
        }
      };

      document.addEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }, [getCartItems]);

  
  return (
    <div className="pt-5 pb-4 sm:py-6 lg:py-1">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 2xl:px-0">

        {/* MAIN CART LAYOUT */}
        <div className="mt-3 flex flex-col gap-4 lg:mt-6 lg:flex-row lg:items-start lg:gap-8">

          {/* LEFT: TIMER AND CART ITEMS */}
          <motion.div
            className="w-full min-w-0 lg:flex-1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {cartItems?.length === 0 ? (
              <EmptyCartUI />
            ) : (
              <div className="space-y-3 sm:space-y-5">

                {/* Reservation timer */}
                <ReservationCountdown
                  cartItems={cartItems}
                  onExpire={getCartItems}
                  durationMinutes={15}
                />

                {/* Reserved products */}
                {cartItems.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                  />
                ))}

              </div>
            )}
          </motion.div>

          {/* RIGHT: CHECKOUT INFORMATION */}
          {cartItems?.length > 0 && (
            <motion.div
              className="w-full min-w-0 space-y-3 sm:space-y-5 lg:w-80 lg:shrink-0 xl:w-96"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >

            
              <DeliveryDestination />
              <GiftCouponCard />             
              <OrderSummary />

            </motion.div>
          )}

        </div>

        {/* RECOMMENDATIONS BELOW THE CART */}
        {cartItems?.length > 0 && (
          <section className="mt-6 sm:mt-8">
            <PeopleAlsoBought />
          </section>
        )}

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

