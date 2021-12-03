import nc from "next-connect";
import dbConnect from "../../../config/dbConnect";
import onError from "../../../middlewares/errors";
import { isAuthenticatedUser } from "../../../middlewares/auth";
import { mpesaCallback } from "../../../middlewares/payment";
// import { dataIntoReqbody } from "../../../middlewares/paymentData";
import { newBooking,testBooking } from "../../../controllers/bookingController";


const handler = nc({ onError });
dbConnect();

handler.post(newBooking);

export default handler;
