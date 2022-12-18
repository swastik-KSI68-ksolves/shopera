import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {GlobalStyles} from '../../Constants/GlobalStyles';

const RatingWithColors = ({rating, size}) => {
  const {fontScale, width} = useWindowDimensions();
  const manageRatingColor = () => {
    if (rating >= 3) {
      return GlobalStyles.colors.ratingColor1;
    } else if (rating >= 2) {
      return GlobalStyles.colors.ratingColor1;
    } else {
      return GlobalStyles.colors.ratingColor1;
    }
  };
  const styles = StyleSheet.create({
    container: {
      backgroundColor: manageRatingColor(),
      width: width / 6.5,
      height: width / 13.5,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      borderRadius: 25,
      paddingHorizontal: 2,
      paddingVertical: 2,
      elevation: 2,
    },
  });
  return (
    <View style={styles.container}>
      <Icon name="star" color={GlobalStyles.colors.color1} size={size} />
      <Text style={{color: GlobalStyles.colors.color1}}>
        {rating.toFixed(1)}
      </Text>
    </View>
  );
};

export default RatingWithColors;
