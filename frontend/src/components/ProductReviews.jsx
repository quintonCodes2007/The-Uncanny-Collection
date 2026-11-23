
import { useEffect, useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import axios from "../lib/axios";
import { useUserStore } from "../stores/useUserStore";
import ReviewModal from "./ReviewModal";
import "./SkeletonShimmer.css";

const ProductReviews = ({ productId, onReviewChanged }) => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const [reviews, setReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [expanded, setExpanded] = useState(false);

  // Track which individual review cards are expanded
  const [expandedCards, setExpandedCards] = useState({});

  const toggleReviewCard = (reviewId) => {
    setExpandedCards((previous) => ({
      ...previous,
      [reviewId]: !previous[reviewId],
    }));
  };

  const [loadingAll, setLoadingAll] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [myReview, setMyReview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [checkingReview, setCheckingReview] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load the latest two reviews
  useEffect(() => {
    let active = true;

    const loadReviews = async () => {
      setLoading(true);
      setError("");
      setReviews([]);
      setReviewCount(0);
      setAllReviews([]);
      setExpanded(false);
      setMyReview(null);
      setModalOpen(false);

      try {
        const response = await axios.get(
          `/products/${productId}/reviews?limit=2`
        );

        if (!active) return;

        setReviews(response.data.reviews ?? []);
        setReviewCount(response.data.reviewCount ?? 0);
      } catch (err) {
        if (!active) return;

        setError("The spirits could not retrieve the reviews.");
      } finally {
        if (active) setLoading(false);
      }
    };

    if (productId) {
      loadReviews();
    }

    return () => {
      active = false;
    };
  }, [productId]);

  // Re-fetch reviews after create, edit, or delete
  const refreshReviews = async () => {
    const response = await axios.get(
      `/products/${productId}/reviews?limit=2`
    );

    setReviews(response.data.reviews ?? []);
    setReviewCount(response.data.reviewCount ?? 0);
    setAllReviews([]);
    setExpanded(false);
    setError("");

    await onReviewChanged?.();
  };

  // Open the review form
  const handleOpenModal = async () => {
    if (!user) {
      toast.error("Sign in before confessing your experience.");
      navigate("/login");
      return;
    }

    if (checkingReview) return;

    setCheckingReview(true);

    try {
      const response = await axios.get(
        `/products/${productId}/reviews/mine`
      );

      setMyReview(response.data.review ?? null);
      setModalOpen(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Could not open your confession."
      );
    } finally {
      setCheckingReview(false);
    }
  };

  // Create or update a review
  const handleSubmit = async (reviewData) => {
    if (saving) return;

    setSaving(true);

    try {
      if (myReview) {
        await axios.put(
          `/products/${productId}/reviews/mine`,
          reviewData
        );

        toast.success("Your confession has been rewritten.");
      } else {
        await axios.post(
          `/products/${productId}/reviews`,
          reviewData
        );

        toast.success("Your confession has been summoned!");
      }

      setModalOpen(false);
      setMyReview(null);

      try {
        await refreshReviews();
      } catch (refreshError) {
        console.error("Could not refresh reviews:", refreshError);
        toast.error("Review saved, but the page could not refresh.");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "The spirits rejected your confession."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete the signed-in user's review
  const handleDelete = async () => {
    if (saving || !myReview) return;

    const confirmed = window.confirm(
      "Erase your confession from this realm?"
    );

    if (!confirmed) return;

    setSaving(true);

    try {
      await axios.delete(
        `/products/${productId}/reviews/mine`
      );

      toast.success("Your confession has vanished.");

      setModalOpen(false);
      setMyReview(null);

      try {
        await refreshReviews();
      } catch (refreshError) {
        console.error("Could not refresh reviews:", refreshError);
        toast.error("Review deleted, but the page could not refresh.");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Could not erase your confession."
      );
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
  if (!productId || !user) {
    setMyReview(null);
    return;
  }

  let active = true;

  axios
    .get(`/products/${productId}/reviews/mine`)
    .then((response) => {
      if (active) {
        setMyReview(response.data.review ?? null);
      }
    })
    .catch(() => {
      if (active) setMyReview(null);
    });

  return () => {
    active = false;
  };
}, [productId, user?._id]);

const handleToggleReviews = async () => {
  if (expanded) {
    setExpanded(false);
    return;
  }

  if (loadingAll) return;

  setLoadingAll(true);

  try {
    const collected = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await axios.get(
        `/products/${productId}/reviews`,
        {
          params: {
            limit: 20,
            page,
          },
        }
      );

      const batch = response.data.reviews ?? [];

      collected.push(...batch);

      hasMore = batch.length === 20;
      page += 1;
    }

    setAllReviews(collected);
    setExpanded(true);
  } catch (err) {
    toast.error(
      "The spirits could not retrieve the remaining reviews."
    );
  } finally {
    setLoadingAll(false);
  }
};

const displayedReviews = expanded ? allReviews : reviews;

  return (
    <section className="mt-14 border-t border-[#51303d] pt-9">

      {/* Section heading and review action */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-red-400">
            Whispers From Previous Owners
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            {loading
              ? "Summoning previous confessions..."
              : reviewCount === 0
                ? "Not a single soul has spoken yet."
                : `${reviewCount} soul${
                    reviewCount === 1 ? "" : "s"
                  } shared their experience.`}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          disabled={checkingReview}
          className="text-sm font-medium text-red-400 transition-colors hover:text-red-300 disabled:cursor-wait disabled:opacity-50"
        >
          {checkingReview
            ? "Opening..."
            : myReview
                ? "Edit Your Review"
                : "Review This Product"}
        </button>
      </div>

      {/* Review content */}
      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-[#51303d] bg-[#21151f] p-4"
            >
              <div className="skeleton-shimmer mb-4 h-4 w-24 rounded" />
              <div className="skeleton-shimmer mb-3 h-4 w-40 rounded" />
              <div className="skeleton-shimmer h-3 w-full rounded" />
              <div className="skeleton-shimmer mt-2 h-3 w-3/4 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : reviews.length === 0 ? (
        <div className="rounded-xl border border-[#69404b] bg-[#21151f] px-6 py-10 text-center">
          <MessageSquare
            size={30}
            className="mx-auto mb-3 text-red-400"
          />

          <h3 className="font-semibold text-red-300">
            The Silence Is Suspicious
          </h3>

          <p className="mt-2 text-sm text-gray-400">
            No souls have confessed their experience yet.
            Be the first to break the silence.
          </p>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${
            expanded ? "review-reveal" : ""
          }`}
        >
          {displayedReviews.map((review) => {
            const author =
              review.user?.username ||
              review.user?.name ||
              "Unknown Soul";

            const isExpanded = Boolean(expandedCards[review._id]);

            return (
              
              <article
                key={review._id}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? "Collapse" : "Expand"} review: ${review.title}`}
                onClick={() => toggleReviewCard(review._id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    toggleReviewCard(review._id);
                  }
                }}
                className="
                  flex cursor-pointer flex-col
                  rounded-lg border border-[#51303d]
                  bg-[#21151f] p-4
                  transition-colors duration-200
                  hover:border-red-500/50
                  focus-visible:outline-2
                  focus-visible:outline-red-400
                "
              >

                {/* Author and stars */}
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-red-300">
                    @{author.replace(/^@/, "")}
                  </span>

                  <div
                    className="flex items-center gap-1"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={
                          star <= review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-600"
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Review text */}
                <h3 className="text-sm font-semibold text-gray-200">
                  {review.title}
                </h3>

                
                  {/* Review text — collapsed by default */}
                  <p
                    className={`mt-2 flex-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-400 ${
                      isExpanded
                        ? "line-clamp-none"
                        : "line-clamp-3 sm:line-clamp-4"
                    }`}
                  >
                    {review.comment}
                  </p>

                  {/* Expand/collapse hint */}
                  <p className="mt-3 text-right text-[11px] font-medium text-red-400">
                    {isExpanded ? "Show Less ↑" : "Read Full Review ↓"}
                  </p>


                {/* Date */}
                <p className="mt-4 text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </p>
              </article>
            );
          })}
        </div>
      )}

      {/* Expand or collapse reviews */}
        {!loading && !error && reviewCount > 2 && (
        <div className="mt-5 flex justify-end">
            <button
            type="button"
            onClick={handleToggleReviews}
            disabled={loadingAll}
            aria-expanded={expanded}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-red-400 transition-colors hover:text-red-300 disabled:cursor-wait disabled:opacity-50"
            >
            {loadingAll
                ? "Summoning Reviews..."
                : expanded
                ? "Show Less Reviews"
                : "View All Reviews"}
            </button>
        </div>
        )}

      {/* Review form */}
      <ReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        existingReview={myReview}
        saving={saving}
      />
    </section>
  );
};

export default ProductReviews;
