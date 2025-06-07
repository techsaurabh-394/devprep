const { Profile } = require("../models/Profile");

const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      // Create a default profile if none exists
      profile = new Profile({
        user: req.user._id,
        name: "",
        title: "Software Developer",
        bio: "Tell us about yourself",
        location: "",
        education: "",
        experience: "",
        skills: [],
        email: "",
        achievements: [],
        avatar: "",
      });
      await profile.save();
    }
    res.json(profile);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      name,
      title,
      bio,
      location,
      education,
      experience,
      skills,
      email,
      achievements,
      avatar,
    } = req.body;

    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      // Update existing profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        {
          $set: {
            name,
            title,
            bio,
            location,
            education,
            experience,
            skills,
            email,
            achievements,
            avatar,
            updatedAt: Date.now(),
          },
        },
        { new: true }
      );
    } else {
      // Create new profile
      profile = new Profile({
        user: req.user._id,
        name,
        title,
        bio,
        location,
        education,
        experience,
        skills,
        email,
        achievements,
        avatar,
      });
      await profile.save();
    }

    res.json(profile);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getProfile, createOrUpdateProfile };
