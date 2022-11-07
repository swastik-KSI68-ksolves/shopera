import React, {useRef, useState, useEffect} from 'react';
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
} from 'react-native';
import {head1, head2, button1} from '../../Constants/Common';
import PrimaryButton from '../../Components/UI/PrimaryButton';
import Lottie from 'lottie-react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';

const Login = ({navigation}) => {
  const imageContainer = useRef(new Animated.Value(1.2)).current;
  const [errorMessage, setErrorMessage] = useState('');
  const [userData, setuserData] = useState({
    email: '',
    password: '',
  });

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

  //Email validation function
  const handleEmailValidation = val => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    if (val.length === 0) {
      setErrorMessage('email field is empty');
    } else if (reg.test(val) === false) {
      setErrorMessage('enter valid email address');
    } else if (reg.test(val) === true) {
      setErrorMessage('');
    }
  };

  const handleUserLogin = () => {
    handleEmailValidation(userData.email);
    if (userData.email == '' || userData.password == '') {
      setErrorMessage('Fill all fields');
    } else if (userData.password < 8) {
      setErrorMessage('Password is too short');
    } else if (errorMessage == '') {
      setErrorMessage('login done');
      //TODO login user with his credentials
    }
  };

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
          placeholderTextColor={GlobalStyles.colors.color3}
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
          placeholderTextColor={GlobalStyles.colors.color3}
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
        style={styles.buttonLogin}
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
            onPress={() => navigation.navigate('register')} //navigate to register screen
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
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
  buttonLogin: {
    backgroundColor: '#FE7E80',
  },
});
