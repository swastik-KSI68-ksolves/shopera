import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity, Image} from 'react-native';
// import FastImage from 'react-native-fast-image';

const Images = ({
  containerStyle,
  url,
  onPress,
  onLoad,
  style,
  loaderSize,
  ...restProps
}) => {
  const [loaded, setLoaded] = useState(false);
  const handleLoading = event => {
    setLoaded(true);
    onLoad && onLoad(event);
  };
  return (
    <TouchableOpacity
      style={[styles.base, containerStyle]}
      onPress={onPress}
      disabled={!onPress}>
      <Image
        style={[styles.base, style]}
        onLoad={handleLoading}
        source={{uri: url}}
        {...restProps}
      />
      {!loaded && (
        <ActivityIndicator
          color={LOADER_COLOR}
          style={styles.loader}
          size={loaderSize}
        />
      )}
    </TouchableOpacity>
  );
};

export default Images;

const BG_COLOR = 'rgba(240, 242, 245, 1)';
const LOADER_COLOR = 'rgba(55, 107, 251, 1)';

const styles = StyleSheet.create({
  base: {
    height: '100%',
    width: '100%',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BG_COLOR,
  },
});
