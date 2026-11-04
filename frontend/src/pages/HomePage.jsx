import CategoryItem from '../components/CategoryItem';
import HomePageProducts from '../components/HomePageProducts';
import MarketplaceSidebar from "../components/MarketplaceSidebar";
import PromoBanners from "../components/PromoBanners";
import MarketplaceFilters from "../components/MarketplaceFilters";

const categories = [
  { href: "/organ", name: "Organs", imageUrl: "/heart.jpeg" },
  { href: "/forbiddenLibrary", name: "Forbidden Library", imageUrl: "/book3.jpg" },
  { href: "/weapons", name: "Weapons", imageUrl: "/weapon2.jpg" },
  { href: "/creepyCollectibles", name: "Creepy Collectibles", imageUrl: "/doll1.jpg" },
  { href: "/potions", name: "Potions", imageUrl: "/potion1.jpeg" },

  // { href: "/witchesApothecary", name: "Witches Apothecary", imageUrl: "/book1.jpg" },
  // { href: '/The "Questionable" Shelf', name: 'The "Questionable" Shelf', imageUrl: "/weapon1.jpg" },
  // { href: "/lost&found", name: "Lost & Found (Definitely Not Stolen)", imageUrl: "/book1.jpg" },
];



const HomePage = () => {
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

            {/* Five category cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:gap-4">
              {categories.map((category) => (
                <CategoryItem
                  key={category.name}
                  category={category}
                />
              ))}
            </div>

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

