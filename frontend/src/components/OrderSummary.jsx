
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ReceiptText } from "lucide-react";

import CurrencyPrice from "./CurrencyPrice";

const OrderSummary = () => {
  const navigate = useNavigate();

  // Read the existing cart totals and coupon information.
  const { total, subtotal, coupon, isCouponApplied } =
    useCartStore();

  const savings = Math.max(0, subtotal - total);

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="
        overflow-hidden rounded-xl
        border border-[#69404b]
        bg-[#281b27]
        p-3 text-white
        shadow-sm
        sm:p-5
      "
    >
      {/* SECTION HEADING */}
      <div className="mb-3 flex items-center gap-2.5">
        <ReceiptText
          size={19}
          className="shrink-0 text-red-400"
        />

        <h2 className="text-sm font-semibold text-red-300 sm:text-lg">
          Order Summary
        </h2>
      </div>

      {/* PRICE BREAKDOWN */}
      <div className="space-y-2.5">

        {/* Subtotal */}
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs text-gray-400 sm:text-sm">
            Original price
          </span>

          <CurrencyPrice
            amount={subtotal}
            className="min-w-0 break-all text-right text-xs font-medium text-gray-200 sm:text-sm"
          />
        </div>

        {/* Savings */}
        {savings > 0 && (
          <div className="flex items-start justify-between gap-3">
            <span className="text-xs text-gray-400 sm:text-sm">
              Savings
            </span>

            <div className="flex items-start text-emerald-400">
              <span>−</span>
              <CurrencyPrice
                amount={savings}
                className="break-all text-right text-xs font-medium sm:text-sm"
              />
            </div>
          </div>
        )}

        {/* Applied coupon */}
        {coupon && isCouponApplied && (
          <div className="flex items-start justify-between gap-3">
            <span className="min-w-0 break-words text-xs text-gray-400">
              Coupon applied
            </span>

            <span className="shrink-0 rounded-md bg-emerald-950/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              {coupon.discountPercentage}% OFF
            </span>
          </div>
        )}

        {/* TOTAL */}
        <div className="flex items-start justify-between gap-3 border-t border-[#69404b] pt-3">
          <span className="text-sm font-bold text-white sm:text-base">
            Total
          </span>

          <CurrencyPrice
            amount={total}
            className="min-w-0 break-all text-right text-lg font-bold leading-tight text-red-400 sm:text-xl"
          />
        </div>
      </div>

      {/* CHECKOUT BUTTON */}
      <motion.button
        type="button"
        onClick={() => navigate("/checkout")}
        whileTap={{ scale: 0.98 }}
        className="
          mt-4 flex min-h-11 w-full
          items-center justify-center gap-2
          rounded-lg border border-red-500/40
          bg-[#b91c32] px-4 py-2.5
          text-sm font-semibold text-white
          transition-colors duration-200
          hover:bg-red-600
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-red-400
        "
      >
        Checkout
        <ArrowRight size={17} />
      </motion.button>

      {/* CONTINUE SHOPPING */}
      <Link
        to="/"
        className="
          mt-3 flex min-h-9 items-center
          justify-center gap-2 text-xs
          font-medium text-red-300
          transition-colors hover:text-red-200
        "
      >
        Continue Shopping
        <ArrowRight size={14} />
      </Link>

    </motion.section>
  );
};

export default OrderSummary;
