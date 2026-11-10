
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Ghost } from "lucide-react";

import axios from "../lib/axios";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q")?.trim() || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchSearchResults = async () => {
      setProducts([]);
      setError("");

      if (query.length < 2) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await axios.get("/products/search", {
          params: { q: query },
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setProducts(
            Array.isArray(response.data)
                ? response.data
                : Array.isArray(response.data?.products)
                ? response.data.products
                : []
            );
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Search failed:", error);

        setError(
          error.response?.data?.message ||
          "Something went wrong while searching."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchSearchResults();

    return () => controller.abort();
  }, [query]);

  return (
    <div className="min-h-screen mt-7 bg-[#120d12] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        
        

        {/* Search heading */}
        <div className="mb-10 text-center">
          

          <h1 className="mb- text-3xl font-bold text-red-400 sm:text-5xl">
            Search the Uncanny
          </h1>

          <p className="text-gray-400">
            {query
              ? `Searching for "${query}"`
              : "What forbidden treasure are you looking for?"}
          </p>
        </div>

        {/* Loading state */}
        {loading && <LoadingSpinner />}

        {/* Error state */}
        {!loading && error && (
          <div
            role="alert"
            className="rounded-xl border border-red-800  p-8 text-center"
          >
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Invalid or missing query */}
        {!loading && !error && query.length < 2 && (
          <p className="text-center text-gray-400">
            Enter at least 2 characters to search.
          </p>
        )}

        {/* Results */}
        {!loading && !error && query.length >= 2 && (
          <>
            {products.length > 0 ? (
              <>
                <p className="mb-6 text-sm text-gray-400">
                  Found {products.length}{" "}
                  {products.length === 1 ? "artifact" : "artifacts"}
                </p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="py-20 text-center">
                <Ghost
                  size={64}
                  className="mx-auto mb-5 text-red-500"
                />

                <h2 className="mb-3 text-2xl font-bold text-red-300">
                  Nothing Lurks Here...
                </h2>

                <p className="mb-6 text-gray-400">
                  No cursed artifacts matched "{query}".
                </p>

                <Link
                  to="/"
                  className="inline-block rounded-lg bg-red-800 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
                >
                  Explore the Collection
                </Link>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default SearchResultsPage;
