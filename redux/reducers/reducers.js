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
} from "./userReducers";

const reducers = combineReducers({
  allRooms: allRoomsReducer,
  roomDetails: roomDetailsReducer,
  room: roomReducer,
  newRoom: newRoomReducer,
  allUsers: allUsersReducer,
  auth: authReducer,
  loadedUser: loadedUserReducer,
  user: userReducer,
  forgotPassword: forgotPasswordReducer,
  checkBooking: checkBookingReducer,
  bookedDates: bookedDatesReducer,
  bookings: bookingsReducer,
  booking: bookingReducer,
  bookingDetails: bookingDetailsReducer,
  newReview: newReviewReducer,
  checkReview: checkReviewReducer,
});

export default reducers;
