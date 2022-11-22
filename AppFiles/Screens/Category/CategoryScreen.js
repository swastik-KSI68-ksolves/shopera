import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import {CategorySlider} from '../../Exporter';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../../Store/AuthContext';
import {HandleCartButtonClick} from '../../Utils/CartManagement';

const CategoryScreen = ({navigation}) => {
  const {fontScale} = useWindowDimensions();
  const Authctx = useContext(AuthContext);
  const [productsData, setProductsData] = useState();
  const [cat, setCat] = useState('');

  const getProductsData = async () => {
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
  }, []);

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: `${category}`,
  //   });
  // }, [navigation]);

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

    // const handleHeartButton = itemDetails => {
    //   const {localId} = JSON.parse(Authctx.userInfo);
    //   HandleHeartButtonClick(itemDetails, localId, setIsInWishLIst);
    // };

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
      headerTitle: 'All Categories',
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
  }, [navigation]);

  const RenderCategoryItems = () => {
    return (
      <FlatList
        style={{flex: 1, backgroundColor: GlobalStyles.colors.color4}}
        data={productsData}
        renderItem={renderProductsCard}
        keyExtractor={item => item.id}
        numColumns={2}
      />
    );
  };

  
  return (
    <View style={styles.container}>
      <View style={styles.Allcategories}>
        <CategorySlider
          setCat={setCat}
          color={'black'}
          size={25}
          style={{flexDirection: 'column'}}
        />
      </View>
      <RenderCategoryItems />
      <View style={styles.MoreOnShopera}></View>
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  catList: {},
  Allcategories: {},
  MoreOnShopera: {},
});
