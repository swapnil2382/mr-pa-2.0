import { useEffect, useState, useContext } from "react";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import ErrorBoundary from "./ErrorBoundary";
import Header from "./components/header";
import Hero from "./components/hero";
import Features from "./components/features";
import Capabilities from "./components/Services";
import ServicesBlog from "./components/capabilities";
import Pricing from "./components/pricing";
import Footer from "./components/footer";
import Chatbot from "./components/chatbot";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import ServicePage from "./components/ServicePage";
import Feedback from "./components/Feedback";
import OtpVerification from "./components/OtpVerification";

function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/signin" replace />;
}

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-black text-white">
              <ErrorBoundary>
                <Header scrollY={scrollY} />
              </ErrorBoundary>
              <main>
                <Hero mousePosition={mousePosition} />
                <Features />
                <ServicesBlog />
                <Capabilities />
                <Pricing />
                <Feedback />
              </main>
              <Footer />
              <Chatbot />
            </div>
          }
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/servicepage/:serviceId"
          element={
            <ProtectedRoute>
              <ServicePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;