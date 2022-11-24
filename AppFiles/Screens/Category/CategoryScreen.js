import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Pressable,
  useWindowDimensions,
  Alert,
  Text,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import {Card, CategorySlider} from '../../Exporter';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../../Store/AuthContext';
import {HandleCartButtonClick} from '../../Utils/CartManagement';
import {useRoute} from '@react-navigation/native';
const CategoryScreen = ({navigation}) => {
  const {fontScale} = useWindowDimensions();
  const Authctx = useContext(AuthContext);
  const [productsData, setProductsData] = useState();
  const [cat, setCat] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  };

  const getProductsData = async () => {
    setProductsData([]);
    console.log('inside  = ', cat);
    const url = `https://dummyjson.com/products/category/${cat}`;
    try {
      let response = await fetch(url, {
        method: 'GET',
      });

      let data = await response.json().then(res => res.products);
      setProductsData(data);
    } catch (err) {
      Alert.alert('Turn internet connection on ', 'or restart app', [
        {
          text: '',
          onPress: () => getProductsData(),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => getProductsData()},
      ]);
    }
  };

  useEffect(() => {
    getProductsData();
    fadeIn();
    return () => fadeOut();
  }, [cat]);

  console.log('PD = ', productsData);

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
        onAddPress={handleCartButton.bind(this, itemDetails)}
      />
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: cat
        ? cat.toLocaleUpperCase().replace('-', ' ')
        : 'All Categories',
      headerRightContainerStyle: {paddingHorizontal: 20},
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: GlobalStyles.colors.PrimaryButtonColor,
        paddingLeft: 25,
      },

      headerRight: () => (
        <Pressable>
          <Icon name="search-outline" color="black" size={fontScale * 25} />
        </Pressable>
      ),
    });
  }, [navigation, cat]);

  const RenderCategoryItems = () => {
    return (
      <>
        {/* <Text style={styles.catNameHeader}>
          {cat.toUpperCase().replace('-', ' ')}
        </Text> */}
        <FlatList
          style={{flex: 1, backgroundColor: GlobalStyles.colors.color4}}
          data={productsData}
          renderItem={renderProductsCard}
          keyExtractor={item => item.id}
          numColumns={2}
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.Allcategories, {borderRadius: fontScale * 25}]}>
        <CategorySlider
          fadeIn={fadeIn}
          setCat={setCat}
          color={'black'}
          size={25}
          style={{flexDirection: 'row'}}
        />
      </View>
      <Animated.View
        style={[
          styles.catList,
          {
            opacity: fadeAnim,
          },
        ]}>
        <RenderCategoryItems />
        {/* <Text style={{color:"black"}}>Hello</Text> */}
      </Animated.View>

      {/* <View style={styles.catList}></View> */}

      <View style={styles.MoreOnShopera}></View>
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  catList: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'white',
  },
  Allcategories: {
    paddingTop: '4%',
    paddingBottom: '4%',
    paddingHorizontal: '4%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  catNameHeader: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  MoreOnShopera: {},
});
