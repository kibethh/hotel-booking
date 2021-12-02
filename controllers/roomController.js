import cloudinary from "cloudinary";
import Room from "../models/room";
import Booking from "../models/booking";
import ErrorHandler from "../utils/errorHandler";
import catchAsync from "../middlewares/catchAsyncErrors";
import APIFeatures from "../utils/apiFeatures";

// Setting up cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Get all rooms
const allRooms = catchAsync(async (req, res) => {
  const roomsCount = await Room.countDocuments();
  const apiFeatures = new APIFeatures(Room.find(), req.query)
    .search()
    .filter()
    .pagination();

  let rooms = await apiFeatures.query;
  let filteredRoomsCount = rooms.length;
  res.status(200).json({
    success: true,
    roomsCount,
    rooms,
    filteredRoomsCount,
  });
});

// create new room /api/rooms
const newRoom = catchAsync(async (req, res) => {
  const images = req.body.images;
  let imagesLink = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "bookit/rooms",
    });

    imagesLink.push({
      public_id: result && result.public_id,
      url: result && result.secure_url,
    });
  }
  req.body.images = imagesLink;
  req.body.user = req.user._id;

  const room = await Room.create(req.body);
  res.status(201).json({
    success: true,
    room,
  });
});

// create room details /api/rooms/:id
const getSingleRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findById(req.query.id);

  if (!room) {
    return next(new ErrorHandler("room not found", 404));
  }
  res.status(200).json({
    success: true,
    room,
  });
});

// update room details /api/rooms/:id
const updateRoom = catchAsync(async (req, res, next) => {
  let room = await Room.findById(req.query.id);

  if (!room) {
    return next(new ErrorHandler("room not found", 404));
  }
  let imagesLink = [];

  if (req.body.images) {
    // Delete images associated with the room
    for (let i = 0; i < room.images.length; i++) {
      await cloudinary.v2.uploader.destroy(room.images[i].public_id);
    }

    // Upload Images
    for (let i = 0; i < req.body.images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(req.body.images[i], {
        folder: "bookit/rooms",
      });

      imagesLink.push({
        public_id: result && result.public_id,
        url: result && result.secure_url,
      });
    }
  }
  req.body.images = imagesLink;
  req.body.user = req.user._id;
  room = await Room.findByIdAndUpdate(req.query.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    room,
  });
});
// delete room  /api/rooms/:id
const deleteRoom = catchAsync(async (req, res) => {
  const room = await Room.findById(req.query.id);

  if (!room) {
    return next(new ErrorHandler("room not found", 404));
  }
  // Delete images associated with the room
  for (let i = 0; i < room.images.length; i++) {
    await cloudinary.v2.uploader.destroy(room.images[i].public_id);
  }
  await Room.findByIdAndDelete(req.query.id);

  res.status(200).json({
    success: true,
    message: "Room deleted",
    room,
  });
});
//CREATE A NEW REVIEW  /api/review
const createRoomReview = catchAsync(async (req, res) => {
  const { rating, comment, roomId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const room = await Room.findById(roomId);
  const isReviewed = room.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    room.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    room.reviews.push(review);
    room.numOfReviews = room.reviews.length;
  }

  room.ratings =
    room.reviews.reduce((acc, item) => item.rating + acc, 0) /
    room.reviews.length;

  await room.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});
//CHECK REVIEW AVAILABILITY  /api/review/check_review_availability
const checkReviewAvailability = catchAsync(async (req, res) => {
  const { roomId } = req.query;
  console.log("Room Id", roomId);
  console.log("User", req.user._id);

  const bookings = await Booking.find({
    userId: req.user._id,
    room: roomId,
    // daysOfStay: 3,
  });

  console.log(bookings);

  let isReviewAvailable = false;
  if (bookings.length > 0) isReviewAvailable = true;

  res.status(200).json({
    success: true,
    isReviewAvailable,
  });
});
//GET ALL ROOMS ADMIN  /api/admin/rooms
const allAdminRooms = catchAsync(async (req, res) => {
  const rooms = await Room.find();
  res.status(200).json({
    success: true,
    rooms,
  });
});

// Get all room reviews - ADMIN   =>   /api/reviews
const getRoomReviews = catchAsync(async (req, res) => {
  const room = await Room.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: room.reviews,
  });
});

// Delete room review - ADMIN   =>   /api/reviews
const deleteReview = catchAsync(async (req, res) => {
  const room = await Room.findById(req.query.roomId);

  const reviews = room.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );

  const numOfReviews = reviews.length;

  const ratings =
    room.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await Room.findByIdAndUpdate(
    req.query.roomId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

export {
  allRooms,
  newRoom,
  getSingleRoom,
  updateRoom,
  deleteRoom,
  createRoomReview,
  checkReviewAvailability,
  allAdminRooms,
  getRoomReviews,
  deleteReview,
};
