import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //   Get user details from frontend
  // Validation of incompleteness(not empty) or format of data
  // Check if user already exist: username,email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response

  //Step 1:Get user details from frontend
  const { fullname, email, username, password } = req.body;
  console.log("email:", email);

  // Validating user
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exist: username,email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email and username already exists");
  }
  console.log(req.files);

  // check for images,coverImage check for avatar
  // multer provides .files method to pass data
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // Check the image or cover image has been uploaded or not
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // upload images on cloudinary imported from the cloudinary.js
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Create a database and set the entry
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    // CoverImage is not checked as it is not compulsory so if coverImage is present give the url else leave it empty
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  // Check the user with id provided by mongodb itself
  // findById is a method to select the user with their id created by mongoDb
  // .select is a method which allow to select the categories.
  // By default all the categories are selected so those which are written with "-" sign are deselect manually
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // Check the user is created or not
  if (!createdUser) {
    throw new ApiError(500, "Something wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered succesfully"));
});

export { registerUser };
