import {create} from 'zustand';
import axios from '../lib/axios';
import {toast} from 'react-hot-toast'; 


export const useCartStore = create((set, get) => ({
  cartItems: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,

	getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupons");
			set({ coupon: response.data });
		} catch (error) {
			console.error("Error fetching coupon:", error);
		}
	},

      applyCoupon: async (code) => {
      try {
        const response = await axios.post("/coupons/validate", { code });
        set({ coupon: response.data, isCouponApplied: true });
        get().calculateTotal();
        toast.success("Coupon applied successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to apply coupon");
      }
    },

      removeCoupon: () => {
      set({ coupon: null, isCouponApplied: false });
      get().calculateTotal();
      toast.success("Coupon removed");
    },

    getCartItems: async () => {
      try {
        const response = await axios.get("/cart");
        console.log("🌕 Refreshed cart:", response.data);

        set({ cartItems: response.data });
        get().calculateTotal();
      } catch (error) {
        console.error("Failed to refresh cart:", error);
      }
    },


addToCart: async (product) => {
  try {
    await axios.post("/cart", {
      productId: product._id,
    });

    // Refresh cart with the actual reservation expiry
    await get().getCartItems();

    toast.success("Item added to cart");
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Error adding item to cart"
    );
  }
},



calculateTotal: () => {
  const { cartItems, coupon, isCouponApplied } = get();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  let total = subtotal;

  if (coupon && isCouponApplied) {
    const discountAmount =
      (subtotal * coupon.discountPercentage) / 100;

    total = subtotal - discountAmount;
  }

  set({ subtotal, total });
},





    removeFromCart: async (productId) => {
        try {
            const response = await axios.delete('/cart', {
                data: { productId }
            });

            if (response.status === 200) {
                toast.success('Item removed from cart');
                set(prevState => ({
                    cartItems: prevState.cartItems.filter(item => item._id !== productId)
                }));
                get().calculateTotal();
            }
        } catch (error) {
            console.error("Error removing item from cart:", error);
            toast.error(error.response?.data?.message || 'Error removing item from cart');
        }
    },

    updateQuantity: async (productId, quantity) => {
      if (quantity === 0) {
        await get().removeFromCart(productId);
        return
      } else {
        try {
          const response = await axios.put('/cart', { productId, quantity });
          set(prevState => ({
            cartItems: prevState.cartItems.map(item => item._id === productId ? { ...item, quantity } : item)
          }));
          get().calculateTotal();
        } catch (error) {
          toast.error(error.response?.data?.message || 'Error updating item quantity');
        }
      }
    },


    clearCart: async () => {
      try {
        await axios.delete('/cart');
        set({ cartItems: [], coupon: null, total: 0, subtotal: 0, isCouponApplied: false });
        toast.success('Cart cleared');

      } catch (error) {
        toast.error(error.response?.data?.message || 'Error clearing cart');
      }
    },
  }));
