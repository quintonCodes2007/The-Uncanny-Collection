import { expireReservations } from "./reservation.service.js";

export const startReservationScheduler = () => {
  const interval = setInterval(async () => {
    try {
      const count = await expireReservations();

      if (count > 0) {
        console.log(`🌕 Expired ${count} cart reservations`);
      }
    } catch (error) {
      console.error("Reservation expiration error:", error);
    }
  }, 60 * 1000);

  interval.unref?.();
};