import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  Text,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
} from 'react-native';

import {head1, head2} from '../../Constants/Common';
import PrimaryButton from '../../Components/UI/PrimaryButton';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import Lottie from 'lottie-react-native';
import LoadingOverlay from '../../Components/UI/LoadingOverlay';
import {AuthContext} from '../../Store/AuthContext';
import {userSignup} from '../../Utils/auth';
import firestore from '@react-native-firebase/firestore';

const SignUp = ({navigation}) => {
  const Authctx = useContext(AuthContext);
  const imageContainer = useRef(new Animated.Value(1.5)).current;
  const [isAuthenticating, setisAuthenticating] = useState(false);

  // for validation
  const [nameErrorMessage, setNameErrorMessage] = useState(null);
  const [emailErrorMessage, setEmailErrorMessage] = useState(null);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(null);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState(null);

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  let response;

  useEffect(() => {
    // componentWillMount
    const keyboardWillShowSub = Keyboard.addListener(
      'keyboardDidShow',
      event => {
        // fadeInImageWithScaleHide();
        Animated.timing(imageContainer, {
          duration: event.duration,
          toValue: 5,
          useNativeDriver: false,
        }).start();
      },
    );
    const keyboardWillHideSub = Keyboard.addListener(
      'keyboardDidHide',
      event => {
        // fadeInImageWithScale
        Animated.timing(imageContainer, {
          duration: event.duration,
          toValue: 1.5,
          useNativeDriver: false,
        }).start();
      },
    );

    return () => {
      //   componentWillUnmount
      keyboardWillShowSub.remove();
      keyboardWillHideSub.remove();
    };
  }, []);

  // useEffect(() => {
  //   signupButtonToggler();
  // }, [userData]);

  // const signupButtonToggler = () => {
  //   userData.name.length >= 5 &&
  //   userData.email.length >= 5 &&
  //   userData.password.length >= 8 &&
  //   userData.confirmPassword.length >= 8
  //     ? setButtonShow(true)
  //     : setButtonShow(false);
  // };

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

  //Email validation function
  const handleEmailValidation = val => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (val.length === 0) {
      setEmailErrorMessage('email field is empty');
      return;
    } else if (reg.test(val) === false) {
      setEmailErrorMessage('enter valid email address');
      return;
    }
    if (reg.test(val) === true) {
      setEmailErrorMessage('');
      return;
    }
    return;
  };

  async function sendUserData({name, email, password}) {
    response = await userSignup(email, password);
    console.log('res = ', response);
    if (typeof response != 'object') {
      Alert.alert(
        response.toLowerCase(),
        'Check your credentials, or try again later',
      );
    } else {
      const users = firestore().collection('User_details').add({
        email: email,
        name: name,
      });
      users.then(sd => {
        console.log('saved in db');
      });
      Authctx.Authenticate(response.idToken);
      Authctx.setUserInfo({email: email, name: name});
    }
    setisAuthenticating(false);
  }

  const handleUserSignup = () => {
    if (
      userData.name == '' ||
      userData.email == '' ||
      userData.password == '' ||
      userData.confirmPassword == ''
    ) {
      if (userData.name == '') setNameErrorMessage('name required');
      if (userData.email == '') setEmailErrorMessage('email required');
      if (userData.password == '') setPasswordErrorMessage('password required');
      if (userData.confirmPassword == '')
        setConfirmPasswordErrorMessage('required');

      if (userData.name != '') setNameErrorMessage('');
      if (userData.email != '') setEmailErrorMessage('');
      if (userData.password != '') setPasswordErrorMessage('');
      if (userData.confirmPassword != '') setConfirmPasswordErrorMessage('');
      return;
    }

    handleNameValidation(userData.name);
    handleEmailValidation(userData.email);

    if (userData.password.length < 8) {
      setPasswordErrorMessage('Password is too short');
      return;
    }

    if (userData.password != userData.confirmPassword) {
      setConfirmPasswordErrorMessage('both password must match');
      return;
    }

    const email = userData.email;
    const password = userData.password;
    const name = userData.name;

    console.debug('not sending data....');
    console.debug(userData);
    if (
      emailErrorMessage == '' &&
      passwordErrorMessage == '' &&
      nameErrorMessage == ''
    ) {
      console.log('sending data....');
      setisAuthenticating(true);
      sendUserData({name, email, password});
      setUserData({...userData, password: ''});
      setUserData({...userData, confirmPassword: ''});
      return;
    }
  };

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating new user" />;
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <Animated.View
        style={{
          width: '100%',
          aspectRatio: imageContainer,
        }}>
        <Lottie
          autoPlay={true}
          loop={true}
          source={require('../../assets/Lottiefiles/Login.json')}
        />
      </Animated.View>

      <Text style={head1}>Create a new account</Text>

      <Text style={styles.link2}>
        Already registered?&nbsp;
        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
          Login here
        </Text>
      </Text>

      <View style={styles.formgroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={!nameErrorMessage ? styles.input : styles.inputError}
          placeholder="Enter your Name"
          placeholderTextColor={GlobalStyles.colors.color2}
          autoCorrect={false}
          autoCapitalize="none"
          value={userData.name}
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
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={!emailErrorMessage ? styles.input : styles.inputError}
          placeholder="Enter your Email"
          placeholderTextColor={GlobalStyles.colors.color2}
          value={userData.email}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={value => {
            setUserData({...userData, email: value});
            setEmailErrorMessage('');
          }}
          onPressIn={() => {
            setEmailErrorMessage('');
          }} // remove error message on click
        />
        {!!emailErrorMessage ? (
          <Text style={styles.errorMessage}>{emailErrorMessage}</Text>
        ) : null}
      </View>
      <View style={styles.formgroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={!passwordErrorMessage ? styles.input : styles.inputError}
          placeholder="Enter your password"
          placeholderTextColor={GlobalStyles.colors.color2}
          secureTextEntry={true}
          value={userData.password}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={value => {
            setUserData({...userData, password: value});
            setPasswordErrorMessage('');
          }}
          onPressIn={() => {
            setPasswordErrorMessage('');
          }}
        />
        {!!passwordErrorMessage ? (
          <Text style={styles.errorMessage}>{passwordErrorMessage}</Text>
        ) : null}
      </View>
      <View style={styles.formgroup}>
        <Text style={styles.label}>Confirm password</Text>
        <TextInput
          style={
            !confirmPasswordErrorMessage ? styles.input : styles.inputError
          }
          placeholderTextColor={GlobalStyles.colors.color2}
          placeholder="Enter your password again"
          secureTextEntry={true}
          value={userData.confirmPassword}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={value => {
            setUserData({...userData, confirmPassword: value});
            setConfirmPasswordErrorMessage('');
          }}
          onPressIn={() => {
            setConfirmPasswordErrorMessage('');
          }}
        />
        {!!confirmPasswordErrorMessage ? (
          <Text style={styles.errorMessage}>{confirmPasswordErrorMessage}</Text>
        ) : null}
      </View>
      <PrimaryButton
        style={styles.buttonRegisterOn}
        onPress={() => {
          handleUserSignup();
        }}>
        Signup
      </PrimaryButton>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.color4,
    paddingHorizontal: '5%',
  },
  imageHolder: {
    flex: 1,
    maxHeight: '30%',
    maxWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    zIndex: -1,
  },
  formgroup: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 10,
    width: '100%',
    margin: 5,
  },
  label: {
    color: 'rgba(0,0,0,0.7)',
    marginLeft: 10,
    color: GlobalStyles.colors.color4,
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
  link: {
    color: GlobalStyles.colors.color01,
    fontSize: 15,
  },
  fp: {
    display: 'flex',
    alignItems: 'flex-end',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  link2: {
    color: GlobalStyles.colors.color2,
    fontSize: 15,
    textAlign: 'center',
  },
  buttonRegisterOn: {
    backgroundColor: '#FE7E80',
  },
  buttonRegisterOff: {
    backgroundColor: GlobalStyles.colors.color3,
  },
  errorMessage: {
    color: GlobalStyles.colors.PrimaryButtonColor,
    paddingHorizontal: 10,
    // paddingVertical: 3,
  },
});
