
import { useMemo } from "react";

import ProductCard from "./ProductCard";
import LoadingSpinner from "./LoadingSpinner";

import { useCurrencyStore } from "../stores/useCurrencyStore";
import { convertProductPrice } from "../lib/currency";

const HomePageProducts = ({
  products = [],
  loading = false,
  maxPrice = null,
  availability = "all",
}) => {
  const currency = useCurrencyStore((state) => state.currency);
  const rates = useCurrencyStore((state) => state.rates);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const stock = Number(product.inventoryQuantity ?? 0);

      // Availability filters
      if (availability === "inStock" && stock <= 0) {
        return false;
      }

      if (
        availability === "lowStock" &&
        (stock <= 0 || stock > 5)
      ) {
        return false;
      }

      // Price filter
      // QBL has no regular price until authorization.
      if (maxPrice !== null && currency !== "QBL") {
        const convertedPrice = convertProductPrice(
          product.price,
          currency,
          rates
        );

        if (
          convertedPrice === null ||
          convertedPrice > maxPrice
        ) {
          return false;
        }
      }

      return true;
    });
  }, [products, maxPrice, availability, currency, rates]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="mt-6 w-full min-w-0">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-red-400 sm:text-2xl">
            Recommended for Your Downfall
          </h2>

          <p className="mt-1 text-xs text-gray-400 sm:text-sm">
            Handpicked artifacts that seem to have a mind of their own.
          </p>
        </div>

        <span className="text-xs text-red-400">
          {/*{filteredProducts.length} of {products.length}*/} Come now...waste your money!!
        </span>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 xl:gap-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          <p className="text-base font-semibold text-red-400">
            Nothing survived your standards.
          </p>

          <p className="mt-2 text-sm text-gray-400">
            Try increasing your budget or changing availability.
            Even cursed objects have financial expectations.
          </p>
        </div>
      )}
    </section>
  );
};

export default HomePageProducts;
