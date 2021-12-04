import axios from "axios";
import Booking from "../models/booking";
import Pay from "../models/pay";
import catchAsync from "../middlewares/catchAsyncErrors";

const getOAuthToken = catchAsync(async () => {
  let consumer_key = process.env.MPESA_CONSUMER_KEY;
  let consumer_secret = process.env.MPESA_CONSUMER_SECRET;

  //form a buffer of the consumer key and secret
  let buffer = new Buffer.from(consumer_key + ":" + consumer_secret);

  let auth = `Basic ${buffer.toString("base64")}`;

  let { data } = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: auth,
      },
    }
  );
  // console.log(data);
  // asigning access token to a variable in the next middleware
  return data["access_token"];
});

export const lipaNaMpesaOnline = catchAsync(async (req, res) => {
  console.log(req.bookingData);
  console.log(req.paymentData);
  let token = await getOAuthToken();
  let auth = `Bearer ${token}`;

  // Creating timestamp
  const today = new Date();
  const date =
    today.getFullYear() +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    ("0" + today.getDate()).slice(-2);
  const time =
    today.getHours().toString() +
    today.getMinutes().toString() +
    today.getSeconds().toString();
  const Timestamp = date + time;

  let buffer = new Buffer.from(
    process.env.BusinessShortCode + process.env.PassKey + Timestamp
  );
  let PhoneNumber = 254769950900;
  let Password = buffer.toString("base64");
  console.log("here before payload");
  const payLoad = {
    BusinessShortCode: 174379,
    Password,
    Timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: 1,
    PartyA: PhoneNumber,
    PartyB: 174379,
    PhoneNumber,
    CallBackURL: process.env.CallBackURL + "/api/v1/pay/status",
    AccountReference: "test",
    TransactionDesc: "test",
  };

  let { data } = await axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    payLoad,
    {
      headers: {
        Authorization: auth,
      },
    }
  );
  res.status(200).json({
    success: true,
    data,
  });
});

export const status = catchAsync(async (req, res, next) => {
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

    await Pay.create({
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
