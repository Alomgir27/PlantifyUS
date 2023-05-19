import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Swiper from 'react-native-swiper';

import { COLORS } from '../constants';

const AuthLandingPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Swiper style={styles.swiperContainer} loop={false} autoplay={false} dotColor={COLORS.primary} activeDotColor={COLORS.secondary}>
        <View style={styles.slide}>
          <Image
            source={require('../../assets/images/slide1.jpg')}
            style={styles.slideImage}
          />
          <Text style={styles.slideText}>Welcome to our app!</Text>
  
          <Text style={{ textAlign: 'center', color: COLORS.gray, margin: 5 }}>
            We are a community of plant lovers
          </Text>
          <Text style={{ textAlign: 'center', color: COLORS.primary, marginBottom: 30, fontWeight: 'bold' }} onPress={() => navigation.navigate('Signup')}>
            Get started
          </Text>
        </View>
        <View style={styles.slide}>
          <Image
            source={require('../../assets/images/slide2.png')}
            style={styles.slideImage}
          />
           <Text style={styles.slideText}>Sign up to get started</Text>
            <Text style={{ textAlign: 'center', color: COLORS.gray, margin: 5 }}>
              Don't have an account?
            </Text>
            <Text style={{ textAlign: 'center', color: COLORS.primary, marginBottom: 30, fontWeight: 'bold' }} onPress={() => navigation.navigate('Signup')}>
              Sign up
            </Text>
        </View>
        <View style={styles.slide}>
          <Image
            source={require('../../assets/images/slide3.png')}
            style={styles.slideImage}
          />
          <Text style={styles.slideText}>Login to your account</Text>

          <Text style={{ textAlign: 'center', color: COLORS.gray, margin: 5 }}>
            Already have an account?
          </Text>
          <Text style={{ textAlign: 'center', color: COLORS.primary, marginBottom: 30, fontWeight: 'bold' }} onPress={() => navigation.navigate('Login')}>
            Login
          </Text>
        </View>
      </Swiper>

     
      {/* <View style={styles.buttonsContainer}>
        <Text style={styles.button} onPress={() => navigation.navigate('Signup')}>Sign up</Text>
        <Text style={styles.button} onPress={() => navigation.navigate('Login')}>Login</Text>
      </View> */}

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
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 30,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    color: '#fff',
    fontSize: 18,
  },
});

export default AuthLandingPage;
