import crypto from "crypto";
import { Mpesa } from "mpesa-api";

import Booking from "../models/booking";
import Payment from "../models/payment";
import ErrorHandler from "../utils/errorHandler";
import catchAsync from "../middlewares/catchAsyncErrors";
import Moment from "moment";

import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

// CREATE NEW BOOKING => /api/bookings

const newBooking = catchAsync(async (req, res) => {
  // FROM MPESA
  const {
    Body: {
      stkCallback: { CallbackMetadata },
    },
  } = req.body;

  if (CallbackMetadata) {
    const {
      Body: {
        stkCallback: {
          CallbackMetadata: { Item },
        },
      },
    } = req.body;

    // Object to insert array items
    const newObj = {};
    Item.forEach((ob) => {
      if (ob.Value) newObj[ob.Name] = ob.Value;
    });

    const bookingData = await Payment.find({ PhoneNumber: newObj.PhoneNumber });
    // console.log("Booking data",bookingData)
    await Payment.deleteMany({ PhoneNumber: newObj.PhoneNumber });

    // configuring booking data
    let {
      room,
      userId,
      checkInDate,
      checkOutDate,
      daysOfStay,
      amountPaid,
      paymentInfo,
    } = bookingData[0];

    checkInDate = {
      dateIn: checkInDate,
      offset: new Date(checkInDate).getTimezoneOffset(),
    };
    checkOutDate = {
      dateOut: checkOutDate,
      offset: new Date(checkOutDate).getTimezoneOffset(),
    };
    // Creating a new booking
    const booking = await Booking.create({
      userId,
      room,
      checkInDate,
      checkOutDate,
      phone: newObj.PhoneNumber,
      daysOfStay,
      amountPaid: newObj.Amount,
      paymentInfo: {
        id: newObj.MpesaReceiptNumber,
        status: "success",
      },
      paidAt: newObj.TransactionDate,
    });
    res.redirect(`/rooms/${booking.room}`);
  }

  res.status(400).json({
    success: false,
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

// // Payment
const lipaNaMpesaOnline = catchAsync(async (req, res, next) => {
  console.log(req.user);
  let paymentData = req.paymentData;
  let bookingData = req.bookingData;

  console.log(bookingData);
  const credentials = {
    clientKey: process.env.MPESA_CONSUMER_KEY,
    clientSecret: process.env.MPESA_CONSUMER_SECRET,
    initiatorPassword: process.env.InitiatorPassword,
    // securityCredential: "YOUR_SECURITY_CREDENTIAL",
    certificatePath: null,
  };

  const environment = "sandbox";
  const mpesa = new Mpesa(credentials, environment);
  await mpesa.lipaNaMpesaOnline({
    ...paymentData,
  });
  //  Deleting previous data
  await Payment.deleteMany({ PhoneNumber: Number(bookingData.PhoneNumber) });
  // This is temporary data
  await Payment.create({
    userId: req.user._id,
    ...bookingData,
  });
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
  lipaNaMpesaOnline,
};
