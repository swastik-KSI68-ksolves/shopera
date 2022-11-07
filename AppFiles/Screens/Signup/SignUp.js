import React, { useEffect, useRef, useState } from 'react'
import {
    View, StyleSheet, Keyboard,
    Text, TextInput, Animated, KeyboardAvoidingView
} from 'react-native'

import { head1, head2 } from '../../CommonStyling/Common'
import PrimaryButton from '../../Components/PrimaryButton'
import {GlobalStyles} from "../../Constants/GlobalStyles"
import Lottie from 'lottie-react-native';



const SignUp = ({ navigation }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordValidError, setpasswordValidError] = useState('');
    const [buttonShow, setButtonShow] = useState(false);
    const imageContainer = useRef(new Animated.Value(1.5)).current;

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    useEffect(() => {
        // componentWillMount 
        const keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', (event) => {
            // fadeInImageWithScaleHide();
            Animated.timing(imageContainer, {
                duration: event.duration,
                toValue: 5,
                useNativeDriver: false,
            }).start();
        });
        const keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', (event) => {
            // fadeInImageWithScale
            Animated.timing(imageContainer, {
                duration: event.duration,
                toValue: 1.5,
                useNativeDriver: false,
            }).start();
        });

        return () => {
            //   componentWillUnmount
            keyboardWillShowSub.remove();
            keyboardWillHideSub.remove();
        }
    }, [])


    // name validation function
    const handleNameValidation = (val) => {
        let pattern = /^[a-zA-Z]{2,40}( [a-zA-Z]{2,40})+$/;
        console.debug(val)
        console.debug(pattern.test(val))

        if (pattern.test(val) === false) {
            setErrorMessage('enter a valid name')
        } else {
            setErrorMessage('');
        }
    };

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
        else {
            setErrorMessage('');
        }
    };

    //Password validation function
    const handlePasswordValidationAlert = (value) => {
        let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
        let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')
        if (value.length === 0) {
            setpasswordValidError('password field is empty');
            return;
        } else if (strongPassword.test(value)) {
            setpasswordValidError("password - Strong");
            styles.passwordMsg = styles.PasswordStrong
            return;
        } else if (mediumPassword.test(value)) {
            setpasswordValidError("password - Medium");
            styles.passwordMsg = styles.PasswordMedium
            return;
        } else {
            setpasswordValidError("password - Weak");
            styles.passwordMsg = styles.PasswordWeak
            return;
        }

        setpasswordValidError('');
    }



    const sendUserData = async () => {

        let pattern = /^[a-zA-Z]{2,40}( [a-zA-Z]{2,40})+$/;
        if (pattern.test(userData.name)) {
            setErrorMessage('');
        } else {
            setErrorMessage('enter a valid name')
        }

        handleEmailValidation(userData.email);
        if (
            userData.name == '' ||
            userData.email == '' ||
            userData.password == '' ||
            userData.confirmPassword == ''
        ) {
            setErrorMessage("please fill all feilds");
            return;
        }

        else if (userData.password != userData.confirmPassword) {
            setErrorMessage("passwords must match")
            return;
        }

        else if (errorMessage == '') {
            const users = firestore().collection('Users').add({
                email: userData.email,
                name: userData.name,
                password: userData.password
            });

            users.then(sd => {
            });
            return;
        }
    }

    return (

        <KeyboardAvoidingView
            style={styles.container}
            behavior="height"
        >
            <Animated.View
                style={{
                    width: "100%",
                    aspectRatio: imageContainer
                }}
            >
                <Lottie
                    autoPlay={true}
                    loop={true}
                    source={require('../../assets/Lottiefiles/register.json')}
                />
            </Animated.View>

            <Text style={head1}>Create a new account</Text>

            {errorMessage ? <Text style={[head2, { color: "red" }]}>{errorMessage}</Text> :
                passwordValidError ? <Text style={[head2, styles.passwordMsg]}> {passwordValidError} </Text> :
                    <Text style={styles.link2}>Already registered?&nbsp;
                        <Text style={styles.link}
                            onPress={() => navigation.navigate('login')}
                        >
                            Login here
                        </Text>
                    </Text>

            }

            <View style={styles.formgroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput style={styles.input}
                    placeholder="Enter your Name"
                    placeholderTextColor={Colors.color3}
                    autoCorrect={false}
                    autoCapitalize="none"
                    value={userData.name}
                    onChangeText={(value) => {
                        setUserData({ ...userData, name: value })
                    }}
                    onPressIn={() => {
                        setpasswordValidError('');
                        setErrorMessage('');
                    }}

                />
            </View>
            <View style={styles.formgroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input}
                    placeholder="Enter your Email"
                    placeholderTextColor={Colors.color3}
                    value={userData.email}
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={(value) => {
                        setUserData({ ...userData, email: value })
                    }}
                    onPressIn={() => {
                        setpasswordValidError('');
                        setErrorMessage('');
                    }}      // remove error message on click 
                />
            </View>
            <View style={styles.formgroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput style={styles.input} placeholder="Enter your password"
                    placeholderTextColor={Colors.color3}
                    secureTextEntry={true}
                    value={userData.password}
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={(value) => {
                        setUserData({ ...userData, password: value })
                        handlePasswordValidationAlert(userData.password)
                    }}
                    onPressIn={() => {
                        setErrorMessage('');
                        setpasswordValidError('');
                    }}
                />
            </View>
            <View style={styles.formgroup}>
                <Text style={styles.label}>Confirm password</Text>
                <TextInput style={styles.input}
                    placeholderTextColor={Colors.color3}
                    placeholder="Enter your password again"
                    secureTextEntry={true}
                    value={userData.confirmPassword}
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={(value) => {
                        setUserData({ ...userData, confirmPassword: value })
                        value.length >= 3 ? setButtonShow(true) : setButtonShow(false)
                    }}
                    onPressIn={() => {
                        setpasswordValidError('');
                        setErrorMessage('');
                    }
                    }

                />
            </View>
            <PrimaryButton
                allDone={!buttonShow}
                style={buttonShow ? styles.buttonRegisterOn : styles.buttonRegisterOff}
                onPress={() => {
                    sendUserData();
                }}
            > Register</PrimaryButton>
        </KeyboardAvoidingView >



    )
}

export default SignUp;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.color4,
        paddingHorizontal: "5%"
    },
    imageHolder: {
        flex: 1,
        maxHeight: "30%",
        maxWidth: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        zIndex: -1,
    },
    formgroup: {
        display: "flex",
        flexDirection: "column",
        paddingHorizontal: 10,
        width: "100%",
        margin: 5,
    },
    label: {
        color: "rgba(0,0,0,0.7)",
        marginLeft: 10,
        color: Colors.color4,
    },
    input: {
        color: Colors.color1,
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 20,
        padding: 10,
    },
    input1: {
        color: Colors.color1,
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 10,
        padding: 10,
        height: 100,
    },
    link: {
        color: Colors.color01,
        fontSize: 15,

    },
    fp: {
        display: "flex",
        alignItems: "flex-end",
        marginHorizontal: 10,
        marginVertical: 5,
    },
    link2: {
        color: Colors.color2,
        fontSize: 15,
        textAlign: "center",
    },
    passwordMsg: {
        color: "red"
    },
    PasswordStrong: {
        color: "green"
    },
    PasswordMedium: {
        color: "blue"
    },
    PasswordWeak: {
        color: "red"
    },
    buttonRegisterOn: {
        backgroundColor: "#ff681c",
    },
    buttonRegisterOff: {
        backgroundColor: Colors.color3
    }
})