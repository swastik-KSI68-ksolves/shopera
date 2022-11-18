import firestore, {firebase} from '@react-native-firebase/firestore';
import {ToastAndroid} from 'react-native';

export const AddItemToWishList = async (itemDetails, localId) => {
  if (localId) {
    await firestore()
      .collection('Wish_list_items')
      .doc(localId)
      .set(
        {
          products: firebase.firestore.FieldValue.arrayUnion({
            wishes: itemDetails,
          }),
        },
        {merge: true},
      )
      .then(() => {
        ToastAndroid.show('Added to wishlist', ToastAndroid.SHORT);
      })
      .catch(() => {
        ToastAndroid.show('something went wrong', ToastAndroid.SHORT);
      });
  }
};

export const HandleHeartButtonClick = async (
  itemDetails,
  localId,
  setIsInWishLIst,
) => {
  let flag = 0;
  if (localId) {
    await firestore()
      .collection('Wish_list_items')
      .doc(localId)
      .get()
      .then(res => {
        const products = res.data()?.products;
        !!products &&
          products.forEach(item => {
            if (item.wishes.id === itemDetails.id) {
              setIsInWishLIst(true);
              flag = 1;
              return;
            }
          });
      })
      .catch(() => {
        console.log('Error occured during add to wish list', err);
        flag = 0;
      });
  }
  flag
    ? ToastAndroid.show('already in wishlist', ToastAndroid.SHORT)
    : AddItemToWishList(itemDetails, localId);
  return;
};
