import firestore, {firebase} from '@react-native-firebase/firestore';
import {ToastAndroid} from 'react-native';

export const AddNotification = (notificationDetails, localId, id) => {
  let details = notificationDetails;
  details['id'] = id;
  if (localId) {
    firestore()
      .collection('Notifications')
      .doc(localId)
      .set(
        {
          notifications: firebase.firestore.FieldValue.arrayUnion(details),
        },
        {merge: true},
      )
      .then(() => {
        ToastAndroid.show('Added to notification', ToastAndroid.SHORT);
      })
      .catch(err => {
        ToastAndroid.show('something went wrong', ToastAndroid.SHORT);
      });
  }
};

export const HandleNotificationAdd = async (notificationDetails, localId) => {
  let flag = 0;
  let len = 0;
  console.log("before");
  if (localId) {
    console.log('after');
    await firestore()
      .collection('Notifications')
      .doc(localId)
      .get()
      .then(response => {
        const notifications = response.data()?.notifications;
        !!notifications ? (len = notifications.length) : (len = 0);
      })
      .catch(() => {
        console.log('Error occured during adding notification');
        flag = 0;
      });

      console.log('done till here');
    flag
      ? ToastAndroid.show('Already in notification', ToastAndroid.SHORT)
      : AddNotification(notificationDetails, localId, len);
  }

  return;
};


// !!notifications &&
        //   notifications.forEach(item => {
        //     if (item.id === itemDetails.id) {
        //       flag = 1;
        //       return;
        //     }
        //   });