import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import Constants from 'expo-constants';

import {useTheme, useTranslation} from '../hooks/';
import {Block, Button, Text} from '../components/';

import * as ICONS from '@expo/vector-icons';



const About = ({ navigation }) => {
  const {t} = useTranslation();
  const {gradients, sizes, colors} = useTheme();

  const handleWebLink = useCallback((url) => Linking.openURL(url), []);

  return (
    <Block
      scroll
      padding={sizes.padding}
      contentContainerStyle={{paddingBottom: sizes.padding * 1.5}}>
        <Block row align="center" justify="space-between" marginBottom={sizes.m}>
          <ICONS.Ionicons name="ios-arrow-back" size={24} color={colors.primary} onPress={() => navigation.navigate('Settings')} />
          <Text>Plant Trees, Save Earth 🌱</Text>
        </Block>
      <Block card flex={0} padding={sizes.sm} marginBottom={sizes.sm}>
        <Text p semibold marginBottom={sizes.sm}>
          {t('common.about')} {t('app.fullname')}
        </Text>
        <Text align="justify" marginBottom={sizes.s}>
         Hello! Welcome to{' '} 
          <Text primary semibold>
            {t('app.name')} {t('app.native')}
          </Text>
          , It is a platform that allows you to plant trees and save the earth.
          Our mission is to make the world a better place by planting trees.
        </Text>
        <Text align="justify" marginBottom={sizes.s}>
          Intially we started with a small team of 2 people and our goal was to 
          plant 100 trees in a year. But now we have a team of 10 people and we
          have planted 1000 trees in a year. We are growing day by day and we
          are trying to make the world a better place.
        </Text>
        <Text align="justify" marginBottom={sizes.sm}>
         So, what are you waiting for? Join us and help us to make the world a
          better place.

        </Text>
        <Button
          gradient={gradients.primary}
          onPress={() =>
            handleWebLink('https://www.github.com/Alomgir27')
          }>
          <Text white semibold>
            {t('common.visit')} {t('app.link')}
          </Text>
        </Button>
      </Block>
      <Block card flex={0} padding={sizes.sm}>
        <Text p semibold>
          {t('common.appDetails')}
        </Text>
        <Block flex={0} row justify="space-between" marginTop={sizes.sm}>
          <Text>{t('common.appName')}</Text>
          <Text semibold>{t('app.fullname')}</Text>
        </Block>

        <Block flex={0} row justify="space-between" marginTop={sizes.sm}>
          <Text>{t('common.appVersion')}</Text>
          <Text semibold>{Constants.nativeAppVersion}</Text>
        </Block>
        <Block flex={0} row justify="space-between" marginTop={sizes.sm}>
          <Text>{t('common.buildVersion')}</Text>
          <Text semibold>{Constants.nativeBuildVersion}</Text>
        </Block>
        <Block flex={0} row justify="space-between" marginTop={sizes.sm}>
          <Text>{t('common.expoVersion')}</Text>
          <Text semibold>{Constants.expoVersion}</Text>
        </Block>
      </Block>
    </Block>
  );
};

export default About;
