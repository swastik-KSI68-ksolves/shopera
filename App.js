import {Alert, Pressable, StatusBar, Text} from 'react-native';
import {GlobalStyles} from './AppFiles/Constants/GlobalStyles';
import Card from './AppFiles/Components/UI/Card';
import {
  Home,
  Login,
  SignUp,
  UserProfile,
  Cart,
  Wishlist,
  CustomDrawerContent,
  CheckoutScreen,
  CategoryScreen,
  IndivisualCategory,
  ChooseScreen,
  MyOrders,
  OnboardingScreen,
} from './AppFiles/Exporter/index';
import {useContext, useEffect, useState} from 'react';
import {ProductDescription} from './AppFiles/Exporter/index';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import {AuthContextProvider, AuthContext} from './AppFiles/Store/AuthContext';
import {IconButton} from './AppFiles/Components/UI/IconButton';
import Icon from 'react-native-vector-icons/Ionicons';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {myStore} from './AppFiles/Store/Redux/Store';
import firestore, {firebase} from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import LoadingOverlay from './AppFiles/Components/UI/LoadingOverlay';
import { requestUserPermission } from './AppFiles/Utils/PushNotifications/PushNotification';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: GlobalStyles.colors.color4,
          width: '100%',
          height: '7%',
        },
        tabBarActiveTintColor: GlobalStyles.colors.PrimaryButtonColor,
        tabBarInactiveTintColor: GlobalStyles.colors.color1,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon name="md-home" color={color} size={size * 1.1} />
          ),
        }}
      />
      <Tab.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: ({color, size}) => (
            <Icon name="grid-outline" color={color} size={size * 1.1} />
          ),
        }}
      />
      <Tab.Screen
        name="Wishlist"
        component={Wishlist}
        options={{
          tabBarLabel: 'Wishlist',
          tabBarIcon: ({color, size}) => (
            <Icon name="heart" color={color} size={size * 1.1} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          headerShown: false,
          tabBarLabel: 'Cart',
          tabBarIcon: ({color, size}) => (
            <Icon name="cart-outline" color={color} size={size * 1.1} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// const DrawerMaker = () => {
//   return (
//     <Drawer.Navigator
//       drawerContent={props => <CustomDrawerContent {...props} />}
//       initialRouteName="Home">
//       <Drawer.Screen
//         name="Home"
//         component={Home}
//         options={{
//           headerShown: false,
//           drawerItemStyle: {backgroundColor: '#0000000'},
//           drawerLabelStyle: {color: 'black'},
//           drawerIcon: ({focused, size}) => (
//             <Icon
//               name="md-home"
//               color={focused ? GlobalStyles.colors.PrimaryButtonColor : '#ccc'}
//               size={size}
//             />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Cart"
//         component={Cart}
//         options={{
//           headerShown: false,
//           drawerItemStyle: {backgroundColor: '#0000000'},
//           drawerLabelStyle: {color: 'black'},
//           drawerIcon: ({focused, size}) => (
//             <Icon
//               name="cart-outline"
//               color={focused ? GlobalStyles.colors.PrimaryButtonColor : '#ccc'}
//               size={size}
//             />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Wishlist"
//         component={Wishlist}
//         options={{
//           headerRightContainerStyle: {alignItems: 'flex-end', paddingRight: 5},
//           drawerItemStyle: {backgroundColor: '#0000000'},
//           drawerLabelStyle: {color: 'black'},
//           drawerIcon: ({focused, size}) => (
//             <Icon
//               name="heart-outline"
//               color={focused ? GlobalStyles.colors.PrimaryButtonColor : '#ccc'}
//               size={size}
//             />
//           ),
//         }}
//       />
//     </Drawer.Navigator>
//   );
// };

function AuthStack({firstLaunch}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {firstLaunch ? (
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      ) : null}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={SignUp} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const Authctx = useContext(AuthContext);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="DrawerMaker"
        component={DrawerMaker}
        options={{
          headerShown: false,
          // tabBarItemStyle: {display: 'none'},
        }}
      /> */}
      {/* <Stack.Screen name="Home" component={Home} /> */}
      <Stack.Screen name="ProductDescription" component={ProductDescription} />
      <Stack.Screen
        name="userProfile"
        component={UserProfile}
        options={{
          headerTitle: 'User profile',
        }}
      />
      <Stack.Screen
        name="chooseScreen"
        component={ChooseScreen}
        options={{
          headerTitle: 'Your Profile',
        }}
      />
      <Stack.Screen
        name="myOrders"
        component={MyOrders}
        options={{
          headerTitle: 'Your Orders',
        }}
      />
      <Stack.Screen name="checkOutScreen" component={CheckoutScreen} />
      <Stack.Screen name="IndivisualCategory" component={IndivisualCategory} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const Authctx = useContext(AuthContext);
  const [isFirstLaunch, setIsFirstLauch] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value === null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLauch(true);
      } else {
        setIsFirstLauch(false);
      }
    });
  }, []);

  if (isAuthenticating) {
    setTimeout(() => {
      setIsAuthenticating(false);
    }, 1000);
  }

  if (isFirstLaunch === null) {
    return null;
  } else if (isFirstLaunch === true) {
    if (isAuthenticating) {
      return <LoadingOverlay message="" />;
    }
    if (!Authctx.isAuthenticated) return <AuthStack firstLaunch={true} />;
  } else {
    if (isAuthenticating) {
      return <LoadingOverlay message="" />;
    }
    if (!Authctx.isAuthenticated) return <AuthStack firstLaunch={false} />;
    if (Authctx.isAuthenticated) return <AuthenticatedStack />;
  }
}
const App = () => {
  // const {cartItems} = useSelector(store => store.cart);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(calculateCartCount());
  // }, [cartItems]);

  useEffect(() => {
    requestUserPermission()
  }, [])
  


  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('new message arrived!', JSON.stringify(remoteMessage.notification.title));
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={GlobalStyles.colors.white}
      />
      <Provider store={myStore}>
        <AuthContextProvider>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </AuthContextProvider>
      </Provider>
    </>
  );
};

export default App;
