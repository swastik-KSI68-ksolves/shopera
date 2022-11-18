import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  useWindowDimensions,
  Pressable,
  ScrollView,
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
  const [wishListData, setWishListData] = useState();
  const [isInWishLIst, setIsInWishLIst] = useState(false);
  const getProductsData = async () => {
    let response = await fetch('https://dummyjson.com/products', {
      method: 'GET',
    });

    let data = await response.json().then(res => res.products);
    setProductsData(data);
  };

  const getWishListData = () => {};

  useEffect(() => {
    getProductsData();
    // getWishListData();
  }, []);

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
        manageWishListInDb={handleHeartButton.bind(this, itemDetails)}
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
              style={{backgroundColor: GlobalStyles.colors.color1}}
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
});
