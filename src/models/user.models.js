import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)


// This all method encrypt the password from the normal strings
userSchema.pre("save", async function (next) {
  // If password is not modified then it will directly return the next instead of running again.
  if(!this.isModified("password")) return next();
  // If password is modified then it will run only.
  //This .hash() method is being used for encrypting the password
  this.password = await bcrypt.hash(this.password, 10)
  next()
});

// It will check the password coming from userSchema is simmilar to that of exporting User
userSchema.methods.isPasswordCorrect = async function(password){
  // Compare method compare the encrypted password and password coming from the user and return it in boolean value.
  // As it takes time to compare it will be awaited
  return await bcrypt.compare(password, this.password)
};

// This method used to generate access token
userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          email: this.email,
          username: this.username,
          fullName: this.fullName
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
  )
}

// This method used to generate refresh token
userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
  )
}

export const User = mongoose.model("User", userSchema)