import React, {useRef, useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
  Animated,
  Easing,
  Image,
  Alert,
} from 'react-native';
import {head1, head2, button1} from '../../Constants/Common';
import PrimaryButton from '../../Components/UI/PrimaryButton';
import Lottie from 'lottie-react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import {FlatList} from 'react-native-gesture-handler';
import LoadingOverlay from '../../Components/UI/LoadingOverlay';
import {AuthContext} from '../../Store/AuthContext';
import {userLogin} from '../../Utils/auth';

const Login = ({navigation}) => {
  const Authctx = useContext(AuthContext);
  const [isAuthenticating, setisAuthenticating] = useState(false);
  const imageContainer = useRef(new Animated.Value(1.2)).current;
  const [errorMessage, setErrorMessage] = useState('');
  const [canSendData, setCanSendData] = useState(false);
  const [userData, setuserData] = useState({
    email: '',
    password: '',
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
          toValue: 1.2,
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
  //   signinButtonToggler();
  // }, [userData]);

  // const signinButtonToggler = () => {
  //   userData.email.length >= 5 && userData.password.length >= 8
  //     ? setButtonShow(true)
  //     : setButtonShow(false);
  // };

  //Email validation function
  const handleEmailValidation = val => {
    console.log('email');
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (val.length === 0) {
      console.log('Hello');
      setErrorMessage('email field is empty');
    } else if (reg.test(val) === false) {
      setErrorMessage('enter valid email address');
    } else if (reg.test(val) === true) {
      setErrorMessage('');
    }
  };

  async function sendUserData({email, password}) {
    setisAuthenticating(true);
    response = await userLogin(email, password);
    console.log('res = ', response);
    if (typeof response != 'object') {
      Alert.alert(
        response,
        'Check your email and password, or try again later',
      );
    } else {
      Authctx.Authenticate(response.idToken);
    }
      setisAuthenticating(false);
  }

  const handleUserLogin = () => {
    if (userData.email == '' || userData.password == '') {
      setErrorMessage('Fill all fields');
      return;
    } else if (userData.password.length < 8) {
      setErrorMessage('Password is too short');
      return;
    }
    handleEmailValidation(userData.email);
    //TODO:handle user login here
    const email = userData.email;
    const password = userData.password;
    if (canSendData) {
      sendUserData({email, password});
    }
  };

  useEffect(() => {
    if (errorMessage == '') {
      setCanSendData(true);
    }
  }, [errorMessage]);

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

      <Text style={head1}>Login</Text>
      {errorMessage ? (
        <Text style={[head2, {color: 'red'}]}>{errorMessage}</Text>
      ) : (
        <Text style={head2}>Sign in to continue</Text>
      )}

      <View style={styles.formgroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Email"
          value={userData.email}
          autoCorrect={false}
          autoCapitalize="none"
          placeholderTextColor={GlobalStyles.colors.color2}
          onChangeText={value => {
            setuserData({...userData, email: value});
          }}
          onPressIn={() => {
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
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={value => {
            setuserData({...userData, password: value});
          }}
          onPressIn={() => {
            setErrorMessage('');
          }} // remove error message on click
        />
      </View>
      <View style={styles.fp}>
        <Text style={styles.link}>Forgot password?</Text>
      </View>
      <PrimaryButton
        style={styles.buttonLoginOn}
        onPress={() => {
          handleUserLogin();
        }}>
        {' '}
        Login{' '}
      </PrimaryButton>

      <View>
        <Text style={styles.link2}>
          Don't have an account?&nbsp;
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Signup')} //navigate to register screen
          >
            Create a new account
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.color4,
    paddingHorizontal: '5%',
  },
  imageHolder: {
    flex: 2,
    maxHeight: '50%',
    maxWidth: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: -1,
  },
  s2: {
    display: 'flex',
    zIndex: -1,
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 10,
  },
  formgroup: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 10,
    width: '100%',
    margin: 5,
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.7)',
    marginLeft: 10,
    marginBottom: 5,
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
    // color: "rgba(0,0,0,0.7)",
    marginTop: 10,
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
  buttonLoginOn: {
    backgroundColor: '#FE7E80',
  },
  buttonLoginOff: {
    backgroundColor: GlobalStyles.colors.color3,
  },
});
