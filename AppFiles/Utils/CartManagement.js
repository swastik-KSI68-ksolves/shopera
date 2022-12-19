import firestore, {firebase} from '@react-native-firebase/firestore';
import {ToastAndroid} from 'react-native';

export const AddItemToCart = (itemDetails, localId, handleReduxCart) => {
  if (localId) {
    firestore()
      .collection('Cart_items')
      .doc(localId)
      .set(
        {
          products: firebase.firestore.FieldValue.arrayUnion(itemDetails),
        },
        {merge: true},
      )
      .then(() => {
        handleReduxCart();
        ToastAndroid.show('Added to cart', ToastAndroid.SHORT);
      })
      .catch(err => {
        ToastAndroid.show('something went wrong', ToastAndroid.SHORT);
      });
  }
};

export const HandleCartButtonClick = async (
  itemDetails,
  localId,
  handleReduxCart,
) => {
  let flag = 0;
  if (localId) {
    await firestore()
      .collection('Cart_items')
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
        console.log('Error occured during add to cart');
        flag = 0;
      });

    flag
      ? ToastAndroid.show(
          'Already in cart, Check your cart',
          ToastAndroid.SHORT,
        )
      : AddItemToCart(itemDetails, localId, handleReduxCart);
  }

  return;
};

export const DeleteCardItems = localId => {
  if (localId) {
    firestore()
      .collection('Cart_items')
      .doc(localId)
      .update({
        products: firebase.firestore.FieldValue.delete(),
      })
      .then(() => {
        ToastAndroid.show('Empty cart', ToastAndroid.SHORT);
      })
      .catch(err => {
        ToastAndroid.show('something went wrong', ToastAndroid.SHORT);
      });
  }
};
