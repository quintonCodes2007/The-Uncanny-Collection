
import { Link } from "react-router-dom";
import { Heart, ArrowLeft, Ghost } from "lucide-react";

import { useUserStore } from "../stores/useUserStore";
import { useWishlistStore } from "../stores/useWishlistStore";

import ProductCard from "../components/ProductCard";

const EMPTY_WISHLIST = [];

const MyWishlistPage = () => {
  const { user } = useUserStore();

  const userId = user?._id || user?.user?._id;

 const wishlist = useWishlistStore(
  (state) => state.wishlists[userId] ?? EMPTY_WISHLIST
);



  return (
    <div className="relative min-h-screen text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Back to marketplace */}
        

        {/* Page heading */}
        <div className="mb-10 text-center">
          

          <h1 className="mb-3 mt-5 text-3xl font-bold text-red-400 sm:text-5xl">
            My Cursed Wishlist
          </h1>

          <p className="text-gray-400">
            Artifacts your heart desires...
            though your soul may disagree.
          </p>
        </div>

        {wishlist.length > 0 ? (
          <>
            {/* Wishlist count */}
            <p className="mb-3 text-sm text-gray-400">
              {wishlist.length}{" "}
              {wishlist.length === 1
                ? "artifact"
                : "artifacts"}{" "}
              waiting for you
            </p>

            {/* Wishlist products */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
              {wishlist.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>

            <p className="mt-8 text-center text-xs text-gray-500">
              Wishlisting does not reserve an artifact.
              Availability may change.
            </p>
          </>
        ) : (
          /* Empty wishlist */
          <div className="py- text-center">
            <Ghost
              size={64}
              className="mx-auto mb-5 text-red-500"
            />

            <h2 className="mb-3 text-2xl font-bold text-red-300">
              Your Heart Desires Nothing... Yet.
            </h2>

            <p className="mx-auto mb-7 max-w-md text-gray-400">
              Not a single cursed artifact has captured
              your attention. How disappointing.
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
            >
              <Heart size={17} />
              Discover Your Next Obsession
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyWishlistPage;
