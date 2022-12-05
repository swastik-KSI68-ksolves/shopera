import React, {useEffect, useState, useContext} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import {OptionPicker, UserAvatar} from '../../Exporter';
import {AuthContext} from '../../Store/AuthContext';

// import firestore from '@react-native-firebase/firestore';

const ChooseScreen = ({navigation}) => {
  const AuthCTX = useContext(AuthContext);
  const userInfo = JSON.parse(AuthCTX.userInfo);
  const word = userInfo.name.charAt(0);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
  });
  const {fontScale, width, height} = useWindowDimensions();
  useEffect(() => {
    const {email, name} = JSON.parse(AuthCTX.userInfo);
    setUserData({...userData, email: email, name: name});
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.userDetails}>
        <UserAvatar
          fontScale={fontScale * 3}
          isImage={false}
          word={word}
          style={{backgroundColor: GlobalStyles.colors.PrimaryButtonColor}}
          onPress={() => {
            navigation.navigate('userProfile');
          }}
        />
        <Text style={[styles.name, {fontSize: fontScale * 20}]}>
          Hi, {userData.name}
        </Text>
      </View>
      <OptionPicker
        color={GlobalStyles.colors.PrimaryButtonColor}
        fontScale={fontScale}
        icon={'person-outline'}
        text={'My Account'}
        onPress={() => {
          navigation.navigate('userProfile');
        }}
      />
      <OptionPicker
        color={GlobalStyles.colors.PrimaryButtonColor}
        fontScale={fontScale}
        icon={'cube-outline'}
        text={'My Orders'}
        onPress={() => {
          navigation.navigate('myOrders');
        }}
      />
      <OptionPicker
        color={GlobalStyles.colors.PrimaryButtonColor}
        fontScale={fontScale}
        icon={'log-out-outline'}
        text={'Log Out'}
        onPress={() => {
          AuthCTX.Logout();
        }}
      />
    </View>
  );
};

export default ChooseScreen;

const styles = StyleSheet.create({
  userDetails: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  name: {
    color: 'black',
    paddingTop: 15,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
