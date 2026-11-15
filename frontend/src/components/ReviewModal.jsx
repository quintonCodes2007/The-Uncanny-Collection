
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Star, X, Trash2 } from "lucide-react";

const ReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  existingReview = null,
  saving = false,
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const editing = Boolean(existingReview);

  useEffect(() => {
    if (!isOpen) return;

    setRating(existingReview?.rating ?? 0);
    setTitle(existingReview?.title ?? "");
    setComment(existingReview?.comment ?? "");
    setHoveredRating(0);
  }, [isOpen, existingReview]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape" && !saving) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, saving, onClose]);

  if (!isOpen) return null;

  const valid =
    rating >= 1 &&
    rating <= 5 &&
    title.trim().length >= 3 &&
    title.trim().length <= 100 &&
    comment.trim().length >= 10 &&
    comment.trim().length <= 1000;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!valid || saving) return;

    onSubmit({
      rating,
      title: title.trim(),
      comment: comment.trim(),
    });
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[#854052] bg-[#1a1018] p-5 text-white shadow-[0_0_50px_rgba(127,29,29,0.25)] sm:p-6"
      >
        {/* Heading */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2
              id="review-modal-title"
              className="font-serif text-2xl font-bold text-red-300"
            >
              {editing
                ? "Rewrite Your Confession"
                : "Confess Your Experience"}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Tell us what happened after you brought
              this artifact home.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close review modal"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-950/50 hover:text-white disabled:opacity-50"
          >
            <X size={21} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Star rating */}
          <div>
            <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-red-300">
              Your Rating
            </label>

            <div
              className="flex items-center gap-2"
              onMouseLeave={() => setHoveredRating(0)}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  disabled={saving}
                  aria-label={`Rate ${star} out of 5 stars`}
                  aria-pressed={rating === star}
                  className="transition-transform hover:scale-110 disabled:cursor-not-allowed"
                >
                  <Star
                    size={30}
                    className={`transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-600"
                    }`}
                  />
                </button>
              ))}

              <span className="ml-2 text-sm text-gray-400">
                {rating ? `${rating}/5` : "Select stars"}
              </span>
            </div>
          </div>

          {/* Review title */}
          <div>
            <label
              htmlFor="review-title"
              className="mb-2 block text-xs font-semibold uppercase tracking-widest text-red-300"
            >
              Review Title
            </label>

            <input
              id="review-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={100}
              disabled={saving}
              placeholder="It followed me home..."
              className="w-full rounded-lg border border-[#69404b] bg-[#271923] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-red-500"
              required
            />

            <p className="mt-1 text-right text-[11px] text-gray-500">
              {title.length}/100
            </p>
          </div>

          {/* Review comment */}
          <div>
            <label
              htmlFor="review-comment"
              className="mb-2 block text-xs font-semibold uppercase tracking-widest text-red-300"
            >
              Your Experience
            </label>

            <textarea
              id="review-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={1000}
              rows={5}
              disabled={saving}
              placeholder="Tell the other souls what happened..."
              className="w-full resize-y rounded-lg border border-[#69404b] bg-[#271923] px-4 py-3 text-sm leading-relaxed text-white outline-none transition-colors placeholder:text-gray-500 focus:border-red-500"
              required
            />

            <p className="mt-1 text-right text-[11px] text-gray-500">
              {comment.length}/1000
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#51303d] pt-5">
            <div>
              {editing && (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={saving}
                  className="inline-flex items-center gap-2 text-xs font-medium text-red-400 transition-colors hover:text-red-300 disabled:opacity-50"
                >
                  <Trash2 size={15} />
                  Delete Review
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-lg border border-[#69404b] px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-[#351823] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!valid || saving}
                className="rounded-lg border border-red-500/50 bg-[#922638] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Summoning..."
                  : editing
                    ? "Update Confession"
                    : "Submit Confession"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ReviewModal;
