// FORGOT PASSWORD
import nc from "next-connect";

import dbConnect from "../../../config/dbConnect";
import onError from "../../../middlewares/errors";
import { forgotPassword } from "../../../controllers/authController";

const handler = nc({ onError });
dbConnect();
handler.post(forgotPassword);

export default handler;
