// AuthContext.js
import React, { createContext, useState } from "react";

export const AuthContext = createContext({ authenticated: "" });

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(null);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
