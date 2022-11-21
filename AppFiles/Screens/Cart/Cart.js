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

const Cart = ({navigation}) => {
  const Authctx = useContext(AuthContext);
  const {fontScale} = useWindowDimensions();
  const [productData, setProductData] = useState([]);

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
        .collection('Cart_items')
        .doc(localId)
        .get();
      const products = response.data().products;
      const filteredData = products.filter(item => {
        return item.id === id;
      });
      const res = firestore().collection('Cart_items').doc(localId)
      res.update({
        products: firebase.firestore.FieldValue.arrayRemove(...filteredData),
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
        onRemoveHandler={onRemoveHandler.bind(this, itemData.item.id)}
      />
    );
  };

  useEffect(() => {
    const {localId} = JSON.parse(Authctx.userInfo);
    function onResult(QuerySnapshot) {
      setProductData([]);
      try {
        const products = QuerySnapshot.data().products;
        products.forEach(documentSnapshot => {
          setProductData(oldArray => [...oldArray, documentSnapshot]);
        });
      } catch (err) {
        console.log(err);
      }
    }

    function onError(error) {
      console.error(error);
      Alert.alert('something went wrong');
    }

    firestore()
      .collection('Cart_items')
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
        <Text style={styles.altText}>You don't have any item in your cart</Text>
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

        <View style={styles.buttonContainer}>
          <PrimaryButton
            onPress={() => navigation.navigate('checkOutScreen')}
            style={styles.buttonSettleNow}>
            SETTLE NOW
          </PrimaryButton>
        </View>
      </View>
      <View style={styles.rateDetails}>
        <H5 style={styles.H6}>Total</H5>
        <H5 style={styles.H3}>${total}</H5>
      </View>
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
    flex: 0.5,
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
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  H3: {
    color: GlobalStyles.colors.color2,
  },
  H6: {
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
  },
});
