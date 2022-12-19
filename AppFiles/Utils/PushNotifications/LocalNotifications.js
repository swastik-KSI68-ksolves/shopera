import PushNotification, {Importance} from 'react-native-push-notification';
import {GlobalStyles} from '../../Constants/GlobalStyles';

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
    bigText: orderId == 'err' ? 'Order Failed' : 'Order Placed Succesfully',
    title: orderId == 'err' ? 'Order Failed' : 'Thanks For Purchasing',
    message: orderId == 'err' ? '' : `Your Order Id Is - ${orderId}`,
    playSound: true,
    soundName: 'default',
    importance: 'high',
    vibrate: true,
    vibration: 1000,
    largeIcon: 'ic_launcher',
    color: GlobalStyles.colors.PrimaryButtonColor,
  });
};
