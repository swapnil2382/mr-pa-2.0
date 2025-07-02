const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const twilio = require("twilio");
const cors = require("cors");
const app = express();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const googleClient = new OAuth2Client({
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  redirectUri: "http://localhost:3000/api/auth/google/callback",
});
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// MongoDB setup
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/mrpa", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  userType: { type: String },
  domain: { type: String },
  isProfileComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  bio: { type: String },
  location: { type: String },
  website: { type: String },
  profilePicture: { type: String },
});
const User = mongoose.model("User", userSchema);

// OTP Schema
const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 },
});
const OTP = mongoose.model("OTP", otpSchema);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Calculate Profile Completion
const calculateProfileCompletion = (user) => {
  const fields = ['name', 'email', 'phone', 'userType', 'domain', 'bio', 'location', 'website', 'profilePicture'];
  const filledFields = fields.filter(field => user[field] && user[field].trim() !== '').length;
  console.log("Profile completion fields:", { fields, filledFields, user });
  return Math.round((filledFields / fields.length) * 100);
};

// Fetch User Data
app.get("/api/auth/user", verifyToken, async (req, res) => {
  console.log("Received GET /api/auth/user for userId:", req.user.userId);
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      user: {
        name: user.name || user.email,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        domain: user.domain,
        bio: user.bio,
        location: user.location,
        website: user.website,
        profilePicture: user.profilePicture,
        profileCompletion: calculateProfileCompletion(user),
      },
    });
  } catch (err) {
    console.error("Error in /api/auth/user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Fallback: GET for Complete Profile
app.get("/api/auth/complete-profile", verifyToken, async (req, res) => {
  console.log("Received GET /api/auth/complete-profile for userId:", req.user.userId);
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      user: {
        name: user.name || user.email,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        domain: user.domain,
        bio: user.bio,
        location: user.location,
        website: user.website,
        profilePicture: user.profilePicture,
        profileCompletion: calculateProfileCompletion(user),
      },
    });
  } catch (err) {
    console.error("Error in GET /api/auth/complete-profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Complete Profile
app.post("/api/auth/complete-profile", verifyToken, async (req, res) => {
  const { name, phone, userType, domain, bio, location, website, profilePicture } = req.body;
  console.log("Received POST /api/auth/complete-profile with body:", req.body);
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (phone && phone !== user.phone) {
      const existingUser = await User.findOne({ phone });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ error: "Phone number already in use" });
      }
    }
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.userType = userType || user.userType;
    user.domain = domain || user.domain;
    user.bio = bio || user.bio;
    user.location = location || user.location;
    user.website = website || user.website;
    user.profilePicture = profilePicture || user.profilePicture;
    user.isProfileComplete = true;
    await user.save();
    const token = jwt.sign(
      { userId: user._id, name: user.name || user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token,
      user: {
        name: user.name || user.email,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        domain: user.domain,
        bio: user.bio,
        location: user.location,
        website: user.website,
        profilePicture: user.profilePicture,
        profileCompletion: calculateProfileCompletion(user),
      },
    });
  } catch (err) {
    console.error("Error in POST /api/auth/complete-profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Email/Password Sign-In
app.post("/api/auth/signin", async (req, res) => {
  const { emailOrPhone, password } = req.body;
  console.log("Received POST /api/auth/signin with body:", req.body);
  try {
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });
    if (!user || !user.password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: user._id, name: user.name || user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token,
      user: {
        name: user.name || user.email,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        domain: user.domain,
        bio: user.bio,
        location: user.location,
        website: user.website,
        profilePicture: user.profilePicture,
        profileCompletion: calculateProfileCompletion(user),
      },
    });
  } catch (err) {
    console.error("Error in /api/auth/signin:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Email/Password Sign-Up
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, phone, password, userType, domain } = req.body;
  console.log("Received POST /api/auth/signup with body:", req.body);
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }], });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email or phone already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      userType,
      domain,
      isProfileComplete: true,
    });
    await user.save();
    const token = jwt.sign(
      { userId: user._id, name: user.name || user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(201).json({
      token,
      user: {
        name: user.name || user.email,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        domain: user.domain,
        bio: user.bio,
        location: user.location,
        website: user.website,
        profilePicture: user.profilePicture,
        profileCompletion: calculateProfileCompletion(user),
      },
    });
  } catch (err) {
    console.error("Error in /api/auth/signup:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Google Sign-In/Sign-Up
app.get("/api/auth/google", (req, res) => {
  console.log("Received GET /api/auth/google");
  const url = googleClient.generateAuthUrl({
    scope: ["profile", "email"],
    redirect_uri: "http://localhost:3000/api/auth/google/callback",
  });
  res.redirect(url);
});

app.get("/api/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  console.log("Received GET /api/auth/google/callback with code:", code);
  try {
    const { tokens } = await googleClient.getToken({
      code,
      redirect_uri: "http://localhost:3000/api/auth/google/callback",
    });
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = new User({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        isProfileComplete: false,
      });
      await user.save();
    }
    const token = jwt.sign(
      { userId: user._id, name: user.name || user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.redirect(`http://localhost:5173/signin?token=${token}`);
  } catch (err) {
    console.error("Error in /api/auth/google/callback:", err);
    res.redirect("http://localhost:5173/signin?error=Google%20authentication%20failed");
  }
});

// Phone OTP Send
app.post("/api/auth/phone/send-otp", async (req, res) => {
  const { phone } = req.body;
  console.log("Received POST /api/auth/phone/send-otp with body:", req.body);
  try {
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }
    if (!/^\+\d{10,15}$/.test(phone)) {
      return res.status(400).json({ error: "Phone number must be in E.164 format (e.g., +1234567890)" });
    }
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ error: "Phone number not registered. Please sign up first." });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ phone, otp });
    await twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: TWILIO_PHONE_NUMBER,
      to: phone,
    });
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error in /api/auth/phone/send-otp:", err.message, err.stack);
    res.status(500).json({ error: "Failed to send OTP. Please try again." });
  }
});

// Phone OTP Verify
app.post("/api/auth/phone/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  console.log("Received POST /api/auth/phone/verify-otp with body:", req.body);
  try {
    if (!phone || !otp) {
      return res.status(400).json({ error: "Phone number and OTP are required" });
    }
    if (!/^\+\d{10,15}$/.test(phone)) {
      return res.status(400).json({ error: "Phone number must be in E.164 format (e.g., +1234567890)" });
    }
    const otpRecord = await OTP.findOne({ phone, otp });
    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid OTP or OTP expired" });
    }
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    await OTP.deleteOne({ phone, otp });
    const token = jwt.sign(
      { userId: user._id, name: user.name || user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token,
      user: {
        name: user.name || user.email,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        domain: user.domain,
        bio: user.bio,
        location: user.location,
        website: user.website,
        profilePicture: user.profilePicture,
        profileCompletion: calculateProfileCompletion(user),
      },
    });
  } catch (err) {
  console.error("Error in /api/auth/phone/verify-otp:", err);
res.status(500).json({
  type: "boolean",
  default: false
});
}
});;
app.listen(process.env.PORT || 3000, () => console.log(`Server running on port ${process.env.PORT || 3000}`));