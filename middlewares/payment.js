import catchAsync from "./catchAsyncErrors";

// Payment
export const bookingDataAndPaymentData = catchAsync(async (req, res, next) => {
  req.bookingData = { "req.body": "bookingData" };

  req.paymentData = { "req.body": "paymentData" };
  next();
});
