import mongoose from "mongoose";
import mongoose from "mongoose";

const paySchema = new mongoose.Schema({
  amount: {
    type: Number,
  },
  transactionId: {
    type: String,
  },
  transactionDate: {
    type: Date,
  },
  phone: {
    type: Number,
  },
});

export default mongoose.models.Pay || mongoose.model("Pay", paySchema);
