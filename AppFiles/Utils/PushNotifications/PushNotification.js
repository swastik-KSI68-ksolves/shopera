import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken();
  }
  return;
}

const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log('old fcm token', fcmToken);
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('new genrated token:', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (err) {
      console.log(err);
    }
  }
  return;
};

// export const NotificationServices=()=>{
//     messaging().onNotificationOpenedApp(remoteMessage => {
//         console.log(
//           'Notification caused app to open from background state:',
//           remoteMessage.notification,
//         );
//         // navigation.navigate(remoteMessage.data.type);
//       });

//        // Check whether an initial notification is available
//     messaging()
//     .getInitialNotification()
//     .then(remoteMessage => {
//       if (remoteMessage) {
//         console.log(
//           'Notification caused app to open from quit state:',
//           remoteMessage.notification,
//         );
//         setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
//       }
//       setLoading(false);
//     });

// }
