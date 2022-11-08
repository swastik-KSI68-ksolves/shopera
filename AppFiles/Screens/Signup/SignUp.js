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
} from 'react-native';

import {head1, head2} from '../../Constants/Common';
import PrimaryButton from '../../Components/UI/PrimaryButton';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import Lottie from 'lottie-react-native';
import LoadingOverlay from '../../Components/UI/LoadingOverlay';
import {AuthContext} from '../../Store/AuthContext';
import {userSignup} from '../../Utils/auth';

const SignUp = ({navigation}) => {
  const Authctx = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [canSendData, setCanSendData] = useState(false);
  const [passwordValidError, setpasswordValidError] = useState('');
  const imageContainer = useRef(new Animated.Value(1.5)).current;
  const [isAuthenticating, setisAuthenticating] = useState(false);
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

  useEffect(() => {
    if (errorMessage == '') {
      setCanSendData(true);
    }
  }, [errorMessage]);

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
    console.debug(val);
    console.debug(pattern.test(val));

    if (pattern.test(val) === false) {
      setErrorMessage('enter a valid name');
    } else {
      setErrorMessage('');
    }
  };

  //Email validation function
  const handleEmailValidation = val => {
    console.log('email');
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (val.length === 0) {
      console.log('Hello');
      setErrorMessage('email field is empty');
    } else if (reg.test(val) === false) {
      console.log('Hello 2');
      setErrorMessage('enter valid email address');
    } else if (reg.test(val) === true) {
      console.log('Hello 3');
      setErrorMessage('');
    }
  };

  async function sendUserData({email, password}) {
    setisAuthenticating(true);
    response = await userSignup(email, password);
    console.log('res = ', response);
    if (typeof response != 'object') {
      Alert.alert(response, 'Check your credentials, or try again later');
    } else {
      Authctx.Authenticate(response.idToken);
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
      setErrorMessage('Fill all fields');
      return;
    } else if (userData.password.length < 8) {
      setErrorMessage('Password is too short');
      return;
    } else if (userData.password != userData.confirmPassword) {
      setErrorMessage('passwords must match');
      return;
    }
    if (true) {
      handleEmailValidation(userData.email);
    }
    handleNameValidation(userData.name);

    const email = userData.email;
    const password = userData.password;
    if (canSendData) {
      sendUserData({email, password});
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

      {errorMessage ? (
        <Text style={[head2, {color: 'red'}]}>{errorMessage}</Text>
      ) : passwordValidError ? (
        <Text style={[head2, styles.passwordMsg]}> {passwordValidError} </Text>
      ) : (
        <Text style={styles.link2}>
          Already registered?&nbsp;
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Login')}>
            Login here
          </Text>
        </Text>
      )}

      <View style={styles.formgroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Name"
          placeholderTextColor={GlobalStyles.colors.color2}
          autoCorrect={false}
          autoCapitalize="none"
          value={userData.name}
          onChangeText={value => {
            setUserData({...userData, name: value});
          }}
          onPressIn={() => {
            setpasswordValidError('');
            setErrorMessage('');
          }}
        />
      </View>
      <View style={styles.formgroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Email"
          placeholderTextColor={GlobalStyles.colors.color2}
          value={userData.email}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={value => {
            setUserData({...userData, email: value});
          }}
          onPressIn={() => {
            setpasswordValidError('');
            setErrorMessage('');
          }} // remove error message on click
        />
      </View>
      <View style={styles.formgroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor={GlobalStyles.colors.color2}
          secureTextEntry={true}
          value={userData.password}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={value => {
            setUserData({...userData, password: value});
          }}
          onPressIn={() => {
            setErrorMessage('');
            setpasswordValidError('');
          }}
        />
      </View>
      <View style={styles.formgroup}>
        <Text style={styles.label}>Confirm password</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor={GlobalStyles.colors.color2}
          placeholder="Enter your password again"
          secureTextEntry={true}
          value={userData.confirmPassword}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={value => {
            setUserData({...userData, confirmPassword: value});
          }}
          onPressIn={() => {
            setpasswordValidError('');
            setErrorMessage('');
          }}
        />
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
  passwordMsg: {
    color: 'red',
  },
  PasswordStrong: {
    color: 'green',
  },
  PasswordMedium: {
    color: 'blue',
  },
  PasswordWeak: {
    color: 'red',
  },
  buttonRegisterOn: {
    backgroundColor: '#FE7E80',
  },
  buttonRegisterOff: {
    backgroundColor: GlobalStyles.colors.color3,
  },
});
