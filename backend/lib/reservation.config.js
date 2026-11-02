export const RESERVATION_DURATION_MINUTES = 1;

export const getReservationExpiry = () => {
  return new Date(
    Date.now() + RESERVATION_DURATION_MINUTES * 60 * 1000
  );
};