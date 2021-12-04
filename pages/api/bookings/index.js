import nc from "next-connect";

import dbConnect from "../../../config/dbConnect";
import onError from "../../../middlewares/errors";
import { adminNewBooking } from "../../../controllers/bookingController";
import { isAuthenticatedUser } from "../../../middlewares/auth";

const handler = nc({ onError });
dbConnect();
handler.use(isAuthenticatedUser).post(adminNewBooking);

export default handler;
