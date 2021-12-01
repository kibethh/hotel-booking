import crypto from "crypto";
import cloudinary from "cloudinary";
import absoluteUrl from "next-absolute-url";
import User from "../models/user";
import ErrorHandler from "../utils/errorHandler";
import catchAsync from "../middlewares/catchAsyncErrors";
import sendEmail from "../utils/sendEmail";

// Setting up cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Register user => /api/auth/register
const registerUser = catchAsync(async (req, res) => {
  console.log("avatar register", req.body.avatar);
  let result;
  if (req.body.avatar) {
    result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "bookit/avatars",
      width: "150",
      crop: "scale",
    });
  }
  console.log(req.body);

  let { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: result && result.public_id,
      url: result && result.secure_url,
    },
  });
  res.status(201).json({
    success: true,
    message: "Account Created successfully",
    user,
  });
});
// Current user profile => /api/me
const currentUserProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(201).json({
    success: true,
    user,
  });
});
// Update user profile => /api/me/update
const updateProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name;
    user.email = req.body.email;
    if (req.body.password) user.password = req.body.password;

    // Update avatar
    if (req.body.avatar) {
      let result;
      if (req.body.avatar !== "") {
        // checking if user already had uploaded
        if (user.avatar.public_id) {
          const image_id = user.avatar.public_id;
          // Delete previous image
          await cloudinary.v2.uploader.destroy(image_id);
          result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "bookit/avatars",
            width: "150",
            crop: "scale",
          });
        }
        //  else {
        result = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "bookit/avatars",
          width: "150",
          crop: "scale",
        });
        // }

        user.avatar = {
          public_id: result.public_id,
          url: result.secure_url,
        };
      }
    }
  }

  await user.save();

  res.status(201).json({
    success: true,
  });
});

// Forgot Password => /api/password/forgot
const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorHandler(
        `User not found with this email: ${req.body.email}!`,
        404
      )
    );
  }
  // Get reset token
  const resetToken = user.getResetPasswordToken();

  // expiry time is saved to the database
  await user.save({ validateBeforeSave: false });

  // Get origin
  const { origin } = absoluteUrl(req);

  // Create reset password url
  const resetUrl = `${origin}/password/reset/${resetToken}`;
  // message to be sent
  const message = `Your password reset token is as follows : \n\n ${resetUrl} \n\n If you have not requested password reset email, then ignore it.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "BOOKIT PASSWORD RECOVERY",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to : ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password => /api/password/reset/:token
const resetPassword = catchAsync(async (req, res, next) => {
  // Hash Url token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.query.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(`Password Reset Token is Invalid or has expired`, 400)
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler(`Passwords do not match!!`, 400));
  }
  // Set the new passwords
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  res.status(200).json({
    success: true,
    message: "Password Updated Successfully",
  });
});

// Get all users   =>   /api/admin/users
const allAdminUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

export {
  registerUser,
  currentUserProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  allAdminUsers,
};
