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
  ActivityIndicator,
} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../../Store/AuthContext';
import {useState} from 'react';
import firestore, {firebase} from '@react-native-firebase/firestore';

const Notifications = ({navigation}) => {
  const Authctx = useContext(AuthContext);
  const {fontScale, width, height} = useWindowDimensions();
  const [NotificationData, setNotificationData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [numberOfNotifications, setNumberOfNotifications] = useState(0);

  // const [dates,setDates]=useState([
  //   {
  //     today:[],
  //     thisWeek:[],
  //     thisMonth:[],
  //     earlier:[],
  //   }
  // ])
  const [today, setToday] = useState([]);
  const [thisWeek, setThisWeek] = useState([]);
  const [thisMonth, setThisMonth] = useState([]);
  const [earlier, setEarlier] = useState([]);

  const epochToJsDate = ts => {
    return new Date(ts);
  };

  const calculateDateArrays = () => {
    setIsLoading(true);
    setNumberOfNotifications(NotificationData.length + 1);
    try {
      if (NotificationData.length > 0) {
        const today = new Date();
        const date7DaysAgo = new Date(new Date().setDate(today.getDate() - 7));
        const date30DaysAgo = new Date(
          new Date().setDate(today.getDate() - 30),
        );

        //calculation for today
        const notificationsToday = NotificationData.filter(item => {
          const dat = epochToJsDate(item.sentTime);
          return dat == today;
        });

        //calculation for this week
        const notifications7DaysAgo = NotificationData.filter(item => {
          const dat = epochToJsDate(item.sentTime);
          return dat >= date7DaysAgo && dat <= today;
        });

        //calculation for this month
        const notifications30DaysAgo = NotificationData.filter(item => {
          const dat = epochToJsDate(item.sentTime);
          return dat >= date30DaysAgo && dat <= date7DaysAgo;
        });

        //calculation for this earlier
        const notificationsAfter30Days = NotificationData.filter(item => {
          const dat = epochToJsDate(item.sentTime);
          return dat <= date30DaysAgo && dat <= today;
        });

        setToday([...notificationsToday]);
        setThisWeek([...notifications7DaysAgo]);
        setThisMonth([...notifications30DaysAgo]);
        setEarlier([...notificationsAfter30Days]);
        setIsLoading(false);
      }
    } catch (err) {
      console.log('error while calculateDateArrays');
    }
    setNumberOfNotifications(NotificationData.length + 1);
  };

  useEffect(() => {
    calculateDateArrays();
  }, [NotificationData]);

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

    const subscriber = firestore()
      .collection('Notifications')
      .doc(localId)
      .onSnapshot(onResult, onError);

    return () => subscriber();
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
  }, [navigation, NotificationData]);

  const styles = StyleSheet.create({
    loader: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
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
      width: '80%',
      height: height / 14,
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
      flex: 1,
    },
    textDetails: {
      flex: 4,
      paddingHorizontal: 10,
    },
    img: {
      width: fontScale * 35,
      height: fontScale * 35,
      resizeMode: 'contain',
      borderColor: 'rgba(0,0,0,0.05)',
      borderWidth: 1,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    title: {
      color: 'black',
    },
    rate: {
      color: 'black',
    },
  });

  const renderCartData = itemData => {
    const img = itemData.item.notification.android?.imageUrl;
    console.log('data', itemData);
    return (
      <View style={styles.itemList}>
        <View style={styles.imgContainer}>
          {!!img ? (
            <Image style={[styles.img]} source={{uri: img}} />
          ) : (
            <Image
              style={[styles.img]}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/1182/1182718.png',
              }}
            />
          )}
        </View>
        <View style={styles.textDetails}>
          <Text style={[styles.title, {fontSize: fontScale * 12}]}>
            {itemData.item.notification.title}
          </Text>
          <Text style={[styles.rate, {fontSize: fontScale * 10}]}>
            {itemData.item.notification.body}
          </Text>
        </View>
      </View>
    );
  };

  return !isLoading ? (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <Text
            style={{color: 'black', textAlign: 'center', fontWeight: '500'}}>
            All Notification History
          </Text>
        }
        contentContainerStyle={{alignItems: 'center'}}
        style={{flex: 1, backgroundColor: GlobalStyles.colors.color4}}
        data={NotificationData}
        renderItem={renderCartData}
        keyExtractor={item => item.id}
      />
      {/* {today.length > 0 ? (
        <FlatList
          ListHeaderComponent={
            <Text
              style={{color: 'black', textAlign: 'center', fontWeight: '500'}}>
              Today
            </Text>
          }
          contentContainerStyle={{alignItems: 'center'}}
          style={{flex: 1, backgroundColor: GlobalStyles.colors.color4}}
          data={today}
          renderItem={renderCartData}
          keyExtractor={item => item.id}
        />
      ) : null}

      {thisWeek.length > 0 ? (
        <FlatList
          ListHeaderComponent={
            <Text
              style={{color: 'black', textAlign: 'center', fontWeight: '500'}}>
              This Week
            </Text>
          }
          contentContainerStyle={{alignItems: 'center'}}
          style={{flex: 1, backgroundColor: GlobalStyles.colors.color4}}
          data={thisWeek}
          renderItem={renderCartData}
          keyExtractor={item => item.id}
        />
      ) : null}

      <View
        style={{
          paddingVertical: 10,
          alignSelf: 'center',
          width: '80%',
          borderBottomColor: '#ddd',
          borderBottomWidth: 1,
        }}></View>

      {thisMonth.length > 0 ? (
        <FlatList
          ListHeaderComponent={
            <Text
              style={{color: 'black', textAlign: 'center', fontWeight: '500'}}>
              This Month
            </Text>
          }
          contentContainerStyle={{alignItems: 'center'}}
          style={{flex: 1, backgroundColor: GlobalStyles.colors.color4}}
          data={thisMonth}
          renderItem={renderCartData}
          keyExtractor={item => item.id}
        />
      ) : null}

      {earlier.length > 0 ? (
        <FlatList
          ListHeaderComponent={
            <Text
              style={{color: 'black', textAlign: 'center', fontWeight: '500'}}>
              Earlier
            </Text>
          }
          contentContainerStyle={{alignItems: 'center'}}
          style={{flex: 1, backgroundColor: GlobalStyles.colors.color4}}
          data={earlier}
          renderItem={renderCartData}
          keyExtractor={item => item.id}
        />
      ) : null} */}
    </View>
  ) : (
    <View style={styles.loader}>
      <ActivityIndicator color={GlobalStyles.colors.color8} size="large" />
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
