import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, FlatList} from 'react-native';
import {Card} from '../../Exporter';

const Home = ({navigation}) => {
  const [productsData, setProductsData] = useState();
  const getProductsData = async () => {
    let response = await fetch('https://dummyjson.com/products', {
      method: 'GET',
    });

    let data = await response.json().then(res => res.products);
    setProductsData(data);
  };

  useEffect(() => {
    getProductsData();
  }, []);

  const renderProductsCard = itemData => {
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
            rating: Math.round(itemData.item.rating),
          })
        }
        howManyStar={Math.round(itemData.item.rating)}
        productName={itemData.item.title}
        productPrice={itemData.item.price}
        image={itemData.item.thumbnail}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={{flex: 1}}
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
    padding: 10,
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
