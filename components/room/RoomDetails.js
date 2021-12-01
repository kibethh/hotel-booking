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

import RoomFeatures from "./RoomFeatures";
import ListReviews from "../review/ListReviews";

const RoomDetails = () => {
  const [checkInDate, setCheckInDate] = useState();
  const [checkOutDate, setCheckOutDate] = useState();
  const [daysOfStay, setDaysOfStay] = useState();

  const dispatch = useDispatch();
  const router = useRouter();
  const roomId = router.query.id;

  const { room, error } = useSelector((state) => state.roomDetails);
  const { user } = useSelector((state) => state.loadedUser);
  const { dates } = useSelector((state) => state.bookedDates);
  const { available, loading: bookingLoading } = useSelector(
    (state) => state.checkBooking
  );
  console.log(dates);

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

  const newBookingHandler = async () => {
    const bookingData = {
      room: router.query.id,
      checkInDate,
      checkOutDate,
      daysOfStay,
      amountPaid: 90,
      paymentInfo: {
        id: "M-PESA_TRANSACTION_ID",
        status: "M-PESA_PAYMENT_STATUS",
      },
    };

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post("/api/bookings", bookingData, config);
      console.log(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    dispatch(getBookedDates(roomId));
    toast.error(error);
    dispatch(clearErrors);
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
        {/* 
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
        </Carousel> */}

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
                <button
                  className="btn btn-block py-3 booking-btn"
                  onClick={newBookingHandler}
                >
                  Pay
                </button>
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
