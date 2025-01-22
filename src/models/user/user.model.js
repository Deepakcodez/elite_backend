import mongoose from "mongoose";
<<<<<<< HEAD
=======
import bcrypt from "bcrypt";
>>>>>>> Shubham

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
<<<<<<< HEAD
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
=======
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows unique or null values
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true, // Allows unique or null values
      trim: true,
    },
    password: {
      type: String,
>>>>>>> Shubham
      required: true,
    },
    role: {
      type: String,
      required: true,
<<<<<<< HEAD
      enum: ["user", "admin","partner"],
      default: "user",
    },
    // will expand later
    address: {
      type: String,
      required: true,
    },
    
    
=======
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
>>>>>>> Shubham
  },
  { timestamps: true }
);

<<<<<<< HEAD
export default mongoose.model("User", userSchema);
=======
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
>>>>>>> Shubham
