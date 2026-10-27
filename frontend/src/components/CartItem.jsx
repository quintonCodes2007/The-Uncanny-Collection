import {Minus, Plus, Trash} from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';

const CartItem = ({ item }) => {
    
    const { updateQuantity, removeFromCart } = useCartStore();


return (
  <div className="rounded-lg border border-gray-700 bg-gray-800 p-3 shadow-sm sm:p-4 md:p-6">
    <div className="flex items-start gap-3 sm:gap-5">

      {/* Product image */}
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-28">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Product information */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">

        <h3 className="text-sm font-semibold text-white break-words sm:text-lg">
          {item.name}
        </h3>

        <p className="line-clamp-2 text-xs text-gray-400 sm:text-sm">
          {item.description}
        </p>

        <p className="text-base font-bold text-red-400 sm:text-lg">
          ${(item.price * item.quantity).toFixed(2)}
        </p>

        {/* Quantity and remove controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={`Decrease quantity of ${item.name}`}
              disabled={item.quantity <= 1}
              onClick={() =>
                updateQuantity(item._id, item.quantity - 1)
              }
              className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-40"
            >
              <Minus size={16} />
            </button>

            <span className="text-sm font-medium text-white">
              {item.quantity}
            </span>

            <button
              type="button"
              aria-label={`Increase quantity of ${item.name}`}
              onClick={() =>
                updateQuantity(item._id, item.quantity + 1)
              }
              className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            type="button"
            aria-label={`Remove ${item.name} from cart`}
            onClick={() => removeFromCart(item._id)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-red-400 hover:bg-red-900/30 hover:text-red-300"
          >
            <Trash size={18} />
          </button>

        </div>
      </div>
    </div>
  </div>
);

};

export default CartItem