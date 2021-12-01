// CHECK BOOKED DATES
import nc from "next-connect";

import dbConnect from "../../../config/dbConnect";
import onError from "../../../middlewares/errors";
import { checkRoomBookedDates } from "../../../controllers/bookingController";

const handler = nc({ onError });
dbConnect();
handler.get(checkRoomBookedDates);

export default handler;
