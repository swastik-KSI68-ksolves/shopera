import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  Pressable,
  Text,
  FlatList,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import {H3, H4, H5, H6} from '../../Components/Heading';
import {Card, CartItemDetails, PrimaryButton} from '../../Exporter';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {ReloadCart} from '../../Utils/Reloader';
import {AuthContext} from '../../Store/AuthContext';
import {CheckoutScreen} from '../../Exporter/index';
import {useLayoutEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  removeItem,
  increase,
  decrease,
  calculateTotal,
} from '../../Store/Redux/Fuctionality/Cart/CartSlice';

const Cart = ({navigation}) => {
  const dispatch = useDispatch();
  const {cartItems, howMany, total} = useSelector(store => store.cart);
  console.log('len = ', cartItems.length);

  console.log('howMany=', howMany);
  const Authctx = useContext(AuthContext);
  const {fontScale} = useWindowDimensions();
  const [productData, setProductData] = useState([]);

  const onPlusHandler = async id => {
    const {localId} = JSON.parse(Authctx.userInfo);
    try {
      const response = await firestore()
        .collection('Cart_items')
        .doc(localId)
        .get();
      const products = response.data().products;
      const filteredData = products.filter(item => {
        return item.id === id;
      });
      firestore()
        .collection('Cart_items')
        .doc(localId)
        .update({
          products: firebase.firestore.FieldValue.arrayRemove(...filteredData),
        })
        .then(() => {})
        .catch(err => {
          console.log('Error during increase count item for cart');
        });
      filteredData[0].howMany += 1; //incerasing howMany count
      filteredData[0].total = filteredData[0].howMany * filteredData[0].price; //increasing total

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
          dispatch(increase(id));
        })
        .catch(err => {
          console.log('Error during increase count item for cart');
        });
    } catch (err) {
      console.log(err);
    }
    return;
  };

  const onMinusHandler = async (id, howMany) => {
    const {localId} = JSON.parse(Authctx.userInfo);
    if (howMany > 1) {
      try {
        const response = await firestore()
          .collection('Cart_items')
          .doc(localId)
          .get();
        const products = response.data().products;
        const filteredData = products.filter(item => {
          return item.id === id;
        });

        const otherData = products.filter(item => {
          return item.id !== id;
        });

        firestore()
          .collection('Cart_items')
          .doc(localId)
          .update({
            products: firebase.firestore.FieldValue.arrayRemove(
              ...filteredData,
            ),
          })
          .then(() => {})
          .catch(err => {
            console.log('Error during increase count item for cart');
          });

        filteredData[0].howMany -= 1; //decreasing howMany count
        filteredData[0].total = filteredData[0].howMany * filteredData[0].price; //decreasing total

        firestore()
          .collection('Cart_items')
          .doc(localId)
          .set(
            {
              products: firebase.firestore.FieldValue.arrayUnion(
                ...filteredData,
              ),
            },
            {merge: true},
          )
          .then(() => {
            dispatch(decrease(id));
          })
          .catch(err => {
            console.log('Error during increase count item for cart');
          });
      } catch (err) {
        console.log(err);
      }
      return;
    }
    return;
  };

  const onRemoveHandler = async id => {
    const {localId} = JSON.parse(Authctx.userInfo);

    try {
      const response = await firestore()
        .collection('Cart_items')
        .doc(localId)
        .get();
      const products = response.data().products;
      const filteredData = products.filter(item => {
        return item.id === id;
      });

      firestore()
        .collection('Cart_items')
        .doc(localId)
        .update({
          products: firebase.firestore.FieldValue.arrayRemove(...filteredData),
        })
        .then(() => {
          dispatch(removeItem(id));
        })
        .catch(err => {
          console.log('Error during delete item from cart');
        });
    } catch (err) {
      console.log(err);
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
      rating: itemData.item.rating,
      thumbnail: itemData.item.thumbnail,
      howMany: itemData.item.howMany,
    };
    return (
      <Card
        id={itemData.item.id}
        productDesc={itemData.item.description}
        horizontal={true}
        productName={itemData.item.title}
        productPrice={itemData.item.price}
        image={itemData.item.thumbnail}
        howMany={itemData.item.howMany}
        onPressPlus={onPlusHandler.bind(this, itemData.item.id)}
        onPressMinus={onMinusHandler.bind(
          this,
          itemData.item.id,
          itemData.item.howMany,
        )}
        onRemoveHandler={onRemoveHandler.bind(this, itemData.item.id)}
      />
    );
  };

  useEffect(() => {
    setProductData([]);
    try {
      setProductData([]);
      setProductData(cartItems);
      dispatch(calculateTotal());
    } catch (err) {
      console.log(err);
    }
  }, [cartItems, howMany]);

  useEffect(() => {
    dispatch(calculateTotal());
    navigation.setOptions({
      tabBarBadge: howMany,
      tabBarBadgeStyle: {
        backgroundColor: GlobalStyles.colors.color9,
        fontSize: 15,
      },
    });
  }, [cartItems, howMany]);

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
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text style={styles.altText}>
            You don't have any item in your cart
          </Text>
          <PrimaryButton
            onPress={() => navigation.navigate('Home')}
            style={styles.buttonSettleNow}>
            Explore Items
          </PrimaryButton>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
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

        {howMany > 0 ? (
          <View style={styles.buttonContainer}>
            <PrimaryButton
              onPress={() =>
                navigation.navigate('checkOutScreen', {
                  productData: productData,
                  total: total,
                  howMany: howMany,
                })
              }
              style={styles.buttonSettleNow}>
              CHECKOUT- {howMany} ITEMS
            </PrimaryButton>
          </View>
        ) : null}
      </View>
      {howMany > 0 ? (
        <View style={styles.rateDetails}>
          <View>
            <H5 style={styles.H5}>Total ₹{total}</H5>
          </View>
        </View>
      ) : null}
      <RenderCartData />
    </View>
  );
};

export default Cart;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    flex: 0.1,
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
    // flex: 0.4,
    justifyContent: 'space-evenly',
    // paddingHorizontal: 30,
  },
  cartAndBack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateDetails: {
    padding: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'flex-end',
    // flexDirection: 'row',
    alignItems: 'flex-end',
  },
  H6: {
    color: GlobalStyles.colors.color3,
    paddingHorizontal: 10,
  },
  H5: {
    color: GlobalStyles.colors.color2,
    paddingHorizontal: 10,
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
    marginBottom: 15,
  },
});
