import {useRoute} from '@react-navigation/native';
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import {Card} from '../../Exporter';
import {AuthContext} from '../../Store/AuthContext';
import {HandleCartButtonClick} from '../../Utils/CartManagement';

const IndivisualCategory = ({navigation}) => {
  const Authctx = useContext(AuthContext);
  const route = useRoute();
  const category = route.params.category;
  const [productsData, setProductsData] = useState();
  const url = `https://dummyjson.com/products/category/${category}`;
  const getProductsData = async () => {
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${category}`,
    });
  }, [navigation]);

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

export default IndivisualCategory;
