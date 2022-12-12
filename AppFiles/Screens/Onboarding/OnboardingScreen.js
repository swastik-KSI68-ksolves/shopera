import {Image, StyleSheet, useWindowDimensions} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

const OnboardingScreen = ({navigation}) => {
  const {width, height, fontScale} = useWindowDimensions();
  const styles = StyleSheet.create({
    img: {
      width: (width / 1.3) * fontScale,
      height: (width / 1.3) * fontScale,
    },
  });
  return (
    <Onboarding
      onSkip={() => navigation.replace('Login')}
      onDone={() => navigation.replace('Login')}
      pages={[
        {
          backgroundColor: '#F8F8F8',
          image: (
            <Image
              style={styles.img}
              source={require('../../assets/Onboarding/DiffrentCategories.png')}
            />
          ),
          title: 'Diffrent Categories',
          subtitle: 'wide range of products avaliable',
        },
        {
          backgroundColor: '#F8F8F8',
          image: (
            <Image
              style={styles.img}
              source={require('../../assets/Onboarding/CustomizableWishlist.png')}
            />
          ),
          title: 'Customizable Wishlist',
          subtitle: 'manage your wishlist easily',
        },
        {
          backgroundColor: '#F8F8F8',
          image: (
            <Image
              style={styles.img}
              source={require('../../assets/Onboarding/ManageCart.png')}
            />
          ),
          title: 'Manage Cart',
          subtitle: 'ship directly from your cart',
        },
        {
          backgroundColor: '#F8F8F8',
          image: (
            <Image
              style={styles.img}
              source={require('../../assets/Onboarding/DiffrentPayment.png')}
            />
          ),
          title: 'Diffrent Payment Methods',
          subtitle: 'choose between diffrent payment options',
        },
      ]}
    />
  );
};

export default OnboardingScreen;
