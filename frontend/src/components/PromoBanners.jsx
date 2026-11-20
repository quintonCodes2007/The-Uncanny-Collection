
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const promotions = [
  {
    label: "FORBIDDEN DISCOUNTS",
    title: "The Midnight Sale",
    description: "Sinister savings on select artifacts.",
    button: "Shop the Sale",
    image: "/banner2.jpeg",
    href: "/deals",
  },
  {
    label: "FEATURED COLLECTION",
    title: "Cursed Gifts",
    description: "Perfect for loved ones... or enemies.",
    button: "Explore",
    image: "/banner1.jpeg",
    href: "/category/cursed-gifts",
  },
];

const PromoBanners = () => {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
      {promotions.map((promo) => (
        <div
          key={promo.title}
          className="group relative flex h-28 min-w-0 flex-col justify-between overflow-hidden rounded-lg border border-red-800/60 bg-[#28121b] sm:h-24 sm:flex-row sm:items-center lg:h-28"
        >
          {/* Background image */}
          <img
            src={promo.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-[#2b1018]/90 to-[#310f1a]/50" />

          {/* Banner text */}
          <div className="relative z-10 flex min-w-0 flex-1 flex-col items-start px-2 pt-3 sm:px-4 sm:pt-0 sm:pl-20 lg:pl-24">
            <span className="rounded bg-red-900/80 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-red-200">
              {promo.label}
            </span>

            <h3 className="mt-1 font-serif text-sm font-bold leading-tight text-red-300 sm:text-lg">
              {promo.title}
            </h3>

            <p className="mt-1 hidden text-[11px] text-gray-200 sm:block">
              {promo.description}
            </p>
          </div>

          {/* Action */}
          <Link
            to={promo.href}
            className="relative z-10 mb-2 ml-2 mr-auto flex shrink-0 items-center gap-1 rounded-md border border-red-500/60 bg-red-900/70 px-2 py-1.5 text-[10px] text-white transition-colors hover:bg-red-700 sm:mb-0 sm:ml-0 sm:mr-3 sm:py-2"
          >
            {promo.button}
            <ArrowUpRight size={12} />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PromoBanners;

