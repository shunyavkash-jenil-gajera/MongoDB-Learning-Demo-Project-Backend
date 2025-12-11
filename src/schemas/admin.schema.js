import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Access_Token_Expiry, Access_Token_Secret, Refresh_Token_Expiry, Refresh_Token_Secret } from "../config/enverment.js";
dotenv.config();


export const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    mobileNumber: {
      type: Number,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "seller", "user"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

User.prototype.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

User.prototype.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    Access_Token_Secret,
    {
      expiresIn: Access_Token_Expiry,
    }
  );
};

User.prototype.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    Refresh_Token_Secret,
    {
      expiresIn: Refresh_Token_Expiry,
    }
  );
};
