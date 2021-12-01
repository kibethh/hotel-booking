import NextAuth from "next-auth";
import Providers from "next-auth/providers";

import User from "../../../models/user";
import dbConnect from "../../../config/dbConnect";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        dbConnect();
        const { email, password } = credentials;
        // Check if email and passwords are entered
        if (!email || !password) {
          throw new Error("Please enter email or password!!");
        }

        // 2. check if user exist && password is correct
        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await user.correctPassword(password, user.password))) {
          throw new Error("Incorrect Email or Password!!");
        }
        return Promise.resolve(user);
      },
    }),
  ],
  callbacks: {
    jwt: async (token, user) => {
      user && (token.user = user);
      return Promise.resolve(token);
    },
    session: async (session, token) => {
      session.user = token.user;
      return Promise.resolve(session);
    },
  },
});
