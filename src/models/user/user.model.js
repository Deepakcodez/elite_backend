import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      sparse: true, // Allows unique null or undefined values
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows unique null values
      trim: true,
    },
    mobile: {
      type: String,
      unique: true,
      sparse: true, // Allows unique null values
      trim: true,
    },
    password: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin", "partner"],
      default: "user",
    },
    emailOtp: { 
      type: String,
      default: null, 
    },
    address: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  try {
    // Hash password only if it has been modified or is new
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});


const User = mongoose.model("User", userSchema);
export default User;
