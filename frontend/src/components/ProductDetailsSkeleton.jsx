
import "./SkeletonShimmer.css";

const Shimmer = ({ className = "" }) => (
  <div
    aria-hidden="true"
    className={`skeleton-shimmer rounded-md ${className}`}
  />
);

const ProductDetailsSkeleton = () => {
  return (
    <div
      role="status"
      aria-label="Loading product details"
      className="relative min-h-screen pt-10 text-white sm:pt-14"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1050px] px-4 pb-12 sm:px-6">

        {/* Breadcrumb skeleton */}
        <div className="mb-7 flex items-center gap-3">
          <Shimmer className="h-3 w-12" />
          <Shimmer className="h-3 w-20" />
          <Shimmer className="h-3 w-28" />
        </div>

        {/* Main product layout */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-7">

          {/* Product image */}
          <div className="overflow-hidden rounded-2xl border border-[#69404b] bg-[#1b111a]">
            <Shimmer className="h-[340px] w-full rounded-none sm:h-[500px] md:h-[460px]" />
          </div>

          {/* Product information */}
          <div className="flex flex-col gap-4">

            {/* Category */}
            <Shimmer className="h-3 w-32" />

            {/* Product name */}
            <Shimmer className="h-8 w-[90%]" />
            <Shimmer className="h-8 w-[55%]" />

            {/* Rating */}
            <Shimmer className="h-4 w-36" />

            <div className="my-1 border-t border-[#51303d]" />

            {/* Price */}
            <Shimmer className="h-3 w-40" />
            <Shimmer className="h-9 w-32" />

            {/* Description */}
            <div className="space-y-2">
              <Shimmer className="h-3 w-full" />
              <Shimmer className="h-3 w-[95%]" />
              <Shimmer className="h-3 w-[80%]" />
              <Shimmer className="h-3 w-[60%]" />
            </div>

            {/* Availability */}
            <div className="rounded-lg border border-[#69404b] bg-[#251821] p-3">
              <Shimmer className="h-4 w-32" />
              <Shimmer className="mt-3 h-3 w-[85%]" />
            </div>

            {/* Quantity, cart and wishlist */}
            <div className="mt-auto flex gap-2 pt-4">
              <Shimmer className="h-9 w-20" />
              <Shimmer className="h-9 flex-1" />
              <Shimmer className="h-9 w-24" />
            </div>
          </div>
        </div>

        {/* Trust cards */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-[#51303d] bg-[#21151f] p-4"
            >
              <Shimmer className="h-4 w-[65%]" />
              <Shimmer className="mt-3 h-3 w-[85%]" />
            </div>
          ))}
        </div>

        {/* Lower content skeleton */}
        <div className="mt-14 border-t border-[#51303d] pt-9">
          <Shimmer className="mb-6 h-7 w-56" />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-lg border border-[#51303d] bg-[#21151f]"
              >
                <Shimmer className="aspect-[5/3] w-full rounded-none" />

                <div className="space-y-2 p-3">
                  <Shimmer className="h-3 w-[85%]" />
                  <Shimmer className="h-3 w-[60%]" />
                  <Shimmer className="h-6 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <span className="sr-only">
          Summoning the artifact...
        </span>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
