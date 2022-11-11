import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, useEffect, useState} from 'react';

export const AuthContext = createContext({
  token: null,
  userInfo: null,
  isAuthenticated: false,
  appLoaded: false,
  Authenticate: token => {},
  setUserInfo: info => {},
  Logout: () => {},
  SetAppLoaded: () => {},
});

export const AuthContextProvider = ({children}) => {
  const [authToken, setAuthToken] = useState(null);
  const [userInfomation, setUserInfomation] = useState(null);
  const [appLoadedOrNot, SetAppLoadedOrNot] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('authToken');
        let userInfo = await AsyncStorage.getItem('userInfomation');
        if (value !== null) {
          setAuthToken(value);
        }
        if (userInfo !== null) {
          setUserInfomation(userInfo);
        }
      } catch (e) {
        setAuthToken(null);
      }
    };

    getData();
  }, []);

  const Authenticate = authToken => {
    setAuthToken(authToken);
    AsyncStorage.setItem('authToken', authToken);
  };

  const LogOut = () => {
    setAuthToken(null);
    AsyncStorage.removeItem('authToken');
    AsyncStorage.removeItem('userInfomation');
  };

  const setUserInfo = info => {
    const Jsoninfo = JSON.stringify(info);
    setUserInfomation(Jsoninfo);
    AsyncStorage.setItem('userInfomation', Jsoninfo);
  };

  // const UpdateUserInfo = () => {
  //   AsyncStorage.removeItem('userInfomation');
  // };

  const values = {
    token: authToken,
    userInfo: userInfomation,
    isAuthenticated: !!authToken,
    appLoaded: appLoadedOrNot,
    Authenticate: Authenticate,
    setUserInfo: setUserInfo,
    Logout: LogOut,
    SetAppLoaded: SetAppLoadedOrNot,
    // updateUserInfo: UpdateUserInfo,
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
