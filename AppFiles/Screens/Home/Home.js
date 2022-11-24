import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  useWindowDimensions,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import {
  Card,
  CategorySlider,
  CustomImageSlider,
  UserAvatar,
} from '../../Exporter';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../../Store/AuthContext';
import firestore from '@react-native-firebase/firestore';
import {AddItemToCart, HandleCartButtonClick} from '../../Utils/CartManagement';
import {HandleHeartButtonClick} from '../../Utils/WishListManagement';

const Home = ({navigation}) => {
  const Authctx = useContext(AuthContext);
  const {fontScale, width, height} = useWindowDimensions();
  const [productsData, setProductsData] = useState();
  const [isInWishLIst, setIsInWishLIst] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const limit = 30;

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
    getProductsData();
  }, []);

  const RenderLoader = () => {
    return isLoading ? (
      <View style={styles.loader}>
        <ActivityIndicator color={GlobalStyles.colors.color9} size="large" />
      </View>
    ) : null;
  };

  const LoadMoreItems = () => {
    setSkip(skip + limit);
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

      let data = await response.json().then(res => res.products);
      if (data.length < 1) {
        ToastAndroid.show('no more products', ToastAndroid.SHORT);
      }
      skip
        ? setProductsData(oldArray => [...oldArray, ...data])
        : data && setProductsData(data);
    } catch (err) {
      setIsLoading(false);
      productsData.length < 1 &&
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

  useEffect(() => {
    getProductsData();
  }, [skip]);

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
    };

    const handleCartButton = itemDetails => {
      const {localId} = JSON.parse(Authctx.userInfo);
      HandleCartButtonClick(itemDetails, localId);
    };

    const handleHeartButton = itemDetails => {
      const {localId} = JSON.parse(Authctx.userInfo);
      HandleHeartButtonClick(itemDetails, localId, setIsInWishLIst);
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
        // manageWishListInDb={handleHeartButton.bind(this, itemDetails)}
        onAddPress={handleCartButton.bind(this, itemDetails)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.aboveContainer}>
        <View style={styles.logoContainer}>
          {/* <View>
            <Pressable
              style={({pressed}) => (pressed ? styles.pressed : null)}
              onPress={() => navigation.openDrawer()}>
              <Icon name="menu" color="white" size={fontScale * 32} />
            </Pressable>
          </View> */}
          <View>
            <Text style={[styles.logo, {fontSize: fontScale * 16}]}>
              Shopera
            </Text>
          </View>
          <View>
            <UserAvatar
              fontScale={fontScale}
              isImage={false}
              word="S"
              style={{backgroundColor: GlobalStyles.colors.color8}}
              onPress={() => {
                navigation.navigate('userProfile');
              }}
            />
            {/* <Icon name="person-circle" color="white" size={fontScale * 32} /> */}
          </View>
        </View>
        <View style={styles.middleContainer}>
          <Text style={[styles.best, {fontSize: fontScale * 23}]}>
            Browse categories
          </Text>
          <CategorySlider color={'black'} size={25} />
        </View>
      </View>
      <FlatList
        style={{flex: 1, marginTop: 20}}
        data={productsData}
        renderItem={renderProductsCard}
        keyExtractor={item => item.id}
        numColumns={2}
        onEndReached={LoadMoreItems}
        ListFooterComponent={RenderLoader}
        onEndReachedThreshold={0}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
