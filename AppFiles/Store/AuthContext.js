import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
  token: null,
  isAuthenticated: false,
  Authenticate: (token) => {},
  Logout: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("authToken");
        if (value !== null) {
          setAuthToken(value);
        }
      } catch (e) {
        setAuthToken(null);
      }
    };

    getData();
  }, []);

  const Authenticate = (authToken) => {
    setAuthToken(authToken);
    AsyncStorage.setItem("authToken", authToken);
  };

  const LogOut = () => {
    setAuthToken(null);
    AsyncStorage.removeItem('authToken');
  };

  const values = {
    token: authToken,
    isAuthenticated: !!authToken,
    Authenticate: Authenticate,
    Logout: LogOut,
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
