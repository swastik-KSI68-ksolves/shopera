import {useRoute, validatePathConfig} from '@react-navigation/native';
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  useWindowDimensions,
  Pressable,
  Text,
  Alert,
} from 'react-native';
import {roundToNearestPixel} from 'react-native/Libraries/Utilities/PixelRatio';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import ImageViewer from '../../Components/UI/ImageViewer';
import Ratings from '../../Components/UI/Ratings';
import {IconButton} from '../../Components/UI/IconButton';
import PrimaryButton from '../../Components/UI/PrimaryButton';
import {
  CartItemDetails,
  CustomImageSlider,
  WishListAddButton,
} from '../../Exporter/index';
import {H1, H2, H3, H4, H5, H6} from '../../Components/Heading';
import {handleWishToggle} from '../../Utils/Wishlist_Handler';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../../Store/AuthContext';
import {ReloadCart} from '../../Utils/Reloader';
import {CardAnimationContext} from '@react-navigation/stack';
import {RotationGesture} from 'react-native-gesture-handler/lib/typescript/handlers/gestures/rotationGesture';

const ProductDescription = ({navigation}) => {
  const Authctx = useContext(AuthContext);
  const {width, height, fontScale} = useWindowDimensions();
  const [numberofItems, setNumberofItems] = useState(0);

  const route = useRoute();
  const data = route.params.Images;
  const Productid = route.params.id;
  const Title = route.params.title;
  const Price = route.params.price;
  const Description = route.params.description;
  const Brand = route.params.brand;
  const Category = route.params.category;
  const Rating = route.params.rating;
  const Thumbnail = route.params.thumbnail;
  // const isAlreadyAdded = route.params.isAlreadyAdded;

  const itemDetails = {
    id: Productid,
    Images: data,
    title: Title,
    price: Price,
    description: Description,
    brand: Brand,
    category: Category,
    rating: Rating,
    thumbnail: Thumbnail,
    howMany: 1,
  };

  const addItemToCart = () => {
    const {localId} = JSON.parse(Authctx.userInfo);
    const cart = firestore()
      .collection('Cart_items')
      .doc(localId)
      .set(itemDetails);
    cart.then(sd => {
      console.log('added item to cart list');
    });
    cart.catch(err => {
      console.log('not added to cart list some error occured');
    });
  };

  const loadCartItems = async setNumberofItems => {
    const {localId} = JSON.parse(Authctx.userInfo);
    const Cart_items = await firestore()
      .collection('Cart_items')
      .doc(localId)
      .get();
    setNumberofItems(Cart_items.data.length);
  };

  const CartCountContainer = () => {
    return (
      <Pressable
        onPress={() => navigation.navigate('Cart')}
        style={({pressed}) =>
          pressed
            ? [styles.cartUpperContianer, {opacity: 0.75}]
            : [styles.cartUpperContianer]
        }>
        <Icon name="cart-outline" color={'black'} size={fontScale * 35} />
        <View style={styles.cartIconContainer}>
          <Text style={{color: 'white', fontSize: fontScale * 12}}>
            {numberofItems}
          </Text>
        </View>
      </Pressable>
    );
  };

  useLayoutEffect(() => {
    loadCartItems(setNumberofItems);
    navigation.setOptions({
      title: Title === '' ? 'Product Overview' : Title,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: fontScale * 14,
      },
      headerRight: CartCountContainer,
      headerRightContainerStyle: {
        alignItems: 'flex-end',
        paddingRight: 20,
      },
    });
  }, []);

  const handleCartButtonClick = () => {
    firestore()
      .collection('Cart_items')
      .where('id', '==', itemDetails.id)
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.length > 0
          ? Alert.alert('already in cart, "see your cart')
          : addItemToCart();
      });
    loadCartItems(setNumberofItems);
    return;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: GlobalStyles.colors.white,
    },
    scrollViewStyle: {
      flex: 1,
      backgroundColor: 'rgba(255,255,255,0.1)',
    },
    rateAndTitleContainer: {
      // paddingHorizontal: 20,
      paddingVertical: 20,
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    imageStyle: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    pressed: {
      opacity: 0.75,
    },
    productDetails: {
      flex: 2,
      paddingHorizontal: 10,
    },
    productTitle: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      maxHeight: '50%',
      flexGrow: 1,
    },

    ratingBrandCat: {
      marginVertical: 3,
      paddingVertical: 3,
      paddingHorizontal: 10,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    ratingBrandCatWithHeart: {
      marginVertical: 3,
      paddingVertical: 3,
      paddingHorizontal: 10,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    smallDetails: {
      borderBottomWidth: 1,
      borderBottomColor: GlobalStyles.colors.PrimaryTextColor,
    },
    titleText: {
      fontSize: Title.length > 40 ? fontScale * 16 : fontScale * 20,
      color: 'black',
      width: '70%',
    },
    detailsText: {
      fontSize: fontScale * 13,
      color: 'rgba(0,0,0,0.8)',
    },
    rateText: {
      fontSize: fontScale * 16,
      backgroundColor: GlobalStyles.colors.PrimaryButtonColor,
      paddingHorizontal: width / 15,
      paddingVertical: width / 35,
      borderRadius: 15,
      color: 'white',
    },
    descText: {
      textAlign: 'left',
      color: 'rgba(0,0,0,0.6)',
      fontSize: 15,
      // marginHorizontal: 10,
      // marginVertical: 10,
    },
    productDescription: {
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 10,
    },
    addToCartArea: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    cartIconContainer: {
      backgroundColor: GlobalStyles.colors.PrimaryButtonColor,
      borderRadius: 200,
      width: numberofItems < 99 ? fontScale * 25 : fontScale * 30,
      height: numberofItems < 99 ? fontScale * 25 : fontScale * 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cartUpperContianer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const showImageZoomer = e => {
    return <ImageViewer url={e} title="hello" visible={true} />;
  };
  return (
    <View style={styles.container}>
      <CustomImageSlider data={data} width={width} />
      <View style={styles.productDetails}>
        <View style={styles.rateAndTitleContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              paddingHorizontal: 10,
            }}>
            <Text style={styles.titleText}>{Title}</Text>

            <View style={{paddingRight: 20}}>
              <WishListAddButton
              // manageWishListInDb={handleWishToggle}
              // isAlreadyAdded={isAlreadyAdded}
              />
            </View>
          </View>
          <View
            style={{
              width: '100%',
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={styles.addToCartArea}>
              {/* <Text style={styles.rateText}>${Price}</Text> */}

              <View style={{paddingHorizontal: 10}}>
                <H3 style={{color: 'black'}}>${Price}</H3>
                <View style={styles.ratingBrandCat}>
                  <Ratings
                    Touchable={false}
                    size={15}
                    howManyStarShow={Rating}
                  />
                </View>
              </View>

              <View style={{justifyContent: 'center', alignItems: 'flex-end'}}>
                <PrimaryButton
                  children="   Buy now   "
                  color={GlobalStyles.colors.PrimaryTextColor}
                  style={{
                    backgroundColor: GlobalStyles.colors.PrimaryButtonColor,
                  }}
                  fsize={fontScale * 14}
                />
                <PrimaryButton
                  onPress={handleCartButtonClick}
                  children="Add to cart"
                  color={GlobalStyles.colors.PrimaryTextColor}
                  style={{
                    backgroundColor: GlobalStyles.colors.PrimaryTextColor,
                  }}
                  fsize={fontScale * 14}
                />
              </View>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.smallDetails}
          contentContainerStyle={{alignItems: 'flex-start'}}>
          <View style={styles.ratingBrandCat}>
            <Text style={[styles.detailsText, {fontWeight: 'bold'}]}>
              Brand
            </Text>
            <Text style={styles.detailsText}> - {Brand}</Text>
          </View>

          <View style={styles.ratingBrandCat}>
            <Text style={[styles.detailsText, {fontWeight: 'bold'}]}>
              Category
            </Text>
            <Text style={styles.detailsText}> - {Category}</Text>
          </View>
          <View style={styles.productDescription}>
            <Text style={styles.descText}>{Description}</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ProductDescription;
