import axios from "axios";
// import { Mpesa } from "mpesa-api";

import {
  PAYMENT_REQUEST,
  PAYMENT_SUCCESS,
  PAYMENT_RESET,
  PAYMENT_FAIL,
  PAYMENT_AUTHORIZATION_REQUEST,
  PAYMENT_AUTHORIZATION_SUCCESS,
  PAYMENT_AUTHORIZATION_FAIL,
  CLEAR_ERRORS,
} from "../constants/paymentConstants";

// PAYMENT-GETTING OAUTH TOKEN
export const getOAuthToken = () => async (dispatch) => {
  try {
    dispatch({ type: PAYMENT_AUTHORIZATION_REQUEST });

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
    dispatch({
      type: PAYMENT_AUTHORIZATION_SUCCESS,
      payload: data["access_token"],
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: PAYMENT_AUTHORIZATION_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Lipa na Mpesa - Using The access Token
export const lipaNaMpesaOnline =
  (paymentData, accessToken) => async (dispatch) => {
    try {
      dispatch({ type: PAYMENT_REQUEST });

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

      // let Password = buffer.toString("base64");
      // const PhoneNumber = "254" + phone.slice(1);

      // let token = req.token;
      let auth = `Bearer ${accessToken}`;

      let { data } = await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        paymentData,
        {
          headers: {
            Authorization: auth,
          },
        }
      );
      // console.log(paymentStatus);
      dispatch({
        type: PAYMENT_SUCCESS,
        payload: paymentStatus,
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: PAYMENT_FAIL,
        payload: error.response.message,
      });
    }
  };
// // Lipa na Mpesa - Using The access Token
// export const lipaNaMpesaOnline =
//   (accessToken, paymentData) => async (dispatch) => {
//     try {
//       dispatch({ type: PAYMENT_REQUEST });

//       // let token = req.token;
//       let auth = `Bearer ${accessToken}`;

//       let { data } = await axios.post(
//         "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
//         paymentData,
//         {
//           headers: {
//             Authorization: auth,
//           },
//         }
//       );
//       dispatch({
//         type: PAYMENT_SUCCESS,
//         payload: data,
//       });
//     } catch (error) {
//       console.log(error);
//       dispatch({
//         type: PAYMENT_FAIL,
//         payload: error.response.message,
//       });
//     }
//   };
