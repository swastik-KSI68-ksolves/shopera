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
  Pressable,
  ToastAndroid,
  useWindowDimensions,
} from 'react-native';
import {head1, head2, button1} from '../../Constants/Common';
import PrimaryButton from '../../Components/UI/PrimaryButton';
import Lottie from 'lottie-react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import {FlatList} from 'react-native-gesture-handler';
import LoadingOverlay from '../../Components/UI/LoadingOverlay';
import {AuthContext} from '../../Store/AuthContext';
import {userLogin} from '../../Utils/auth';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

const Login = ({navigation}) => {
  const {fontScale} = useWindowDimensions();
  const Authctx = useContext(AuthContext);
  const [isAuthenticating, setisAuthenticating] = useState(false);
  const imageContainer = useRef(new Animated.Value(1.2)).current;

  // for validation
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(null);
  const [emailErrorMessage, setEmailErrorMessage] = useState(null);
  const [iconName, setIconName] = useState('eye-outline');

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

  async function sendUserData({email, password}) {
    response = await userLogin(email, password);
    if (typeof response != 'object') {
      Alert.alert(
        response.toLowerCase(),
        'Check your email and password, or try again later',
      );
    } else {
      const localId = response.localId;
      firestore()
        .collection('User_details')
        .where('email', '==', email)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            const {email, name} = documentSnapshot.data();
            Authctx.setUserInfo({email: email, name: name, localId: localId});
          });
        });

      Authctx.Authenticate(response.idToken);
    }
    setisAuthenticating(false);
  }

  const handleUserLogin = () => {
    if (userData.email == '' || userData.password == '') {
      if (userData.email == '') setEmailErrorMessage('email required');
      if (userData.password == '') setPasswordErrorMessage('password required');
      if (userData.email != '') setEmailErrorMessage('');
      if (userData.password != '') setPasswordErrorMessage('');
      return;
    }
    handleEmailValidation(userData.email);

    if (userData.password.length < 8) {
      setPasswordErrorMessage('password is too short');
      return;
    }

    const email = userData.email;
    const password = userData.password;

    if (emailErrorMessage == '' && passwordErrorMessage == '') {
      setisAuthenticating(true);
      sendUserData({email, password});
      setuserData({...userData, password: ''});
      return;
    }
  };

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging in.." />;
  }

  const forgotPasswordHandler = () => {
    if (!emailErrorMessage && userData.email) {
      auth()
        .sendPasswordResetEmail(userData.email)
        .then(
          Alert.alert(
            'password reset email sent',
            'to your registerd email id',
          ),
        )
        .catch(err => {
          console.log(err);
          ToastAndroid.show('Some thing went wrong', ToastAndroid.SHORT);
        });
    } else {
      ToastAndroid.show('Please enter email', ToastAndroid.SHORT);
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

      <Text style={head1}>login</Text>
      <Text style={head2}>login in to continue</Text>

      <View style={styles.formgroup}>
        <Text style={styles.label}>email</Text>
        <TextInput
          style={!emailErrorMessage ? styles.input : styles.inputError}
          placeholder="Enter your email"
          value={userData.email}
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={GlobalStyles.colors.color2}
          onChangeText={value => {
            setuserData({...userData, email: value});
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
        <Text style={styles.label}>password</Text>
        <View>
          {/* fff */}
          <TextInput
            style={!passwordErrorMessage ? styles.input : styles.inputError}
            placeholder="Enter your password"
            placeholderTextColor={GlobalStyles.colors.color2}
            secureTextEntry={iconName == 'eye-outline' ? true : false}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={value => {
              setuserData({...userData, password: value});
              setPasswordErrorMessage('');
            }}
            onPressIn={() => {
              setPasswordErrorMessage('');
            }} // remove error message on click
          />
          <Pressable
            onPress={() =>
              iconName == 'eye-outline'
                ? setIconName('eye-off-outline')
                : setIconName('eye-outline')
            }
            style={{
              alignSelf:'flex-end',
              width: '20%',
              alignItems: 'flex-end',
              paddingHorizontal: 15,
              top: fontScale * -33,
            }}>
            <Icon
              name={iconName}
              color={GlobalStyles.colors.color1}
              size={fontScale * 22}
            />
          </Pressable>
        </View>
        {!!passwordErrorMessage ? (
          <Text style={styles.errorMessage}>{passwordErrorMessage}</Text>
        ) : null}
      </View>
      <Pressable style={styles.fp} onPress={forgotPasswordHandler}>
        <Text style={styles.link}>forgot password?</Text>
      </Pressable>
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
          don't have an account?&nbsp;
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Signup')} //navigate to register screen
          >
            create a new account
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
  inputError: {
    color: GlobalStyles.colors.color1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
    padding: 10,
    borderColor: GlobalStyles.colors.colorRedShade2,
    borderWidth: 1,
  },
  link: {
    color: GlobalStyles.colors.color1,
    fontSize: 15,
  },
  fp: {
    display: 'flex',
    alignItems: 'flex-end',
    marginHorizontal: 10,
    marginVertical: 5,
    paddingVertical: 5,
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
    backgroundColor: GlobalStyles.colors.PrimaryButtonColor,
  },
  buttonLoginOff: {
    backgroundColor: GlobalStyles.colors.color3,
  },
  errorMessage: {
    color: GlobalStyles.colors.colorRedShade2,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
});
