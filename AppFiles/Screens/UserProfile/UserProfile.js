import {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
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
} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import {PrimaryButton, UserAvatar} from '../../Exporter';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../../Store/AuthContext';
import {useDrawerStatus} from '@react-navigation/drawer';
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

  const AuthCTX = useContext(AuthContext);

  useLayoutEffect(() => {
    const {email} = JSON.parse(AuthCTX.userInfo);
    console.log(typeof email);
    firestore()
      .collection('User_details')
      .where('email', '==', email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          console.log('doc = ', documentSnapshot);
          console.log('doc Data = ', documentSnapshot.data());
          console.log('doc ID = ', documentSnapshot.id);
          setUserDocId(documentSnapshot.id);
          const {email, name} = documentSnapshot.data();
          setUserData({...userData, email: email, name: name});
        });
      });
  }, []);

  const updateUserData = userData => {
    const {email, localId} = JSON.parse(AuthCTX.userInfo);
    AuthCTX.setUserInfo({email: email, name: userData.name, localId: localId});
    firestore()
      .collection('User_details')
      .doc(userDocId)
      .update({
        name: userData.name,
        pincode: userData.pincode,
        address: userData.address,
      })
      .then(() => {
        console.log('User updated!');
      });
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

    const pincode = userData.pincode;
    const address = userData.address;
    if (
      pincodeErrorMessage == '' &&
      addressErrorMessage == '' &&
      nameErrorMessage == ''
    ) {
      console.log('sending data....');
      updateUserData(userData);
      // setisAuthenticating(true);
      // setUserData({...userData, pincode: ''});
      // setUserData({...userData, address: ''});
      return;
    }
  };

  return (
    <ScrollView>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.userDetails}>
          <UserAvatar
            fontScale={fontScale * 3}
            isImage={false}
            word="S"
            style={{backgroundColor: GlobalStyles.colors.color1}}
            onPress={() => {
              navigation.navigate('userProfile');
            }}
          />
          <Text style={[styles.name, {fontSize: fontScale * 20}]}>
            Full Name
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
            onChangeText={value => {
              // setUserData({...userData, confirmPassword: value});
              // setConfirmPasswordErrorMessage('');
            }}
            // onPressIn={() => {
            //   console.log("done")
            // }}
          />
          {/* {!!confirmPasswordErrorMessage ? (
            <Text style={styles.errorMessage}>
              {confirmPasswordErrorMessage}
            </Text>
          ) : null} */}
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
            placeholder="Enter address"
            value={userData.address}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={value => {
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
  errorMessage: {
    color: GlobalStyles.colors.PrimaryButtonColor,
    paddingHorizontal: 10,
  },
});
