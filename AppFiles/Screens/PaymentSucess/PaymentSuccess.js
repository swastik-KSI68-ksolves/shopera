import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import Lottie from 'lottie-react-native';
import {PrimaryButton} from '../../Exporter';
import {useRoute} from '@react-navigation/native';

const PaymentSuccess = ({navigation}) => {
  const {width, fontScale, height} = useWindowDimensions();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    IconContiner: {
      width: '80%',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    optionContainer: {
      height: height / 4,
      width: '80%',
      alignSelf: 'center',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    detailsText: {
      color: GlobalStyles.colors.color2,
      fontSize: fontScale * 19,
      textAlign: 'center',
      paddingVertical: 10,
      fontWeight: '500',
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.IconContiner}>
        {/* <Icon
          name={'location-outline'}
          color={GlobalStyles.colors.color9}
          size={width / 1.5}
        /> */}
        <Lottie
          autoSize={true}
          resizeMode="cover"
          autoPlay={true}
          loop={true}
          source={require('../../assets/Lottiefiles/OrderSuccess.json')}
        />
        <Text style={styles.detailsText}>Order Placed Successfully</Text>
        <Text
          style={[
            styles.detailsText,
            {fontSize: fontScale * 16, fontWeight: '400'},
          ]}>
          Thanks For Purchasing!
        </Text>
      </View>
      <View style={styles.optionContainer}>
        {/* <Text style={styles.detailsText}>
          Order Id:<Text style={{fontWeight: '500'}}>{orderId}</Text>
        </Text> */}

        <PrimaryButton
          children=" Continue Shopping "
          color={GlobalStyles.colors.PrimaryTextColor}
          style={{
            backgroundColor: GlobalStyles.colors.color5,
          }}
          fsize={fontScale * 14}
          onPress={() => navigation.navigate('Home')}
        />
        <PrimaryButton
          children="    Manage Orders    "
          color={GlobalStyles.colors.PrimaryTextColor}
          style={{
            backgroundColor: GlobalStyles.colors.PrimaryButtonColor,
          }}
          fsize={fontScale * 14}
          onPress={() => navigation.navigate('myOrders')}
        />
      </View>
    </View>
  );
};

export default PaymentSuccess;
