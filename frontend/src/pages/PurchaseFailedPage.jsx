
import { Link, useLocation } from "react-router-dom";
import { CircleX, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const PurchaseFailedPage = () => {
  const location = useLocation();

  const message =
    location.state?.error ||
    "The spirits interrupted your checkout. Please try again.";

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-red-500/30 bg-gray-950/90 p-8 text-center shadow-xl"
      >
        <CircleX className="mx-auto mb-5 h-16 w-16 text-red-500" />

        <h1 className="mb-3 text-3xl font-bold text-red-400">
          The Ritual Failed
        </h1>

        <p className="mb-3 text-gray-300">
          Even dark magic has its bad days.
        </p>

        <p className="mb-8 text-sm text-gray-400">
          {message}
        </p>

        <Link
          to="/cart"
          className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
        >
          <ShoppingCart size={18} />
          Return to Cart
        </Link>

        <p className="mt-5 text-xs text-gray-500">
          Your cart items have not been intentionally removed.
        </p>
      </motion.div>
    </main>
  );
};

export default PurchaseFailedPage;

