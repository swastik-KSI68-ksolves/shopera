import firestore, {firebase} from '@react-native-firebase/firestore';
import {ToastAndroid} from 'react-native';

export const AddItemToCart = (itemDetails, localId) => {
  if (localId) {
    firestore()
      .collection('Cart_items')
      .doc(localId)
      .set(
        {
          products: firebase.firestore.FieldValue.arrayUnion({
            itemDetails: itemDetails,
          }),
        },
        {merge: true},
      )
      .then(() => {
        ToastAndroid.show('Added to cart', ToastAndroid.SHORT);
      })
      .catch(err => {
        ToastAndroid.show('something went wrong', ToastAndroid.SHORT);
      });
  }
};

export const HandleCartButtonClick = async (itemDetails, localId) => {
  let flag = 0;
  if (localId) {
    await firestore()
      .collection('Cart_items')
      .doc(localId)
      .get()
      .then(response => {
        console.log('respoce', response.data());
        const products = response.data()?.products;
        console.log('pro', products);
        !!products &&
          products.forEach(item => {
            if (item.itemDetails.id === itemDetails.id) {
              console.log('match');
              flag = 1;
              return;
            }
          });
      })
      .catch(() => {
        console.log('Error occured during add to cart');
        flag = 0;
      });

    console.log('flag', flag);
    flag
      ? ToastAndroid.show(
          'Already in cart, Check your cart',
          ToastAndroid.SHORT,
        )
      : AddItemToCart(itemDetails, localId);
    // : ToastAndroid.show('Test', ToastAndroid.SHORT);
  }

  return;
};
