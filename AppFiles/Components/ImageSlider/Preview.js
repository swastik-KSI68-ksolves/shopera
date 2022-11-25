import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  useWindowDimensions,
  Pressable,
} from 'react-native';

export default Preview = ({
  style,
  item,
  imageKey,
  onPress,
  index,
  active,
  local,
}) => {
  const {width, fontScale} = useWindowDimensions();
  return (
    <Pressable style={[styles.videoContainer]} onPress={() => onPress(item)}>
      <View style={[styles.imageContainer, styles.shadow]}>
        <Image
          style={[
            styles.videoPreview,
            {width: width, resizeMode: 'contain'},
            active ? {} : {height: 120},
          ]}
          source={{uri: item[imageKey]}}
        />
      </View>
      <Text
        style={[
          styles.desc,
          {fontSize: item.desc.length < 50 ? fontScale * 10 : fontScale * 9},
        ]}>
        {item.desc.slice(0, 60)}...
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPreview: {
    height: 200,
    resizeMode: 'cover',
  },
  desc: {
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 24,
    marginTop: 18,
    color: 'black',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
