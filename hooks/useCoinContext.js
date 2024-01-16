import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

const CoinContext = createContext();

const CoinProvider = ({ children }) => {
  const [coin, setCoin] = useState(0);

  useEffect(() => {
    // Retrieve coin value from SecureStore when the component mounts
    const getStoredCoins = async () => {
      try {
        const storedCoinsString = await SecureStore.getItemAsync("coins");
        if (storedCoinsString) {
          const storedCoins = parseInt(storedCoinsString, 10);
          setCoin(storedCoins);
        }
      } catch (error) {
        console.error("Error fetching coins from SecureStore:", error);
      }
    };

    getStoredCoins();
  }, []);

  const updateAndStoreCoins = async (newCoinValue) => {
    try {
      // Update state
      setCoin(newCoinValue);

      // Store the updated coin value in SecureStore
      await SecureStore.setItemAsync("coins", String(newCoinValue));
    } catch (error) {
      console.error("Error updating and storing coins:", error);
    }
  };

  return (
    <CoinContext.Provider
      value={{
        setCoin: updateAndStoreCoins,
        coin,
      }}
    >
      {children}
    </CoinContext.Provider>
  );
};

export { CoinProvider, CoinContext };
