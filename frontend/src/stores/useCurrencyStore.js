
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CURRENCIES } from "../lib/currency";

export const useCurrencyStore = create(
  persist(
    (set, get) => ({
      currency: "NAD",
      rates: {},
      ratesLoading: false,
      ratesUpdatedAt: null,

      setCurrency: (currency) => {
        const valid = CURRENCIES.some(
          (item) => item.code === currency
        );

        if (valid) {
          set({ currency });
        }
      },

      fetchRates: async () => {
        const lastUpdate = get().ratesUpdatedAt;
        const maxAge = 15 * 60 * 1000;

        if (
          get().ratesLoading ||
          (lastUpdate && Date.now() - lastUpdate < maxAge)
        ) {
          return;
        }

        set({ ratesLoading: true });

        const nextRates = { ...get().rates };

        try {
          const response = await fetch(
            "https://open.er-api.com/v6/latest/NAD"
          );

          if (!response.ok) {
            throw new Error("Fiat exchange-rate request failed");
          }

          const data = await response.json();

          if (data.result !== "success") {
            throw new Error("Invalid exchange-rate response");
          }

          for (const code of ["USD", "KES"]) {
            const rate = data.rates?.[code];

            if (Number.isFinite(rate) && rate > 0) {
              nextRates[code] = rate;
            }
          }
        } catch (error) {
          console.error("Fiat rates unavailable:", error);
        }

        try {
          const response = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=nad"
          );

          if (!response.ok) {
            throw new Error("Bitcoin price request failed");
          }

          const data = await response.json();
          const bitcoinPrice = data.bitcoin?.nad;

          if (
            Number.isFinite(bitcoinPrice) &&
            bitcoinPrice > 0
          ) {
            // Value of one BTC in NAD.
            nextRates.BTC = bitcoinPrice;
          }
        } catch (error) {
          console.error("Bitcoin rate unavailable:", error);
        }

        set({
          rates: nextRates,
          ratesLoading: false,
          ratesUpdatedAt: Date.now(),
        });
      },
    }),
    {
      name: "uncanny-currency",
      partialize: (state) => ({
        currency: state.currency,
      }),
    }
  )
);
