import firestore, {firebase} from '@react-native-firebase/firestore';
import {ToastAndroid} from 'react-native';

export const AddItemToOrder = (itemDetails, localId, total, lengthOfArray) => {
//   const Today = new Date();
//   const orderId = `L${lengthOfArray}T${total}D${Today}`;

  if (localId) {
    firestore()
      .collection('Customer_Orders')
      .doc(localId)
      .set(
        {
          products: firebase.firestore.FieldValue.arrayUnion(itemDetails),
        },
        {merge: true},
      )
      .then(() => {
        ToastAndroid.show('Added to orders', ToastAndroid.SHORT);
      })
      .catch(err => {
        ToastAndroid.show('something went wrong', ToastAndroid.SHORT);
      });
  }
};

export const HandleOrderAdd = async (itemDetails, localId, total) => {
  let flag = 0;
  const lengthOfArray = itemDetails.length;
  if (localId) {
    await firestore()
      .collection('Customer_Orders')
      .doc(localId)
      .get()
      .then(response => {
        const products = response.data()?.products;
        !!products &&
          products.forEach(item => {
            if (item.id === itemDetails.id) {
              flag = 1;
              return;
            }
          });
      })
      .catch(() => {
        console.log('Error occured during add to orders');
        flag = 0;
      });

    flag
      ? ToastAndroid.show(
          'Already ordered, Check your orders',
          ToastAndroid.SHORT,
        )
      : //   : AddItemToOrder(itemDetails, localId, total);
        itemDetails.map(item =>
          AddItemToOrder(item, localId, total, lengthOfArray),
        );
  }

  return;
};
