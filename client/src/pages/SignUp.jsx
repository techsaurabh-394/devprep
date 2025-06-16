import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaGithub } from "react-icons/fa";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        "https://devprep-e6wc.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create an account");
      }
      navigate("/signin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Create your DevPrep account
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Start your interview preparation journey
          </p>
        </div>
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded relative animate-shake">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <InputField
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              icon={<FaUser />}
              placeholder="Username"
              type="text"
            />
            <InputField
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              icon={<FaEnvelope />}
              placeholder="Email address"
              type="email"
            />
            <InputField
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              icon={<FaLock />}
              placeholder="Password"
              type="password"
            />
            <InputField
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={<FaLock />}
              placeholder="Confirm Password"
              type="password"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 shadow-lg disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Create Account"
            )}
          </button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                Or sign up with
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-6">
            <a
              href="/api/auth/google"
              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors text-base"
            >
              <FaGoogle /> Sign up with Google
            </a>
            <a
              href="/api/auth/github"
              className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-black text-white font-bold py-2 px-4 rounded-lg shadow transition-colors text-base"
            >
              <FaGithub /> Sign up with GitHub
            </a>
          </div>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ id, name, value, onChange, icon, placeholder, type }) => (
  <div>
    <label htmlFor={id} className="sr-only">
      {placeholder}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary-500 dark:text-primary-400">
        {icon}
      </div>
      <input
        id={id}
        name={name}
        type={type}
        required
        value={value}
        onChange={onChange}
        className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800"
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default SignUp;
