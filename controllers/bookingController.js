import crypto from "crypto";
import Booking from "../models/booking";
import ErrorHandler from "../utils/errorHandler";
import catchAsync from "../middlewares/catchAsyncErrors";
import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

// CREATE NEW BOOKING => /api/bookings
const newBooking = catchAsync(async (req, res) => {
  let { room, checkInDate, checkOutDate, daysOfStay, amountPaid, paymentInfo } =
    req.body;

  checkInDate = {
    dateIn: checkInDate,
    offset: new Date(checkInDate).getTimezoneOffset(),
  };
  checkOutDate = {
    dateOut: checkOutDate,
    offset: new Date(checkOutDate).getTimezoneOffset(),
  };

  const booking = await Booking.create({
    userId: req.user._id,
    room,
    checkInDate,
    checkOutDate,
    daysOfStay,
    amountPaid,
    paymentInfo,
    paidAt: Date.now(),
  });

  res.status(201).json({
    success: true,
    booking,
  });
});
// CHECK ROOM BOOKING AVAILABILITY => /api/bookings/check
const checkRoomBookingAvailability = catchAsync(async (req, res) => {
  let { roomId, checkInDate, checkOutDate } = req.query;
  checkInDate = new Date(checkInDate);
  checkOutDate = new Date(checkOutDate);

  const booking = await Booking.find({
    room: roomId,
    $and: [
      {
        "checkInDate.dateIn": {
          $lte: checkOutDate,
        },
      },
      {
        "checkOutDate.dateOut": {
          $gte: checkInDate,
        },
      },
    ],
  });

  // Check if there is any booking available
  let isAvailable;

  if (booking && booking.length === 0) {
    isAvailable = true;
  } else {
    isAvailable = false;
  }

  res.status(200).json({
    success: true,
    isAvailable,
  });
});
// CHECK BOOK DATES OF A ROOM => /api/bookings/check_booked_dates
const checkRoomBookedDates = catchAsync(async (req, res) => {
  const { roomId } = req.query;
  const bookings = await Booking.find({ room: roomId });

  let bookedDates = [];

  const timeDifference = moment().utcOffset() / 60;

  bookings.forEach((booking) => {
    const checkInDate = moment(booking.checkInDate.dateIn).add(
      timeDifference,
      "hours"
    );
    const checkOutDate = moment(booking.checkOutDate.dateOut).add(
      timeDifference,
      "hours"
    );

    // const range = moment.range(
    //   moment(
    //     new Date(
    //       booking.checkInDate.dateIn.getTime() -
    //         booking.checkInDate.offset * 60000
    //     )
    //   ),
    //   moment(
    //     new Date(
    //       booking.checkOutDate.dateOut.getTime() -
    //         booking.checkOutDate.offset * 60000
    //     )
    //   )
    // );
    const range = moment.range(moment(checkInDate), moment(checkOutDate));
    const dates = Array.from(range.by("day"));
    bookedDates = bookedDates.concat(dates);
  });

  res.status(200).json({
    success: true,
    bookedDates,
  });
});

// BOOKINGS OF CURRENT USER => /api/bookings/me
const myBookings = catchAsync(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate({
      path: "room",
      select: "name pricePerNight images",
    })
    .populate({
      path: "userId",
      select: "name email",
    });

  res.status(200).json({
    success: true,
    bookings,
  });
});

// BOOKINGS DETAILS => /api/bookings/[id]
const bookingDetails = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.query.id)
    .populate({
      path: "room",
      select: "name pricePerNight images",
    })
    .populate({
      path: "userId",
      select: "name email",
    });

  res.status(200).json({
    success: true,
    booking,
  });
});

// Get all bookings - ADMIN   =>   /api/admin/bookings
const allAdminBookings = catchAsync(async (req, res) => {
  const bookings = await Booking.find()
    .populate({
      path: "room",
      select: "name pricePerNight images",
    })
    .populate({
      path: "userId",
      select: "name email",
    });

  res.status(200).json({
    success: true,
    bookings,
  });
});

// Delete booking - ADMIN   =>   /api/admin/bookings/id
const deleteBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.query.id);

  if (!booking) {
    return next(new ErrorHandler("Booking not found with this ID", 404));
  }

  await booking.remove();

  res.status(200).json({
    success: true,
  });
});

export {
  newBooking,
  checkRoomBookingAvailability,
  checkRoomBookedDates,
  myBookings,
  bookingDetails,
  allAdminBookings,
  deleteBooking,
};
