import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import {Card, CategorySlider, UserAvatar} from '../../Exporter';
import {AuthContext} from '../../Store/AuthContext';
import firestore from '@react-native-firebase/firestore';
import {HandleCartButtonClick} from '../../Utils/CartManagement';
import {HandleHeartButtonClick} from '../../Utils/WishListManagement';
import {FlatListSlider} from 'react-native-flatlist-slider';
import Preview from '../../Components/ImageSlider/Preview';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart} from '../../Store/Redux/Fuctionality/Cart/CartSlice';
const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const {fontScale, width, height} = useWindowDimensions();
  const [productsData, setProductsData] = useState();
  const [isInWishLIst, setIsInWishLIst] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [shouldGetData, setShouldGetdata] = useState(true);
  const [cartData, setCartData] = useState([]);
  const limit = 30;
  let firstTenProducts = [];
  let word = 'G';
  let userLocalId;

  const Authctx = useContext(AuthContext);
  const userInfo = JSON.parse(Authctx.userInfo);

  if (userInfo) {
    word = userInfo.name.charAt(0);
    userLocalId = userInfo.localId;
  }

  if (productsData) {
    firstTenProducts = productsData.slice(0, 10);
  }

  if (cartData.length > 0) {
    dispatch(addToCart(cartData));
  }

  useEffect(() => {
    getProductsData();
  }, [skip]);

  useEffect(() => {
    if (userLocalId) {
      getCartProductData(userLocalId);
    }
    console.log('called useeff');
  }, [userLocalId]);

  const getCartProductData = async localId => {
    await firestore()
      .collection('Cart_items')
      .doc(localId)
      .get()
      .then(response => {
        const products = response.data()?.products;
        if (!!products) {
          setCartData(products);
          console.log('done');
        }
      })
      .catch(() => {
        console.log('Error occured during add to cart');
      });
  };

  const images = firstTenProducts.map(object => {
    return {image: object.images[0], desc: object.description, id: object.id};
  });

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
    getProductsData();
  }, []);

  const RenderLoader = () => {
    return isLoading ? (
      <View style={styles.loader}>
        <ActivityIndicator color={GlobalStyles.colors.color8} size="large" />
      </View>
    ) : null;
  };

  const LoadMoreItems = () => {
    shouldGetData && setSkip(skip + limit);
  };

  const getProductsData = async () => {
    setIsLoading(true);
    try {
      let response = await fetch(
        `https://dummyjson.com/products?limit=${limit}&skip=${skip}`,
        {
          method: 'GET',
        },
      );

      const data = await response.json().then(res => res.products);

      if (!data) {
        ToastAndroid.show('no more products', ToastAndroid.SHORT);
        setShouldGetdata(false);
      }
      skip
        ? setProductsData(oldArray => [...oldArray, ...data])
        : data && setProductsData(data);
    } catch (err) {
      setIsLoading(false);
      !productsData &&
        Alert.alert('Turn internet connection on ', 'or restart app', [
          {
            text: '',
            onPress: () => getProductsData(),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => getProductsData()},
        ]);
    }
    setIsLoading(false);
  };

  const renderProductsCard = itemData => {
    const itemDetails = {
      id: itemData.item.id,
      Images: itemData.item.images,
      title: itemData.item.title,
      price: itemData.item.price,
      description: itemData.item.description,
      brand: itemData.item.brand,
      category: itemData.item.category,
      thumbnail: itemData.item.thumbnail,
      howMany: 1,
      rating: Math.round(itemData.item.rating),
      total: 1 * itemData.item.price,
    };

    const handleCartButton = itemDetails => {
      const handleReduxCart = () => {
        dispatch(addToCart([itemDetails]));
      };
      const {localId} = JSON.parse(Authctx.userInfo);
      HandleCartButtonClick(itemDetails, localId, handleReduxCart);
    };

    return (
      <Card
        onPress={() =>
          navigation.navigate('ProductDescription', {
            id: itemData.item.id,
            Images: itemData.item.images,
            title: itemData.item.title,
            price: itemData.item.price,
            description: itemData.item.description,
            brand: itemData.item.brand,
            category: itemData.item.category,
            thumbnail: itemData.item.thumbnail,
            rating: Math.round(itemData.item.rating),
            // TODO: isAlreadyAdded
          })
        }
        howManyStar={Math.round(itemData.item.rating)}
        productName={itemData.item.title}
        productPrice={itemData.item.price}
        image={itemData.item.thumbnail}
        isAlreadyAdded={isInWishLIst}
        onAddPress={handleCartButton.bind(this, itemDetails)}
      />
    );
  };

  const RenderImageSlider = () => {
    return images ? (
      <FlatListSlider
        component={<Preview />}
        indicatorActiveColor={GlobalStyles.colors.color5}
        loop={true}
        autoscroll={true}
        data={images}
        width={width}
        timer={5000}
        animation={true}
        imageKey={'image'}
        indicatorActiveWidth={20}
        // contentContainerStyle={{paddingHorizontal: 16}}
      />
    ) : null;
    return <View></View>;
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.aboveContainer}>
              <View style={styles.logoContainer}>
                <View>
                  <Text style={[styles.logo, {fontSize: fontScale * 16}]}>
                    Shopera
                  </Text>
                </View>
                <View>
                  <UserAvatar
                    fontScale={fontScale}
                    isImage={false}
                    word={word}
                    style={{backgroundColor: GlobalStyles.colors.color6}}
                    onPress={() => {
                      navigation.navigate('chooseScreen');
                    }}
                  />
                </View>
              </View>
              <View style={styles.middleContainer}>
                <Text style={[styles.best, {fontSize: fontScale * 23}]}>
                  Browse categories
                </Text>
                <CategorySlider color={'black'} size={25} />
              </View>
            </View>
            <View
              style={{
                paddingBottom: 10,
                paddingTop: 20,
                backgroundColor: GlobalStyles.colors.color4,
              }}>
              <RenderImageSlider />
            </View>
          </>
        }
        style={{flex: 1}}
        nestedScrollEnabled
        data={productsData}
        initialNumToRender={5}
        renderItem={renderProductsCard}
        keyExtractor={item => item.id}
        numColumns={2}
        onEndReached={LoadMoreItems}
        ListFooterComponent={RenderLoader}
        onEndReachedThreshold={0}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressBackgroundColor="White"
            colors={[
              GlobalStyles.colors.color2,
              GlobalStyles.colors.color6,
              GlobalStyles.colors.color8,
              GlobalStyles.colors.color9,
            ]}
          />
        }
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aboveContainer: {
    paddingTop: 10,
    width: '100%',
    flex: 0.5,
    backgroundColor: GlobalStyles.colors.PrimaryButtonColor,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 10,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  middleContainer: {
    flex: 2,
    backgroundColor: GlobalStyles.colors.PrimaryButtonColor,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    fontWeight: 'bold',
    color: 'white',
  },
  sliderText: {
    color: 'white',
    padding: 10,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.65,
  },
  best: {
    color: 'white',
    fontWeight: '600',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  loader: {
    marginVertical: 15,
    alignItems: 'center',
  },
});
