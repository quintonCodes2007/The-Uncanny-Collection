
import { create } from "zustand";
import axios from "../lib/axios";

export const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  loaded: false,
  error: null,

  fetchCategories: async () => {
    if (get().loading || get().loaded) return;

    set({ loading: true, error: null });

    try {
      const response = await axios.get("/categories");

      set({
        categories: response.data.categories ?? [],
        loaded: true,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch categories:", error);

      set({
        loading: false,
        error: "Could not load marketplace categories.",
      });
    }
  },
}));
