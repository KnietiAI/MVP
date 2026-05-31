import React, { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import { FaBitcoin, FaSpinner } from "react-icons/fa";

function ConnectWallet() {
  const {
    connectWallet,
    isConnecting,
    detectAvailableWallets,
  } = useWallet();
  const [availableWallets, setAvailableWallets] = useState([]);
  const [error, setError] = useState("");
  const [selectedWallet, setSelectedWallet] = useState(null);

  useEffect(() => {
    const wallets = detectAvailableWallets();
    setAvailableWallets(wallets);
  }, [detectAvailableWallets]);

  const handleConnect = async (walletName) => {
    try {
      setError("");
      setSelectedWallet(walletName);
      await connectWallet(walletName);
    } catch (err) {
      setError(err.message || "Failed to connect wallet");
      setSelectedWallet(null);
    }
  };

  const walletLogos = {
    MetaMask: "🦊",
    "Trust Wallet": "🦁",
    "Coinbase Wallet": "🏦",
    "Rabby Wallet": "🐰",
    "Brave Wallet": "🦁",
    "OKX Wallet": "🪙",
    "Binance Wallet": "📊",
    "Web3 Wallet": "🔐",
  };

  const walletColors = {
    MetaMask: "from-orange-500 to-red-500",
    "Trust Wallet": "from-blue-500 to-cyan-500",
    "Coinbase Wallet": "from-blue-600 to-blue-400",
    "Rabby Wallet": "from-purple-500 to-pink-500",
    "Brave Wallet": "from-orange-400 to-yellow-400",
    "OKX Wallet": "from-black to-gray-700",
    "Binance Wallet": "from-yellow-400 to-yellow-500",
    "Web3 Wallet": "from-purple-600 to-blue-600",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-8">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main container */}
      <div className="w-full max-w-md relative z-10">
        {/* Card with glassmorphism effect */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <FaBitcoin className="text-white text-4xl" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
              Crypto Trader
            </h1>
            <p className="text-gray-300 text-sm">
              Connect your wallet to access premium crypto trading
            </p>
          </div>

          {/* Connection status */}
          <div className="mb-8">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-gray-400 text-center text-sm">
                {availableWallets.length > 0
                  ? `${availableWallets.length} wallet(s) detected`
                  : "Detecting wallets..."}
              </p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Wallet buttons */}
          <div className="space-y-3 mb-6">
            {availableWallets.length > 0 ? (
              availableWallets.map((wallet) => (
                <button
                  key={wallet}
                  onClick={() => handleConnect(wallet)}
                  disabled={isConnecting}
                  className={`w-full py-4 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    selectedWallet === wallet && isConnecting
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/50"
                      : `bg-gradient-to-r ${walletColors[wallet]} hover:shadow-lg hover:shadow-yellow-400/30 border border-white/10`
                  } disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
                >
                  {selectedWallet === wallet && isConnecting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">
                        {walletLogos[wallet] || "🔐"}
                      </span>
                      <span>
                        Connect {wallet}
                      </span>
                    </>
                  )}
                </button>
              ))
            ) : (
              <div className="text-center py-8">
                <FaSpinner className="animate-spin text-yellow-400 text-3xl mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Detecting wallets...</p>
              </div>
            )}
          </div>

          {/* Install wallet info */}
          {availableWallets.length === 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
              <p className="text-yellow-300 text-sm text-center">
                No wallet detected. Install MetaMask, Trust Wallet, or any EVM-compatible wallet.
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center pt-6 border-t border-white/10">
            <p className="text-gray-400 text-xs">
              Your wallet address and transactions are secure and private.
            </p>
          </div>
        </div>

        {/* Floating cards (decorative) */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl opacity-10 blur-2xl"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl opacity-10 blur-2xl"></div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default ConnectWallet;
