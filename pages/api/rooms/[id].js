import nc from "next-connect";
import dbConnect from "../../../config/dbConnect";
import onError from "../../../middlewares/errors";
import { isAuthenticatedUser, authorizeRoles } from "../../../middlewares/auth";
import {
  getSingleRoom,
  updateRoom,
  deleteRoom,
} from "../../../controllers/roomController";

const handler = nc({ onError });
dbConnect();

handler.get(getSingleRoom);
handler.use(isAuthenticatedUser, authorizeRoles("admin")).patch(updateRoom);

handler.use(isAuthenticatedUser, authorizeRoles("admin")).delete(deleteRoom);

export default handler;
