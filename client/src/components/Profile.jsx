import React, { useState, useEffect, useCallback } from "react";
import {
  Edit3,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  BookOpen,
  Award,
  Link as LinkIcon,
  Save,
  X,
  RefreshCw,
  Camera,
  GithubIcon,
  Linkedin,
  Code2,
  Trophy,
  FileText,
  Plus,
  Calendar as CalendarIcon,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    personal: {
      name: "",
      email: "",
      phone: "",
      location: "",
      bio: "",
    },
    education: [],
    experience: [],
    skills: [],
  });
  const [originalData, setOriginalData] = useState(null);

  const fetchProfileData = useCallback(() => {
    if (!user) return;

    setIsLoading(true);
    try {
      const savedProfile = localStorage.getItem(`profile_${user?.username}`);
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfileData(parsedProfile);
        setOriginalData(parsedProfile);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch profile data on component mount
  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [fetchProfileData, user]);

  const handleEdit = () => {
    setOriginalData({ ...profileData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      localStorage.setItem(
        `profile_${user.username}`,
        JSON.stringify(profileData)
      );
      setIsEditing(false);
      setOriginalData(null);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Failed to save profile changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileData(originalData);
    setOriginalData(null);
    toast.success("Changes cancelled");
  };

  const handleChange = (section, value, index = null) => {
    setProfileData((prev) => {
      if (Array.isArray(prev[section]) && index !== null) {
        const newArray = [...prev[section]];
        newArray[index] = { ...newArray[index], ...value };
        return { ...prev, [section]: newArray };
      }
      return { ...prev, [section]: { ...prev[section], ...value } };
    });
  };

  const addListItem = (section, defaultItem) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: [...prev[section], defaultItem],
    }));
  };

  const removeListItem = (section, index) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <div className="flex gap-4">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 ${
                    isSaving ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2 ${
                    isSaving ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {/* Professional Profile Card */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-purple-400 flex items-center justify-center text-3xl font-bold text-white shadow-lg border-4 border-primary-200">
                {profileData.personal.name
                  ? profileData.personal.name[0]
                  : profileData.personal.email
                  ? profileData.personal.email[0]
                  : "U"}
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profileData.personal.name || "Your Name"}
                </div>
                <div className="text-gray-500 dark:text-gray-300 text-sm">
                  {profileData.personal.email || "your@email.com"}
                </div>
                <div className="text-primary-600 dark:text-primary-400 text-xs mt-1 font-semibold">
                  {profileData.personal.location || "Location"}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="inline-block bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-semibold">
                {profileData.personal.role || "Candidate"}
              </span>
              {profileData.personal.github && (
                <a
                  href={profileData.personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 text-sm flex items-center gap-1"
                >
                  <GithubIcon className="w-4 h-4" /> GitHub
                </a>
              )}
              {profileData.personal.linkedin && (
                <a
                  href={profileData.personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 dark:text-blue-400 hover:underline text-sm flex items-center gap-1"
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.personal.name}
                  onChange={(e) =>
                    handleChange("personal", { name: e.target.value })
                  }
                  disabled={!isEditing}
                  className={`w-full p-2 border rounded-lg ${
                    isEditing
                      ? "bg-white dark:bg-gray-700 border-primary-300"
                      : "bg-gray-100 dark:bg-gray-800 border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.personal.email}
                  onChange={(e) =>
                    handleChange("personal", { email: e.target.value })
                  }
                  disabled={!isEditing}
                  className={`w-full p-2 border rounded-lg ${
                    isEditing
                      ? "bg-white dark:bg-gray-700 border-primary-300"
                      : "bg-gray-100 dark:bg-gray-800 border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profileData.personal.phone}
                  onChange={(e) =>
                    handleChange("personal", { phone: e.target.value })
                  }
                  disabled={!isEditing}
                  className={`w-full p-2 border rounded-lg ${
                    isEditing
                      ? "bg-white dark:bg-gray-700 border-primary-300"
                      : "bg-gray-100 dark:bg-gray-800 border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={profileData.personal.location}
                  onChange={(e) =>
                    handleChange("personal", { location: e.target.value })
                  }
                  disabled={!isEditing}
                  className={`w-full p-2 border rounded-lg ${
                    isEditing
                      ? "bg-white dark:bg-gray-700 border-primary-300"
                      : "bg-gray-100 dark:bg-gray-800 border-gray-300"
                  }`}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  value={profileData.personal.bio}
                  onChange={(e) =>
                    handleChange("personal", { bio: e.target.value })
                  }
                  disabled={!isEditing}
                  rows={4}
                  className={`w-full p-2 border rounded-lg ${
                    isEditing
                      ? "bg-white dark:bg-gray-700 border-primary-300"
                      : "bg-gray-100 dark:bg-gray-800 border-gray-300"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Education
            </h2>
            <div className="space-y-4">
              {profileData.education.map((edu, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) =>
                        handleChange(
                          "education",
                          { school: e.target.value },
                          index
                        )
                      }
                      disabled={!isEditing}
                      placeholder="School/University"
                      className={`w-full p-2 border rounded-lg ${
                        isEditing
                          ? "bg-white dark:bg-gray-700 border-primary-300"
                          : "bg-gray-100 dark:bg-gray-800 border-gray-300"
                      }`}
                    />
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) =>
                        handleChange(
                          "education",
                          { degree: e.target.value },
                          index
                        )
                      }
                      disabled={!isEditing}
                      placeholder="Degree"
                      className={`w-full p-2 border rounded-lg ${
                        isEditing
                          ? "bg-white dark:bg-gray-700 border-primary-300"
                          : "bg-gray-100 dark:bg-gray-800 border-gray-300"
                      }`}
                    />
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) =>
                        handleChange(
                          "education",
                          { year: e.target.value },
                          index
                        )
                      }
                      disabled={!isEditing}
                      placeholder="Year"
                      className={`w-full p-2 border rounded-lg ${
                        isEditing
                          ? "bg-white dark:bg-gray-700 border-primary-300"
                          : "bg-gray-100 dark:bg-gray-800 border-gray-300"
                      }`}
                    />
                    {isEditing && (
                      <button
                        onClick={() => removeListItem("education", index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isEditing && (
                <button
                  onClick={() =>
                    addListItem("education", {
                      school: "",
                      degree: "",
                      year: "",
                    })
                  }
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Education
                </button>
              )}
            </div>
          </div>

          {/* Experience Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Experience
            </h2>
            <div className="space-y-4">
              {profileData.experience.map((exp, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) =>
                        handleChange(
                          "experience",
                          { company: e.target.value },
                          index
                        )
                      }
                      disabled={!isEditing}
                      placeholder="Company"
                      className={`w-full p-2 border rounded-lg ${
                        isEditing
                          ? "bg-white dark:bg-gray-700 border-primary-300"
                          : "bg-gray-100 dark:bg-gray-800 border-gray-300"
                      }`}
                    />
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) =>
                        handleChange(
                          "experience",
                          { position: e.target.value },
                          index
                        )
                      }
                      disabled={!isEditing}
                      placeholder="Position"
                      className={`w-full p-2 border rounded-lg ${
                        isEditing
                          ? "bg-white dark:bg-gray-700 border-primary-300"
                          : "bg-gray-100 dark:bg-gray-800 border-gray-300"
                      }`}
                    />
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) =>
                        handleChange(
                          "experience",
                          { duration: e.target.value },
                          index
                        )
                      }
                      disabled={!isEditing}
                      placeholder="Duration"
                      className={`w-full p-2 border rounded-lg ${
                        isEditing
                          ? "bg-white dark:bg-gray-700 border-primary-300"
                          : "bg-gray-100 dark:bg-gray-800 border-gray-300"
                      }`}
                    />
                    <textarea
                      value={exp.description}
                      onChange={(e) =>
                        handleChange(
                          "experience",
                          { description: e.target.value },
                          index
                        )
                      }
                      disabled={!isEditing}
                      placeholder="Description"
                      className={`w-full p-2 border rounded-lg ${
                        isEditing
                          ? "bg-white dark:bg-gray-700 border-primary-300"
                          : "bg-gray-100 dark:bg-gray-800 border-gray-300"
                      }`}
                    />
                    {isEditing && (
                      <button
                        onClick={() => removeListItem("experience", index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isEditing && (
                <button
                  onClick={() =>
                    addListItem("experience", {
                      company: "",
                      position: "",
                      duration: "",
                      description: "",
                    })
                  }
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Experience
                </button>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <div
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                    isEditing
                      ? "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => removeListItem("skills", index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {isEditing && (
                <button
                  onClick={() => {
                    const skill = window.prompt("Enter new skill:");
                    if (skill) {
                      addListItem("skills", skill);
                    }
                  }}
                  className="px-3 py-1 rounded-full text-sm bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Skill
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
