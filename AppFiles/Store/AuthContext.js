import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';

export const AuthContext = createContext({
  token: null,
  userInfo: null,
  isAuthenticated: false,
  appLoaded: false,
  cartItem: null,
  Authenticate: token => {},
  setUserInfo: info => {},
  Logout: () => {},
  SetAppLoaded: () => {},
  loadCartItems: () => {},
});

export const AuthContextProvider = ({children}) => {
  const [authToken, setAuthToken] = useState(null);
  const [userInfomation, setUserInfomation] = useState(null);
  const [appLoadedOrNot, SetAppLoadedOrNot] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('authToken');
        const userInfo = await AsyncStorage.getItem('userInfomation');
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

  const loadCartItems = async () => {
    await firestore()
      .collection('Cart_items')
      .get()
      .then(querySnapshot => {
        setCartItems(querySnapshot.docs.length);
      });
  };

  // const UpdateUserInfo = () => {
  //   AsyncStorage.removeItem('userInfomation');
  // };

  const values = {
    token: authToken,
    userInfo: userInfomation,
    isAuthenticated: !!authToken,
    appLoaded: appLoadedOrNot,
    cartItem: cartItems,
    Authenticate: Authenticate,
    setUserInfo: setUserInfo,
    Logout: LogOut,
    SetAppLoaded: SetAppLoadedOrNot,
    loadCartItems: loadCartItems,
    // updateUserInfo: UpdateUserInfo,
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
