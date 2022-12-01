import React, {useEffect} from 'react';
import {Pressable, Text, useWindowDimensions} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import Icon from 'react-native-vector-icons/Ionicons';

const CheckoutScreen = ({navigation}) => {
  const {fontScale, width} = useWindowDimensions();
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
  return <Text>Checkout screen</Text>;
};

export default CheckoutScreen;
