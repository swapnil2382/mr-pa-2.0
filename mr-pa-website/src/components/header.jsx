import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import botimg from "../lib/mrpa.jpg";

export default function Header({ scrollY }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "Capabilities", href: "#services" },
    { name: "Services", href: "#what-we-do" },
    { name: "Pre-Book", href: "#pre-booking" },
    { name: "Pricing", href: "#pricing" },
  ];

  const handleLogout = () => {
    logout();
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 10 ? "bg-black/90 backdrop-blur-xl border-b border-zinc-800" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <img src={botimg} alt="Mr. Pa Logo" className="w-[80%] h-[80%] object-cover" />
            </div>
            <span className="font-semibold text-lg text-white">Mr. Pa</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA or Account Menu */}
          <div className="hidden md:block relative">
            {token ? (
              <div className="relative">
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center space-x-2 text-white hover:text-zinc-300 transition-colors duration-200"
                >
                  <User size={20} />
                  <span className="text-sm font-medium">{user?.name || "User"}</span>
                </button>
                {accountMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg py-2"
                  >
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <Button className="bg-white hover:bg-zinc-100 text-black font-semibold px-6 py-2 rounded-lg transition-all duration-200">
                <Link to="/signin">Sign In / Log In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-black/95 backdrop-blur-xl border-t border-zinc-800"
        >
          <div className="px-6 py-6 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block py-2 text-zinc-400 hover:text-white font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            {token ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-white">
                  <User size={20} />
                  <span className="text-sm font-medium">{user?.name || "User"}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full text-left py-2 text-sm text-zinc-300 hover:text-white"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 text-sm text-red-400 hover:text-red-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Button className="w-full bg-white hover:bg-zinc-100 text-black font-semibold rounded-lg mt-4">
                <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                  Sign In / Log In
                </Link>
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}