import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Room",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  checkInDate: {
    dateIn: {
      type: Date,
      required: true,
    },
    offset: {
      type: Number,
      required: true,
    },
  },
  checkOutDate: {
    dateOut: {
      type: Date,
      required: true,
    },
    offset: {
      type: Number,
      required: true,
    },
  },
  amountPaid: {
    type: Number,
    required: true,
  },
  daysOfStay: {
    type: Number,
    required: true,
  },
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  paidAt: {
    type: Date,
    default: Date.now(),
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema);
