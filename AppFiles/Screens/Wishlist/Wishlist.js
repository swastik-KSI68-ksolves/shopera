import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  Pressable,
  Text,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {GlobalStyles} from '../../Constants/GlobalStyles';
import {H5, H6} from '../../Components/Heading';
import {Card, CartItemDetails, PrimaryButton} from '../../Exporter';

const Wishlist = ({navigation}) => {
  const {fontScale} = useWindowDimensions();
  const total = 1200;
  const numberOfItems = 3;
  const image =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2TOQn2aqp0iOP0WcA9MOb46jqXLJmviPnFg&usqp=CAU';
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Pressable
            style={({pressed}) => (pressed ? styles.pressed : null)}
            onPress={() =>
              setTimeout(() => {
                navigation.goBack();
              }, 200)
            }>
            <View style={styles.cartAndBack}>
              <Icon name="arrow-back" color="black" size={fontScale * 32} />
            </View>
          </Pressable>
        </View>
        {/* <Text style={{paddingHorizontal: 10, fontSize: fontScale * 22}}>
          Cart
        </Text> */}
        <View style={styles.rateDetails}>
          <H6 style={styles.H6}>Total</H6>
          <H5 style={styles.H3}>${total}</H5>
        </View>
      </View>
      <ScrollView
        style={styles.cartItemCards}
        contentContainerStyle={styles.cardItemCardContainer}>
        <Card
          // horizontal={true}
          productName="mobile"
          productPrice={250}
          image={image}
        />
        <Card
          // horizontal={true}
          productName="mobile"
          productPrice={250}
          image={image}
        />
        <Card
          // horizontal={true}
          productName="mobile"
          productPrice={250}
          image={image}
        />
        <Card
          // horizontal={true}
          productName="mobile"
          productPrice={250}
          image={image}
        />
        <Card
          // horizontal={true}
          productName="mobile"
          productPrice={250}
          image={image}
        />
      </ScrollView>
      {/* <View style={styles.textContainer}></View> */}
      <View style={styles.buttonContainer}>
        {/* <H6>Total - ${total}</H6> */}
        <PrimaryButton style={styles.buttonSettleNow}>SETTLE NOW</PrimaryButton>
      </View>
    </View>
  );
};

export default Wishlist;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  cartItemCards: {
    flex: 2,
  },
  cardItemCardContainer: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  textContainer: {flex: 1, backgroundColor: 'red'},
  buttonContainer: {
    flex: 0.2,
    justifyContent: 'space-evenly',
    paddingHorizontal: 30,
  },
  cartAndBack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateDetails: {
    alignItems: 'baseline',
  },
  H3: {
    color: GlobalStyles.colors.color2,
  },
  H6: {
    color: GlobalStyles.colors.color3,
  },
  pressed: {
    opacity: 0.75,
  },
  buttonSettleNow: {
    backgroundColor: GlobalStyles.colors.PrimaryButtonColor,
  },
});
