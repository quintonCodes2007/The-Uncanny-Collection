
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import CurrencyPrice from "./CurrencyPrice";

const CartItem = ({ item }) => {
  const updateQuantity = useCartStore(
    (state) => state.updateQuantity
  );

  const removeFromCart = useCartStore(
    (state) => state.removeFromCart
  );

  return (
    <article className="rounded-xl border border-[#543440] bg-[#2b202b] p-2.5 shadow-sm sm:p-4">

      <div className="flex items-center gap-3">

        {/* COMPACT PRODUCT IMAGE */}
        <img
          src={item.image}
          alt={item.name}
          className="h-[64px] w-[64px] shrink-0 rounded-lg object-cover sm:h-28 sm:w-28"
        />

        {/* PRODUCT DETAILS */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">

          {/* Name */}
          <h3 className="line-clamp-2 text-xs font-semibold leading-4 text-white sm:text-lg">
            {item.name}
          </h3>

          {/* Description — desktop only */}
          <p className="hidden text-sm text-gray-400 sm:line-clamp-2">
            {item.description}
          </p>

          {/* Price */}
          <CurrencyPrice
            amount={item.price * item.quantity}
            className="text-sm font-bold text-red-400 sm:text-lg"
          />

          {/* QUANTITY CONTROLS */}
          <div className="mt-1 flex items-center gap-2">

            <button
              type="button"
              onClick={() =>
                updateQuantity(item._id, item.quantity - 1)
              }
              disabled={item.quantity <= 1}
              aria-label={`Decrease quantity of ${item.name}`}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#62404b] bg-[#44303c] text-gray-200 transition-colors hover:bg-[#604052] disabled:opacity-40"
            >
              <Minus size={14} />
            </button>

            <span className="min-w-4 text-center text-xs font-semibold text-white">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                updateQuantity(item._id, item.quantity + 1)
              }
              aria-label={`Increase quantity of ${item.name}`}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#62404b] bg-[#44303c] text-gray-200 transition-colors hover:bg-[#604052]"
            >
              <Plus size={14} />
            </button>

          </div>
        </div>

        {/* REMOVE PRODUCT */}
        <button
          type="button"
          onClick={() => removeFromCart(item._id)}
          aria-label={`Remove ${item.name} from cart`}
          className="flex h-10 w-9 shrink-0 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-950/40 hover:text-red-300"
        >
          <Trash2 size={17} />
        </button>

      </div>
    </article>
  );
};

export default CartItem;
