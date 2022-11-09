import {View, Text, StyleSheet, Pressable} from 'react-native';
const PrimaryButton = ({children, onPress, style, allDone, fsize}) => {
  return (
    <View style={styles.outerContainer}>
      <Pressable
        style={({pressed}) =>
          pressed
            ? [styles.innerContainer, styles.pressed, style]
            : [styles.innerContainer, style]
        }
        onPress={onPress}
        disabled={allDone}>
        <Text style={[styles.buttonText, {fontSize: fsize}]}>{children}</Text>
      </Pressable>
    </View>
  );
};
export default PrimaryButton;

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 28,
    margin: 4,
    overflow: 'hidden',
    elevation: 6,
  },
  innerContainer: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    elevation: 12,
  },

  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
