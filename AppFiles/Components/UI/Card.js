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
import {WishListAddButton} from '../../Exporter/index';
import {useContext, useState} from 'react';
import {AuthContext} from '../../Store/AuthContext';

const Card = ({
  id,
  howMany,
  productName,
  productPrice,
  productDesc,
  image,
  howManyStar,
  onPress,
  horizontal,
  isAlreadyAdded,
  manageWishListInDb,
  onRemoveHandler,
  onAddPress,
  wishListCard,
}) => {
  const {width, height, fontScale} = useWindowDimensions();
  const [numberofItems, setNumberofItems] = useState(1);
  // const nameLen =
  const producStyle = StyleSheet.create({
    productName: {
      width: '80%',
      paddingVertical: 5,
      fontSize: productName.length >= 16 ? fontScale * 11 : fontScale * 15,
      color: GlobalStyles.colors.PrimaryTextColor,
    },
    productNameHorizontal: {
      width: '80%',
      paddingVertical: 5,
      fontSize: productName.length >= 16 ? fontScale * 15 : fontScale * 20,
      color: GlobalStyles.colors.PrimaryTextColor,
    },
    productPrice: {
      fontSize: fontScale * 16,
      color: 'black',
      fontWeight: 'bold',
    },
    productPriceHorizontal: {
      fontSize: fontScale * 20,
      color: 'black',
      fontWeight: 'bold',
    },
    productDesc: {
      fontSize: fontScale * 11,
      color: GlobalStyles.colors.color2,
    },
    cardContainer: {
      backgroundColor: '#ffffff',
      paddingHorizontal: 5,
      paddingVertical: 5,
      margin: 10,
      width: horizontal ? height * 0.47 : width * 0.43,
      height: horizontal ? width * 0.55 : height * 0.35,
      justifyContent: 'space-evenly',
      flexDirection: horizontal ? 'row' : 'column',
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
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingLeft: fontScale * 15,
    },
    pressed: {
      opacity: 0.75,
    },
    imageContainerHrizontal: {
      flex: 0.7,
      justifyContent: 'flex-start',
    },
    imageHorizontal: {
      flex: 1,
      resizeMode: 'cover',
      borderColor: 'rgba(0,0,0,0.1)',
      borderWidth: 1,
      borderRadius: 10,
    },
    detailsContainerHorizontal: {
      flex: 1,
      justifyContent: 'space-evenly',
      alignItems: 'flex-start',
      paddingLeft: 10,
    },
    numberofItemsChanger: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    numberofItems: {
      color: 'black',
      fontSize: fontScale * 20,
      paddingHorizontal: 15,
      paddingVertical: 10,
      // justifyContent:"space-evenly"
    },
  });

  if (horizontal) {
    const ShowPlusMinus = () => {
      if (!wishListCard) {
        return (
          <View style={producStyle.numberofItemsChanger}>
            <IconButton
              color="white"
              name="add"
              size={23}
              style={{
                backgroundColor: GlobalStyles.colors.PrimaryTextColor,
              }}
              // onPress={() => setNumberofItems(numberofItems + 1)}  increase howMany
            />
            <Text style={producStyle.numberofItems}>{howMany}</Text>
            <IconButton
              color="white"
              name="remove-outline"
              size={23}
              style={{
                backgroundColor: GlobalStyles.colors.PrimaryTextColor,
              }}
              // onPress={() =>
              //   // numberofItems > 1 && setNumberofItems(numberofItems - 1) reduce howMany
              // }
            />
            <View style={producStyle.ratingAndButton}>
              <IconButton
                onPress={() => onRemoveHandler(id)}
                color="white"
                name="close-outline"
                size={23}
                style={{
                  backgroundColor: GlobalStyles.colors.PrimaryButtonColor,
                }}
              />
            </View>
          </View>
        );
      }
      return (
        <IconButton
          onPress={() => onRemoveHandler(id)}
          color="white"
          name="close-outline"
          size={23}
          style={{
            backgroundColor: GlobalStyles.colors.PrimaryButtonColor,
          }}
        />
      );
    };
    return (
      <Pressable
        style={({pressed}) => pressed && producStyle.pressed}
        onPress={onPress}>
        <View style={producStyle.cardContainer}>
          <View style={producStyle.imageContainerHrizontal}>
            <Image style={producStyle.imageHorizontal} source={{uri: image}} />
          </View>
          <View style={producStyle.detailsContainerHorizontal}>
            <Text style={producStyle.productNameHorizontal}>{productName}</Text>
            <Text style={producStyle.productDesc}>
              {productDesc.slice(0, 30)}... desc
            </Text>
            <Text style={producStyle.productPriceHorizontal}>
              ${productPrice}
            </Text>
            <ShowPlusMinus />
          </View>
        </View>
      </Pressable>
    );
  }
  return (
    <Pressable
      style={({pressed}) => pressed && producStyle.pressed}
      onPress={onPress}>
      <View style={producStyle.cardContainer}>
        <View style={producStyle.imageContainer}>
          <Image style={producStyle.image} source={{uri: image}} />
        </View>
        <View style={producStyle.detailsContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 2,
            }}>
            <Text style={producStyle.productName}>{productName}</Text>
            <WishListAddButton
              manageWishListInDb={manageWishListInDb}
              isAlreadyAdded={isAlreadyAdded}
            />
          </View>
          <Text style={producStyle.productPrice}>${productPrice}</Text>
          <View style={producStyle.ratingAndButton}>
            <Ratings
              Touchable={false}
              size={fontScale * 15}
              howManyStarShow={howManyStar}
            />
            <View>
              <IconButton
                onPress={onAddPress}
                color="white"
                name="add"
                size={fontScale * 23}
                style={{
                  backgroundColor: GlobalStyles.colors.PrimaryButtonColor,
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default Card;
