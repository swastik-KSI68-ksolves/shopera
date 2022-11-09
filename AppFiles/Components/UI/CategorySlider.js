import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import Icon from 'react-native-vector-icons/Ionicons';

const CategorySlider = ({size, color}) => {
  return (
    <ScrollView style={styles.categorySlider} horizontal>
      <View style={styles.setView}>
        <View style={styles.iconBox}>
          <Icon name="ios-build" color={color} size={size} />
        </View>

        <Text style={styles.setText}>Tools</Text>
      </View>
      <View style={styles.setView}>
        <View style={styles.iconBox}>
          <Icon
            name="ios-bicycle"
            color={color}
            size={size}
            style={styles.iconStyle}
          />
        </View>
        <Text style={styles.setText}>Sport</Text>
      </View>
      <View style={styles.setView}>
        <View style={styles.iconBox}>
          <Icon
            name="shirt-outline"
            color={color}
            size={size}
            style={styles.iconStyle}
          />
        </View>
        <Text style={styles.setText}>Clothes</Text>
      </View>
      <View style={styles.setView}>
        <View style={styles.iconBox}>
          <Icon
            name="desktop-outline"
            color={color}
            size={size}
            style={styles.iconStyle}
          />
        </View>
        <Text style={styles.setText}>Computers</Text>
      </View>
      <View style={styles.setView}>
        <View style={styles.iconBox}>
          <Icon
            name="book-outline"
            color={color}
            size={size}
            style={styles.iconStyle}
          />
        </View>
        <Text style={styles.setText}>Books</Text>
      </View>
      <View style={styles.setView}>
        <View style={styles.iconBox}>
          <Icon
            name="ios-bicycle"
            color={color}
            size={size}
            style={styles.iconStyle}
          />
        </View>
        <Text style={styles.setText}>Sport</Text>
      </View>
      <View style={styles.setView}>
        <View style={styles.iconBox}>
          <Icon
            name="shirt-outline"
            color={color}
            size={size}
            style={styles.iconStyle}
          />
        </View>
        <Text style={styles.setText}>Clothes</Text>
      </View>
      <View style={styles.setView}>
        <View style={styles.iconBox}>
          <Icon
            name="desktop-outline"
            color={color}
            size={size}
            style={styles.iconStyle}
          />
        </View>
        <Text style={styles.setText}>Computers</Text>
      </View>
      <View style={styles.setView}>
        <View style={styles.iconBox}>
          <Icon
            name="book-outline"
            color={color}
            size={size}
            style={styles.iconStyle}
          />
        </View>
        <Text style={styles.setText}>Books</Text>
      </View>
    </ScrollView>
  );
};

export default CategorySlider;

const styles = StyleSheet.create({
  categorySlider: {
    width:"100%",
  },
  setView: {
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 13,
  },
  setText: {
    // padding: 5,
    color: 'white',
  },
  iconBox: {
    width: 50,
    height: 50,
    backgroundColor: GlobalStyles.colors.color4,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
