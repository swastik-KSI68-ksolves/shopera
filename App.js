import {StatusBar, Text} from 'react-native';
import {GlobalStyles} from './AppFiles/Constants/GlobalStyles';
import Card from './AppFiles/Components/UI/Card';
import {Home, Login, SignUp} from './AppFiles/Exporter/index';
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

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerMaker = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
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
      <Stack.Screen
        name="ProductDescription"
        component={ProductDescription}
        options={{
          headerRight: () => (
            <IconButton
              style={{
                backgroundColor: GlobalStyles.colors.PrimaryButtonColor,
                width: 33,
                height: 33,
              }}
              color="white"
              name="log-out"
              size={22}
              onPress={Authctx.Logout}
            />
          ),
        }}
      />
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
