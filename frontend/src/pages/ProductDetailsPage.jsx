
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  Star,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  Skull,
} from "lucide-react";
import toast from "react-hot-toast";

import axios from "../lib/axios";
import CurrencyPrice from "../components/CurrencyPrice";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useWishlistStore } from "../stores/useWishlistStore";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useUserStore();
  const { getCartItems, cartItems } = useCartStore();

  const userId = user?._id || user?.user?._id;

  const isWishlisted = useWishlistStore(
    (state) => state.isWishlisted
  );
  const toggleWishlist = useWishlistStore(
    (state) => state.toggleWishlist
  );

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      setProduct(null);
      setRelatedProducts([]);
      setQuantity(1);

      try {
        const response = await axios.get(`/products/${id}`);

        if (!active) return;

        const fetchedProduct = response.data;
        setProduct(fetchedProduct);

        const categorySlug = fetchedProduct.category?.slug;

        if (categorySlug) {
          try {
            const relatedResponse = await axios.get(
              `/products/category/${encodeURIComponent(categorySlug)}`
            );

            if (!active) return;

            const related = (
              relatedResponse.data.products ?? []
            )
              .filter((item) => item._id !== fetchedProduct._id)
              .slice(0, 4);

            setRelatedProducts(related);
          } catch (relatedError) {
            console.error(
              "Failed to load related products:",
              relatedError
            );
          }
        }
      } catch (err) {
        if (!active) return;

        setError(
          err.response?.data?.message ||
          "This artifact could not be summoned."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (error || !product) {
    return (
      <div className="mx-auto min-h-[65vh] max-w-5xl px-4 py-20 text-center">
        <Skull
          size={60}
          className="mx-auto mb-5 text-red-500"
        />

        <h1 className="mb-3 text-3xl font-bold text-red-400">
          Artifact Not Found
        </h1>

        <p className="mb-7 text-gray-400">
          {error || "This item escaped our inventory."}
        </p>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-lg bg-red-800 px-6 py-3 text-white hover:bg-red-700"
        >
          <ArrowLeft size={17} />
          Return to the Collection
        </Link>
      </div>
    );
  }

  const stock = Number(product.inventoryQuantity ?? 0);
  const inStock = stock > 0;
  const lowStock = stock > 0 && stock <= 5;
  const wishlisted = isWishlisted(userId, product._id);

  const existingCartItem = cartItems.find(
    (item) => item._id === product._id
  );

  const handleWishlist = () => {
    if (!userId) {
      toast.error("Sign in to save cursed artifacts!");
      navigate("/login");
      return;
    }

    toggleWishlist(userId, product);

    toast.success(
      wishlisted
        ? "Removed from your wishlist"
        : "Artifact added to your wishlist! ❤️"
    );
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Sign in before adopting this artifact.");
      navigate("/login");
      return;
    }

    if (!inStock || addingToCart) return;

    setAddingToCart(true);

    try {
      // Current cart API adds one item per POST.
      await axios.post("/cart", {
        productId: product._id,
      });

      // For quantities above one, adjust the reservation
      // using the existing cart quantity endpoint.
      if (quantity > 1) {
        const existingQuantity = Number(
          existingCartItem?.quantity ?? 0
        );

        await axios.put("/cart", {
          productId: product._id,
          quantity: existingQuantity + quantity,
        });
      }

      await getCartItems();

      toast.success(
        quantity === 1
          ? "Artifact added to cart!"
          : `${quantity} artifacts added to cart!`
      );

      setQuantity(1);
    } catch (err) {
      // A POST may have succeeded even if the PUT failed.
      // Refresh the cart to reflect the actual reservation.
      await getCartItems();

      toast.error(
        err.response?.data?.message ||
        "The artifact resisted your cart."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-10 text-white sm:pt-14">
      <div className="relative z-10 mx-auto w-full max-w-[1050px] px-4 pb-12 sm:px-6">

        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex flex-wrap items-center gap-2 text-xs text-gray-400"
        >
          <Link to="/" className="hover:text-red-400">
            Home
          </Link>

          <ChevronRight size={14} />

          <Link to="/products" className="hover:text-red-400">
            The Collection
          </Link>

          {product.category?.slug && (
            <>
              <ChevronRight size={14} />

              <Link
                to={`/category/${product.category.slug}`}
                className="hover:text-red-400"
              >
                {product.category.name}
              </Link>
            </>
          )}

          <ChevronRight size={14} />

          <span className="max-w-[220px] truncate text-red-300">
            {product.name}
          </span>
        </nav>

        {/* Main product layout */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-7">

          {/* Left: Image */}
          <div>
            <div className="relative overflow-hidden rounded-2xl border border-[#69404b] bg-[#1b111a] shadow-xl shadow-black/30">
              <div className="h-[340px] w-full sm:h-[500px] md:h-[460px]">
  <img
    src={product.image}
    alt={product.name}
    className="h-full w-full object-contain"
  />
</div>

              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {product.isHot && (
                  <span className="rounded-md border border-orange-400/40 bg-red-950/85 px-3 py-1.5 text-xs font-bold text-orange-200 backdrop-blur-sm">
                    🔥 HOT
                  </span>
                )}

                {product.isNewArrival && (
                  <span className="rounded-md border border-green-400/40 bg-green-950/85 px-3 py-1.5 text-xs font-bold text-green-300 backdrop-blur-sm">
                    ✦ NEW
                  </span>
                )}

                {product.discountPercentage > 0 && (
                  <span className="rounded-md bg-red-700 px-3 py-1.5 text-xs font-bold text-white">
                    -{product.discountPercentage}%
                  </span>
                )}
              </div>
            </div>

            

                

          </div>

          {/* Right: Product information */}
          <div className="flex h-full flex-col justify-between">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
              {product.category?.name || "Forbidden Artifact"}
            </p>

            <h1 className="text-xl font-bold leading-snug text-white sm:text-4xl">
            {product.name}
            </h1>

            {/* Ratings */}
            {typeof product.rating === "number" && (
              <div className="mt-2 mb-2 flex items-center gap-2">
                <div
                  className="flex items-center gap-1"
                  aria-label={`${product.rating} out of 5 stars`}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={
                        star <= Math.round(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-600"
                      }
                    />
                  ))}
                </div>

                <span className="text-sm text-gray-400">
                  {product.rating.toFixed(1)}
                  {" · "}
                  {product.reviewCount ?? 0} reviews
                </span>
              </div>
            )}

            <div className="my-2 border-t border-[#51303d]" />

            {/* Price */}
            <div className="space-y-2">
              <p className="text-xs mt-3 uppercase tracking-widest text-gray-400">
                Your Financial Sacrifice
              </p>

            <CurrencyPrice
            amount={product.price}
            className="text-2xl font-extrabold text-white sm:text-3xl"
            />

              {product.originalPrice > product.price && (
                <div className="text-sm text-gray-500 line-through">
                  <CurrencyPrice
                    amount={product.originalPrice}
                  />
                </div>
              )}
            </div>

            {/* Short description */}
                <p className="mt-3 text- leading-6 text-gray-300">
                {product.description}
                </p>

            {/* Stock */}
            <div className="mt-3 rounded-lg border border-[#69404b] bg-[#251821] px-3 py-2">
              <div className="flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    !inStock
                      ? "bg-red-500"
                      : lowStock
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                  }`}
                />

                <span
                  className={`text-sm font-semibold ${
                    !inStock
                      ? "text-red-400"
                      : lowStock
                        ? "text-amber-400"
                        : "text-emerald-400"
                  }`}
                >
                  {!inStock
                    ? "Out of Stock"
                    : lowStock
                      ? `Only ${stock} left in this realm`
                      : "In Stock — For Now"}
                </span>
              </div>

              <p className="mt-1 text-xs text-gray-500">
                Availability may change when other souls
                reserve this artifact.
              </p>
            </div>

            
               
{/* Quantity, Add to Cart, and Wishlist */}
<div className="mt- flex w-80 items-center gap-2 pt-4">

  {/* Quantity selector */}
  {inStock && (
    <div className="flex h-9 shrink-0 items-center overflow-hidden rounded-md border border-[#69404b] bg-[#21151f]">
      <button
        type="button"
        onClick={() =>
          setQuantity((value) => Math.max(1, value - 1))
        }
        disabled={quantity <= 1 || addingToCart}
        aria-label="Decrease quantity"
        className="flex h-full w-7 items-center justify-center hover:bg-red-950/50 disabled:opacity-40"
      >
        <Minus size={13} />
      </button>

      <span className="min-w-6 text-center text-xs font-semibold">
        {quantity}
      </span>

      <button
        type="button"
        onClick={() =>
          setQuantity((value) =>
            Math.min(stock, value + 1)
          )
        }
        disabled={quantity >= stock || addingToCart}
        aria-label="Increase quantity"
        className="flex h-full w-7 items-center justify-center hover:bg-red-950/50 disabled:opacity-40"
      >
        <Plus size={13} />
      </button>
    </div>
  )}

  {/* Add to Cart */}
  <button
    type="button"
    onClick={handleAddToCart}
    disabled={!inStock || addingToCart}
    className="flex h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md border border-red-500/60 bg-[#922638] px-3 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <ShoppingCart size={15} className="shrink-0" />

    <span className="whitespace-nowrap">
      {addingToCart
        ? "Summoning..."
        : inStock
          ? "Add to Cart"
          : "Sold Out"}
    </span>
  </button>

  {/* Wishlist */}
  <button
    type="button"
    onClick={handleWishlist}
    aria-pressed={wishlisted}
    title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    className={`flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md border px-3 text-xs font-semibold transition-colors ${
      wishlisted
        ? "border-red-500 bg-red-950/60 text-red-300"
        : "border-[#805360] bg-[#281b25] text-gray-200 hover:border-red-500 hover:text-red-300"
    }`}
  >
    <Heart
      size={16}
      className={wishlisted ? "fill-red-500 text-red-500" : ""}
    />

    <span className="hidden sm:inline">
      {wishlisted ? "Saved" : "Wishlist"}
    </span>
  </button>
</div>
 

            

          </div>
        </div>

        
        

        {/* Trust messages */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-lg border border-[#51303d] bg-[#21151f] p-4">
                <Truck
                  size={21}
                  className="shrink-0 text-red-400"
                />
                <div>
                  <h3 className="text-sm font-semibold text-gray-200">
                    Delivery Across Realms
                  </h3>
                  <p className="mt-1 text-xs text-gray-400">
                    Estimated 3–5 business hauntings.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-[#51303d] bg-[#21151f] p-4">
                <ShieldCheck
                  size={21}
                  className="shrink-0 text-red-400"
                />
                <div>
                  <h3 className="text-sm font-semibold text-gray-200">
                    Questionable Protection
                  </h3>
                  <p className="mt-1 text-xs text-gray-400">
                    Your purchase is protected.
                    Your soul is another matter.
                  </p>
                </div>
              </div>
            </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-14 border-t border-[#51303d] pt-9">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-red-400">
                  You May Also Regret Buying
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  More questionable treasures from this realm.
                </p>
              </div>

              {product.category?.slug && (
                <Link
                  to={`/category/${product.category.slug}`}
                  className="text-sm font-medium text-red-400 hover:text-red-300"
                >
                  Explore Category
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <ProductCard
                  key={item._id}
                  product={item}
                />
              ))}
            </div>
          </section>
        )}

        {/* Bottom navigation */}
        <div className="mt-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-red-400"
          >
            <ArrowLeft size={17} />
            Back to The Collection
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
