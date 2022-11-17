import {StatusBar, Text} from 'react-native';
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
} from './AppFiles/Exporter/index';
import {useContext, useEffect, useState} from 'react';
import {ProductDescription} from './AppFiles/Exporter/index';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import {AuthContextProvider, AuthContext} from './AppFiles/Store/AuthContext';
import {IconButton} from './AppFiles/Components/UI/IconButton';
import Icon from 'react-native-vector-icons/Ionicons';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerMaker = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          drawerItemStyle: {backgroundColor: '#0000000'},
          drawerLabelStyle: {color: 'black'},
          drawerIcon: ({focused, size}) => (
            <Icon
              name="md-home"
              color={focused ? GlobalStyles.colors.PrimaryButtonColor : '#ccc'}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Cart"
        component={Cart}
        options={{
          headerShown: false,
          drawerItemStyle: {backgroundColor: '#0000000'},
          drawerLabelStyle: {color: 'black'},
          drawerIcon: ({focused, size}) => (
            <Icon
              name="cart-outline"
              color={focused ? GlobalStyles.colors.PrimaryButtonColor : '#ccc'}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Wishlist"
        component={Wishlist}
        options={{
          headerRightContainerStyle:{alignItems:"flex-end",paddingRight:5,},
          drawerItemStyle: {backgroundColor: '#0000000'},
          drawerLabelStyle: {color: 'black'},
          drawerIcon: ({focused, size}) => (
            <Icon
              name="heart-outline"
              color={focused ? GlobalStyles.colors.PrimaryButtonColor : '#ccc'}
              size={size}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
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
        name="DrawerMaker"
        component={DrawerMaker}
        options={{headerShown: false}}
      />

      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ProductDescription" component={ProductDescription} />
      <Stack.Screen
        name="userProfile"
        component={UserProfile}
        options={{
          headerTitle: 'User profile',
        }}
      />
      <Stack.Screen name="checkOutScreen" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const Authctx = useContext(AuthContext);
  return (
    <NavigationContainer>
      {!Authctx.isAuthenticated && <AuthStack />}
      {Authctx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}
const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={GlobalStyles.colors.white}
      />
      <AuthContextProvider>
        <Navigation />
      </AuthContextProvider>
    </>
  );
};

export default App;
