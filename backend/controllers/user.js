import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { sendEmail } from "../middlewares/sendMail.js";
import crypto from "crypto";
import cloudinary from "cloudinary";

export const register = catchAsyncError(async (req, res, next) => {
  const { avatar } = req.body;
  const isExists = await User.findOne({ email: req.body.email });
  if (isExists) {
    return next(new ErrorHandler("User already exists", 400));
  }
  const myCloud = await cloudinary.v2.uploader.upload(avatar, {
    folder: "avatars",
  });
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
  });

  const token = await user.generateToken();

  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    })
    .json({
      success: true,
      user,
      token,
      message: "Registered successfully",
    });
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email })
    .select("+password")
    .populate("posts following followers");
  if (!user) {
    return next(new ErrorHandler("Invalid Credentials", 401));
  }
  const isMatch = await user.passwordCompare(password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid Credentials", 401));
  }
  const token = await user.generateToken();

  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(Date.now() + 90 * 24 * 60 * 1000),
      httpOnly: true,
    })
    .json({
      success: true,
      user,
      message: "Successfully logged in",
      token,
    });
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({ success: true, message: "Logged out" });
});

export const followUser = catchAsyncError(async (req, res, next) => {
  const userToFollow = await User.findById(req.params.id);
  const logged = await User.findById(req.user._id);
  if (!userToFollow) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (logged.following.includes(req.params.id)) {
    const indexFollowing = logged.following.indexOf(req.params.id);
    logged.following.splice(indexFollowing, 1);
    const indexFollowers = userToFollow.followers.indexOf(req.user._id);
    userToFollow.followers.splice(indexFollowers, 1);
    await logged.save();
    await userToFollow.save();
    return res.status(200).json({
      success: true,
      message: "User Unfollowed",
    });
  } else {
    logged.following.push(userToFollow._id);
    userToFollow.followers.push(req.user._id);
    await logged.save();
    await userToFollow.save();
  }
  return res.status(200).json({
    success: true,
    message: "User Followed",
  });
});

export const updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return next(
      new ErrorHandler("Please provide old password and new password", 404)
    );
  }
  const isMatch = await user.passwordCompare(oldPassword);
  if (!isMatch) {
    return next(new ErrorHandler("Incorrect Old Password", 400));
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json({
    success: false,
    message: "Password updated",
  });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const { name, email, avatar } = req.body;
  if (email) {
    user.email = email;
  }
  if (name) user.name = name;
  if (avatar) {
    await cloudinary.v2.uploader.destroy(avatar);
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
    });
    user.avatar.public_id = myCloud.public_id;
    user.avatar.url = myCloud.secure_url;
  }
  await user.save();
  res.status(200).json({
    success: true,
    message: "Profile updated",
  });
});

export const deleteMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  //Getting above user posts id (returns array)
  const posts = user.posts;
  const followers = user.followers;
  const followings = user.following;
  await user.remove();
  //Logout user after deleting profile
  res
    .status(200)
    .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
  await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  for (let i = 0; i < posts.length; i++) {
    //Accessing above array (id) posts
    const userPost = await Post.findById(posts[i]);
    await cloudinary.v2.uploader.destroy(userPost.image.public_id);
    await userPost.remove();
  }
  for (let i = 0; i < followers.length; i++) {
    //Accessing above array (id) posts
    const follower = await User.findById(followers[i]);
    const index = follower.following.indexOf(req.user._id);
    follower.following.splice(index, 1);
    await follower.save();
  }
  for (let i = 0; i < followings.length; i++) {
    //Accessing above array (id) posts
    const follows = await User.findById(followings[i]);
    const index = follows.followers.indexOf(req.user._id);
    follows.followers.splice(index, 1);
    await follows.save();
  }

  const allPost = await Post.find();
  for (let i = 0; i < allPost.length; i++) {
    const post = await Post.findById(post[i]._id);

    for (let j = 0; j < post.comments.length; j++) {
      if (post.comments[j].user === user._id) {
        post.comments.splice(j, 1); //TODO Check git if error
      }
    }
  }
  for (let i = 0; i < allPost.length; i++) {
    const post = await Post.findById(post[i]._id);

    for (let j = 0; j < post.likes.length; j++) {
      if (post.likes[j].user === user._id) {
        post.likes.splice(j, 1); //TODO Check git if error
      }
    }
  }

  res.status(200).json({
    success: true,
    message: "Profile deleted",
  });
});

export const myProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate(
    "posts following followers"
  );
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

export const getMyPosts = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const posts = [];
  for (let i = 0; i < user.posts.length; i++) {
    const post = await Post.findById(user.posts[i]).populate(
      "likes comments.user"
    );
    posts.push(post);
  }
  res.status(200).json({
    success: true,
    posts,
  });
});

export const getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate(
    "posts following followers"
  );
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const user = await User.find({
    name: { $regex: req.query.name, $options: "i" },
  });
  res.status(200).json({
    success: true,
    user,
  });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  console.log("kuch aaya");
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new ErrorHandler("User not found", 404));

  const resetPasswordToken = await user.getResetPasswordToken();
  await user.save();

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetPasswordToken}`;
  const message = `Reset your password by clicking the link below \n\n ${resetUrl}`;
  try {
    await sendEmail({ email: user.email, subject: "Reset Password", message });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    return next(new ErrorHandler(error.message, 500));
  }
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  console.log(req.params.token);
  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return next(new ErrorHandler("Invalid token", 401));

  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();
  res.status(200).json({
    success: true,
    message: `Password updated`,
  });
});

export const getUserPosts = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const posts = [];
  for (let i = 0; i < user.posts.length; i++) {
    const post = await Post.findById(user.posts[i]).populate(
      "likes comments.user"
    );
    posts.unshift(post);
  }
  res.status(200).json({
    success: true,
    posts,
  });
});
