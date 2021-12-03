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

// PAYMENT AUTHORIZATION REDUCER
export const paymentAuthorizationReducer = (
  state = { loading: false, accessToken: "" },
  action
) => {
  switch (action.type) {
    case PAYMENT_AUTHORIZATION_REQUEST:
      return {
        loading: true,
      };
    case PAYMENT_AUTHORIZATION_SUCCESS:
      return {
        accessToken: action.payload,
      };
    case PAYMENT_AUTHORIZATION_FAIL:
      return {
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// PAYMENT REDUCER
export const paymentReducer = (
  state = { loading: false, isPaid: null },
  action
) => {
  switch (action.type) {
    case PAYMENT_REQUEST:
      return {
        loading: true,
      };

    case PAYMENT_SUCCESS:
      return {
        loading: false,
        isPaid: action.payload,
      };

    case PAYMENT_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case PAYMENT_RESET:
      return {
        loading: false,
        isPaid: false,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
