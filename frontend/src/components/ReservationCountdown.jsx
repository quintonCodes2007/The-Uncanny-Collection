
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

    const updateCountdown = () => {
      const remaining = getRemainingTime();
      setSecondsLeft(remaining);

      if (remaining === 0 && !expiryHandled) {
        expiryHandled = true;
        onExpire?.();
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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl border border-red-500/40 bg-gradient-to-r from-[#2a101c] via-[#371320] to-[#1b1019] p-5 shadow-lg shadow-red-950/20"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex shrink-0 gap-1 text-xl">
            <span>🌕</span>
            <span>🌕</span>
            <span>🌕</span>
          </div>

          <div>
            <h3 className="font-serif text-xl font-bold text-red-300">
              Three Full Moons
            </h3>

            <p className="mt-1 text-sm text-gray-300">
              Complete your ritual before your artifacts escape.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:text-right">
          <Hourglass className="h-6 w-6 text-red-400" />

          <div>
            <p className="text-xs uppercase tracking-widest text-red-300">
              Time Remaining
            </p>

            <p className="font-mono text-3xl font-bold tabular-nums text-white">
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-red-950">
        <div
          className="h-full rounded-full bg-red-500 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-3 text-xs italic text-red-300/80">
        Once the moons fade, your reserved items return to the darkness.
      </p>
    </motion.div>
  );
};

export default ReservationCountdown;

