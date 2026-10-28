const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  school: { type: String, required: true },
  degree: String,
  field: String,
  startYear: Number,
  endYear: Number, // empty = still studying
});

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },   // e.g. "Frontend Developer"
  company: { type: String, required: true },
  location: String,
  startDate: Date,
  endDate: Date,                             // ignored when current is true
  current: { type: Boolean, default: false },
  description: { type: String, maxlength: 500 },
});

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: {
      type: String,
      required: function () { return this.authProvider !== "google"; },
    },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String, default: null },
    role: {
      type: String,
      enum: ["freelancer", "client"],   // fixed typo: was "eum"
      required: true,
    },
  clientType: {
  type: String,
  enum: ["individual", "company"],
  default: function () {
    return this.role === "client" ? "individual" : undefined;
  },
},
    companyName: {
  type: String,
  trim: true,
  required: function () {
    return this.role === "client" && this.clientType === "company";
  },
},
    skills: [{ type: String }],
    lastOpenedConversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      default: null,
    },

    // ---- profile fields ----
    avatar: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    socialLinks: {
  github: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  portfolio: { type: String, default: "" },
},
    headline: { type: String, maxlength: 100 },
    bio: { type: String, maxlength: 500 },
    location: String,
    website: String,

    // freelancer
    education: [educationSchema],
    experience: [experienceSchema],
  },
  { timestamps: true }
);

userSchema.index({ email: 1, role: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);