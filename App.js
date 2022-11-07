import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {GlobalStyles} from './AppFiles/Constants/GlobalStyles';
import Card from './AppFiles/Components/UI/Card';
import {Home, Login, SignUp} from './AppFiles/Exporter/index';
import {useEffect, useState} from 'react';
import {ProductDescription} from './AppFiles/Exporter/index';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerMaker = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Home} />
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
  return (
    <NavigationContainer>
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
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Navigation() {
  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
}
const App = () => {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={GlobalStyles.colors.white}
      />
      <Navigation />
    </>
  );
};

export default App;
