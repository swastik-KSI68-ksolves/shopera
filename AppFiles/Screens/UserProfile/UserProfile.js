import {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Animated,
  Keyboard,
  ToastAndroid,
  Pressable,
} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import {PrimaryButton, UserAvatar} from '../../Exporter';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../../Store/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import {useRoute} from '@react-navigation/native';

const UserProfile = ({navigation}) => {
  const {fontScale} = useWindowDimensions();
  const [nameErrorMessage, setNameErrorMessage] = useState(null);
  const [pincodeErrorMessage, setPincodeErrorMessage] = useState(null);
  const [addressErrorMessage, setAddressErrorMessage] = useState(null);
  const [userDocId, setUserDocId] = useState(null);

  const [userData, setUserData] = useState({
    name: '',
    pincode: '',
    address: '',
  });

  console.log(userData);

  const AuthCTX = useContext(AuthContext);
  const userInfo = JSON.parse(AuthCTX.userInfo);
  const word = userInfo.name.charAt(0);

  const route = useRoute();
  const isCheckout = route.params?.isCheckout;
  console.log(isCheckout);

  useLayoutEffect(() => {
    if (isCheckout == undefined) {
      navigation.setOptions({
        headerRight: () => (
          <Pressable
            style={({pressed}) =>
              pressed ? {paddingRight: 15, opacity: 0.75} : {paddingRight: 15}
            }
            onPress={() => AuthCTX.Logout()}>
            <Icon name="log-out-outline" color="black" size={fontScale * 30} />
          </Pressable>
        ),
      });
    }
  }, [navigation]);

  useEffect(() => {
    const {email} = JSON.parse(AuthCTX.userInfo);
    firestore()
      .collection('User_details')
      .where('email', '==', email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          setUserDocId(documentSnapshot.id);
          const {email, name} = documentSnapshot.data();
          const {address, pincode} = documentSnapshot.data();
          if (address && pincode) {
            setUserData({
              ...userData,
              email: email,
              name: name,
              address: address,
              pincode: pincode,
            });
          } else {
            setUserData({...userData, email: email, name: name});
          }
        });
      });
  }, []);

  const updateUserData = async userData => {
    console.log('user data in update', userData);
    const {email, localId} = JSON.parse(AuthCTX.userInfo);
    AuthCTX.setUserInfo({email: email, name: userData.name, localId: localId});
    await firestore()
      .collection('User_details')
      .doc(userDocId)
      .update({
        name: userData.name,
        pincode: userData.pincode,
        address: userData.address,
      })
      .then(() => {
        if (isCheckout) {
          navigation.goBack();
        }
        AuthCTX.setAddress(
          `${userData.name}, ${userData.pincode}, ${userData.address}`,
        );
        ToastAndroid.show('details updated', ToastAndroid.SHORT);
      });

    return;
  };

  // name validation function
  const handleNameValidation = val => {
    let pattern = /^[a-zA-Z]{2,40}( [a-zA-Z]{2,40})+$/;
    if (pattern.test(val) === false) {
      setNameErrorMessage('enter a valid name');
      return;
    }
    setNameErrorMessage('');
    return;
  };

  const sendUserDataToServer = () => {
    if (userData.pincode == '' || userData.address == '') {
      if (userData.pincode == '') setPincodeErrorMessage('picode required');
      if (userData.address == '') setAddressErrorMessage('address required');

      if (userData.pincode != '') setPincodeErrorMessage('');
      if (userData.address != '') setAddressErrorMessage('');
      return;
    }

    handleNameValidation(userData.name);

    if (userData.pincode.length != 6) {
      setPincodeErrorMessage('Pincode must be 6 character long');
      return;
    }
    if (
      pincodeErrorMessage == '' &&
      addressErrorMessage == '' &&
      nameErrorMessage == ''
    ) {
      updateUserData(userData);
    }
    return;
  };

  return (
    <ScrollView>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.userDetails}>
          <UserAvatar
            fontScale={fontScale * 3}
            isImage={false}
            word={word}
            style={{backgroundColor: GlobalStyles.colors.color1}}
            onPress={() => {
              navigation.navigate('userProfile');
            }}
          />
          <Text style={[styles.name, {fontSize: fontScale * 20}]}>
            {userData.name}
          </Text>
        </View>
        <View style={styles.formgroup}>
          <Text style={styles.label}>your name </Text>
          <TextInput
            style={!pincodeErrorMessage ? styles.input : styles.inputError}
            placeholderTextColor={GlobalStyles.colors.color2}
            placeholder="Full Name"
            value={userData.name}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={value => {
              setUserData({...userData, name: value});
              setNameErrorMessage('');
            }}
            onPressIn={() => {
              setNameErrorMessage('');
            }}
          />
          {!!nameErrorMessage ? (
            <Text style={styles.errorMessage}>{nameErrorMessage}</Text>
          ) : null}
        </View>
        <View style={styles.formgroup}>
          <Text style={styles.label}>your email</Text>
          <TextInput
            editable={false}
            style={[styles.input, {backgroundColor: '#ddd'}]}
            placeholderTextColor={GlobalStyles.colors.color2}
            placeholder="Email "
            value={userData.email}
            autoCorrect={false}
            autoCapitalize="none"
            onTouchStart={() =>
              ToastAndroid.show('Coupon Expired', ToastAndroid.SHORT)
            }
          />
        </View>
        <View style={styles.formgroup}>
          <Text style={styles.label}>Enter pincode</Text>
          <TextInput
            style={!pincodeErrorMessage ? styles.input : styles.inputError}
            placeholderTextColor={GlobalStyles.colors.color2}
            placeholder="Pincode"
            value={userData.pincode}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={value => {
              console.log('pin = ', value);
              setUserData({...userData, pincode: value});
              setPincodeErrorMessage('');
            }}
            onPressIn={() => {
              setPincodeErrorMessage('');
            }}
          />
          {!!pincodeErrorMessage ? (
            <Text style={styles.errorMessage}>{pincodeErrorMessage}</Text>
          ) : null}
        </View>
        <View style={styles.formgroup}>
          <Text style={styles.label}>Enter Address </Text>
          <TextInput
            multiline={true}
            numberOfLines={5}
            style={!addressErrorMessage ? styles.input : styles.inputError}
            placeholderTextColor={GlobalStyles.colors.color2}
            placeholder="Address - House No/Street/City "
            value={userData.address}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={value => {
              console.log('address = ', value);
              setUserData({...userData, address: value});
              setAddressErrorMessage('');
            }}
            onPressIn={() => {
              setAddressErrorMessage('');
            }}
          />
          {!!addressErrorMessage ? (
            <Text style={styles.errorMessage}>{addressErrorMessage}</Text>
          ) : null}
        </View>
        <PrimaryButton
          style={styles.buttonRegisterOn}
          onPress={sendUserDataToServer}>
          Update
        </PrimaryButton>
        {/* <PrimaryButton style={styles.logout} onPress={() => AuthCTX.Logout()}>
          Logout
        </PrimaryButton> */}
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.color4,
    paddingHorizontal: 10,
  },
  userDetails: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  name: {
    color: 'black',
    paddingTop: 15,
  },
  formgroup: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: '100%',
    margin: 5,
  },
  label: {
    color: 'rgba(0,0,0,0.7)',
    marginLeft: 10,
    paddingBottom: 5,
  },
  input: {
    color: GlobalStyles.colors.color1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
    padding: 10,
  },
  inputError: {
    color: GlobalStyles.colors.color1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
    padding: 10,
    borderColor: GlobalStyles.colors.PrimaryButtonColor,
    borderWidth: 1,
  },
  buttonRegisterOn: {
    backgroundColor: GlobalStyles.colors.PrimaryButtonColor,
  },
  logout: {
    paddingTop: 20,
    backgroundColor: GlobalStyles.colors.color2,
  },
  errorMessage: {
    color: GlobalStyles.colors.PrimaryButtonColor,
    paddingHorizontal: 10,
  },
});
