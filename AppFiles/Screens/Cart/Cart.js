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
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import {H5, H6} from '../../Components/Heading';
import {Card, CartItemDetails, PrimaryButton} from '../../Exporter';
import firestore from '@react-native-firebase/firestore';
import {ReloadCart} from '../../Utils/Reloader';

const Cart = ({navigation}) => {
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

  const onRemoveHandler = id => {
    firestore()
      .collection('Cart_items')
      .where('id', '==', id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          // setDocId(documentSnapshot.id);
          firestore()
            .collection('Cart_items')
            .doc(documentSnapshot.id)
            .delete()
            .then(() => {
              console.log('item deleted!');
            });
        });
      });
    return;
  };

  const renderCartProducts = itemData => {
    console.log(itemData);
    return (
      <Card
        id={itemData.item.id}
        productDesc={itemData.item.description}
        horizontal={true}
        productName={itemData.item.title}
        productPrice={itemData.item.price}
        image={itemData.item.thumbnail}
        howMany={itemData.item.howMany}
        onRemoveHandler={onRemoveHandler}
      />
    );
  };

  // useEffect(() => {
  //   firestore()
  //     .collection('Cart_items')
  //     .get()
  //     .then(querySnapshot => {
  //       querySnapshot.forEach(documentSnapshot => {
  //         setProductData(oldArray => [...oldArray, documentSnapshot.data()]);
  //       });
  //     });
  // }, []);

  // useEffect(() => {
  //   const subscriber = firestore()
  //     .collection('Cart_items')
  //     .onSnapshot(documentSnapshot => {
  //       console.log('data = ', documentSnapshot.docs);
  //     });

  //   return () => subscriber();
  // }, []);

  useEffect(() => {
    function onResult(QuerySnapshot) {
      console.log('Got Users collection result.');
      // console.log('QuerySnapshot =  ', QuerySnapshot.docs);
      setProductData([]);
      QuerySnapshot.forEach(documentSnapshot => {
        setProductData(oldArray => [...oldArray, documentSnapshot.data()]);
      });
    }

    function onError(error) {
      console.error(error);
      Alert.alert('something went wrong');
    }

    firestore().collection('Cart_items').onSnapshot(onResult, onError);
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
        <View style={styles.rateDetails}>
          <H6 style={styles.H6}>Total</H6>
          <H5 style={styles.H3}>${total}</H5>
        </View>
      </View>
      <RenderCartData />
      <View style={styles.buttonContainer}>
        <PrimaryButton style={styles.buttonSettleNow}>SETTLE NOW</PrimaryButton>
      </View>
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
    alignItems: 'baseline',
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
});
