import React, { createContext, useContext, useState, useEffect } from "react";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletType, setWalletType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-detect and reconnect on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const savedWallet = localStorage.getItem("walletType");
        const savedAccount = localStorage.getItem("walletAddress");

        if (savedAccount && savedWallet) {
          const { ethereum } = window;
          if (ethereum) {
            try {
              const accounts = await ethereum.request({
                method: "eth_accounts",
              });
              if (accounts && accounts.length > 0) {
                setAccount(accounts[0]);
                setWalletType(savedWallet);
                const chainIdHex = await ethereum.request({
                  method: "eth_chainId",
                });
                setChainId(parseInt(chainIdHex, 16));
              } else {
                localStorage.removeItem("walletAddress");
                localStorage.removeItem("walletType");
              }
            } catch (err) {
              console.error("Auto-reconnect failed:", err);
            }
          }
        }
      } catch (err) {
        console.error("Wallet check failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkWalletConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    const { ethereum } = window;
    if (!ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        localStorage.setItem("walletAddress", accounts[0]);
      } else {
        setAccount(null);
        setWalletType(null);
        localStorage.removeItem("walletAddress");
        localStorage.removeItem("walletType");
      }
    };

    const handleChainChanged = (chainIdHex) => {
      setChainId(parseInt(chainIdHex, 16));
      localStorage.setItem("chainId", parseInt(chainIdHex, 16).toString());
    };

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  const connectWallet = async (preferredWallet = null) => {
    setIsConnecting(true);
    try {
      const { ethereum } = window;

      if (!ethereum) {
        throw new Error("No Web3 wallet detected");
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        setWalletType(preferredWallet || "MetaMask");
        localStorage.setItem("walletAddress", accounts[0]);
        localStorage.setItem("walletType", preferredWallet || "MetaMask");

        // Get chain ID
        const chainIdHex = await ethereum.request({
          method: "eth_chainId",
        });
        setChainId(parseInt(chainIdHex, 16));
        localStorage.setItem(
          "chainId",
          parseInt(chainIdHex, 16).toString()
        );

        return accounts[0];
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setWalletType(null);
    setChainId(null);
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("walletType");
    localStorage.removeItem("chainId");
    sessionStorage.clear();
  };

  const detectAvailableWallets = () => {
    const { ethereum } = window;
    if (!ethereum) return [];

    const wallets = [];

    // Check for MetaMask
    if (ethereum.isMetaMask) wallets.push("MetaMask");

    // Check for other wallets
    if (ethereum.isTrustWallet) wallets.push("Trust Wallet");
    if (ethereum.isCoinbaseWallet) wallets.push("Coinbase Wallet");
    if (ethereum.isRabby) wallets.push("Rabby Wallet");
    if (ethereum.isBraveWallet) wallets.push("Brave Wallet");
    if (ethereum.isOKExWallet) wallets.push("OKX Wallet");
    if (ethereum.isBinance) wallets.push("Binance Wallet");

    // If no specific wallet detected but ethereum is available, it's an injected wallet
    if (wallets.length === 0 && ethereum) {
      wallets.push("Web3 Wallet");
    }

    return wallets;
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        chainId,
        isConnecting,
        walletType,
        isLoading,
        connectWallet,
        disconnectWallet,
        detectAvailableWallets,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
};
