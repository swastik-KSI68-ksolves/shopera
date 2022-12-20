/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {HandleNotificationAdd} from './AppFiles/Utils/NotificationManager';

const getLocalId = async () => {
  const userInfo = await AsyncStorage.getItem('userInfomation');
  if (userInfo !== null) {
    const {localId} = JSON.parse(userInfo);
    return localId;
  } else {
    console.log('user info is null');
    return undefined;
  }
};

const HandleNotification = async remoteMessage => {
  console.log(remoteMessage);
  const local_id = await getLocalId();
  !!local_id
    ? HandleNotificationAdd(remoteMessage, local_id)
    : console.log('local id not defined');
  // ToastAndroid.showWithGravity(
  //   'You Have New Notification',
  //   ToastAndroid.SHORT,
  //   ToastAndroid.TOP,
  // );
  return;
};

// Registerd background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  await HandleNotification(remoteMessage);
  console.log('Message handled in the background!', remoteMessage);
});


AppRegistry.registerComponent(appName, () => App);
