import toast from 'react-hot-toast';
import { ShoppingCart, Heart, Star, Flame, Tag } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore.js';
import { useCartStore } from '../stores/useCartStore.js';

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

          {/* Promotional badge */}
          {product.discountPercentage > 0 ? (
            <span className="absolute left-2 top-2 rounded-md bg-[#982b3b] px-2 py-0.5 text-[10px] font-semibold text-white">
              <Tag size={11} className="mr-1 inline" />
              {product.discountPercentage}% Off
            </span>
          ) : product.isFeatured ? (
            <span className="absolute left-2 top-2 rounded-md bg-[#982b3b] px-2 py-0.5 text-[10px] font-semibold text-white">
              <Star size={11} className="mr-1 inline fill-current" />
              Featured
            </span>
          ) : product.isHot ? (
            <span className="absolute left-2 top-2 rounded-md bg-[#982b3b] px-2 py-0.5 text-[10px] font-semibold text-white">
              <Flame size={11} className="mr-1 inline" />
              Hot
            </span>
          ) : product.isNew ? (
            <span className="absolute left-2 top-2 rounded-md bg-[#982b3b] px-2 py-0.5 text-[10px] font-semibold text-white">
              New
            </span>
          ) : null}

          {/* Wishlist placeholder */}
          <span
            title="Wishlist coming soon"
            className="absolute right-2 top-2 rounded-full bg-black/65 p-1 text-white"
          >
            <Heart size={17} />
          </span>
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
                <span className="text-sm font-bold text-white sm:text-base">
                  N${product.price.toFixed(2)}
                </span>

                {product.originalPrice > product.price && (
                  <span className="text-[10px] text-gray-500 line-through">
                    N${product.originalPrice.toFixed(2)}
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