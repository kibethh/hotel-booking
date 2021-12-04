import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Head from "next/head";
import { Carousel } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import NewReview from "../review/NewReview";
import { clearErrors } from "../../redux/actions/roomActions";
import {
  checkBooking,
  getBookedDates,
} from "../../redux/actions/bookingActions";
import { CHECK_BOOKING_RESET } from "../../redux/constants/bookingConstants";
import { PAYMENT_REQUEST } from "../../redux/constants/paymentConstants";

// import { dataIntoReqbody } from "../../middlewares/paymentData";
// import {
//   lipaNaMpesaOnline,
//   getOAuthToken,
// } from "../../redux/actions/paymentActions";

import RoomFeatures from "./RoomFeatures";
import ListReviews from "../review/ListReviews";

const RoomDetails = () => {
  const [checkInDate, setCheckInDate] = useState();
  const [checkOutDate, setCheckOutDate] = useState();
  const [daysOfStay, setDaysOfStay] = useState();
  const [phone, setPhone] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();
  const roomId = router.query.id;

  const { room, error } = useSelector((state) => state.roomDetails);
  const { user } = useSelector((state) => state.loadedUser);
  const { dates } = useSelector((state) => state.bookedDates);
  const { available, loading: bookingLoading } = useSelector(
    (state) => state.checkBooking
  );
  const { loading, accessToken } = useSelector(
    (state) => state.paymentAuthorization
  );
  const { isPaid } = useSelector((state) => state.payment);

  const excludedDates = [];
  dates.length > 0 &&
    dates.forEach((date) => {
      excludedDates.push(new Date(date));
    });

  const onChange = (dates) => {
    const [checkInDate, checkOutDate] = dates;
    setCheckInDate(checkInDate);
    setCheckOutDate(checkOutDate);
    if (checkInDate && checkOutDate) {
      // Calculating Days of stay

      const days = Math.floor(
        (new Date(checkOutDate) - new Date(checkInDate)) / 86400000 + 1
      );
      setDaysOfStay(days);
      dispatch(
        checkBooking(
          roomId,
          checkInDate.toISOString(),
          checkOutDate.toISOString()
        )
      );
    }
  };

  const newBookingHandler = async (e) => {
    e.target.innerHTML = "TRANSACTION INITIATED...";
    e.target.disabled = "true";
    setTimeout(() => (e.target.hidden = "true"), 2000);

    try {
      const PhoneNumber = "254" + phone.slice(1);

      const bookingData = {
        room: router.query.id,
        checkInDate,
        checkOutDate,
        PhoneNumber,
        daysOfStay,
        amountPaid: 90,
        paymentInfo: {
          id: "M-PESA_TRANSACTION_ID",
          status: "M-PESA_PAYMENT_STATUS",
        },
      };
      // end of booking data
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

      let Password = buffer.toString("base64");

      const paymentData = {
        BusinessShortCode: 174379,
        Password,
        Timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: 1,
        PartyA: PhoneNumber,
        PartyB: 174379,
        PhoneNumber,
        CallBackURL:
          "https://hotel-booking-kibethh.vercel.app/api/payment/status",
        AccountReference: "test",
        passKey: process.env.PassKey,
        TransactionDesc: "test",
      };

      const bookPay = {
        bookingData,
        paymentData,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      // console.log(bookPay);

      const { data } = await axios.post("/api/payment", bookPay, config);
      console.log(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    dispatch(getBookedDates(roomId));
    if (error) {
      toast.error(error);
      dispatch(clearErrors);
    }
  }, [dispatch, error, roomId]);
  return (
    <>
      <Head>
        <title>{room.name} - BookIT</title>
      </Head>
      <div className="container container-fluid">
        <h2 className="mt-5">{room.name}</h2>
        <p>{room.address}</p>

        <div className="ratings mt-auto mb-3">
          <div className="rating-outer">
            <div
              className="rating-inner"
              style={{ width: `${(room.ratings / 5) * 100} %` }}
            ></div>
          </div>
          <span id="no_of_reviews">({room.numOfReviews} Reviews)</span>
        </div>

        <Carousel hover="pause">
          {room.images &&
            room.images.map((image) => (
              <Carousel.Item key={image.public_id}>
                <div style={{ width: "100%", height: "440px" }}>
                  <Image
                    className="d-block m-auto"
                    alt={room.name}
                    src={image.url}
                    layout="fill"
                  />
                </div>
              </Carousel.Item>
            ))}
        </Carousel>

        <div className="row my-5">
          <div className="col-12 col-md-6 col-lg-8">
            <h3>Description</h3>
            <p>{room.description}</p>

            <RoomFeatures room={room} />
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="booking-card shadow-lg p-4">
              <div className="price-per-night">
                <b>${room.pricePerNight}</b> / night
                <hr />
                <p className="mt-5 mt-3">Pick Check-In and Check-Out Date</p>
                <DatePicker
                  className="w-100"
                  selected={checkInDate}
                  onChange={onChange}
                  minDate={new Date()}
                  startDate={checkInDate}
                  endDate={checkOutDate}
                  excludeDates={excludedDates}
                  selectsRange
                  inline
                />
              </div>
              {available === true && (
                <div className="alert alert-success my-3 font-weight-bold">
                  Room is available. Book now
                </div>
              )}
              {available === false && (
                <div className="alert alert-danger my-3 font-weight-bold">
                  Room not available. Try different dates.
                </div>
              )}
              {available && !user && (
                <div className="alert alert-danger my-3 font-weight-bold">
                  Login to Book a room.
                </div>
              )}
              {available && user && (
                <>
                  <div className="form-group">
                    <label htmlFor="phone_field">
                      Enter Your M-PESA Phone Number
                    </label>
                    <input
                      type="number"
                      id="phone_field"
                      className="form-control"
                      value={phone}
                      placeholder="e.g 0712345678 10+ characters"
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn btn-block py-3 booking-btn"
                    onClick={newBookingHandler}
                    style={{
                      display: `${phone.length < 10 ? "none" : "block"}`,
                    }}
                  >
                    Pay To Book
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <NewReview />

        {room.reviews && room.reviews.length > 0 ? (
          <ListReviews reviews={room.reviews} />
        ) : (
          <p>
            <b>No Reviews yet on this room</b>
          </p>
        )}
      </div>
    </>
  );
};

export default RoomDetails;
