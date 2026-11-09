
import { useCurrencyStore } from "../stores/useCurrencyStore";
import {
  formatCurrencyPrice,
  getCurrency,
} from "../lib/currency.js";

const CurrencyPrice = ({
  amount,
  className = "",
  showOriginal = false,
}) => {
  const { currency, rates } = useCurrencyStore();

  const selected = getCurrency(currency);

  return (
    <span className={className}>
      {formatCurrencyPrice(amount, currency, rates)}

      {showOriginal && currency !== "NAD" && (
        <span className="ml-2 text-xs font-normal text-gray-400">
          (N${Number(amount).toFixed(2)})
        </span>
      )}

      {currency === "QBL" && (
        <span className="block text-[10px] font-normal text-amber-400">
          Divine authorization coming soon
        </span>
      )}

      {selected.type === "cursed" && (
        <span className="block text-[10px] font-normal text-gray-500">
          Fictional price
        </span>
      )}
    </span>
  );
};

export default CurrencyPrice;
