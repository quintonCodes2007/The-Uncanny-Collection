
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe, LockKeyhole } from "lucide-react";

import { CURRENCIES } from "../lib/currency";
import { useCurrencyStore } from "../stores/useCurrencyStore";

const CurrencySelector = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const {
    currency,
    setCurrency,
    fetchRates,
  } = useCurrencyStore();

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const selected = CURRENCIES.find(
    (item) => item.code === currency
  );

  const renderGroup = (type, title) => {
    const options = CURRENCIES.filter(
      (item) => item.type === type
    );

    return (
      <div>
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-red-300">
          {title}
        </p>

        {options.map((item) => (
          <button
            key={item.code}
            type="button"
            role="option"
            aria-selected={currency === item.code}
            onClick={() => {
              setCurrency(item.code);
              setOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-red-900/40 ${
              currency === item.code
                ? "bg-red-900/30 text-red-200"
                : "text-gray-200"
            }`}
          >
            <span>{item.icon}</span>

            <span className="min-w-0 flex-1">
              {item.name}
            </span>

            <span className="text-xs text-gray-400">
              {item.code}
            </span>

            {item.code === "QBL" && (
              <LockKeyhole
                size={14}
                className="text-amber-400"
              />
            )}
          </button>
        ))}
      </div>
    );
  };

  
  return (
    <div ref={containerRef} className="relative z-50 min-w-0">
      {/* Currency selector button */}
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls="uncanny-currency-options"
        className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-200 transition-colors hover:bg-red-950/40"
      >
        <Globe size={19} className="text-red-400" />

        <span>{selected?.icon}</span>

        <span className="font-semibold">
          {currency}
        </span>

        <ChevronDown
          size={15}
          className={`transition-transform duration-300 ease-in-out ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Animated currency options */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out lg:block lg:transition-none ${
          open
            ? "grid-rows-[1fr] opacity-100 lg:visible"
            : "grid-rows-[0fr] opacity-0 lg:invisible lg:pointer-events-none"
        }`}
      >
        <div className="min-h-0 overflow-hidden lg:overflow-visible">
          <div
            id="uncanny-currency-options"
            role="listbox"
            aria-label="Choose display currency"
            aria-hidden={!open}
            inert={!open}
            className="
              relative mt-2
              max-h-[45vh] w-full min-w-0
              overflow-y-auto overflow-x-hidden
              rounded-xl
              border border-[#793342]
              bg-[#1b1019]
              p-2
              shadow-xl shadow-black/40

              lg:absolute lg:right-0 lg:top-full
              lg:z-50 lg:mt-2 lg:max-h-[65vh]
              lg:w-72 lg:shadow-2xl
            "
          >
            {/* Dropdown heading */}
            <div className="border-b border-red-900/50 px-3 py-3">
              <h3 className="font-bold text-red-200">
                💀 The Forbidden Exchange
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                Every currency has a price.
              </p>
            </div>

            {/* Real currencies */}
            {renderGroup("real", "The Mortal Realm")}

            <div className="my-2 border-t border-red-900/40" />

            {/* Fictional currencies */}
            {renderGroup("cursed", "The Cursed Treasury")}

            <div className="my-2 border-t border-red-900/40" />

            {/* Special currencies */}
            {renderGroup("special", "Divine Privileges")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencySelector;

