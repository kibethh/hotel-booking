import { combineReducers } from "redux";

import {
  allRoomsReducer,
  roomDetailsReducer,
  newReviewReducer,
  checkReviewReducer,
  newRoomReducer,
  roomReducer,
  roomReviewsReducer,
  reviewReducer,
} from "./roomReducers";

import {
  checkBookingReducer,
  bookedDatesReducer,
  bookingsReducer,
  bookingReducer,
  bookingDetailsReducer,
} from "./bookingReducers";
import {
  authReducer,
  loadedUserReducer,
  userReducer,
  forgotPasswordReducer,
  allUsersReducer,
  userDetailsReducer,
} from "./userReducers";
import { paymentAuthorizationReducer, paymentReducer } from "./paymentReducer";

const reducers = combineReducers({
  allRooms: allRoomsReducer,
  roomDetails: roomDetailsReducer,
  room: roomReducer,
  newRoom: newRoomReducer,
  allUsers: allUsersReducer,
  auth: authReducer,
  loadedUser: loadedUserReducer,
  user: userReducer,
  userDetails: userDetailsReducer,
  forgotPassword: forgotPasswordReducer,
  checkBooking: checkBookingReducer,
  bookedDates: bookedDatesReducer,
  bookings: bookingsReducer,
  booking: bookingReducer,
  bookingDetails: bookingDetailsReducer,
  newReview: newReviewReducer,
  checkReview: checkReviewReducer,
  roomReviews: roomReviewsReducer,
  review: reviewReducer,
  paymentAuthorization: paymentAuthorizationReducer,
  payment: paymentReducer,
});

export default reducers;
