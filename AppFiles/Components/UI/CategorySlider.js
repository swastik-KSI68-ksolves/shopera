import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {Cat} from '../../Utils/HardCodedData/AllCategories';
import {useNavigation} from '@react-navigation/native';

const CategorySlider = ({size, color, image}) => {
  const navigation = useNavigation();
  const renderCategories = itemData => {
    const RenderIcon = () => {
      // return (
      //   <Image
      //     resizeMode="contain"
      //     style={{width: size * 2, height: size * 2, borderRadius: 50}}
      //     source={{uri: itemData.item.image}}
      //   />
      // );
      if (itemData.item.isMC) {
        return (
          <IconMCI
            name={itemData.item.icon}
            color={color}
            size={size * 1.2}
            style={styles.iconStyle}
          />
        );
      } else {
        return (
          <Icon
            name={itemData.item.icon}
            color={color}
            size={size * 1.2}
            style={styles.iconStyle}
          />
        );
      }
    };
    return (
      <View style={styles.setView}>
        <Pressable
          style={({pressed}) => (pressed ? {opacity: 0.75} : null)}
          onPress={() =>
            navigation.navigate('IndivisualCategory', {
              category: itemData.item.cat,
            })
          }>
          <View style={styles.iconBox}>
            <RenderIcon />
          </View>
        </Pressable>
        <Text style={styles.setText}>{itemData.item.cat}</Text>
      </View>
    );
  };
  return (
    <FlatList
      style={styles.categorySlider}
      data={Cat}
      renderItem={renderCategories}
      keyExtractor={item => item.key}
      numColumns={1}
      horizontal
    />
  );
};

export default CategorySlider;

const styles = StyleSheet.create({
  categorySlider: {
    width: '100%',
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
    borderWidth: 4,
    borderColor: GlobalStyles.colors.color2,
    width: 60,
    height: 60,
    backgroundColor: GlobalStyles.colors.color4,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStyle: {},
});
