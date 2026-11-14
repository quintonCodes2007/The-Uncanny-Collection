
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductPagination = ({
  currentPage,
  totalPages,
  categorySlug = null,
  searchParams,
}) => {
  if (totalPages <= 1) return null;

  const getPageUrl = (page) => {
    const params = new URLSearchParams(searchParams);

    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    const path = categorySlug
      ? `/category/${encodeURIComponent(categorySlug)}`
      : page === 1
        ? "/"
        : "/products";

    const query = params.toString();

    return query ? `${path}?${query}` : path;
  };

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      Math.abs(page - currentPage) <= 1
  );

  const linkStyle =
    "inline-flex h-9 min-w-9 items-center justify-center " +
    "rounded-md border border-red-900/60 px-2 text-xs " +
    "font-semibold transition-colors hover:bg-red-900/40";

  return (
    <nav
      aria-label="Product pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      {currentPage > 1 && (
        <Link
          to={getPageUrl(currentPage - 1)}
          className={`${linkStyle} text-gray-300`}
        >
          <ChevronLeft size={15} />
          Prev
        </Link>
      )}

      {pages.map((page, index) => (
        <div key={page} className="flex items-center gap-2">
          {index > 0 && page - pages[index - 1] > 1 && (
            <span className="text-gray-500">…</span>
          )}

          <Link
            to={getPageUrl(page)}
            aria-current={
              page === currentPage ? "page" : undefined
            }
            className={`${linkStyle} ${
              page === currentPage
                ? "border-red-500 bg-red-800 text-white"
                : "bg-[#25161f] text-gray-300"
            }`}
          >
            {page}
          </Link>
        </div>
      ))}

      {currentPage < totalPages && (
        <Link
          to={getPageUrl(currentPage + 1)}
          className={`${linkStyle} text-gray-300`}
        >
          Next
          <ChevronRight size={15} />
        </Link>
      )}
    </nav>
  );
};

export default ProductPagination;
