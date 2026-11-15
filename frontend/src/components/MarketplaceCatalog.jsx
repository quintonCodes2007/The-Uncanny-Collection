
import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { Ghost, PackageOpen, ArrowLeft } from "lucide-react";

import axios from "../lib/axios";
import ProductCard from "./ProductCard";
import ProductPagination from "./ProductPagination";
import MarketplaceSidebar from "./MarketplaceSidebar";
import MarketplaceFilters from "./MarketplaceFilters";
import { ProductGridSkeleton } from "./MarketplaceSkeleton";
import DeliveryCard from "./DeliveryCard";

import { useCurrencyStore } from "../stores/useCurrencyStore";
import { convertProductPrice } from "../lib/currency";

const shuffleProducts = (products) => {
  const shuffled = [...products];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [
      shuffled[j],
      shuffled[i],
    ];
  }

  return shuffled;
};
const PRODUCTS_PER_PAGE = 18;

const MarketplaceCatalog = ({
  categorySlug = null,
  collection = null,
  title = "Recommended for Your Downfall",
  description = "Handpicked artifacts that seem to have a mind of their own.",
  children,
}) => {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currency = useCurrencyStore((state) => state.currency);
  const rates = useCurrencyStore((state) => state.rates);

  // Pagination
  const rawPage = Number(searchParams.get("page"));

  const requestedPage =
    Number.isSafeInteger(rawPage) && rawPage > 0
      ? rawPage
      : 1;

  // Price filter
  const rawMaxPrice = searchParams.get("maxPrice");
  const parsedPrice =
    rawMaxPrice === null ? null : Number(rawMaxPrice);

  const maxPrice =
    parsedPrice !== null &&
    Number.isFinite(parsedPrice) &&
    parsedPrice >= 0
      ? parsedPrice
      : null;

  // Availability filter
  const rawAvailability = searchParams.get("availability");

  const availability = ["all", "inStock", "lowStock"].includes(
    rawAvailability
  )
    ? rawAvailability
    : "all";

  // Fetch products
  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      setProducts([]);
      setCategoryName("");

      try {
        const endpoint = categorySlug
          ? `/products/category/${encodeURIComponent(categorySlug)}`
          : "/products/homepageProducts";

        const response = await axios.get(endpoint);

        if (!active) return;

        if (categorySlug) {
          setProducts(response.data.products ?? []);
          setCategoryName(
            response.data.category?.name ?? categorySlug
          );
        } else {
          const fetchedProducts = Array.isArray(response.data)
            ? response.data
            : [];

          setProducts(
            pathname === "/"
              ? shuffleProducts(fetchedProducts)
              : fetchedProducts
          );
        }
      } catch (err) {
        if (!active) return;

        console.error("Failed to load products:", err);

        setError(
          err.response?.data?.message ||
          "The catalog portal has malfunctioned."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, [categorySlug, pathname]);

  // Update a URL filter
  const setFilter = (key, value) => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);

        if (
          value === null ||
          value === "" ||
          (key === "availability" && value === "all")
        ) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }

        next.delete("page");

        return next;
      },
      { replace: true }
    );
  };

  // STEP 1: Collection-specific products
  const collectionProducts = useMemo(() => {
    if (collection === "deals") {
      return products.filter((product) => {
        const original = Number(product.originalPrice ?? 0);
        const current = Number(product.price ?? 0);

        return original > 0 && current < original;
      });
    }

    if (collection === "new") {
      return products.filter(
        (product) => product.isNewArrival === true
      );
    }

    if (collection === "hot") {
      return products.filter(
        (product) => product.isHot === true
      );
    }

    return products;
  }, [products, collection]);

  // STEP 2: User-selected filters
  const filteredProducts = useMemo(() => {
    return collectionProducts.filter((product) => {
      const stock = Number(product.inventoryQuantity ?? 0);

      if (availability === "inStock" && stock <= 0) {
        return false;
      }

      if (
        availability === "lowStock" &&
        (stock <= 0 || stock > 5)
      ) {
        return false;
      }

      if (maxPrice !== null && currency !== "QBL") {
        const converted = convertProductPrice(
          product.price,
          currency,
          rates
        );

        if (converted === null || converted > maxPrice) {
          return false;
        }
      }

      return true;
    });
  }, [
    collectionProducts,
    availability,
    maxPrice,
    currency,
    rates,
  ]);

  // Pagination calculations
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );

  const currentPage = Math.min(requestedPage, totalPages);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const visibleProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  // Page headings
  const displayTitle = categorySlug
    ? categoryName || "Forbidden Collection"
    : title;

  const isCollectionPage =
    Boolean(categorySlug) ||
    Boolean(collection) ||
    pathname === "/products";

  // Empty-state logic
  const isCollectionEmpty = collectionProducts.length === 0;

  const refreshStock = useCallback(async () => {
  try {
    const endpoint = categorySlug
      ? `/products/category/${encodeURIComponent(categorySlug)}`
      : "/products/homepageProducts";

    const response = await axios.get(endpoint);

    const latestProducts = categorySlug
      ? response.data.products ?? []
      : Array.isArray(response.data)
        ? response.data
        : [];

    setProducts((currentProducts) => {
      const stockById = new Map(
        latestProducts.map((item) => [
          item._id,
          item.inventoryQuantity,
        ])
      );

      return currentProducts.map((product) =>
        stockById.has(product._id)
          ? {
              ...product,
              inventoryQuantity: stockById.get(product._id),
            }
          : product
      );
    });
  } catch (error) {
    console.error("Could not refresh inventory:", error);
  }
}, [categorySlug]);

useEffect(() => {
  const interval = window.setInterval(() => {
    if (document.visibilityState === "visible") {
      refreshStock();
    }
  }, 60_000);

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      refreshStock();
    }
  };

  document.addEventListener(
    "visibilitychange",
    handleVisibilityChange
  );

  return () => {
    window.clearInterval(interval);

    document.removeEventListener(
      "visibilitychange",
      handleVisibilityChange
    );
  };
}, [refreshStock]);

  return (
    <div className="relative min-h-screen pt-16 text-white">
      <div className="relative z-10 mx-auto w-full max-w-[1800px] px-3 sm:px-5 xl:px-8">
        <div className="flex flex-col items-start gap-6 lg:flex-row">

          {/* Sidebar */}
            <div className="w-full min-w-0 space-y-3 lg:w-[195px] lg:shrink-0 xl:w-[205px]">
              <MarketplaceSidebar />

              <MarketplaceFilters
                products={collectionProducts}
                maxPrice={maxPrice}
                setMaxPrice={(value) =>
                  setFilter("maxPrice", value)
                }
                availability={availability}
                setAvailability={(value) =>
                  setFilter("availability", value)
                }
              />

              <DeliveryCard />
            </div>

          {/* Main content */}
          <div className="min-w-0 w-full flex-1">

            {/* Homepage banners and categories */}
            {children}

            <section className="mt-8 w-full min-w-0">

              {/* Heading */}
              <div
                className={
                  isCollectionPage
                    ? "mb-8 text-center"
                    : "mb-5"
                }
              >
                <h1
                  className={
                    isCollectionPage
                      ? "px-2 text-center text-2xl font-bold leading-tight text-red-600 wrap-break-word sm:text-4xl lg:text-5xl"
                      : "text-xl font-bold text-red-400 sm:text-2xl"
                  }
                >
                  {displayTitle}
                </h1>

                {!categorySlug && (
                  <p className="mt-2 text-xs text-gray-400 sm:text-sm">
                    {description}
                  </p>
                )}
              </div>

              {/* Product content */}
              {loading ? (
                <ProductGridSkeleton />
              ) : error ? (
                <p className="py-12 text-center text-red-400">
                  {error}
                </p>
              ) : filteredProducts.length === 0 ? (

                /* Empty collection or empty filter results */
                <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-[#69404b] bg-[#21151f] px-6 py-12 text-center shadow-xl shadow-black/20">

                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-red-500/30 bg-red-950/40 shadow-[0_0_25px_rgba(239,68,68,0.12)]">
                    {isCollectionEmpty ? (
                      <Ghost
                        size={38}
                        className="text-red-400"
                      />
                    ) : (
                      <PackageOpen
                        size={38}
                        className="text-red-400"
                      />
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-red-300">
                    {isCollectionEmpty
                      ? "This Realm Remains Uninhabited"
                      : "Nothing Survived Your Standards"}
                  </h2>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-gray-400">
                    {isCollectionEmpty
                      ? categorySlug
                        ? "No cursed artifacts have been summoned into this category yet. Check back when the collection grows."
                        : "This collection is currently empty. Our supernatural staff are searching for something appropriately questionable."
                      : "No artifacts match your current filters. Try adjusting your price range or availability preferences."}
                  </p>

                  <Link
                    to="/products"
                    className="mt-7 inline-flex items-center gap-2 rounded-lg border border-red-500/40 bg-[#922638] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                  >
                    <ArrowLeft size={16} />
                    Explore Other Artifacts
                  </Link>
                </div>

              ) : (
                <>
                  {/* Products */}
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 xl:gap-3">
                    {visibleProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onStockChanged={refreshStock}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <ProductPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    categorySlug={categorySlug}
                    searchParams={searchParams}
                  />
                </>
              )}

            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceCatalog;
