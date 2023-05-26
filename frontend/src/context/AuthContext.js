import React, { createContext, useState } from "react";

// Create the AuthContext
const AuthContext = createContext();

// Create a provider component for the AuthContext
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null); // Store the authentication token
  const [user, setUser] = useState(null); // Store the authenticated user object

  // Function to set the token and user when logged in
  const login = (authToken, userData) => {
    setToken(authToken);
    setUser(userData);
  };

  // Function to clear the token and user when logged out
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  // Provide the authentication context to child components
  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
