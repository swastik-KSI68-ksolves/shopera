import React, {useContext, useEffect} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  Platform,
  ToastAndroid,
  Image,
} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../../Store/AuthContext';
import {useState} from 'react';
import firestore, {firebase} from '@react-native-firebase/firestore';

const Notifications = ({navigation}) => {
  const Authctx = useContext(AuthContext);
  const {fontScale, width, height} = useWindowDimensions();
  const numberOfNotifications = 10;
  const [NotificationData, setNotificationData] = useState([]);

  useEffect(() => {
    const {localId} = JSON.parse(Authctx.userInfo);
    function onResult(QuerySnapshot) {
      setNotificationData([]);
      try {
        const notifications = QuerySnapshot.data().notifications;
        notifications.forEach(documentSnapshot => {
          setNotificationData(oldArray => [...oldArray, documentSnapshot]);
        });
      } catch (err) {
        console.log(err);
        ToastAndroid.show('Something Went Wrong', ToastAndroid.SHORT);
      }
    }

    function onError(error) {
      Alert.alert('something went wrong');
    }

    firestore()
      .collection('Notifications')
      .doc(localId)
      .onSnapshot(onResult, onError);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      tabBarLabel: 'Notifications',
      headerRightContainerStyle: {paddingHorizontal: 20},
      headerTitleAlign: 'center',
      headerTitleStyle: {color: GlobalStyles.colors.PrimaryButtonColor},
      headerRight: () => (
        <>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 30,
              height: 30,
              backgroundColor: GlobalStyles.colors.color6,
              borderRadius: 50,
            }}>
            <Text
              style={{
                color: 'black',
                fontSize:
                  numberOfNotifications < 99 ? fontScale * 12 : fontScale * 10,
              }}>
              {numberOfNotifications}
            </Text>
          </View>
        </>
      ),
    });
  }, [navigation]);

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

  const renderCartData = itemData => {
    const img = itemData.item.notification.android?.imageUrl;
    console.log('data', itemData.item.id);
    // return (
    //   <View style={styles.itemList}>
    //     <View style={styles.imgContainer}>
    //       {!!img ? (
    //         <Image style={[styles.img]} source={{uri: img}} />
    //       ) : (
    //         <Image
    //           style={[styles.img]}
    //           source={{
    //             uri: 'https://cdn-icons-png.flaticon.com/512/1182/1182718.png',
    //           }}
    //         />
    //       )}
    //     </View>
    //     <View style={styles.textDetails}>
    //       <Text style={[styles.title, {fontSize: fontScale * 15}]}>
    //         {itemData.item.notification.title}
    //       </Text>
    //       <Text style={styles.rate}>{itemData.item.notification.body}</Text>
    //       {/* <Text style={styles.quantity}>Quantity: {itemData.item.howMany}</Text> */}
    //     </View>
    //   </View>
    // );
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{alignItems: 'center'}}
        style={{flex: 1, backgroundColor: GlobalStyles.colors.color4}}
        data={NotificationData}
        renderItem={renderCartData}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
});
