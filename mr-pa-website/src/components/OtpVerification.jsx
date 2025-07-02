import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import botimg from "../lib/mrpa.jpg";

const BASE_URL = "http://localhost:3000";

export default function OtpVerification() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const query = new URLSearchParams(location.search);
  const phone = query.get("phone");

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/auth/phone/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.token, data.user);
        setError("");
        navigate("/profile");
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  const resendOtp = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/phone/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (response.ok) {
        setError("");
        alert("OTP resent successfully");
      } else {
        setError(data.error || "Failed to resend OTP");
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
        className="w-full max-w-md p-8 bg-zinc-950/90 rounded-xl border border-white/10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-50 pointer-events-none" />
        <button
          onClick={() => navigate("/signin")}
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
        <h2 className="text-2xl font-bold text-center mb-2 relative z-10">Verify OTP</h2>
        <p className="text-zinc-400 text-center text-sm mb-6 relative z-10">
          Enter the OTP sent to {phone}
        </p>
        {error && <p className="text-red-400 text-center text-sm mb-4">{error}</p>}
        <form onSubmit={verifyOtp} className="space-y-6 relative z-10" autoComplete="off">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-zinc-300">
              OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10"
              placeholder="Enter OTP"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white hover:bg-zinc-100 text-black font-semibold rounded-lg py-2 transition-all duration-200"
          >
            Verify OTP
          </button>
          <button
            type="button"
            onClick={resendOtp}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 transition-all duration-200 mt-2"
          >
            Resend OTP
          </button>
        </form>
        <p className="text-center text-sm text-zinc-400 mt-6 relative z-10">
          Back to{" "}
          <Link to="/signin" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}