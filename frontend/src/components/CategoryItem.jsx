
import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
  if (!category) return null;

  return (
    <Link
      to={`/category/${encodeURIComponent(category.name)}`}
      className="group relative block h-52 w-full overflow-hidden rounded-lg sm:h-72 lg:h-96"
    >
      <img
        src={category.imageUrl}
        alt={category.name}
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

      {/* Category information */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-2 sm:p-4">
        <h3 className="mb-1 text-sm font-bold leading-tight text-white sm:text-xl lg:text-2xl">
          {category.name}
        </h3>

        <p className="hidden text-sm text-gray-200 sm:block">
          Explore our {category.name} collection
        </p>
      </div>
    </Link>
  );
};

export default CategoryItem;
