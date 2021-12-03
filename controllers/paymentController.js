// const prettyjson = require("prettyjson");
// const stringify = require("json-stable-stringify");
// const axios = require("axios");
// const Booking = require("../models/booking");
// const catchAsync = require("../utils/catchAsync");
// const APIFeatures = require("../utils/apiFeatures");
// const AppError = require("../utils/appError");

import Booking from "../models/booking";

export const paymentStatus = catchAsync(async (req, res, next) => {
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

    await Payment.create({
      amount: newObj.Amount,
      transactionId: newObj.MpesaReceiptNumber,
      transactionDate: newObj.TransactionDate,
      phone: newObj.PhoneNumber,
    });
  }

  res.status(200).json({
    success: true,
    //   ResultDesc,
  });
});

// Creating a booking after payment
export const newBooking = catchAsync(async (req, res) => {
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

    // await Payment.create({
    //   amount: newObj.Amount,
    //   transactionId: newObj.MpesaReceiptNumber,
    //   transactionDate: newObj.TransactionDate,
    //   phone: newObj.PhoneNumber,
    // });
  }
  amountPaid = newObj.Amount;
  paymentInfo = {
    id: newObj.MpesaReceiptNumber,
    status: "M-PESA_PAYMENT_STATUS",
  };

  const booking = await Booking.create({
    userId: req.user._id,
    room,
    checkInDate,
    checkOutDate,
    daysOfStay,
    amountPaid,
    paymentInfo,
    paidAt: newObj.TransactionDate,
  });

  res.status(201).json({
    success: true,
    booking,
  });
});
