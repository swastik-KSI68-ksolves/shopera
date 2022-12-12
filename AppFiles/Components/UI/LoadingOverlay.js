import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';

function LoadingOverlay({message}) {
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.message}>{message}</Text>
      <ActivityIndicator
        size="large"
        color={GlobalStyles.colors.PrimaryButtonColor}
      />
    </View>
  );
}

export default LoadingOverlay;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: 'white',
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
    color: 'black',
  },
});
