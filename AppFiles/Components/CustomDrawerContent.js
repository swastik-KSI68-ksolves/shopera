import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {validatePathConfig} from '@react-navigation/native';
import {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Children} from 'react/cjs/react.production.min';
import {GlobalStyles} from '../Constants/GlobalStyles';
import {UserAvatar} from '../Exporter';
import {AuthContext} from '../Store/AuthContext';
import {H3, H5} from './Heading';

const ShowLogOutButton = ({fontScale}) => {
  const Authctx = useContext(AuthContext);
  return (
    <Pressable onPress={Authctx.Logout}>
      <View>
        <DrawerItem
          onPress={Authctx.Logout}
          labelStyle={{color: 'black'}}
          label="Log out"
          icon={({focused, size}) => (
            <Icon
              name="log-out-outline"
              color={focused ? GlobalStyles.colors.PrimaryButtonColor : '#ccc'}
              size={size}
              onPress={Authctx.Logout}
            />
          )}
        />
      </View>
    </Pressable>
  );
};

const UserImageAndNameContainer = ({fontScale, navigation}) => {
  const [Name, setName] = useState('User Name');
  // const Authctx = useContext(AuthContext);
  // useEffect(() => {
  //   if (Authctx.appLoaded) {
  //     const {name} = JSON.parse(Authctx.userInfo);
  //     setName(name);
  //   }
  // }, [Authctx.appLoaded]);

  return (
    <View style={styles.userDetailsContainer}>
      <View style={styles.userAvatarContainer}>
        <UserAvatar
          isImage={false}
          fontScale={fontScale * 3}
          word={Name.charAt(0)}
          onPress={() => navigation.navigate('userProfile')}
        />
      </View>
      <View style={styles.HelloTextContainer}>
        <Text style={[styles.Hello, {fontSize: fontScale * 20}]}>Hello,</Text>
        <Text style={[styles.name, {fontSize: fontScale * 25}]}>{Name}</Text>
      </View>
      <View
        style={{
          marginVertical: 10,
          width: '100%',
          height: 1,
          borderBottomColor: 'rgba(0,0,0,0.07)',
          borderBottomWidth: 1,
          marginHorizontal: 10,
        }}></View>
    </View>
  );
};

const CustomDrawerContent = props => {
  const Authctx = useContext(AuthContext);
  const {width, height, fontScale} = useWindowDimensions();
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.container}>
        <UserImageAndNameContainer
          fontScale={fontScale}
          navigation={props.navigation}
        />
        <DrawerItemList {...props} />
        <ShowLogOutButton fontScale={fontScale} />

        {/* <View style={styles.logoutButtonContainer}>
          <Pressable>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </Pressable>
        </View> */}
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'column',
  },
  userDetailsContainer: {
    padding: 10,
    alignItems: 'baseline',
    justifyContent: 'space-evenly',
  },
  userAvatarContainer: {
    alignItems: 'baseline',
  },
  HelloTextContainer: {
    paddingTop: 10,
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  Hello: {
    color: GlobalStyles.colors.color2,
    fontWeight: '500',
  },
  name: {
    color: GlobalStyles.colors.color1,
    fontWeight: '500',
  },
  logoutButtonContainer: {
    // justifyContent:"center",
    alignItems: 'center',
  },
  logoutButtonText: {
    backgroundColor: 'orange',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 10,
  },
});
