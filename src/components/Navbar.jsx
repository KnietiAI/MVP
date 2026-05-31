import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBitcoin, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { useWallet } from "../context/WalletContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { account, disconnectWallet } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Charts", path: "/exchanges" },
    { name: "Get Recommendations", path: "/recommendations" },
    { name: "News", path: "/news" },
    { name: "About", path: "/about" },
  ];

  const handleDisconnect = () => {
    disconnectWallet();
    navigate("/connect");
    setMenuOpen(false);
  };

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 backdrop-blur-md border-b border-white/10 shadow-2xl p-4 sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
            <FaBitcoin className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent tracking-wide hidden sm:block">
            Crypto Trader
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative text-white font-medium transition-all duration-300 hover:text-yellow-400 ${
                location.pathname === link.path ? "text-yellow-400" : ""
              }`}
            >
              {link.name}
              <span
                className={`absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-400 transition-all duration-300 ${
                  location.pathname === link.path ? "w-full" : "hover:w-full"
                }`}
              ></span>
            </Link>
          ))}
        </div>

        {/* Wallet Info & Disconnect - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {account && (
            <>
              {/* Wallet Address Display */}
              <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-xl border border-white/20 hover:border-yellow-400/50 transition-all">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-sm text-gray-300 font-mono">
                  {truncateAddress(account)}
                </span>
              </div>

              {/* Disconnect Button */}
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-500 hover:to-red-600 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 border border-red-400/30 hover:border-red-400/60 shadow-lg hover:shadow-red-500/50"
              >
                <FaSignOutAlt className="text-lg" />
                <span>Disconnect</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-4">
          {account && (
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg border border-white/20">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs text-gray-300 font-mono">
                {truncateAddress(account)}
              </span>
            </div>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl hover:text-yellow-400 transition-colors"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-white font-medium transition-colors duration-300 hover:text-yellow-400 px-3 py-2 rounded-lg ${
                location.pathname === link.path
                  ? "text-yellow-400 bg-white/10"
                  : "hover:bg-white/5"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {account && (
            <>
              <div className="border-t border-white/10 pt-3 mt-2">
                <p className="text-xs text-gray-400 mb-2">Connected Wallet</p>
                <p className="text-sm text-gray-300 font-mono mb-3">
                  {account}
                </p>
                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-500 hover:to-red-600 rounded-lg font-semibold text-white transition-all duration-300"
                >
                  <FaSignOutAlt />
                  <span>Disconnect Wallet</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
