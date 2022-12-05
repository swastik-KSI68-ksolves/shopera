import React from 'react';
import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {GlobalStyles} from '../../Constants/GlobalStyles';

const OptionPicker = ({icon, fontScale, color, onPress, text}) => {
  const stylesInside = StyleSheet.create({
    optionPicker: {
      paddingHorizontal: 30,
      marginTop: 15,
      paddingBottom: 10,
      marginBottom: 15,
      backgroundColor: 'white',
      alignSelf: 'center',
      width: '85%',
      height: 70,
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
    },
    text: {
      color: GlobalStyles.colors.color2,
      fontSize: fontScale * 16,
    },
  });
  return (
    <Pressable style={stylesInside.optionPicker} onPress={onPress}>
      <Icon name={icon} color={color} size={fontScale * 30} />
      <View>
        <Text style={stylesInside.text}>{text}</Text>
      </View>

      <Icon
        name="chevron-forward-outline"
        color={GlobalStyles.colors.color2}
        size={fontScale * 25}
      />
    </Pressable>
  );
};

export default OptionPicker;
