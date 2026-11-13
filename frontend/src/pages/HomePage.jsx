import CategoryItem from '../components/CategoryItem';
import HomePageProducts from '../components/HomePageProducts';
import MarketplaceSidebar from "../components/MarketplaceSidebar";
import PromoBanners from "../components/PromoBanners";
import MarketplaceFilters from "../components/MarketplaceFilters";
import { useEffect } from "react";
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
    <div className="relative min-h-screen pt-16 text-white">
      <div className="relative z-10 mx-auto w-full max-w-[1800px] px-3 sm:px-5 xl:px-8">
        <div className="flex flex-col items-start gap-6 lg:flex-row">

          {/* Sidebar — far left and aligned near the top */}
          <div className="w-full min-w-0 space-y-3 lg:w-[195px] lg:shrink-0 xl:w-[205px]">
            <MarketplaceSidebar />
            <div className="mt-4">
              <MarketplaceFilters />
            </div>
          </div>

          {/* Main marketplace area */}
          <div className="min-w-0 w-full flex-1">

            {/* Heading */}
            <div className="mb-6 text-center">
              <h1 className="mb-3 text-3xl font-bold text-red-400 sm:text-4xl xl:text-5xl">
                Browse Our Curiosities
              </h1>
              <p className="text-sm text-gray-400 sm:text-base">
                Some artifacts choose their owner. The rest just scream until someone buys them.
              </p>
            </div>

            {/* Promotional banners */}
              <div className="mb-3">
                <PromoBanners />
              </div>

            
{/* Featured category cards */}
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


            {/* Product recommendations */}
            <div className="mt-8">
              <HomePageProducts />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

