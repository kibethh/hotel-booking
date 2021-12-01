import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter a room name"],
    trim: true,
    maxLength: [100, "Room name cannot exceed 100 characters"],
  },
  pricePerNight: {
    type: Number,
    required: [true, "Please Enter a room price per night"],
    maxLength: [4, "Room Price cannot exceed 4 characters"],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "Please Enter a room description"],
  },
  address: {
    type: String,
    required: [true, "Please Enter a room address"],
  },
  guestCapacity: {
    type: Number,
    required: [true, "Please Enter  room guest capacity"],
  },
  numOfBeds: {
    type: Number,
    required: [true, "Please Enter the number of beds in the room"],
  },
  internet: {
    type: Boolean,
    default: false,
  },
  breakfast: {
    type: Boolean,
    default: false,
  },
  airConditioned: {
    type: Boolean,
    default: false,
  },
  petsAllowed: {
    type: Boolean,
    default: false,
  },
  roomCleaning: {
    type: Boolean,
    default: false,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numOfreviews: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please Enter Room Category"],
    enum: {
      values: ["King", "Single", "Twins"],
      message: "Please Select Correct Category for the room",
    },
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.models.Room || mongoose.model("Room", roomSchema);
