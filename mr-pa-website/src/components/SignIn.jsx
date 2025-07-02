import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import botimg from "../lib/mrpa.jpg";

const BASE_URL = "http://localhost:3000";

export default function SignIn() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isProcessingGoogle, setIsProcessingGoogle] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, token } = useContext(AuthContext);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tokenParam = query.get("token");
    const errorParam = query.get("error");
    if (tokenParam && !isProcessingGoogle) {
      setIsProcessingGoogle(true);
      login(tokenParam, {});
    } else if (errorParam) {
      setError(decodeURIComponent(errorParam));
      setIsProcessingGoogle(false);
    }
  }, [location.search, login]);

  useEffect(() => {
    if (isProcessingGoogle && token && user) {
      navigate("/profile", { replace: true });
      setIsProcessingGoogle(false);
    }
  }, [token, user, navigate, isProcessingGoogle]);

  const handleGoogleSignIn = () => {
    window.location.href = `${BASE_URL}/api/auth/google`;
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+\d{10,15}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneSignIn = async (e) => {
    e.preventDefault();
    if (!validatePhoneNumber(emailOrPhone)) {
      setError("Please enter a valid phone number in E.164 format (e.g., +1234567890)");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/auth/phone/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: emailOrPhone }),
      });
      const data = await response.json();
      console.log("Send OTP response:", data);
      if (response.ok) {
        navigate(`/otp-verification?phone=${encodeURIComponent(emailOrPhone)}`);
      } else {
        setError(
          data.error === "Phone number not registered. Please sign up first."
            ? "This phone number is not registered. Please sign up first."
            : data.error || "Failed to send OTP. Please try again."
        );
      }
    } catch (err) {
      console.error("Network error in handlePhoneSignIn:", err);
      setError("Network error. Please check your connection and try again.");
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!emailOrPhone || !password) {
      setError("Please enter both email/phone and password");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone, password }),
      });
      const data = await response.json();
      console.log("Sign-in response:", data);
      if (response.ok) {
        login(data.token, data.user);
        setError("");
        navigate("/profile", { replace: true });
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Network error in handleEmailSignIn:", err);
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
        <h2 className="text-2xl font-bold text-center mb-2 relative z-10">Sign In</h2>
        <p className="text-zinc-400 text-center text-sm mb-6 relative z-10">
          Access your account to unlock AI-powered features
        </p>
        {isProcessingGoogle && (
          <p className="text-blue-400 text-center text-sm mb-4">Processing Google Sign-In...</p>
        )}
        {error && !isProcessingGoogle && (
          <p className="text-red-400 text-center text-sm mb-4">{error}</p>
        )}
        <form
          onSubmit={handleEmailSignIn}
          className="space-y-6 relative z-10"
          autoComplete="off"
          disabled={isProcessingGoogle}
        >
          <div>
            <label htmlFor="emailOrPhone" className="block text-sm font-medium text-zinc-300">
              Email or Phone
            </label>
            <input
              id="emailOrPhone"
              name="nope-emailOrPhone"
              type="text"
              autoComplete="off"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
              disabled={isProcessingGoogle}
              className="w-full mt-1 px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10 disabled:opacity-50"
              placeholder="Enter your email or phone (e.g., +1234567890)"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
              Password
            </label>
            <input
              id="password"
              name="nope-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isProcessingGoogle}
              className="w-full mt-1 px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10 disabled:opacity-50"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={isProcessingGoogle}
            className="w-full bg-white hover:bg-zinc-100 text-black font-semibold rounded-lg py-2 transition-all duration-200 disabled:opacity-50"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={handlePhoneSignIn}
            disabled={isProcessingGoogle}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 transition-all duration-200 mt-2 disabled:opacity-50"
          >
            Sign In with Phone
          </button>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isProcessingGoogle}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg py-2 transition-all duration-200 mt-2 disabled:opacity-50"
          >
            Sign In with Google
          </button>
        </form>
        <p className="text-center text-sm text-zinc-400 mt-6 relative z-10">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}