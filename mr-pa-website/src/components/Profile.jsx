import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { User, Upload, Save, Info, AlertCircle, LogOut, Home, Menu, X, Mail, Phone, MapPin, Globe, Briefcase, GraduationCap } from "lucide-react";

const BASE_URL = "https://mr-pa-2-0.onrender.com";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState("");
  const [domain, setDomain] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const navigate = useNavigate();
  const { user, token, login, logout, isLoading, fetchError } = useContext(AuthContext);

  // Compress image before upload
  const compressImage = (file, maxSizeKB = 500, maxWidth = 800) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob.size / 1024 > maxSizeKB) {
                reject(new Error(`Image size exceeds ${maxSizeKB}KB after compression. Please use a smaller image.`));
              } else {
                const compressedReader = new FileReader();
                compressedReader.readAsDataURL(blob);
                compressedReader.onload = () => resolve(compressedReader.result);
                compressedReader.onerror = (err) => reject(err);
              }
            },
            "image/jpeg",
            0.7
          );
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Validate phone number
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+\d{10,15}$/;
    return phone ? phoneRegex.test(phone) : false;
  };

  // Calculate profile completion
  const calculateProfileCompletion = () => {
    const fields = [name, email, phone, userType, domain, bio, location, website, profilePicture];
    const filledFields = fields.filter((field) => field && field.trim() !== "").length;
    console.log("Profile completion:", { fields, filledFields });
    return Math.round((filledFields / fields.length) * 100);
  };

  useEffect(() => {
    if (!token) {
      console.log("Authentication required");
      setError("Authentication required. Please log in.");
      navigate("/signin");
      return;
    }
    if (fetchError) {
      setError(fetchError);
      return;
    }
    if (user && !isLoading) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setUserType(user.userType || "");
      setDomain(user.domain || "");
      setBio(user.bio || "");
      setLocation(user.location || "");
      setWebsite(user.website || "");
      setProfilePicture(user.profilePicture || "");
      setProfileCompletion(calculateProfileCompletion());
      if (!user.name || !user.phone || !user.userType || !user.domain) {
        setIsEditing(true);
        setError("Please complete your profile by providing all required fields: Name, Phone Number, Role, and Specialization.");
      }
    }
  }, [user, token, isLoading, fetchError, navigate]);

  useEffect(() => {
    setProfileCompletion(calculateProfileCompletion());
  }, [name, email, phone, userType, domain, bio, location, website, profilePicture]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Session expired. Please log in again.");
      navigate("/signin");
      return;
    }
    if (!name || !validatePhoneNumber(phone) || !userType || !domain) {
      setError("Required fields: Name, valid Phone Number (e.g., +917410522382), Role, and Specialization.");
      return;
    }
    const requestBody = { name, phone, userType, domain, bio, location, website, profilePicture };
    console.log("Sending POST to /api/auth/complete-profile:", requestBody);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/complete-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      console.log("Response from /api/auth/complete-profile:", data);
      if (response.ok) {
        login(data.token, data.user);
        setSuccess("Profile updated successfully.");
        setError("");
        setShowSaveModal(true);
        setTimeout(() => setShowSaveModal(false), 3000);
        setIsEditing(false);
      } else {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          navigate("/signin");
        } else {
          setError(data.error || "Failed to update profile.");
        }
        setSuccess("");
      }
    } catch (err) {
      setError("Network error or image size too large. Please try a smaller image.");
      setSuccess("");
      console.error("Fetch error:", err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size / 1024 > 5000) {
        setError("Image size exceeds 5MB. Please choose a smaller image.");
        return;
      }
      try {
        const compressedImage = await compressImage(file, 500);
        setProfilePicture(compressedImage);
      } catch (err) {
        setError(err.message || "Failed to process image. Please try another.");
        console.error("Image compression error:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <motion.div
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-zinc-300 text-base font-medium flex items-center space-x-3"
        >
          <div className="w-8 h-8 border-3 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading your profile...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black font-inter flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-zinc-900 border-r border-zinc-700 flex-col shadow-sm">
        <div className="p-6 border-b border-zinc-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white">{name || "User Profile"}</h2>
              <p className="text-sm text-zinc-500">Manage your account</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-3 text-zinc-300 hover:text-white hover:bg-zinc-800 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium"
          >
            <Home size={18} className="text-zinc-300" />
            <span>Home</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate("/signin");
            }}
            className="w-full flex items-center space-x-3 text-zinc-300 hover:text-red-300 hover:bg-zinc-800 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-left"
          >
            <LogOut size={18} className="text-zinc-300" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden fixed left-0 top-0 h-full w-72 bg-zinc-900 z-50 shadow-xl"
            >
              <div className="p-6 border-b border-zinc-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-white">{name || "User Profile"}</h2>
                      <p className="text-sm text-zinc-500">Manage your account</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                  >
                    <X size={18} className="text-zinc-300" />
                  </button>
                </div>
              </div>
              <nav className="p-4 space-y-2">
                <Link
                  to="/"
                  className="flex items-center space-x-3 text-zinc-300 hover:text-white hover:bg-zinc-800 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Home size={18} className="text-zinc-300" />
                  <span>Home</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/signin");
                    setIsSidebarOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 text-zinc-300 hover:text-red-300 hover:bg-zinc-800 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-left"
                >
                  <LogOut size={18} className="text-zinc-300" />
                  <span>Logout</span>
                </button>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-zinc-900 border-b border-zinc-700 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <Menu size={20} className="text-zinc-300" />
          </button>
          <h1 className="font-semibold text-white">Profile Settings</h1>
          <div className="w-8"></div>
        </div>

        <div className="max-w-4xl mx-auto p-6 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 hidden lg:block"
          >
            <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-zinc-300">Manage your personal information and account preferences</p>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-zinc-900 rounded-xl shadow-sm border border-zinc-700 overflow-hidden"
          >
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-6 lg:px-8 py-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-zinc-800">
                    <img
                      src={profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Completion Ring */}
                  <div className="absolute -inset-1">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                      <circle
                        cx="50"
                        cy="50"
                        r="48"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeDasharray={`${profileCompletion * 3.01} 301`}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-center lg:text-left text-white">
                  <h2 className="text-2xl lg:text-3xl font-bold mb-2">{name || "Complete Your Profile"}</h2>
                  <p className="text-zinc-300 mb-3">Profile completion: {profileCompletion}%</p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm">
                    {email && (
                      <div className="flex items-center space-x-1">
                        <Mail size={14} className="text-zinc-300" />
                        <span>{email}</span>
                      </div>
                    )}
                    {phone && (
                      <div className="flex items-center space-x-1">
                        <Phone size={14} className="text-zinc-300" />
                        <span>{phone}</span>
                      </div>
                    )}
                    {location && (
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} className="text-zinc-300" />
                        <span>{location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="px-6 lg:px-8">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-4 bg-zinc-800 border border-zinc-700 rounded-lg flex items-start space-x-3"
                  >
                    <AlertCircle size={20} className="text-zinc-300 mt-0.5 flex-shrink-0" />
                    <p className="text-zinc-300 text-sm">{error}</p>
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-4 bg-green-800 border border-green-700 rounded-lg flex items-start space-x-3"
                  >
                    <Save size={20} className="text-green-300 mt-0.5 flex-shrink-0" />
                    <p className="text-green-300 text-sm">{success}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Form Content */}
            <div className="px-6 lg:px-8 py-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                <motion.button
                  onClick={() => setIsEditing(!isEditing)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isEditing ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700" : "bg-zinc-700 text-white hover:bg-zinc-600"
                  }`}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Profile Picture Upload */}
                {isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-3">Profile Picture</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700">
                        <img
                          src={profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700 transition-colors duration-200"
                        />
                        <p className="text-xs text-zinc-500 mt-1">PNG, JPG up to 5MB. Image will be compressed to 500KB.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Full Name *</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200 bg-zinc-800 text-white"
                        placeholder="Enter your full name"
                        required
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-white">
                        <User size={16} className="text-zinc-500" />
                        <span>{name || "Not provided"}</span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
                    <div className="flex items-center space-x-2 text-zinc-300">
                      <Mail size={16} className="text-zinc-500" />
                      <span>{email || "Not provided"}</span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Phone Number *</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200 bg-zinc-800 text-white"
                        placeholder="+1234567890"
                        required
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-white">
                        <Phone size={16} className="text-zinc-500" />
                        <span>{phone || "Not provided"}</span>
                      </div>
                    )}
                  </div>

                  {/* User Type */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Role *</label>
                    {isEditing ? (
                      <select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        className="w-full px-4 py-3 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200 bg-zinc-800 text-white"
                        required
                      >
                        <option value="">Select your role</option>
                        <option value="student">Student</option>
                        <option value="business">Business Professional</option>
                        <option value="freelancer">Freelancer</option>
                      </select>
                    ) : (
                      <div className="flex items-center space-x-2 text-white">
                        {userType === "student" && <GraduationCap size={16} className="text-zinc-500" />}
                        {userType === "business" && <Briefcase size={16} className="text-zinc-500" />}
                        {userType === "freelancer" && <User size={16} className="text-zinc-500" />}
                        <span className="capitalize">{userType || "Not provided"}</span>
                      </div>
                    )}
                  </div>

                  {/* Domain */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Specialization *</label>
                    {isEditing ? (
                      <select
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="w-full px-4 py-3 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200 bg-zinc-800 text-white"
                        required
                      >
                        <option value="">Select specialization</option>
                        <option value="technology">Technology</option>
                        <option value="education">Education</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="finance">Finance</option>
                        <option value="marketing">Marketing</option>
                        <option value="design">Design</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <div className="flex items-center space-x-2 text-white">
                        <Briefcase size={16} className="text-zinc-500" />
                        <span className="capitalize">{domain || "Not provided"}</span>
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-4 py-3 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200 bg-zinc-800 text-white"
                        placeholder="City, Country"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-white">
                        <MapPin size={16} className="text-zinc-500" />
                        <span>{location || "Not provided"}</span>
                      </div>
                    )}
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Website</label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full px-4 py-3 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200 bg-zinc-800 text-white"
                        placeholder="https://yourwebsite.com"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-white">
                        <Globe size={16} className="text-zinc-500" />
                        {website ? (
                          <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-300 hover:text-white transition-colors duration-200"
                          >
                            {website}
                          </a>
                        ) : (
                          <span>Not provided</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Biography</label>
                  {isEditing ? (
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200 bg-zinc-800 text-white resize-none"
                      placeholder="Tell us about yourself, your experience, and your goals..."
                    />
                  ) : (
                    <div className="text-white leading-relaxed">
                      {bio || <span className="text-zinc-500 italic">No biography provided. Add a bio to tell others about yourself.</span>}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex justify-end space-x-4 pt-6 border-t border-zinc-700">
                    <motion.button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg hover:from-gray-600 hover:to-gray-800 transition-colors duration-200 font-medium flex items-center space-x-2"
                    >
                      <Save size={18} />
                      <span>Save Changes</span>
                    </motion.button>
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Success Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="fixed bottom-4 right-4 bg-green-800 text-green-300 p-3 rounded-lg shadow-lg flex items-center space-x-2 text-sm"
          >
            <Save size={18} />
            <span>Profile updated successfully</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}