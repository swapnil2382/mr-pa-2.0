import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import botimg from "../lib/mrpa.jpg";

const BASE_URL = "http://localhost:3000";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const error = query.get("error");
    if (token) {
      login(token, {});
      navigate("/profile");
    } else if (error) {
      setError(decodeURIComponent(error));
    }
  }, [location, login, navigate]);

  const handleGoogleSignUp = () => {
    window.location.href = `${BASE_URL}/api/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password || !confirmPassword || !userType || !domain) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, userType, domain }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.token, data.user);
        setError("");
        navigate("/profile");
      } else {
        setError(data.error || "Sign-up failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md p-8 bg-zinc-950/95 rounded-xl border border-white/10 shadow-2xl relative overflow-hidden pointer-events-auto"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-50 pointer-events-none" />
        <button
          onClick={() => navigate("/")}
          className="absolute top-0 right-0 w-12 h-12 flex items-center justify-center text-white text-2xl font-bold z-20 bg-zinc-700 hover:bg-zinc-600 rounded-bl-2xl"
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center space-x-3 pointer-events-auto">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center">
              <img src={botimg} alt="Mr. Pa Logo" className="w-[80%] h-[80%] object-cover" />
            </div>
            <span className="font-semibold text-2xl text-white">Mr. Pa</span>
          </Link>
        </div>
        <h2 className="text-3xl font-bold text-center mb-3">Sign Up</h2>
        <p className="text-zinc-400 text-center text-sm mb-8">
          Create your account to unlock AI-powered features
        </p>
        {error && <p className="text-red-400 text-center text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6 pointer-events-auto">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10 placeholder-zinc-500 text-sm pointer-events-auto"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10 placeholder-zinc-500 text-sm pointer-events-auto"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-1">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10 placeholder-zinc-500 text-sm pointer-events-auto"
              placeholder="Enter your phone number (e.g., +1234567890)"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10 placeholder-zinc-500 text-sm pointer-events-auto"
              placeholder="Enter your password"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10 placeholder-zinc-500 text-sm pointer-events-auto"
              placeholder="Confirm your password"
            />
          </div>
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-zinc-300 mb-1">
              I am a
            </label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
              className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10 text-sm pointer-events-auto"
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
            <label htmlFor="domain" className="block text-sm font-medium text-zinc-300 mb-1">
              Domain
            </label>
            <select
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
              className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10 text-sm pointer-events-auto"
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
          <Button
            type="submit"
            className="w-full bg-white hover:bg-zinc-100 text-black font-semibold rounded-lg py-3 transition-all duration-200 text-sm pointer-events-auto"
            disabled={!name || !email || !phone || !password || !confirmPassword || !userType || !domain}
          >
            Sign Up
          </Button>
          <Button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg py-3 transition-all duration-200 text-sm pointer-events-auto mt-2"
          >
            Sign Up with Google
          </Button>
        </form>
        <p className="text-center text-sm text-zinc-400 mt-6">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-400 hover:text-blue-300 font-medium pointer-events-auto">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}