
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";

import axios from "../lib/axios";
import ProductCard from "./ProductCard";
import ProductPagination from "./ProductPagination";
import MarketplaceSidebar from "./MarketplaceSidebar";
import MarketplaceFilters from "./MarketplaceFilters";
import LoadingSpinner from "./LoadingSpinner";

import { useCurrencyStore } from "../stores/useCurrencyStore";
import { convertProductPrice } from "../lib/currency";

const PRODUCTS_PER_PAGE = 18;


const MarketplaceCatalog = ({
  categorySlug = null,
  title = "Recommended for Your Downfall",
  description = "Handpicked artifacts that seem to have a mind of their own.",
  children,
}) => {

const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currency = useCurrencyStore((state) => state.currency);
  const rates = useCurrencyStore((state) => state.rates);

  const rawPage = Number(searchParams.get("page"));
  const requestedPage =
    Number.isSafeInteger(rawPage) && rawPage > 0
      ? rawPage
      : 1;

  const rawMaxPrice = searchParams.get("maxPrice");

  const parsedPrice =
    rawMaxPrice === null ? null : Number(rawMaxPrice);

  const maxPrice =
    parsedPrice !== null &&
    Number.isFinite(parsedPrice) &&
    parsedPrice >= 0
      ? parsedPrice
      : null;

  const rawAvailability = searchParams.get("availability");

  const availability = [
    "all",
    "inStock",
    "lowStock",
  ].includes(rawAvailability)
    ? rawAvailability
    : "all";

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
          setProducts(
            Array.isArray(response.data) ? response.data : []
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
  }, [categorySlug]);

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

        // A changed filter always returns to page one.
        next.delete("page");

        return next;
      },
      { replace: true }
    );
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
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
  }, [products, availability, maxPrice, currency, rates]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );

  // Clamp the page if filtering reduces the number of pages.
  const currentPage = Math.min(requestedPage, totalPages);

  const startIndex =
    (currentPage - 1) * PRODUCTS_PER_PAGE;

  const visibleProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  const displayTitle = categorySlug
    ? categoryName || "Forbidden Collection"
    : title;

  return (
    <div className="relative min-h-screen pt-16 text-white">
      <div className="relative z-10 mx-auto w-full max-w-[1800px] px-3 sm:px-5 xl:px-8">

        <div className="flex flex-col items-start gap-6 lg:flex-row">

          {/* Shared marketplace sidebar */}
          <div className="w-full min-w-0 space-y-3 lg:w-[195px] lg:shrink-0 xl:w-[205px]">
            <MarketplaceSidebar />

            <div className="mt-4">
              <MarketplaceFilters
                products={products}
                maxPrice={maxPrice}
                setMaxPrice={(value) =>
                  setFilter("maxPrice", value)
                }
                availability={availability}
                setAvailability={(value) =>
                  setFilter("availability", value)
                }
              />
            </div>
          </div>

          {/* Main marketplace content */}
          <div className="min-w-0 w-full flex-1">

            {/* Homepage-only content goes here */}
            {children}

            <section className="mt-8 w-full min-w-0">
              
        {/* Marketplace heading */}
        <div className={categorySlug || location.pathname === "/products" ? "mb-8 text-center" : "mb-5"}>



        <h1
        className={
            categorySlug || location.pathname === "/products"
            ? "px-2 text-center text-2xl font-bold leading-tight text-red-600 wrap-break-word sm:text-4xl lg:text-5xl"
            : "text-xl font-bold text-red-400 sm:text-2xl"
        }
        >
        {displayTitle}
        </h1>


  {!categorySlug && (
    <p className="mt-1 text-xs text-gray-400 sm:text-sm">
      {description}
    </p>
  )}

</div>


              {loading ? (
                <LoadingSpinner />
              ) : error ? (
                <p className="py-12 text-center text-red-400">
                  {error}
                </p>
              ) : filteredProducts.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="font-semibold text-red-400">
                    Nothing survived your standards.
                  </p>

                  <p className="mt-2 text-sm text-gray-400">
                    Try changing your price or availability filters.
                    Even ghosts have budgets.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 xl:gap-3">
                    {visibleProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                      />
                    ))}
                  </div>

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
