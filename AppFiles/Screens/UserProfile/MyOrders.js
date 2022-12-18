import {useRoute} from '@react-navigation/native';
import React from 'react';
import {useContext} from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  useWindowDimensions,
  View,
} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {AuthContext} from '../../Store/AuthContext';

const MyOrders = ({navigation}) => {
  const {fontScale, height, width} = useWindowDimensions();
  const [productData, setProductData] = useState([]);
  const Authctx = useContext(AuthContext);
  let total = 0;
  if (productData.length > 0) {
    total = productData.reduce((sum, product) => {
      return sum + product.total;
    }, 0);
  } else {
    total = 0;
  }

  useEffect(() => {
    const {localId} = JSON.parse(Authctx.userInfo);
    function onResult(QuerySnapshot) {
      setProductData([]);
      try {
        const products = QuerySnapshot.data().products;
        products.forEach(documentSnapshot => {
          setProductData(oldArray => [...oldArray, documentSnapshot]);
        });
      } catch (err) {
        ToastAndroid.show('Something Went Wrong', ToastAndroid.SHORT);
      }
    }

    function onError(error) {
      console.log('err');
      Alert.alert('something went wrong');
    }

    firestore()
      .collection('Customer_Orders')
      .doc(localId)
      .onSnapshot(onResult, onError);
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    itemList: {
      marginVertical: 10,
      paddingVertical: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: '95%',
      height: height / 6,
      backgroundColor: 'white',
      marginBottom: 5,
      shadowColor: 'black',
      shadowOpacity: 0.5,
      shadowOffset: {width: 2, height: 2},
      shadowRadius: 8,
      overflow: Platform === 'android' ? 'hidden' : 'visible',
      elevation: 3,
      borderRadius: 10,
    },
    imgContainer: {
      flex: 2,
    },
    textDetails: {
      flex: 3,
      paddingHorizontal: 10,
    },
    img: {
      flex: 1,
      resizeMode: 'center',
      // borderColor: 'rgba(0,0,0,0.1)',
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
    },
    title: {
      color: 'black',
      padding: 2,
    },
    rate: {
      color: 'black',
      padding: 2,
    },
    quantity: {
      color: 'black',
      padding: 2,
    },
    orderDetails: {
      paddingHorizontal: 15,
    },
    PaidMoney: {
      color: 'black',
      fontSize: fontScale * 18,
      fontWeight: '500',
    },
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Your Orders',
      headerRightContainerStyle: {paddingHorizontal: 20},
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: GlobalStyles.colors.PrimaryButtonColor,
        marginLeft: fontScale * 25,
      },
    });
  }, [navigation]);

  const renderCartData = itemData => {
    return (
      <View style={styles.itemList}>
        <View style={styles.imgContainer}>
          <Image
            style={[styles.img]}
            source={{uri: String(itemData.item.Images[0])}}
          />
        </View>
        <View style={styles.textDetails}>
          <Text style={[styles.title, {fontSize: fontScale * 15}]}>
            {itemData.item.title}
          </Text>
          {/* <Text
            style={[
              {fontWeight: 'bold', color: 'black', padding: 2},
              {fontSize: fontScale * 14},
            ]}> */}

          <Text style={styles.rate}>Price: ₹{itemData.item.price}</Text>
          {/* </Text> */}
          {/* <Text
            style={[
              {fontWeight: 'bold', color: 'black', padding: 2},
              {fontSize: fontScale * 14},
            ]}> */}

          <Text style={styles.quantity}>Quantity: {itemData.item.howMany}</Text>
          {/* </Text> */}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.orderDetails}>
        {/* <Text style={styles.rate}>Order Id - {orderId}</Text> */}
        {/* <Text style={styles.PaidMoney}>Money Paid - {total}</Text> */}
      </View>
      <FlatList
        contentContainerStyle={{alignItems: 'center'}}
        style={{flex: 1, backgroundColor: GlobalStyles.colors.color4}}
        data={productData}
        renderItem={renderCartData}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default MyOrders;
