
export const CURRENCIES = [
  { code: "NAD", name: "Namibian Dollar", icon: "🇳🇦", type: "real" },
  { code: "USD", name: "US Dollar", icon: "🇺🇸", type: "real" },
  { code: "KES", name: "Kenyan Shilling", icon: "🇰🇪", type: "real" },
  { code: "BTC", name: "Bitcoin", icon: "₿", type: "real" },

  { code: "BNC", name: "Bone Coins", icon: "🦴", type: "cursed" },
  { code: "BLD", name: "Blood Marks", icon: "🩸", type: "cursed" },
  { code: "SCR", name: "Screams", icon: "😱", type: "cursed" },
  { code: "MEM", name: "Lost Memories", icon: "🧠", type: "cursed" },
  { code: "YOL", name: "Years of Life", icon: "🕯️", type: "cursed" },
  { code: "SOL", name: "Souls", icon: "👻", type: "cursed" },
  { code: "SAC", name: "Sacrifices", icon: "🔪", type: "cursed" },
  { code: "DTH", name: "Death Tokens", icon: "🪙", type: "cursed" },

  { code: "QBL", name: "Quinton's Blessing", icon: "👑", type: "special" },
];

export const getCurrency = (code) =>
  CURRENCIES.find((currency) => currency.code === code) ||
  CURRENCIES[0];

// Every cursed currency has its own pricing rules.
// All input prices are assumed to be in NAD.
export const getCursedPrice = (price, currency) => {
  const nad = Math.max(0, Number(price) || 0);

  if (nad === 0) return 0;

  switch (currency) {
    case "BNC":
      return Math.ceil(nad / 10);

    case "BLD":
      return Math.ceil(nad / 35);

    case "SCR":
      return Math.ceil(nad / 2);

    case "MEM":
      return Math.ceil(nad / 100);

    case "YOL":
      return Math.ceil(nad / 250) / 10;

    case "SOL":
      return Math.ceil(nad / 250);

    case "SAC":
      if (nad <= 50) return 1;
      if (nad <= 150) return 2;
      if (nad <= 300) return 3;
      if (nad <= 500) return 4;
      if (nad <= 1000) return 5;
      return 6 + Math.floor((nad - 1000) / 500);

    case "DTH":
      return Math.ceil(nad / 1000);

    default:
      return nad;
  }
};

export const formatCurrencyPrice = (
  price,
  currency = "NAD",
  rates = {}
) => {
  const nad = Number(price);

  if (!Number.isFinite(nad)) return "Price unavailable";

  if (currency === "QBL") {
    return "🔒 Blessing required";
  }

  if (getCurrency(currency).type === "cursed") {
    const amount = getCursedPrice(nad, currency);
    return `${amount.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })} ${currency}`;
  }

  if (currency === "BTC") {
    if (!rates.BTC) return `N$${nad.toFixed(2)}`;

    return `₿${(nad / rates.BTC).toFixed(8)}`;
  }

  if (currency === "USD" || currency === "KES") {
    if (!rates[currency]) return `N$${nad.toFixed(2)}`;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(nad * rates[currency]);
  }

  return `N$${nad.toFixed(2)}`;
};


export const convertProductPrice = (
  price,
  currency = "NAD",
  rates = {}
) => {
  const nad = Number(price);

  if (!Number.isFinite(nad)) return null;

  if (currency === "QBL") return null;

  if (getCurrency(currency).type === "cursed") {
    return getCursedPrice(nad, currency);
  }

  if (currency === "BTC") {
    return rates.BTC > 0 ? nad / rates.BTC : nad;
  }

  if (currency === "USD" || currency === "KES") {
    return rates[currency] > 0
      ? nad * rates[currency]
      : nad;
  }

  return nad;
};

