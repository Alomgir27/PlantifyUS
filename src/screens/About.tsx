import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import Constants from 'expo-constants';

import {useTheme, useTranslation} from '../hooks/';
import {Block, Button, Text} from '../components/';

const About = () => {
  const {t} = useTranslation();
  const {gradients, sizes} = useTheme();

  const handleWebLink = useCallback((url) => Linking.openURL(url), []);

  return (
    <Block
      scroll
      padding={sizes.padding}
      contentContainerStyle={{paddingBottom: sizes.padding * 1.5}}>
      <Block card flex={0} padding={sizes.sm} marginBottom={sizes.sm}>
        <Text p semibold marginBottom={sizes.sm}>
          {t('common.about')} {t('app.fullname')}
        </Text>
        <Text align="justify" marginBottom={sizes.s}>
          Are you looking for a modern mobile template to help you speed up your
          development? Take a look at{' '}
          <Text primary semibold>
            {t('app.name')} {t('app.native')}
          </Text>
          , a gorgeous and innovative free template that will help you create
          powerful mobile applications.
        </Text>
        <Text align="justify" marginBottom={sizes.s}>
          The product is loaded with a big number of components (like buttons,
          icons, cards, sections, example pages, and many more) that will save
          you tons of time and money.
        </Text>
        <Text align="justify" marginBottom={sizes.sm}>
          This product is the result of Creative Tim’s work, the popular creator
          of both free and paid UI Kits and Dashboards, helping over 1.5 million
          creatives from all over the world.
        </Text>
        <Button
          gradient={gradients.primary}
          onPress={() =>
            handleWebLink('https://www.creative-tim.com/templates/react-native')
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
