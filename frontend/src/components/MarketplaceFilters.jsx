
import { useState } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { useCurrencyStore } from "../stores/useCurrencyStore";
import {
  convertProductPrice,
  formatCurrencyPrice,
} from "../lib/currency";

const MarketplaceFilters = ({
  products = [],
  maxPrice,
  setMaxPrice,
  availability,
  setAvailability,
}) => {
  const currency = useCurrencyStore((state) => state.currency);
  const rates = useCurrencyStore((state) => state.rates);

  const [expanded, setExpanded] = useState({
    price: true,
    availability: true,
    rating: false,
    condition: false,
    origin: false,
  });

  const toggle = (section) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sections = [
    { id: "price", title: "Price Range" },
    { id: "availability", title: "Availability" },
    { id: "rating", title: "Rating" },
    { id: "condition", title: "Condition" },
    { id: "origin", title: "Origin" },
  ];

  const priceFilterAvailable = currency !== "QBL";

  const step =
    currency === "BTC"
      ? 0.00000001
      : currency === "YOL"
        ? 0.1
        : currency === "USD"
          ? 0.01
          : 1;

  const convertedPrices = products
    .map((product) =>
      convertProductPrice(product.price, currency, rates)
    )
    .filter((price) => price !== null);

  const highestPrice = Math.max(0, ...convertedPrices);

  // Include the previously selected limit when currency changes.
  // This preserves the numeric limit instead of resetting it.
  const sliderMax =
    Math.max(
      step,
      Math.ceil(highestPrice / step) * step,
      maxPrice ?? 0
    );

  const sliderValue = maxPrice ?? sliderMax;

  const displayPrice = (amount) =>
    formatCurrencyPrice(amount, currency, rates);

  return (
    <aside className="overflow-hidden rounded-lg border border-[#69404b] bg-[#21151f] text-gray-200">
      <div className="flex items-center gap-2 border-b border-[#69404b] bg-[#351823] px-3 py-2.5">
        <SlidersHorizontal
          size={16}
          className="text-red-400"
        />

        <h2 className="text-sm font-semibold text-red-300">
          Refine Your Search
        </h2>
      </div>

      <div className="divide-y divide-[#56323d] px-3">
        {sections.map(({ id, title }) => (
          <div key={id} className="py-2">
            <button
              type="button"
              onClick={() => toggle(id)}
              aria-expanded={expanded[id]}
              className="flex w-full items-center justify-between text-left text-xs font-semibold text-gray-200"
            >
              {title}

              {expanded[id] ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </button>

            {expanded[id] && id === "price" && (
              <div className="mt-3 space-y-3">

                {priceFilterAvailable ? (
                  <>
                    <div className="space-y-1 text-[11px] text-gray-400">
                      <p>
                        Minimum: {displayPrice(0)}
                      </p>

                      <p className="break-words font-medium text-red-300">
                        Maximum: {maxPrice === null
                          ? "Any price"
                          : displayPrice(maxPrice)}
                      </p>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={sliderMax}
                      step={step}
                      value={sliderValue}
                      onChange={(e) =>
                        setMaxPrice(Number(e.target.value))
                      }
                      className="w-full cursor-pointer accent-red-500"
                      aria-label={`Maximum price in ${currency}`}
                    />

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-gray-500">
                        {currency}
                      </span>

                      <button
                        type="button"
                        onClick={() => setMaxPrice(null)}
                        className="text-[11px] text-red-400 hover:text-red-300"
                      >
                        Clear price
                      </button>
                    </div>

                    {(
                      (currency === "USD" ||
                        currency === "KES" ||
                        currency === "BTC") &&
                      !(rates[currency] > 0)
                    ) && (
                      <p className="text-[10px] text-amber-400">
                        Exchange rate unavailable.
                        Showing NAD fallback prices.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-amber-400">
                    Quinton's Blessing requires authorization.
                    Price filtering is unavailable.
                  </p>
                )}
              </div>
            )}

            {expanded[id] && id === "availability" && (
              <div className="mt-3 space-y-2">
                {[
                  { value: "all", label: "All Products" },
                  { value: "inStock", label: "In Stock" },
                  { value: "lowStock", label: "Low Stock (1–5)" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-2 text-xs text-gray-300"
                  >
                    <input
                      type="radio"
                      name="availability"
                      checked={availability === option.value}
                      onChange={() =>
                        setAvailability(option.value)
                      }
                      className="accent-red-500"
                    />

                    {option.label}
                  </label>
                ))}
              </div>
            )}

            {expanded[id] &&
              ["rating", "condition", "origin"].includes(id) && (
                <p className="mt-2 text-xs text-gray-500">
                  Options coming soon
                </p>
              )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default MarketplaceFilters;
