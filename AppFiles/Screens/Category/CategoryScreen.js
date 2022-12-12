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
import {addToCart} from '../../Store/Redux/Fuctionality/Cart/CartSlice';
import {useDispatch} from 'react-redux';
const CategoryScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {fontScale} = useWindowDimensions();
  const Authctx = useContext(AuthContext);
  const [productsData, setProductsData] = useState();
  const [cat, setCat] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const RenderLoader = () => {
    return isLoading ? (
      <View style={styles.loader}>
        <ActivityIndicator color={GlobalStyles.colors.color8} size="large" />
      </View>
    ) : null;
  };

  const getProductsData = async () => {
    setIsLoading(true);
    const url = `https://dummyjson.com/products/category/${cat}`;
    try {
      let response = await fetch(url, {
        method: 'GET',
      });

      let data = await response.json().then(res => res.products);
      setProductsData(data);
    } catch (err) {
      setIsLoading(false);
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
  }, [cat]);


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

      // headerRight: () => (
      //   <Pressable>
      //     <Icon name="search-outline" color="black" size={fontScale * 25} />
      //   </Pressable>
      // ),
    });
  }, [navigation, cat]);

  const RenderCategoryItems = () => {
    return (
      <>
        {/* <Text style={styles.catNameHeader}>
          {cat.toUpperCase().replace('-', ' ')}
        </Text> */}
        <FlatList
          contentContainerStyle={{alignItems: 'center'}}
          style={{flex: 1, backgroundColor: GlobalStyles.colors.color4}}
          data={productsData}
          renderItem={renderProductsCard}
          keyExtractor={item => item.id}
          numColumns={2}
        />
      </>
    );
  };
  const RenderData = () => {
    if (isLoading) return <RenderLoader />;
    return <RenderCategoryItems />;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.Allcategories, {borderRadius: fontScale * 25}]}>
        <CategorySlider
          setCat={setCat}
          color={'black'}
          size={25}
          style={{flexDirection: 'row'}}
        />
      </View>
      {/* <Text style={{color:"black"}}>Hello</Text> */}

      <View style={styles.catList}>
        <RenderData />
      </View>

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
