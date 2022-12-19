import firestore from '@react-native-firebase/firestore';
export const handleWishToggle = (
  id,
  images,
  title,
  price,
  description,
  brand,
  category,
  rating,
) => {
  const wishes = firestore().collection('Wishlist_items').add({
    id: id,
    Images: images,
    title: title,
    price: price,
    description: description,
    brand: brand,
    category: category,
    rating: rating,
  });
  wishes.then(sd => {
  });
  wishes.catch(err => {
    console.log('not added to whish list some error occured');
  });
};
