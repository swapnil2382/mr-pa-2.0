import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import botimg from "../lib/mrpa.jpg";

const BASE_URL = "http://localhost:3000";

export default function CompleteProfile() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState("");
  const [domain, setDomain] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setUserType(user.userType || "");
      setDomain(user.domain || "");
      setBio(user.bio || "");
      setLocation(user.location || "");
      setWebsite(user.website || "");
      setProfilePicture(user.profilePicture || "");
    }
  }, [user]);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+\d{10,15}$/;
    return phone ? phoneRegex.test(phone) : true; // Phone is optional
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePhoneNumber(phone)) {
      setError("Please enter a valid phone number in E.164 format (e.g., +1234567890)");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/auth/complete-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone, userType, domain, bio, location, website, profilePicture }),
      });
      const data = await response.json();
      console.log("Complete profile response:", data);
      if (response.ok) {
        navigate("/profile");
      } else {
        setError(data.error || "Failed to complete profile");
      }
    } catch (err) {
      console.error("Network error in handleSubmit:", err);
      setError("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md p-8 bg-zinc-950/90 rounded-xl border border-white/10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-50 pointer-events-none" />
        <button
          onClick={() => navigate("/")}
          className="absolute top-0 right-0 w-12 h-12 flex items-center justify-center text-white text-2xl font-bold z-20 bg-zinc-700 hover:bg-zinc-600 rounded-bl-2xl"
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex justify-center mb-8 relative z-10">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center">
              <img src={botimg} alt="Mr. Pa Logo" className="w-[80%] h-[80%] object-cover" />
            </div>
            <span className="font-semibold text-xl text-white">Mr. Pa</span>
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2 relative z-10">Complete Your Profile</h2>
        <p className="text-zinc-400 text-center text-sm mb-6 relative z-10">
          Fill in your details to complete your profile
        </p>
        {error && <p className="text-red-400 text-center text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10" autoComplete="off">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-zinc-300">
              Phone Number (Optional)
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10"
              placeholder="Enter your phone (e.g., +1234567890)"
            />
          </div>
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-zinc-300">
              I am a
            </label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10"
            >
              <option value="" disabled>
                Select user type
              </option>
              <option value="student">Student</option>
              <option value="business">Business</option>
              <option value="freelancer">Freelancer</option>
            </select>
          </div>
          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-zinc-300">
              Domain
            </label>
            <select
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10"
            >
              <option value="" disabled>
                Select domain
              </option>
              <option value="technology">Technology</option>
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-zinc-300">
              Bio (Optional)
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10"
              placeholder="Tell us about yourself"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-zinc-300">
              Location (Optional)
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10"
              placeholder="Enter your location"
            />
          </div>
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-zinc-300">
              Website (Optional)
            </label>
            <input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10"
              placeholder="Enter your website"
            />
          </div>
          <div>
            <label htmlFor="profilePicture" className="block text-sm font-medium text-zinc-300">
              Profile Picture URL (Optional)
            </label>
            <input
              id="profilePicture"
              type="url"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10"
              placeholder="Enter profile picture URL"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white hover:bg-zinc-100 text-black font-semibold rounded-lg py-2 transition-all duration-200"
          >
            Complete Profile
          </button>
        </form>
      </motion.div>
    </div>
  );
}