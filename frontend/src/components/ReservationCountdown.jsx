
import { useEffect, useState } from "react";
import { Hourglass } from "lucide-react";
import { motion } from "framer-motion";

const ReservationCountdown = ({
  cartItems,
  onExpire,
  durationMinutes = 15,
}) => {
  const getRemainingTime = () => {
    const expiryTimes = cartItems
      .filter((item) => item.expiresAt)
      .map((item) => new Date(item.expiresAt).getTime())
      .filter(Number.isFinite);

    if (!expiryTimes.length) return null;

    return Math.max(
      0,
      Math.ceil((Math.min(...expiryTimes) - Date.now()) / 1000)
    );
  };

  const [secondsLeft, setSecondsLeft] = useState(getRemainingTime);

useEffect(() => {
  let expiryHandled = false;
  let refreshing = false;

  const updateCountdown = async () => {
    const remaining = getRemainingTime();
    setSecondsLeft(remaining);

    if (remaining === 0 && !expiryHandled && !refreshing) {
      refreshing = true;

      try {
        await onExpire?.();
      } catch (error) {
        console.error("Failed to refresh cart:", error);
      } finally {
        refreshing = false;
      }
    }
  };

  updateCountdown();

  const interval = setInterval(updateCountdown, 1000);

  return () => clearInterval(interval);
}, [cartItems, onExpire]);

  const minutes = Math.floor((secondsLeft ?? 0) / 60);
  const seconds = (secondsLeft ?? 0) % 60;

  const totalSeconds = durationMinutes * 60;

  const progress =
    secondsLeft === null
      ? 0
      : Math.min(100, Math.max(0, (secondsLeft / totalSeconds) * 100));

  if (secondsLeft === null) return null;

  
return (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="
      relative overflow-hidden
      rounded-lg
      border border-red-500/30
      px-3 py-2.5
      shadow-md shadow-red-950/20
      sm:rounded-xl sm:px-5 sm:py-4
    "
    style={{
      backgroundImage: `
        radial-gradient(
          ellipse at 85% 15%,
          rgba(190, 35, 56, 0.22),
          transparent 65%
        ),
        linear-gradient(
          110deg,
          #35151f 0%,
          #1d111b 60%,
          #321621 100%
        )
      `,
    }}
  >
    {/* Slim countdown content */}
    <div className="relative z-10 flex items-center gap-2">

      {/* Small hourglass icon */}
      <Hourglass
        size={18}
        className="shrink-0 text-red-400"
      />

      {/* Reservation title */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-serif text-sm font-semibold text-red-300 sm:text-lg">
          Three Full Moons
        </h3>

        <p className="mt-0.5 truncate text-[10px] text-gray-400 sm:text-xs">
          Your reservation is ticking away.
        </p>
      </div>

      {/* Countdown */}
      <div className="shrink-0 text-right">
        <p className="text-[9px] uppercase tracking-wider text-red-300/80">
          Time Left
        </p>

        <p className="font-mono text-xl font-bold leading-tight tabular-nums text-white sm:text-2xl">
          {String(minutes).padStart(2, "0")}:
          {String(seconds).padStart(2, "0")}
        </p>
      </div>
    </div>

    {/* Thin reservation progress bar */}
    <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-red-950/80">
      <div
        className="h-full rounded-full bg-gradient-to-r from-red-600 to-rose-400 transition-[width] duration-1000 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  </motion.div>
);

};

export default ReservationCountdown;

