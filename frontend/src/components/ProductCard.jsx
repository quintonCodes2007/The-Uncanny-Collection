import toast from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';
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
  <div className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg">

    {/* Compact square product image */}
    <div className="aspect-square w-full overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </div>

    {/* Product details */}
    <div className="flex flex-1 flex-col p-1.5 sm:p-3">

      <h3 className="line-clamp-2 text-[10px] leading-tight font-semibold text-red-300 sm:text-sm">
        {product.name}
      </h3>

      {/* Hide descriptions on smaller screens */}
      <p className="mt-1 hidden line-clamp-2 text-xs text-gray-400 sm:block">
        {product.description}
      </p>

      <div className="mt-auto pt-2">
        <p className="truncate text-xs font-bold text-red-500 sm:text-lg">
          ${product.price.toFixed(2)}
        </p>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        aria-label={`Add ${product.name} to cart`}
        className="mt-2 flex min-h-8 w-full items-center justify-center rounded-md bg-red-800 px-1 py-1.5 text-white transition-colors hover:bg-red-700 sm:gap-1"
      >
        <ShoppingCart size={16} className="shrink-0" />
        <span className="hidden text-xs sm:inline">Add</span>
      </button>

    </div>
  </div>
);

}

export default ProductCard