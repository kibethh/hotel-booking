import nc from "next-connect";
import dbConnect from "../../../config/dbConnect";
import onError from "../../../middlewares/errors";
import { isAuthenticatedUser } from "../../../middlewares/auth";
import { bookingDataAndPaymentData } from "../../../middlewares/payment";
// import { dataIntoReqbody } from "../../../middlewares/paymentData";

import { lipaNaMpesaOnline } from "../../../controllers/bookingController";

const handler = nc({ onError });
dbConnect();


handler
  .use(isAuthenticatedUser, bookingDataAndPaymentData )
  .post(lipaNaMpesaOnline);

export default handler;
