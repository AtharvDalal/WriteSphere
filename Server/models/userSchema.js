import mongoose from "mongoose";
import validator from "validator";


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Name Must Contain At least 3 Charachter"],
    maxLength: [32, "Name Must Contain At least 32 Charachter"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please Provide Valid Email address"],
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password Must Contain At least 8 Charachter"],
    maxLength: [32, "Password Cannot exceed 32 Charachter"],
  },
  role: {
    type: String,
    required: true,
    enum: ["Reader", "Author"],
  },
  phone: {
    type: Number,
    required: true,
  },
  avatar: {
    public_id: {
      type: String,
    },
  },
  education: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("User", UserSchema);
