import { Ticket, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";

const GiftCouponCard = () => {
  const [userInputCode, setUserInputCode] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const {
    coupon,
    isCouponApplied,
    applyCoupon,
    getMyCoupon,
    removeCoupon,
  } = useCartStore();

  useEffect(() => {
    getMyCoupon();
  }, [getMyCoupon]);


  const displayedCode = userInputCode ?? coupon?.code ?? "";

  const handleApplyCoupon = () => {
    const code = displayedCode.trim();
    if (!code) return;

    applyCoupon(code);
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
    setUserInputCode("");
  };

  
return (
  <section className="overflow-hidden rounded-xl border border-[#69404b] bg-[#281b27] text-white">

    {/* Compact coupon header */}
    <button
      type="button"
      onClick={() => setExpanded((prev) => !prev)}
      aria-expanded={expanded}
      aria-controls="coupon-options"
      className="flex min-h-14 w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-red-950/20"
    >
      <Ticket size={19} className="shrink-0 text-red-400" />

      <div className="min-w-0 flex-1">
        <h2 className="text-sm font-semibold text-red-300">
          Have a Cursed Code?
        </h2>

        <p className="mt-0.5 truncate text-[11px] text-gray-400">
          {isCouponApplied && coupon
            ? `Applied: ${coupon.code}`
            : coupon
              ? "You have an available coupon"
              : "Enter a voucher or gift card"}
        </p>
      </div>

      <ChevronDown
        size={18}
        className={`shrink-0 text-gray-400 transition-transform duration-300 ${
          expanded ? "rotate-180" : ""
        }`}
      />
    </button>

    {/* Expandable coupon controls */}
    {expanded && (
      <div
        id="coupon-options"
        className="space-y-3 border-t border-[#69404b] px-3 py-3"
      >
        <label
          htmlFor="voucher"
          className="block text-xs font-medium text-gray-300"
        >
          Voucher or Gift Card
        </label>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            id="voucher"
            value={displayedCode}
            onChange={(event) =>
              setUserInputCode(event.target.value)
            }
            placeholder="Enter your cursed code..."
            className="min-w-0 flex-1 rounded-lg border border-[#69404b] bg-[#21151f] px-3 py-2.5 text-sm text-white outline-none focus:border-red-500"
          />

          <button
            type="button"
            onClick={handleApplyCoupon}
            disabled={!displayedCode.trim()}
            className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
          >
            Apply Code
          </button>
        </div>

        {coupon && (
          <div className="rounded-lg border border-[#69404b] bg-[#21151f] p-3">
            <p className="text-[11px] text-gray-400">
              {isCouponApplied
                ? "Applied Coupon"
                : "Your Available Coupon"}
            </p>

            <p className="mt-1 break-all text-xs font-semibold text-red-300">
              {coupon.code} — {coupon.discountPercentage}% OFF
            </p>

            {isCouponApplied && (
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="mt-2 text-xs font-medium text-red-400 hover:text-red-300"
              >
                Remove Coupon
              </button>
            )}
          </div>
        )}
      </div>
    )}

  </section>
);

};

export default GiftCouponCard;
