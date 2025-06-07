const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  education: [
    {
      school: String,
      degree: String,
      field: String,
      startYear: Number,
      endYear: Number,
      description: String,
    },
  ],
  experience: [
    {
      company: String,
      position: String,
      startDate: Date,
      endDate: Date,
      current: Boolean,
      description: String,
    },
  ],
  skills: {
    type: [String],
    default: [],
  },
  email: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  socialLinks: {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    leetcode: { type: String, default: "" },
    hackerrank: { type: String, default: "" },
    portfolio: { type: String, default: "" },
  },
  certifications: [
    {
      name: String,
      issuer: String,
      issueDate: Date,
      expiryDate: Date,
      credentialId: String,
      credentialUrl: String,
    },
  ],
  projects: [
    {
      title: String,
      description: String,
      technologies: [String],
      liveUrl: String,
      githubUrl: String,
      startDate: Date,
      endDate: Date,
    },
  ],
  achievements: {
    type: [String],
    default: [],
  },
  resume: {
    url: String,
    lastUpdated: Date,
  },
  avatar: {
    type: String,
    default: "", // Will store URL of the avatar
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

profileSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = { Profile };
