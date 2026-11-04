
import { useState } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const MarketplaceFilters = () => {
  const [maxPrice, setMaxPrice] = useState(1000);
  const [availability, setAvailability] = useState("all");
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

  return (
    <aside className="overflow-hidden rounded-lg border border-[#69404b] bg-[#21151f] text-gray-200">
      <div className="flex items-center gap-2 border-b border-[#69404b] bg-[#351823] px-3 py-2.5">
        <SlidersHorizontal size={16} className="text-red-400" />
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
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>N$0</span>
                  <span>N${maxPrice.toLocaleString()}</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-red-500"
                  aria-label="Maximum price"
                />
              </div>
            )}

            {expanded[id] && id === "availability" && (
              <div className="mt-3 space-y-2">
                {[
                  { value: "all", label: "All products" },
                  { value: "inStock", label: "In Stock" },
                  { value: "lowStock", label: "Low Stock" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-2 text-xs text-gray-300"
                  >
                    <input
                      type="radio"
                      name="availability"
                      checked={availability === option.value}
                      onChange={() => setAvailability(option.value)}
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
