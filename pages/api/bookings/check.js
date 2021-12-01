import nc from "next-connect";

import dbConnect from "../../../config/dbConnect";
import onError from "../../../middlewares/errors";
import { checkRoomBookingAvailability } from "../../../controllers/bookingController";

const handler = nc({ onError });
dbConnect();
handler.get(checkRoomBookingAvailability);

export default handler;
