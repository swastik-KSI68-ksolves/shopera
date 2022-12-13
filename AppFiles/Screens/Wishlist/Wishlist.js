import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  Pressable,
  Text,
  FlatList,
  Alert,
  Modal,
  ToastAndroid,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import {H4, H5, H6} from '../../Components/Heading';
import {Card, CartItemDetails, PrimaryButton} from '../../Exporter';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {ReloadCart} from '../../Utils/Reloader';
import {AuthContext} from '../../Store/AuthContext';
import {CheckoutScreen} from '../../Exporter/index';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart} from '../../Store/Redux/Fuctionality/Cart/CartSlice';

const Wishlist = ({navigation}) => {
  const dispatch = useDispatch();
  const {cartItems} = useSelector(store => store.cart);
  const Authctx = useContext(AuthContext);
  const {fontScale} = useWindowDimensions();
  const [productData, setProductData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  let total;
  if (productData.length > 0) {
    total = productData.reduce((sum, product) => {
      return sum + product.price;
    }, 0);
  } else {
    total = 0;
  }

  const onRemoveHandler = async id => {
    const {localId} = JSON.parse(Authctx.userInfo);
    try {
      const response = await firestore()
        .collection('Wish_list_items')
        .doc(localId)
        .get();
      const wishes = response.data().wishes;
      const filteredData = wishes.filter(item => {
        return item.id === id;
      });
      const res = firestore().collection('Wish_list_items').doc(localId);
      res.update({
        wishes: firebase.firestore.FieldValue.arrayRemove(...filteredData),
      });
    } catch (err) {
      ToastAndroid.show('Something Went Wrong', ToastAndroid.SHORT);
    }
    return;
  };

  const moveToCartHandler = async itemDetails => {
    const {localId} = JSON.parse(Authctx.userInfo);
    try {
      const response = await firestore()
        .collection('Wish_list_items')
        .doc(localId)
        .get();
      const wishes = response.data().wishes;
      const filteredData = wishes.filter(item => {
        return item.id === itemDetails.id;
      });

      firestore()
        .collection('Wish_list_items')
        .doc(localId)
        .update({
          wishes: firebase.firestore.FieldValue.arrayRemove(...filteredData),
        });

      firestore()
        .collection('Cart_items')
        .doc(localId)
        .set(
          {
            products: firebase.firestore.FieldValue.arrayUnion(...filteredData),
          },
          {merge: true},
        )
        .then(() => {
          const result = cartItems.find(item => item.id === itemDetails.id);
          if (!result) dispatch(addToCart([itemDetails]));
        })
        .catch(err => {
          ToastAndroid.show('Something Went Wrong', ToastAndroid.SHORT);
        });
    } catch (err) {
      ToastAndroid.show('Something Went Wrong', ToastAndroid.SHORT);
    }
    return;
  };

  const renderCartProducts = itemData => {
    const itemDetailsForRemove = {
      id: itemData.item.id,
      Images: itemData.item.Images,
      title: itemData.item.title,
      price: itemData.item.price,
      description: itemData.item.description,
      brand: itemData.item.brand,
      category: itemData.item.category,
      thumbnail: itemData.item.thumbnail,
      howMany: itemData.item.howMany,
      rating: itemData.item.rating,
      total: 1 * itemData.item.price,
    };
    return (
      <Card
        id={itemData.item.id}
        productDesc={itemData.item.description}
        horizontal={true}
        wishListCard={true}
        productName={itemData.item.title}
        productPrice={itemData.item.price}
        image={itemData.item.thumbnail}
        howMany={itemData.item.howMany}
        onRemoveHandler={onRemoveHandler.bind(this, itemData.item.id)}
        onPressMoveToCart={moveToCartHandler.bind(this, itemDetailsForRemove)}
      />
    );
  };

  useEffect(() => {
    const {localId} = JSON.parse(Authctx.userInfo);
    function onResult(QuerySnapshot) {
      setProductData([]);
      try {
        const wishes = QuerySnapshot.data().wishes;
        wishes.forEach(documentSnapshot => {
          setProductData(oldArray => [...oldArray, documentSnapshot]);
        });
      } catch (err) {
        ToastAndroid.show('Something Went Wrong', ToastAndroid.SHORT);
      }
    }

    function onError(error) {
      Alert.alert('something went wrong');
    }

    firestore()
      .collection('Wish_list_items')
      .doc(localId)
      .onSnapshot(onResult, onError);
  }, []);

  const RenderCartData = () => {
    if (productData.length > 0) {
      return (
        <FlatList
          style={styles.cartItemCards}
          contentContainerStyle={styles.cardItemCardContainer}
          data={productData}
          renderItem={renderCartProducts}
          keyExtractor={item => item.id}
        />
      );
    } else {
      return (
        <Text style={styles.altText}>
          You don't have any item in your wishlist.
        </Text>
      );
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRightContainerStyle: {paddingHorizontal: 20},
      headerTitleAlign: 'center',
      headerTitleStyle: {color: GlobalStyles.colors.PrimaryButtonColor},

      // headerRight: () => (
      //   <>
      //     <Pressable onPress={() => setModalVisible(true)}>
      //       <Icon name="search-outline" color="black" size={fontScale * 25} />
      //     </Pressable>
      //   </>
      // ),
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalView}>
          <View></View>

          <Pressable
            style={[
              styles.button,
              styles.buttonClose,
              {backgroundColor: GlobalStyles.colors.color9},
            ]}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.textStyle}>search</Text>
          </Pressable>
        </View>
      </Modal>
      <RenderCartData />
      {/* <View style={styles.buttonContainer}>
        <PrimaryButton
          onPress={() => navigation.navigate('checkOutScreen')}
          style={styles.buttonSettleNow}>
          SETTLE NOW
        </PrimaryButton>
      </View> */}
    </View>
  );
};

export default Wishlist;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  cartItemCards: {
    flex: 2,
  },
  cardItemCardContainer: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  textContainer: {flex: 1, backgroundColor: 'red'},
  buttonContainer: {
    flex: 0.2,
    justifyContent: 'space-evenly',
    paddingHorizontal: 30,
  },
  cartAndBack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateDetails: {
    alignItems: 'flex-end',
  },
  H3: {
    color: GlobalStyles.colors.color2,
  },
  H6: {
    color: GlobalStyles.colors.color3,
  },
  pressed: {
    opacity: 0.75,
  },
  buttonSettleNow: {
    backgroundColor: GlobalStyles.colors.PrimaryButtonColor,
  },
  altText: {
    color: 'black',
    textAlign: 'center',
  },

  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 15,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

{
  /* <View style={styles.headerContainer}>
        <View>
          <Pressable
            style={({pressed}) => (pressed ? styles.pressed : null)}
            onPress={() =>
              setTimeout(() => {
                navigation.goBack();
              }, 200)
            }>
            <View style={styles.cartAndBack}>
              <Icon
                name="arrow-back"
                color="black"
                size={fontScale * 32}
                onPress={() => navigation.goBack()}
              />
            </View>
          </Pressable>
        </View>
        <View style={styles.rateDetails}>
          {/* <H5 style={styles.H6}>your</H5> */
}
//     <H6 style={styles.H3}>Wishlist</H6>
//   </View>
//   <Pressable
//     style={({pressed}) => (pressed ? styles.pressed : null)}
//     onPress={() =>
//       setTimeout(() => {
//         navigation.goBack();
//       }, 200)
//     }>
//     <View style={styles.cartAndBack}>
//       <Icon
//         name="arrow-back"
//         color="black"
//         size={fontScale * 32}
//         onPress={() => navigation.goBack()}
//       />
//     </View>
//   </Pressable>
// </View> */}
