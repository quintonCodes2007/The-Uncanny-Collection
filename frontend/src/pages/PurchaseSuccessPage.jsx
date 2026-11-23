
import { CheckCircle, HandHeart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useEffect } from "react";
import { useCartStore } from "../stores/useCartStore";

const PurchaseSuccessPage = () => {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Confetti
        numberOfPieces={400}
        recycle={false}
        colors={["#dc2626", "#ef4444", "#f87171"]}
      />

      {/* Compact mobile container */}
      <div className="mt-0 flex h-full items-start justify-center px-3 pt-12 sm:mt-8 sm:px-4 sm:pt-0">

        {/* Same original background and colors */}
        <div className="relative z-10 w-full max-w-[305px] overflow-hidden rounded-lg bg-gray-800 shadow-xl sm:max-w-md">

          <div className="p-2.5 sm:p-8">

            {/* Smaller success icon on mobile */}
            <div className="flex justify-center">
              <CheckCircle className="mb-1 h-8 w-8 text-red-300 sm:mb-4 sm:h-16 sm:w-16" />
            </div>

            {/* Compact heading */}
            <h1 className="mb-1.5 text-center text-lg font-bold leading-tight text-red-400 sm:text-3xl">
              Purchase Successful... Unfortunately.
            </h1>

            <p className="mb-1.5 text-center text-[13px] leading-5 text-red-400 sm:mb-2 sm:text-base">
              Thank you for funding our mysterious activities.
              Your contribution will not be forgotten.
            </p>

            <p className="mb-3 text-center text-xs text-red-400 sm:mb-6 sm:text-sm">
              A confirmation email is kama on its way.
            </p>

            {/* Compact order information */}
            <div className="mb-2 rounded-lg bg-gray-700 p-2 sm:mb-6 sm:p-4">

              <div className="mb-1 flex items-center justify-between gap-2 sm:mb-2">
                <span className="text-xs text-red-400 sm:text-sm">
                  Order ID:
                </span>

                <span className="text-xs font-semibold text-red-400 sm:text-sm">
                  21a3b79c
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-red-400 sm:text-sm">
                  estimate delivery
                </span>

                <span className="text-xs font-semibold text-red-400 sm:text-sm">
                  18 thousand weeks
                </span>
              </div>
            </div>

            {/* Compact action buttons */}
            <div className="space-y-1.5 sm:space-y-4">

              <button
                type="button"
                className="flex min-h-11 w-full items-center justify-center rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white transition duration-300 sm:px-4 sm:text-base"
              >
                <HandHeart className="mr-2" size={16} />
                We appreciate your loss!
              </button>

              <Link
                to="/"
                className="flex min-h-11 w-full items-center justify-center rounded-lg bg-gray-600 px-3 py-2 text-center text-xs font-bold text-red-400 transition duration-300 hover:bg-gray-700 sm:px-4 sm:text-base"
              >
                <ArrowRight className="mr-2 shrink-0" size={16} />
                Continue making poor decisions
              </Link>

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PurchaseSuccessPage;
