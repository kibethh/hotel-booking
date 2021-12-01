import nc from "next-connect";
import dbConnect from "../../../../config/dbConnect";
import onError from "../../../../middlewares/errors";
import { resetPassword } from "../../../../controllers/authController";

const handler = nc({ onError });
dbConnect();
handler.patch(resetPassword);

export default handler;
