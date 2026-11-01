
import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: Number.isSafeInteger,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "completed", "expired", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

reservationSchema.index(
  { user: 1, product: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "active" },
  }
);

const Reservation = mongoose.model(
  "Reservation",
  reservationSchema
);

export default Reservation;
