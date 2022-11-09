import {
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import {PrimaryButton, UserAvatar} from '../../Exporter';

const UserProfile = ({navigation}) => {
  const {fontScale} = useWindowDimensions();
  return (
    <View style={styles.container}>
      <View style={styles.userDetails}>
        <UserAvatar
          fontScale={fontScale * 3}
          isImage={false}
          word="S"
          style={{backgroundColor: GlobalStyles.colors.color1}}
          onPress={() => {
            navigation.navigate('userProfile');
          }}
        />
        <Text style={[styles.name, {fontSize: fontScale * 20}]}>Full Name</Text>
      </View>
      <KeyboardAvoidingView>
        <ScrollView style={styles.formContainer}>
          <View style={styles.formgroup}>
            <Text style={styles.label}>Enter your first name </Text>
            <TextInput
              style={styles.input}
              placeholderTextColor={GlobalStyles.colors.color2}
              placeholder="First Name"
              secureTextEntry={true}
              // value={userData.confirmPassword}
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={value => {
                // setUserData({...userData, confirmPassword: value});
                // setConfirmPasswordErrorMessage('');
              }}
              onPressIn={() => {
                // setConfirmPasswordErrorMessage('');
              }}
            />
            {/* {!!confirmPasswordErrorMessage ? (
            <Text style={styles.errorMessage}>
              {confirmPasswordErrorMessage}
            </Text>
          ) : null} */}
          </View>
          <View style={styles.formgroup}>
            <Text style={styles.label}>Enter your last name </Text>
            <TextInput
              style={styles.input}
              placeholderTextColor={GlobalStyles.colors.color2}
              placeholder="Last Name"
              secureTextEntry={true}
              // value={userData.confirmPassword}
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={value => {
                // setUserData({...userData, confirmPassword: value});
                // setConfirmPasswordErrorMessage('');
              }}
              onPressIn={() => {
                // setConfirmPasswordErrorMessage('');
              }}
            />
            {/* {!!confirmPasswordErrorMessage ? (
            <Text style={styles.errorMessage}>
              {confirmPasswordErrorMessage}
            </Text>
          ) : null} */}
          </View>
          <View style={styles.formgroup}>
            <Text style={styles.label}>Enter your email</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor={GlobalStyles.colors.color2}
              placeholder="Email "
              secureTextEntry={true}
              // value={userData.confirmPassword}
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={value => {
                // setUserData({...userData, confirmPassword: value});
                // setConfirmPasswordErrorMessage('');
              }}
              onPressIn={() => {
                // setConfirmPasswordErrorMessage('');
              }}
            />
            {/* {!!confirmPasswordErrorMessage ? (
            <Text style={styles.errorMessage}>
              {confirmPasswordErrorMessage}
            </Text>
          ) : null} */}
          </View>
          <View style={styles.formgroup}>
            <Text style={styles.label}>Enter Address </Text>
            <TextInput
              multiline={true}
              numberOfLines={5}
              style={styles.input}
              placeholderTextColor={GlobalStyles.colors.color2}
              placeholder="Enter address"
              secureTextEntry={true}
              // value={userData.confirmPassword}
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={value => {
                // setUserData({...userData, confirmPassword: value});
                // setConfirmPasswordErrorMessage('');
              }}
              onPressIn={() => {
                // setConfirmPasswordErrorMessage('');
              }}
            />
            {/* {!!confirmPasswordErrorMessage ? (
            <Text style={styles.errorMessage}>
              {confirmPasswordErrorMessage}
            </Text>
          ) : null} */}
          </View>
          <PrimaryButton style={styles.buttonRegisterOn}>Signup</PrimaryButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userDetails: {
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  name: {
    color: 'black',
    paddingTop: 15,
  },
  formgroup: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: '100%',
    margin: 5,
  },
  label: {
    color: 'rgba(0,0,0,0.7)',
    marginLeft: 10,
  },
  input: {
    color: GlobalStyles.colors.color1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
    padding: 10,
  },
  buttonRegisterOn: {
    backgroundColor: '#FE7E80',
  },
  formContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
