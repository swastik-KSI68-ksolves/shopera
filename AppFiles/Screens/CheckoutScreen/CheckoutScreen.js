import React, {useEffect} from 'react';
import {Pressable, Text, useWindowDimensions} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import {useRoute} from '@react-navigation/native';

const CheckoutScreen = ({navigation}) => {
  const {fontScale, width} = useWindowDimensions();
  const route = useRoute();
  const cartData = route.params.productData;

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
  return <Text style={{color: 'black', fontSize: 25}}>{cartData.length}</Text>;
};

export default CheckoutScreen;
