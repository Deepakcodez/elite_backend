import partnerModel from "../models/painterModel.js";
import jwt from "jsonwebtoken";
import Partner from "../models/partnerModel.js";

// Fixed OTP function
const generateOTP = () => "1234"; // Fixed OTP

// Register Function
export async function register(req, res) {
  try {
    const { mobile, email, password, name } = req.body;

    // Validate input
    if (!name) return res.status(400).send({ error: "Name is required." });
    if (!mobile && !email)
      return res.status(400).send({ error: "Either mobile or email is required." });

    // Check for duplicate mobile or email
    if (mobile) {
      const existingMobile = await partnerModel.findOne({ mobile });
      if (existingMobile)
        return res.status(400).send({ error: "Mobile number already exists." });
    }
    if (email) {
      const existingEmail = await partnerModel.findOne({ email });
      if (existingEmail)
        return res.status(400).send({ error: "Email already exists." });
    }

    // Mobile-based Signup
    if (mobile) {
      const otp = generateOTP();

      // Create a new user with OTP
      const newUser = new partnerModel({
        name,
        mobile,
        otp, // Fixed OTP
        isVerified: false,
      });

      // Mock SMS delivery
      console.log(`Mock SMS: OTP for mobile number ${mobile} is ${otp}`);

      await newUser.save();
      return res
        .status(201)
        .send({ msg: "User registered successfully. OTP is 1234 for testing purposes." });
    }

    // Email-based Signup
    if (email) {
      const newUser = new partnerModel({
        name,
        email,
        password, 
        isVerified: true,
      });

      await newUser.save();
      return res
        .status(201)
        .send({ msg: "User registered successfully with email." });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send({ error: "An error occurred during registration." });
  }
}

// Verify OTP for Mobile Signup
export async function verifyRegisterOTP(req, res) {
  try {
    const { mobile, otp } = req.body;

    const user = await partnerModel.findOne({ mobile });
    if (!user) return res.status(404).send({ error: "User not found." });
    if (user.otp !== otp) return res.status(400).send({ error: "Invalid OTP." });

    user.isVerified = true;
    user.otp = null; 
    await user.save();

    res.status(200).send({ msg: "OTP verified successfully. User registration completed." });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    res.status(500).send({ error: "An error occurred during OTP verification." });
  }
}

// Login Function
export async function login(req, res) {
  try {
    const { mobile, email, password } = req.body;

    if (mobile) {
      const user = await partnerModel.findOne({ mobile });
      if (!user) return res.status(404).send({ error: "User not found." });
      if (!user.isVerified)
        return res.status(400).send({ error: "Mobile number not verified." });

      const otp = generateOTP();
      user.otp = otp;

      console.log(`Mock SMS: OTP for login for mobile number ${mobile} is ${otp}`);

      await user.save();
      return res
        .status(200)
        .send({ msg: "OTP sent. Use 12345 to log in for testing purposes." });
    }

    if (email) {
      const user = await partnerModel.findOne({ email });
      if (!user) return res.status(404).send({ error: "User not found." });
      if (user.password !== password)
        return res.status(400).send({ error: "Invalid password." });

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      return res.status(200).send({ msg: "Login successful.", token });
    }

    return res.status(400).send({ error: "Invalid login method. Provide mobile or email." });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ error: "An error occurred during login." });
  }
}

// Verify OTP for Login
export async function verifyLoginOTP(req, res) {
  try {
    const { mobile, otp } = req.body;

    const user = await partnerModel.findOne({ mobile });
    if (!user) return res.status(404).send({ error: "User not found." });
    if (user.otp !== otp) return res.status(400).send({ error: "Invalid OTP." });

    user.otp = null; 
    await user.save();

    const token = jwt.sign(
      { userId: user._id, mobile: user.mobile },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).send({ msg: "OTP verified successfully. Login successful.", token });
  } catch (error) {
    console.error("Error during OTP verification for login:", error);
    res.status(500).send({ error: "An error occurred during OTP verification for login." });
  }
}


export const signOut = async (req, res) => {
  try {
    res.status(200).json({ msg: "Successfully signed out." });
  } catch (error) {
    res.status(500).json({ msg: "Error during sign out.", error: error.message });
  }
};




// Create Profile
export const createProfile = async (req, res) => {
  try {
    const { name, businessName, gender, phoneNumber } = req.body;

    if (!name) return res.status(400).json({ error: "Name is required." });

    const profile = new Partner({
      name,
      businessName,
      gender,
      phoneNumber,
    });

    await profile.save();
    res.status(201).json({ msg: "Profile created successfully.", profile });
  } catch (error) {
    res.status(500).json({ msg: "Error creating profile", error: error.message });
  }
};


// Get Profile
export const getProfile = async (req, res) => {
  try {
    const profile = await Partner.findById(req.params.id);
    if (!profile) return res.status(404).json({ msg: "Profile not found." });
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching profile", error: error.message });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { name, businessName, gender, phoneNumber } = req.body;

    if (!name && !businessName && !gender && !phoneNumber) {
      return res.status(400).json({ error: "No fields to update." });
    }

    const updates = { name, businessName, gender, phoneNumber };

    const profile = await Partner.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!profile) return res.status(404).json({ msg: "Profile not found." });

    res.status(200).json({ msg: "Profile updated successfully.", profile });
  } catch (error) {
    res.status(500).json({ msg: "Error updating profile", error: error.message });
  }
};



// Get Earnings
export const getEarnings = async (req, res) => {
  try {
    const profile = await Partner.findById(req.params.id);
    if (!profile) return res.status(404).json({ msg: "Profile not found." });
    res.status(200).json({ earnings: profile.earnings });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching earnings", error: error.message });
  }
};

// Update Availability
export const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const profile = await Partner.findByIdAndUpdate(
      req.params.id,
      { availability },
      { new: true }
    );
    if (!profile) return res.status(404).json({ msg: "Profile not found." });
    res.status(200).json({ msg: "Availability updated successfully.", profile });
  } catch (error) {
    res.status(500).json({ msg: "Error updating availability", error: error.message });
  }
};


