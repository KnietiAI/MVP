import React, { useEffect, useState } from "react";
import axios from "axios";
import { useWallet } from "../context/WalletContext";

function HomePage() {
  const { account } = useWallet();
  const [coins, setCoins] = useState([]);
  const [globalData, setGlobalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("usd");
  const [symbol, setSymbol] = useState("$");
  const [error, setError] = useState("");

  const currencySymbols = {
    usd: "$",
    inr: "₹",
    eur: "€",
    gbp: "£",
    jpy: "¥",
    aud: "A$",
    cad: "C$",
  };

  // Helper functions for caching
  const getCachedData = (key, expiryMinutes = 10) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { timestamp, data } = JSON.parse(cached);
    const now = new Date().getTime();
    if (now - timestamp < expiryMinutes * 60 * 1000) {
      return data;
    }
    return null;
  };

  const setCachedData = (key, data) => {
    localStorage.setItem(
      key,
      JSON.stringify({ timestamp: new Date().getTime(), data })
    );
  };

  useEffect(() => {
    if (!account) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        setSymbol(currencySymbols[currency] || "$");

        // Check cache for coins and global data
        const coinsCacheKey = `topCoins_${currency}`;
        const globalCacheKey = `globalData_${currency}`;
        const cachedCoins = getCachedData(coinsCacheKey);
        const cachedGlobal = getCachedData(globalCacheKey);

        let coinsData = cachedCoins;
        let global = cachedGlobal;

        if (!cachedCoins || !cachedGlobal) {
          // Fetch from API if cache is empty or expired
          const [coinsRes, globalRes] = await Promise.all([
            axios.get(
              `/api/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=6&page=1&sparkline=true`
            ),
            axios.get("/api/global"),
          ]);

          coinsData = coinsRes.data;
          global = globalRes.data.data;

          // Store in cache
          setCachedData(coinsCacheKey, coinsData);
          setCachedData(globalCacheKey, global);
        }

        setCoins(coinsData);
        setGlobalData(global);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 500);
    return () => clearTimeout(timer);
  }, [currency, account]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mb-4"></div>
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-center">
          <p className="text-red-300 font-semibold mb-2">Failed to Load Data</p>
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
            Crypto Market Dashboard
          </h2>
          <p className="text-gray-400 text-sm">
            Real-time cryptocurrency market data and analytics
          </p>
        </div>
      </div>

      {/* Currency Selector */}
      <div className="flex justify-center mb-8">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="bg-white/10 text-white p-3 rounded-lg border border-white/20 hover:border-yellow-400/50 transition-all backdrop-blur-sm font-semibold"
        >
          {Object.entries(currencySymbols).map(([key, value]) => (
            <option key={key} value={key}>
              {key.toUpperCase()} ({value})
            </option>
          ))}
        </select>
      </div>

      {/* Global Stats */}
      {globalData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all hover:shadow-lg hover:shadow-yellow-400/20">
            <p className="text-gray-400 text-sm font-semibold mb-2">
              Total Market Cap
            </p>
            <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {symbol}
              {(globalData.total_market_cap[currency] / 1e12).toFixed(2)}T
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all hover:shadow-lg hover:shadow-yellow-400/20">
            <p className="text-gray-400 text-sm font-semibold mb-2">
              24h Volume
            </p>
            <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {symbol}
              {(globalData.total_volume[currency] / 1e12).toFixed(2)}T
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all hover:shadow-lg hover:shadow-yellow-400/20">
            <p className="text-gray-400 text-sm font-semibold mb-2">
              BTC Dominance
            </p>
            <p className="text-2xl font-bold text-green-400">
              {globalData.market_cap_percentage.btc.toFixed(2)}%
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all hover:shadow-lg hover:shadow-yellow-400/20">
            <p className="text-gray-400 text-sm font-semibold mb-2">
              ETH Dominance
            </p>
            <p className="text-2xl font-bold text-blue-400">
              {globalData.market_cap_percentage.eth.toFixed(2)}%
            </p>
          </div>
        </div>
      )}

      {/* Top Coins */}
      <h3 className="text-3xl font-bold mb-6 text-white">Top Cryptocurrencies</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/20"
          >
            <div className="flex items-center mb-4">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-12 h-12 mr-4 rounded-full"
              />
              <div>
                <h3 className="text-white font-bold text-lg">{coin.name}</h3>
                <p className="text-gray-400 text-sm uppercase">{coin.symbol}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-300 text-sm">
                <span className="text-gray-400">Price:</span>{" "}
                <span className="font-semibold text-yellow-400">
                  {symbol}
                  {coin.current_price.toLocaleString()}
                </span>
              </p>
              <p className="text-gray-300 text-sm">
                <span className="text-gray-400">Market Cap:</span>{" "}
                <span className="font-semibold text-orange-400">
                  {symbol}
                  {(coin.market_cap / 1e9).toFixed(1)}B
                </span>
              </p>
              <p
                className={`text-sm font-semibold mt-3 ${
                  coin.price_change_percentage_24h >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {coin.price_change_percentage_24h >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}% (24h)
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* News Section */}
      <h3 className="text-3xl font-bold mb-6 text-white">Latest Crypto News</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all hover:shadow-lg hover:shadow-yellow-400/20">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg mb-4 flex items-center justify-center text-xl">
            💰
          </div>
          <h4 className="text-yellow-400 font-bold mb-2 text-lg">Bitcoin Surge</h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            Bitcoin continues to dominate the crypto market with strong institutional adoption and growing mainstream acceptance.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all hover:shadow-lg hover:shadow-yellow-400/20">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg mb-4 flex items-center justify-center text-xl">
            ⚡
          </div>
          <h4 className="text-yellow-400 font-bold mb-2 text-lg">Ethereum 2.0</h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            Ethereum network continues to evolve with major scalability improvements and layer-2 solutions going mainstream.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all hover:shadow-lg hover:shadow-yellow-400/20">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg mb-4 flex items-center justify-center text-xl">
            📜
          </div>
          <h4 className="text-yellow-400 font-bold mb-2 text-lg">Regulations</h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            Governments worldwide are establishing clear frameworks for digital assets, creating a more secure environment.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
