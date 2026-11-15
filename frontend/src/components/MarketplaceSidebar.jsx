
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  List,
  HeartPulse,
  BookOpen,
  Swords,
  Skull,
  FlaskConical,
  WandSparkles,
  Hourglass,
  Moon,
  Gift,
  ChevronRight,
} from "lucide-react";

import { useCategoryStore } from "../stores/useCategoryStore";


const categoryIcons = {
  organs: HeartPulse,
  "forbidden-library": BookOpen,
  weapons: Swords,
  "creepy-collectibles": Skull,
  "potions-elixirs": FlaskConical,
  "occult-tools": WandSparkles,
  "relics-artifacts": Hourglass,
  curiosities: Moon,
  "cursed-gifts": Gift,
};


const MarketplaceSidebar = () => {

    const {
  categories,
  loading,
  error,
  fetchCategories,
} = useCategoryStore();

useEffect(() => {
  fetchCategories();
}, [fetchCategories]);

  return (
    <aside className="w-full min-w-0 space-y-3">
      {/* Category list */}
      <div className="overflow-hidden rounded-xl border border-[#69404b] bg-[#21151f]">
        <div className="flex items-center gap-3 border-b border-[#69404b] bg-[#351823] px-4 py-3">
          <List size={19} className="text-red-400" />
          <h2 className="font-semibold text-red-300">
            Shop by Category
          </h2>
        </div>

        <nav className="py-2" aria-label="Product categories">
          
{loading && categories.length === 0 && (
  <p className="px-4 py-3 text-xs text-gray-400">
    Summoning categories...
  </p>
)}

{error && categories.length === 0 && (
  <p className="px-4 py-3 text-xs text-red-400">
    {error}
  </p>
)}

{categories.map((category) => {
  const Icon = categoryIcons[category.slug] || Gift;

  return (
    <Link
      key={category._id}
      to={`/category/${encodeURIComponent(category.slug)}`}
      className="group flex items-center gap-3 px-4 py-2 text-sm text-gray-200 transition-colors hover:bg-red-950/40 hover:text-red-300"
    >
      <Icon
        size={18}
        className="shrink-0 text-red-400"
      />

      <span className="min-w-0 flex-1">
        {category.name}
      </span>

      <ChevronRight
        size={15}
        className="text-gray-500 transition-transform group-hover:translate-x-1"
      />
    </Link>
  );
})}

        </nav>
      </div>
      

    </aside>
  );
};

export default MarketplaceSidebar;
