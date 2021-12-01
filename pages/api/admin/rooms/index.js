import nc from "next-connect";
import dbConnect from "../../../../config/dbConnect";

import { allAdminRooms } from "../../../../controllers/roomController";

import onError from "../../../../middlewares/errors";
import {
  isAuthenticatedUser,
  authorizeRoles,
} from "../../../../middlewares/auth";

const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser, authorizeRoles("admin")).get(allAdminRooms);

export default handler;
