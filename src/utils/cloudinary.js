import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration of cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

// Method to store file path of local server
const uploadOnCloudinary = async (localFilePath) => {
  try {
    // If file path is not there it will directly return the null
    if (!localFilePath) return null
    // Upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
  })
    // File has been uploaded successfully
    // console.log("File is uploaded on cloudinary", response.url);
    fs.unlinkSync(localFilePath)
    return response;

  } catch (error) {
    //   Remove the locally saved temporary file as the upload operation got failed
    fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

export {uploadOnCloudinary}
