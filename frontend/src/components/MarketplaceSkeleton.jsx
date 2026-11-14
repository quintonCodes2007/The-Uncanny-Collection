
import "./SkeletonShimmer.css";

const SkeletonLine = ({ className = "" }) => (
  <div
    className={`skeleton-shimmer rounded-sm ${className}`}
  />
);

export const ProductCardSkeleton = () => (
  <div
    aria-hidden="true"
    className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-[#51303d] bg-[#1e141c]"
  >
    {/* Product image placeholder */}
    <div className="skeleton-shimmer aspect-[5/3] w-full" />

    {/* Product information placeholders */}
    <div className="flex flex-1 flex-col gap-2 p-2">
      <SkeletonLine className="h-4 w-[85%]" />

      <SkeletonLine className="h-3 w-full" />

      <SkeletonLine className="h-3 w-[60%]" />

      {/* Rating */}
      <SkeletonLine className="h-3 w-[45%]" />

      {/* Price and stock */}
      <div className="mt-auto flex justify-between gap-2 pt-2">
        <SkeletonLine className="h-4 w-[40%]" />
        <SkeletonLine className="h-3 w-[30%]" />
      </div>

      {/* Add to cart button */}
      <SkeletonLine className="h-7 w-full rounded-md" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 18 }) => (
  <div
    role="status"
    aria-label="Loading products"
    className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 xl:gap-3"
  >
    {Array.from({ length: count }, (_, index) => (
      <ProductCardSkeleton key={index} />
    ))}

    <span className="sr-only">
      Summoning products...
    </span>
  </div>
);

export const CategoryGridSkeleton = ({ count = 5 }) => (
  <div
    role="status"
    aria-label="Loading categories"
    className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:gap-4"
  >
    {Array.from({ length: count }, (_, index) => (
      <div
        key={index}
        aria-hidden="true"
        className="skeleton-shimmer h-44 w-full rounded-lg sm:h-48 lg:h-52"
      />
    ))}

    <span className="sr-only">
      Summoning categories...
    </span>
  </div>
);
