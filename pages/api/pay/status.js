import nc from "next-connect";
import dbConnect from "../../../config/dbConnect";
import onError from "../../../middlewares/errors";
import { isAuthenticatedUser } from "../../../middlewares/auth";
import { status } from "../../../controllers/payController";
// import { dataIntoReqbody } from "../../../middlewares/paymentData";

const handler = nc({ onError });
dbConnect();

// handler.post(newBooking);
handler.post(status);

export default handler;
