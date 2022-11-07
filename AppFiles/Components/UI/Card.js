import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import {IconButton} from './IconButton';
import Ratings from './Ratings';

const Card = ({productName, productPrice, image, howManyStar, onPress}) => {
  const {width, height, fontScale} = useWindowDimensions();
  // const nameLen =
  const producStyle = StyleSheet.create({
    productName: {
      paddingVertical: 5,
      fontSize: productName.length >= 16 ? fontScale * 11 : fontScale * 15,
      color: GlobalStyles.colors.PrimaryTextColor,
    },
    pructPrice: {
      fontSize: productName.length >= 16 ? fontScale * 13 : fontScale * 16,
      color: 'black',
    },
    cardContainer: {
      backgroundColor: '#ffffff',
      paddingHorizontal: 5,
      paddingVertical: 5,
      margin: 10,
      width: width * 0.43,
      height: height * 0.35,
      justifyContent: 'space-evenly',
      borderRadius: 10,
      shadowColor: 'black',
      shadowOpacity: 0.5,
      shadowOffset: {width: 2, height: 2},
      shadowRadius: 8,
      overflow: Platform === 'android' ? 'hidden' : 'visible',
      elevation: 3,
    },
    imageContainer: {
      maxWidth: '100%',
      height: '50%',
    },
    detailsContainer: {
      justifyContent: 'space-evenly',
    },
    image: {
      maxWidth: '100%',
      height: '100%',
      resizeMode: 'contain',
      borderRadius: 10,
    },
    ratingAndButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    pressed: {
      opacity: 0.75,
    },
  });
  return (
    <Pressable
      style={({pressed}) => pressed && producStyle.pressed}
      onPress={onPress}>
      <View style={producStyle.cardContainer}>
        <View style={producStyle.imageContainer}>
          <Image style={producStyle.image} source={{uri: image}} />
        </View>
        <View style={producStyle.detailsContainer}>
          <Text style={producStyle.productName}>{productName}</Text>
          <Text style={producStyle.pructPrice}>${productPrice}</Text>
          <View style={producStyle.ratingAndButton}>
            <Ratings
              Touchable={false}
              size={15}
              howManyStarShow={howManyStar}
            />
            <IconButton
              color="white"
              name="add"
              size={23}
              style={{backgroundColor: GlobalStyles.colors.PrimaryButtonColor}}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default Card;
