
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
    <div ref={containerRef} className="relative z-50">
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
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          id="uncanny-currency-options"
          role="listbox"
          aria-label="Choose display currency"
          className="absolute right-0 top-full z-50 mt-2 max-h-[65vh] w-72 overflow-y-auto rounded-xl border border-[#793342] bg-[#1b1019] p-2 shadow-2xl shadow-black/60"
        >
          <div className="border-b border-red-900/50 px-3 py-3">
            <h3 className="font-bold text-red-200">
              💀 The Forbidden Exchange
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              Every currency has a price.
            </p>
          </div>

          {renderGroup("real", "The Mortal Realm")}

          <div className="my-2 border-t border-red-900/40" />

          {renderGroup("cursed", "The Cursed Treasury")}

          <div className="my-2 border-t border-red-900/40" />

          {renderGroup("special", "Divine Privileges")}

          <p className="px-3 py-3 text-[10px] leading-relaxed text-gray-500">
            
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
