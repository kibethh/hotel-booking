import mongoose from "mongoose";

const dbConnect = () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  // const DB = process.env.MONGODB_URL;

//   mongoose
//     .connect(DB, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     .then(() => console.log("connected"));
// };
  mongoose
    .connect(
      "mongodb+srv://humphrey:12database12@cluster0.pudlj.mongodb.net/hotelbooking?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log("connected"));
};

export default dbConnect;
