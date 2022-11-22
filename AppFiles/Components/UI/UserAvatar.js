import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';

const UserAvatar = ({word, isImage, fontScale, imageLink, style, onPress}) => {
  if (!isImage) {
    return (
      <Pressable
        style={({pressed}) => (pressed ? {opacity: 0.75} : null)}
        onPress={onPress}>
        <View
          style={[
            styles.userCirlce,
            {height: fontScale * 40, width: fontScale * 40},
            style,
          ]}>
          <Text style={[styles.userText, {fontSize: fontScale * 22}]}>
            {word.toUpperCase()}
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={({pressed}) => (pressed ? {opacity: 0.75} : null)}
      onPress={onPress}>
      <View
        style={[
          styles.userCirlceImageContainer,
          {height: fontScale * 40, width: fontScale * 40},
          style,
        ]}>
        <Image style={styles.userCirlceImage} source={{uri: imageLink}} />
      </View>
    </Pressable>
  );
};

export default UserAvatar;

const styles = StyleSheet.create({
  userCirlce: {
    backgroundColor: GlobalStyles.colors.PrimaryButtonColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  userText: {
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: {width: -1, height: -1},
    textShadowRadius: 10,
  },

  userCirlceImageContainer: {
    borderRadius: 100,
    justifyContent: 'center',
  },
  userCirlceImage: {
    flex: 1,
    resizeMode: 'contain',
    borderRadius: 100,
  },
});
