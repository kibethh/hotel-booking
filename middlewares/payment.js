
import catchAsync from "./catchAsyncErrors";

// Payment
export const bookingDataAndPaymentData = catchAsync(async (req, res, next) => {
  
  req.bookingData = req.body.bookingData;

  req.paymentData = req.body.paymentData;
  next();
});
// Payment- shifting data in req.body
export const mpesaCallback = catchAsync(async (req, res, next) => {
  console.log(req.body)
  req.mpesaData = req.body;

  next();
});
