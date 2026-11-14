
import { useEffect } from "react";

import CategoryItem from "../components/CategoryItem";
import PromoBanners from "../components/PromoBanners";
import MarketplaceCatalog from "../components/MarketplaceCatalog";

import { useCategoryStore } from "../stores/useCategoryStore";

const HomePage = () => {
  const {
    categories,
    loading,
    error,
    fetchCategories,
  } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const featuredCategories = categories.filter(
    (category) => category.isFeatured
  );

  return (
    <MarketplaceCatalog
      title="Recommended for Your Downfall"
      description="Handpicked artifacts that seem to have a mind of their own."
    >
      <div className="mb-6 text-center">
        <h1 className="mb-3 text-3xl font-bold text-red-400 sm:text-4xl xl:text-5xl">
          Browse Our Curiosities
        </h1>

        <p className="text-sm text-gray-400 sm:text-base">
          Some artifacts choose their owner.
          The rest just scream until someone buys them.
        </p>
      </div>

      <div className="mb-3">
        <PromoBanners />
      </div>

      {loading && categories.length === 0 ? (
        <p className="py-8 text-center text-gray-400">
          Summoning marketplace categories...
        </p>
      ) : error && categories.length === 0 ? (
        <p className="py-8 text-center text-red-400">
          {error}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:gap-4">
          {featuredCategories.map((category) => (
            <CategoryItem
              key={category._id}
              category={category}
            />
          ))}
        </div>
      )}
    </MarketplaceCatalog>
  );
};

export default HomePage;
