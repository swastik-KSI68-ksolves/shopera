import React, {useState} from 'react';
import {Pressable, useWindowDimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {GlobalStyles} from '../../Constants/GlobalStyles';

const WishListAddButton = ({isAlreadyAdded, manageWishListInDb}) => {
  const {fontScale} = useWindowDimensions();
  const icon = isAlreadyAdded ? 'heart' : 'heart-outline';
  const color = isAlreadyAdded
    ? GlobalStyles.colors.colorRedShade
    : 'rgba(0,0,0,0.6)';
  const [heartOnTap, setheartOnTap] = useState(icon);
  const [heartColor, setHeartColor] = useState(color);
  return (
    <Pressable
      onPress={() => {
        const change =
          heartOnTap === 'heart-outline' ? 'heart' : 'heart-outline';
        const changeColor =
          heartColor === 'rgba(0,0,0,0.6)'
            ? GlobalStyles.colors.colorRedShade
            : 'rgba(0,0,0,0.6)';
        setheartOnTap(change);
        setHeartColor(changeColor);
        // if (
        //   heartOnTap === 'heart' &&
        //   heartColor === GlobalStyles.colors.colorRedShade
        // ) {
        () => manageWishListInDb;
        // }
      }}>
      <Icon name={heartOnTap} color={heartColor} size={fontScale * 31} />
    </Pressable>
  );
};

export default WishListAddButton;
