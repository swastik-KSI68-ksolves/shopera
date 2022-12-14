import React, {useEffect} from 'react';
import {
  Button,
  FlatList,
  Image,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  useWindowDimensions,
  View,
  ActivityIndicator,
} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import {useRoute} from '@react-navigation/native';
import {useState} from 'react';
import {useContext} from 'react';
import {AuthContext} from '../../Store/AuthContext';
import firestore from '@react-native-firebase/firestore';
import RazorpayCheckout from 'react-native-razorpay';
import {HandleOrderAdd} from '../../Utils/OrderManagement';
import {DisplayNotification} from '../../Utils/PushNotifications/LocalNotifications';

const CheckoutScreen = ({navigation}) => {
  const {fontScale, height} = useWindowDimensions();
  const AuthCTX = useContext(AuthContext);
  const route = useRoute();
  const cartData = route.params.productData;
  const gotTotal = route.params.total;
  const howMany = route.params.howMany;
  const productTotal = gotTotal;
  const [couponCode, setCouponCode] = useState('');
  const [couponCodeErrorMessage, setCouponCodeErrorMessage] = useState('');
  const [discountGiven, setDiscountGiven] = useState('₹0');
  const [total, setTotal] = useState(gotTotal + howMany * 40);
  const [shouldApplyCoupon, setShouldApplyCoupon] = useState(true);
  const [questionVisible, setQuestionVisible] = useState('flex');
  const [sucessOrFailureIcon, setSucessOrFailureIcon] = useState('');
  const [showAddressActivity, setShowAddressActivity] = useState(true);

  var keyboardWillShowSub, keyboardWillHideSub;
  const [userData, setUserData] = useState({
    name: '',
    pincode: '',
    address: '',
    email: '',
  });
  let address = AuthCTX.address;
  useEffect(() => {
    // componentWillMount
    keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', event => {
      setQuestionVisible('none');
    });
    keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', event => {
      setQuestionVisible('flex');
    });

    return () => {
      //   componentWillUnmount
      keyboardWillShowSub.remove();
      keyboardWillHideSub.remove();
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Checkout',
      headerRightContainerStyle: {paddingHorizontal: 20},
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: GlobalStyles.colors.PrimaryButtonColor,
        marginLeft: fontScale * 25,
      },
    });
  }, [navigation]);

  useEffect(() => {
    const {email} = JSON.parse(AuthCTX.userInfo);
    firestore()
      .collection('User_details')
      .where('email', '==', email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          const {name, email} = documentSnapshot.data();
          const {address, pincode} = documentSnapshot.data();
          if (address && pincode) {
            setUserData({
              ...userData,
              name: name,
              address: address,
              pincode: pincode,
              email: email,
            });
            AuthCTX.setAddress(`${name}, ${pincode}, ${address}`);
            setShowAddressActivity(false);
          }
        });
      });
    setShowAddressActivity(false);
  }, [AuthContext, AuthCTX.userInfo]);

  const calculateDiscount = itemData => {
    const Today = new Date();
    const CouponDate = new Date(itemData.ValidTill);
    if (CouponDate > Today) {
      if (itemData.Type === 'Flat') {
        const tempTotal = total - itemData.Discount;
        console.log('1 = total = ', tempTotal, total);
        if (total > itemData.Discount) {
          setTotal(tempTotal);
          setDiscountGiven(`-₹${itemData.Discount}`);
        } else {
          ToastAndroid.show(
            'Add more items to apply this coupon',
            ToastAndroid.SHORT,
          );
        }
      }
      if (itemData.Type === 'percent') {
        const tempTotal = total - (total * itemData.Discount) / 100;
        console.log('2 = total = ', tempTotal, total);
        if (total > itemData.Discount) {
          setTotal(tempTotal);
          setDiscountGiven(`-${itemData.Discount}%`);
        } else {
          ToastAndroid.show(
            'Add more items to apply this coupon',
            ToastAndroid.SHORT,
          );
        }
      }
      setShouldApplyCoupon(false);
    } else {
      setSucessOrFailureIcon('cross1');
      ToastAndroid.show('Coupon Expired', ToastAndroid.SHORT);
      return;
    }
    return;
  };

  const findCouponCode = async () => {
    await firestore()
      .collection('Coupons')
      .where('Code', '==', couponCode.toUpperCase())
      .get()
      .then(querySnapshot => {
        if (querySnapshot.docs.length < 1) {
          setSucessOrFailureIcon('cross1');
          setCouponCodeErrorMessage('Invalid Coupon');
        } else {
          setSucessOrFailureIcon('right1');
          calculateDiscount(querySnapshot.docs[0].data());
        }
      })
      .catch(err => {
        ToastAndroid.show('No Coupon Found', ToastAndroid.SHORT);
      });
  };

  const proceedToPayment = () => {
    if (!address) {
      ToastAndroid.show('Add Address To Continue', ToastAndroid.SHORT);
      return;
    }
    var options = {
      description: 'Credits towards consultation',
      image:
        'data:image/png;base64,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',
      currency: 'INR',
      key: 'rzp_test_5ESt98Q9R8fOhd',
      amount: total * 100,
      name: 'Shopera',
      prefill: {
        email: userData.email,
        contact: '9191919191',
        name: userData.name,
      },
      theme: GlobalStyles.colors.PrimaryButtonColor,
    };
    RazorpayCheckout.open(options)
      .then(data => {
        // handle success
        const today = Date.now();
        const orderId = `L${cartData.length}R${total}D${today}`;
        const {localId} = JSON.parse(AuthCTX.userInfo);
        HandleOrderAdd(cartData, localId, total);
        navigation.navigate('myOrders');
        DisplayNotification(orderId);
      })
      .catch(error => {
        // handle failure
        alert(`Error: ${error.code} | ${error.description}`);
      });
  };

  const sytlesInside = StyleSheet.create({
    itemList: {
      marginVertical: 10,
      paddingVertical: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: '95%',
      height: height / 6,
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
    addressList: {
      paddingBottom: 10,
      marginBottom: 10,
      backgroundColor: 'white',
      alignSelf: 'center',
      width: '95%',
      height: 120,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'column',
      shadowColor: 'black',
      shadowOpacity: 0.5,
      shadowOffset: {width: 2, height: 2},
      shadowRadius: 8,
      overflow: Platform === 'android' ? 'hidden' : 'visible',
      elevation: 3,
      borderRadius: 10,
    },
    locationIconContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'baseline',
      paddingHorizontal: 10,
    },
    addressAndButtonContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'baseline',
      justifyContent: 'space-evenly',
    },
    totalPayAndButtonContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
    bottomContainer: {
      width: '95%',
      height: height / 8,
      alignSelf: 'center',
      backgroundColor: 'white',
      padding: 10,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      shadowColor: 'black',
      shadowOpacity: 0.5,
      shadowOffset: {width: 2, height: 2},
      shadowRadius: 8,
      overflow: Platform === 'android' ? 'hidden' : 'visible',
      elevation: 3,
      borderRadius: 10,
      marginBottom: 10,
    },
    totalAndVoucherContainer: {
      flex: 1,
      width: '95%',
      // height: height / 5,
      alignSelf: 'center',
      backgroundColor: 'white',
      padding: 10,
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: 'black',
      shadowOpacity: 0.5,
      shadowOffset: {width: 2, height: 2},
      shadowRadius: 8,
      overflow: Platform === 'android' ? 'hidden' : 'visible',
      elevation: 3,
      borderRadius: 10,
      marginBottom: 10,
    },
    voucherCodeContainer: {
      width: '100%',
      justifyContent: 'space-around',
      flex: 1,
      // backgroundColor: 'red',
    },
    buttonAndTextFieldContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    totalDetailsContainer: {
      flex: 1,
      // backgroundColor: 'green',
      width: '100%',
      justifyContent: 'space-evenly',
      paddingHorizontal: 15,
    },
    textDetailsContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    questions: {
      color: GlobalStyles.colors.color1,
      fontSize: fontScale * 13,
      fontWeight: '500',
    },
    answer: {
      color: GlobalStyles.colors.color2,
      fontSize: fontScale * 13,
      fontWeight: '500',
    },
    note: {
      color: GlobalStyles.colors.color2,
      fontSize: fontScale * 8,
      fontWeight: '500',
    },
  });
  return (
    <View style={sytles.container}>
      <View style={sytlesInside.addressList}>
        <View style={sytlesInside.locationIconContainer}>
          <Icon
            name={'location-outline'}
            color={GlobalStyles.colors.color5}
            size={fontScale * 25}
          />
          <Text style={{fontWeight: '450', color: GlobalStyles.colors.color5}}>
            {' '}
            Shipping Address
          </Text>
        </View>
        <View style={sytlesInside.addressAndButtonContainer}>
          {showAddressActivity ? (
            <ActivityIndicator
              color={GlobalStyles.colors.color8}
              size="small"
            />
          ) : address ? (
            <Text style={sytles.addressText}>
              {address}
              {/* {userData.name} {userData.address} {userData.pincode} */}
            </Text>
          ) : (
            <Text style={sytles.addressText}>Address not found !</Text>
          )}
          <Pressable
            android_ripple={{color: GlobalStyles.colors.color9}}
            style={sytles.selectAddress}
            onPress={() =>
              navigation.navigate('userProfile', {
                isCheckout: true,
              })
            }>
            {userData.address ? (
              <Text style={sytles.selectAddressText}>Edit address</Text>
            ) : (
              <Text style={sytles.selectAddressText}>Add address</Text>
            )}
          </Pressable>
        </View>
      </View>
      {/* <FlatList
        contentContainerStyle={{alignItems: 'center'}}
        style={{flex: 1, backgroundColor: GlobalStyles.colors.color4}}
        data={cartData}
        renderItem={renderCartData}
        keyExtractor={item => item.id}
      /> */}

      <View style={sytlesInside.totalAndVoucherContainer}>
        <View style={sytlesInside.voucherCodeContainer}>
          <View
            style={[
              sytlesInside.locationIconContainer,
              {display: questionVisible},
            ]}>
            <Icon
              name={'gift-outline'}
              color={GlobalStyles.colors.color5}
              size={fontScale * 25}
            />
            <Text
              style={{
                fontWeight: '450',
                color: GlobalStyles.colors.color5,
              }}>
              {' '}
              Coupon Code
            </Text>
          </View>
          {sucessOrFailureIcon === 'right1' ? (
            <Text
              style={{
                color: GlobalStyles.colors.color1,
                paddingHorizontal: 15,
                display: questionVisible,
                // paddingVertical: 20,
              }}>
              Hurray! you got discount
            </Text>
          ) : (
            <Text
              style={{
                color: GlobalStyles.colors.color1,
                paddingHorizontal: 15,
                display: questionVisible,
                // paddingVertical: 20,
              }}>
              Do you have any valid coupon code ?
            </Text>
          )}
          <View style={sytlesInside.buttonAndTextFieldContainer}>
            <TextInput
              editable={sucessOrFailureIcon === 'right1' ? false : true}
              removeClippedSubviews={true}
              inlineImagePadding={15}
              inlineImageLeft={sucessOrFailureIcon}
              maxLength={12}
              // style={!couponCodeErrorMessage ? sytles.input : sytles.inputError}
              style={
                couponCodeErrorMessage
                  ? sytles.inputError
                  : sucessOrFailureIcon == 'right1'
                  ? [
                      sytles.input,
                      {
                        borderColor: GlobalStyles.colors.color8,
                        borderWidth: 1,
                      },
                    ]
                  : sytles.input
              }
              placeholder={
                !couponCodeErrorMessage
                  ? 'Enter Coupon Code'
                  : couponCodeErrorMessage
              }
              value={couponCode}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="default"
              placeholderTextColor={
                !couponCodeErrorMessage
                  ? GlobalStyles.colors.color2
                  : GlobalStyles.colors.colorRedShade2
              }
              onChangeText={value => {
                setCouponCode(value);
                setCouponCodeErrorMessage('');
                if (sucessOrFailureIcon !== 'right1') {
                  setSucessOrFailureIcon('');
                }
              }}
              onPressIn={() => {
                setCouponCodeErrorMessage('');
                if (sucessOrFailureIcon !== 'right1') {
                  setSucessOrFailureIcon('');
                }
              }} // remove error message on click
            />
            <Pressable
              android_ripple={{color: GlobalStyles.colors.color9}}
              style={[
                sytles.selectAddress,
                {backgroundColor: GlobalStyles.colors.color6},
              ]}
              onPress={shouldApplyCoupon ? findCouponCode : null}>
              <Text style={sytles.selectNextText}>Use Code</Text>
            </Pressable>
          </View>
        </View>
        <View style={sytlesInside.totalDetailsContainer}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: 'black',
                fontWeight: '500',
                fontSize: fontScale * 15,
              }}>
              Total Payment
            </Text>
            <Text style={[sytlesInside.answer, {fontSize: fontScale * 15}]}>
              ₹{total}
            </Text>
          </View>
          <View
            style={{borderBottomColor: '#ddd', borderBottomWidth: 1}}></View>
          <View style={sytlesInside.textDetailsContainer}>
            <Text style={sytlesInside.questions}>Total Buy</Text>
            <Text style={sytlesInside.answer}>₹{productTotal}</Text>
          </View>
          <View style={sytlesInside.textDetailsContainer}>
            <Text style={sytlesInside.questions}>Delivery Charges</Text>
            <Text style={sytlesInside.answer}>₹{40 * howMany}</Text>
            {/* <Text style={sytlesInside.note}>₹40 each item</Text> */}
          </View>
          <View style={sytlesInside.textDetailsContainer}>
            <Text style={sytlesInside.questions}>Coupon Discount</Text>
            <Text style={sytlesInside.answer}>{discountGiven}</Text>
          </View>
        </View>
      </View>
      <View style={sytlesInside.bottomContainer}>
        <View style={sytlesInside.totalPayAndButtonContainer}>
          <View>
            <Text style={[sytles.totalPayText, {fontWeight: '500'}]}>
              Total Pay
            </Text>
            <Text
              style={[
                sytles.totalPayText,
                {color: GlobalStyles.colors.color2},
              ]}>
              ₹ {total}
            </Text>
          </View>
          <Pressable
            android_ripple={{color: GlobalStyles.colors.color9}}
            style={[
              sytles.selectAddress,
              {backgroundColor: GlobalStyles.colors.PrimaryButtonColor},
            ]}
            onPress={proceedToPayment}>
            <Text style={sytles.selectNextText}>Next</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default CheckoutScreen;
const sytles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imgContainer: {
    flex: 2,
  },
  textDetails: {
    flex: 3,
    paddingHorizontal: 10,
  },
  img: {
    flex: 1,
    resizeMode: 'center',
    // borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  title: {
    color: 'black',
    padding: 2,
  },
  rate: {
    color: 'black',
    padding: 2,
  },
  quantity: {
    color: 'black',
    padding: 2,
  },
  addressText: {
    color: GlobalStyles.colors.color2,
    width: '45%',
  },
  selectAddress: {
    backgroundColor: GlobalStyles.colors.PrimaryButtonColor,
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: 50,
    borderRadius: 10,
  },
  selectAddressText: {
    color: 'white',
  },
  totalPayText: {
    color: 'black',
  },
  selectNextText: {
    color: 'white',
  },
  inputError: {
    color: GlobalStyles.colors.color1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    padding: 10,
    borderColor: GlobalStyles.colors.colorRedShade2,
    borderWidth: 1,
  },
  input: {
    width: '50%',
    height: 50,
    color: GlobalStyles.colors.color1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    padding: 10,
  },
  errorMessage: {
    color: GlobalStyles.colors.colorRedShade2,
    paddingHorizontal: 10,
    // paddingVertical: 3,
  },
});
