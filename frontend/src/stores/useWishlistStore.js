
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      // Each user has a separate wishlist.
      wishlists: {},

      getWishlist: (userId) => {
        if (!userId) return [];

        return get().wishlists[userId] || [];
      },

      isWishlisted: (userId, productId) => {
        if (!userId || !productId) return false;

        const wishlist = get().wishlists[userId] || [];

        return wishlist.some(
          (product) => product._id === productId
        );
      },

      toggleWishlist: (userId, product) => {
        if (!userId || !product?._id) return;

        set((state) => {
          const current = state.wishlists[userId] || [];

          const exists = current.some(
            (item) => item._id === product._id
          );

          const updated = exists
            ? current.filter(
                (item) => item._id !== product._id
              )
            : [...current, product];

          return {
            wishlists: {
              ...state.wishlists,
              [userId]: updated,
            },
          };
        });
      },

      removeFromWishlist: (userId, productId) => {
        if (!userId) return;

        set((state) => ({
          wishlists: {
            ...state.wishlists,
            [userId]: (
              state.wishlists[userId] || []
            ).filter((item) => item._id !== productId),
          },
        }));
      },
    }),
    {
      name: "uncanny-wishlists",
      partialize: (state) => ({
        wishlists: state.wishlists,
      }),
    }
  )
);
