module.exports = {
  env: {
    MONGODB_URL: "mongodb://127.0.0.1:27017/hotelBooking",
    DATABASE:
      "mongodb+srv://humphrey:<password>@cluster0.pudlj.mongodb.net/hotelbooking?retryWrites=true&w=majority",
    DATABASE_PASSWORD: "12database12",
    MONGODB_ONLINE_URL:
      "mongodb+srv://humphrey:12database12@cluster0.pudlj.mongodb.net/hotelbooking?retryWrites=true&w=majority",

    // NEXT_AUTH
    NEXTAUTH_UR: "https://hkhotelbooking.vercel.app",
    // CLOUDINARY
    CLOUDINARY_CLOUD_NAME: "kibethh",
    CLOUDINARY_API_KEY: "247797832247976",
    CLOUDINARY_API_SECRET: "WT0R1cHKSkB_H0klWNjY-z_7YqM",
    EMAIL_USERNAME: "1584c62592416c",
    EMAIL_FROM: "noreply@hotel.com",
    EMAIL_NAME: "HOTELROOM",
    EMAIL_PASSWORD: "6e03cb3f56b568",
    EMAIL_HOST: "smtp.mailtrap.io",
    EMAIL_SERVICE: "mailtrap",
    EMAIL_PORT: 2525,
    // MPESA
    MPESA_CONSUMER_KEY: "Ao84Pyj0tMCrIcsDVkcETytsSKLwo4mE",
    MPESA_CONSUMER_SECRET: "ThzdZ6IwdvgPWmbl",
    TOKEN_URL:
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    CallBackURL: "https://hotel-booking-kibethh.vercel.app",
    InitiatorName: "testapi",
    InitiatorPassword: "Safaricom999!",
    PartyA: 600999,
    PartyB: 600000,
    PhoneNumber: 254708374149,
    BusinessShortCode: 174379,
    PassKey: "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
  },
  images: {
    domains: ["a0.muscache.com", "res.cloudinary.com"],
  },
};
