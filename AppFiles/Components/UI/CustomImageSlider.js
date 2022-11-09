import React from 'react';
import {Image, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';

const CustomImageSlider = ({data, width, style}) => {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      style={styles.scrollViewStyle}>
      {data.map((e, index) => {
        return (
          <Pressable key={index + 1}>
            <View style={[styles.imageContainer, {width: width}, style]}>
              <Image style={styles.imageStyle} source={{uri: e}} />
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

export default CustomImageSlider;

const styles = StyleSheet.create({
  scrollViewStyle: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  imageContainer: {
    width: 100,
    height: 200,
    backgroundColor: GlobalStyles.colors.Primary1,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
