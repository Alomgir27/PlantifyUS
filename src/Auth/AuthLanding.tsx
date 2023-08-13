import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Swiper from 'react-native-swiper';

import { COLORS } from '../constants/index';

const AuthLandingPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Swiper style={styles.swiperContainer} loop={false} autoplay={false} dotColor={COLORS.primary} activeDotColor={COLORS.secondary}>
        <View style={styles.slide}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.slideImage}
          />
          <Text style={styles.slideText}>Welcome to our app!</Text>
  
          <Text style={{ textAlign: 'center', color: COLORS.gray, margin: 5 }}>
            We are a community of plant lovers
          </Text>
        </View>
        <View style={styles.slide}>
          <Image
            source={require('../../assets/images/slide2.png')}
            style={styles.slideImage}
          />
           <Text style={styles.slideText}>Did you know?</Text>
            <Text style={{ textAlign: 'center', color: COLORS.gray, margin: 5 }}>
              Plants can help you sleep better and improve your mood
            </Text>
        </View>
        <View style={styles.slide}>
          <Image
            source={require('../../assets/images/slide3.png')}
            style={styles.slideImage}
          />
          <Text style={styles.slideText}>Join our community!</Text>
          {/* sologan */}
          <Text style={{ textAlign: 'center', color: COLORS.gray, margin: 5 }}>
            Share your plants with others and get inspired
          </Text>

          <View style={styles.buttonsContainer}>
            <Text style={styles.button} onPress={() => navigation.navigate('Signup')}>Sign up</Text>
            <Text style={styles.button} onPress={() => navigation.navigate('Login')}>Login</Text>
          </View>

          {/* sologan about trees and plants */}
          <Text style={{ textAlign: 'center', color: COLORS.gray, margin: 5 }}>
            We are dreamming of a greener world, where trees and plants are everywhere and everyone is happy. Join us!
          </Text>

        </View>
      </Swiper>

     
      

      <Text style={{ textAlign: 'center', color: COLORS.gray, marginBottom: 5 }}>
        By continuing, you agree to our Terms of Use and Privacy Policy
       </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  swiperContainer: {
    
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  slideText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    color: '#fff',
    fontSize: 18,
  },
});

export default AuthLandingPage;
