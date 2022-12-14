import PushNotification, {Importance} from 'react-native-push-notification';
import { GlobalStyles } from '../../Constants/GlobalStyles';

PushNotification.configure({
  onNotification: notification => {
    console.log('Local Notification', notification);
  },
  popInitialNotification: true,
  requestPermissions: true,
});

PushNotification.createChannel(
  {
    channelId: 'channel-id',
    channelName: 'my-name',
    channelDescription: 'A channel for notification',
    playSound: true,
    soundName: 'default',
    importance: Importance.HIGH,
    vibrate: true,
    vibration: 1000,
  },
  created => console.log(`createChannel returned '${created}'`),
);

export const DisplayNotification = orderId => {
  PushNotification.localNotification({
    channelId: 'channel-id',
    channelName: 'my-channel',
    autoCancel: true,
    bigText: 'Order Placed Succesfully',
    title: 'Order Placed Succesfully',
    message: `your order id is - ${orderId}`,
    playSound: true,
    soundName: 'default',
    importance: 'high',
    vibrate: true,
    vibration: 1000,
    largeIcon: "ic_launcher", 
    color:GlobalStyles.colors.PrimaryButtonColor
  });
};
