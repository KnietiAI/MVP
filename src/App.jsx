import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { WalletProvider, useWallet } from "./context/WalletContext";
import Navbar from "./components/Navbar";
import ConnectWallet from "./pages/ConnectWallet";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";
import CryptoDetails from "./pages/CryptoDetails";
import NewsPage from "./pages/NewsPage";
import Exchanges from "./pages/Exchanges";
import Recommendation from "./pages/Recommendation";
import About from "./pages/About";

function ProtectedRoute({ children }) {
  const { account, isLoading } = useWallet();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return <Navigate to="/connect" replace />;
  }

  return children;
}

function AppContent() {
  const { account, isLoading } = useWallet();

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Show only connect wallet page if not connected
  if (!account) {
    return (
      <div className="bg-gray-900 min-h-screen">
        <ConnectWallet />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/connect" element={<Navigate to="/" replace />} />
          <Route
            path="/crypto/:id"
            element={
              <ProtectedRoute>
                <CryptoDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/news"
            element={
              <ProtectedRoute>
                <NewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exchanges"
            element={
              <ProtectedRoute>
                <Exchanges />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <Recommendation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <WalletProvider>
      <Router>
        <AppContent />
      </Router>
    </WalletProvider>
  );
}

export default App;
