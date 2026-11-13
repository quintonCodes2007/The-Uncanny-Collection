import toast from 'react-hot-toast';
import { ShoppingCart, Heart, Star, Flame, Tag } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore.js';
import { useCartStore } from '../stores/useCartStore.js';

import CurrencyPrice from "./CurrencyPrice";

import { useNavigate } from "react-router-dom";
import { useWishlistStore } from "../stores/useWishlistStore";

const ProductCard = ({ product }) => {
    const { user } = useUserStore();
    const { addToCart } = useCartStore();
    const handleAddToCart = () => {

        if(!user) {
            toast.success(`Please login to add to cart`, {id:"login"});
            return
        } else{
            addToCart(product);
        }
    }

    const navigate = useNavigate();

const userId = user?._id || user?.user?._id;

const {
  isWishlisted,
  toggleWishlist,
} = useWishlistStore();

const wishlisted = isWishlisted(userId, product._id);

const handleWishlist = () => {
  if (!userId) {
    toast.error("Sign in to save cursed artifacts!");

    navigate("/login");
    return;
  }

  toggleWishlist(userId, product);

  if (wishlisted) {
    toast.success("Removed from your wishlist");
  } else {
    toast.success("Artifact added to your wishlist! ❤️");
  }
};


    return (
      <article className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-[#51303d] bg-[#1e141c] transition-all duration-300 hover:border-red-500/70 hover:shadow-lg hover:shadow-red-950/30">

        {/* Product image and badges */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#130b11]">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          
{/* Promotional badges */}
<div className="absolute left-2 top-2 z-10 flex flex-row flex-wrap items-center gap-1.5">

  {product.discountPercentage > 0 && (
    <span className="rounded-md bg-red-800 px-2 py-1 text-[10px] font-semibold text-white">
      <Tag size={11} className="mr-1 inline" />
      {product.discountPercentage}% Off
    </span>
  )}

  {product.isFeatured && (
    <span className="rounded-md bg-amber-600 px-2 py-1 text-[10px] font-semibold text-white">
      <Star size={11} className="mr-1 inline" />
      Featured
    </span>
  )}

  
{product.isHot && (
  <span
    className="
      inline-flex items-center gap-1
      rounded-md
      border border-orange-400/40
      bg-red-950/70
      px-2.5 py-1
      text-[10px] font-bold tracking-wide text-orange-200
      shadow-[0_0_10px_rgba(249,115,22,0.25)]
      backdrop-blur-sm
    "
  >
    <span className="text-xs">🔥</span>
    HOT
  </span>
)}


  
{product.isNewArrival && (
  <span
    className="
      inline-flex items-center gap-1
      rounded-md
      border border-green-400/40
      bg-green-950/65
      px-2.5 py-1
      text-[10px] font-bold tracking-wide text-green-300
      shadow-[0_0_10px_rgba(34,197,94,0.25)]
      backdrop-blur-sm
    "
  >
    <span className="text-xs">✦</span>
    NEW
  </span>
)}


</div>


          {/* Wishlist placeholder */}
          {/* Wishlist button */}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={
              wishlisted
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
            aria-pressed={wishlisted}
            title={
              wishlisted
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            className={`absolute right-2 top-2 z-10 rounded-full p-2 transition-all duration-200 hover:scale-110 ${
              wishlisted
                ? "bg-red-900/90 text-red-400"
                : "bg-black/65 text-white hover:text-red-400"
            }`}
          >
            <Heart
              size={19}
              className={
                wishlisted ? "fill-red-500 text-red-500" : ""
              }
            />
          </button>
        </div>

        {/* Product information */}
        <div className="flex flex-1 flex-col p-2.5 sm:p-3">

          <h3 className="line-clamp-1 text-sm font-bold text-white">
            {product.name}
          </h3>

          <p className="mt-1 line-clamp-1 text-[11px] text-gray-400">
            {product.description}
          </p>

          {/* Real customer ratings, when available */}
          {typeof product.rating === "number" &&
            typeof product.reviewCount === "number" && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <div
                  className="flex items-center gap-0.5"
                  aria-label={`${product.rating} out of 5 stars`}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={12}
                      className={
                        star <= Math.round(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-600"
                      }
                    />
                  ))}
                </div>

                <span className="text-[10px] text-gray-400">
                  ({product.reviewCount})
                </span>
              </div>
            )}

          {/* Price and stock */}
          <div className="mt-auto pt-3">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <div className="flex items-center gap-2">
                <CurrencyPrice
                    amount={product.price}
                    className="text-sm font-bold text-white sm:text-base"
                  />

                {product.originalPrice > product.price && (
                    <span className="text-[10px] text-gray-500 line-through">
                      <CurrencyPrice amount={product.originalPrice} />
                    </span>
                  )}
              </div>

              <span
                className={`flex items-center gap-1 text-[10px] ${
                  product.inventoryQuantity <= 5
                    ? "text-amber-400"
                    : "text-emerald-400"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    product.inventoryQuantity <= 5
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                  }`}
                />

                {product.inventoryQuantity <= 0
                  ? "Out of Stock"
                  : product.inventoryQuantity <= 5
                    ? `Low Stock (${product.inventoryQuantity} left)`
                    : "In Stock"}
              </span>
            </div>

            {/* Add to cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.inventoryQuantity <= 0}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-red-500/60 bg-[#922638] px-2 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart size={14} />
              Add to Cart
            </button>
          </div>
        </div>
      </article>
    );



}

export default ProductCard