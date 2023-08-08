// import {useNavigation} from '@react-navigation/core';
import React from 'react';

import {useData, useTheme, useTranslation} from '../hooks/';
import {Block, Button, Image, Switch, Text} from '../components/';

const Settings = () => {
  // const navigation = useNavigation();
  const {isDark, handleIsDark} = useData();
  const {t, locale, setLocale} = useTranslation();
  const {assets, colors, gradients, sizes} = useTheme();

  const isEN = locale.includes('en');

  return (
    <Block
      scroll
      padding={sizes.padding}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: sizes.xxl}}>
      {/* settings */}
      <Block card padding={sizes.sm} marginBottom={sizes.sm}>
        <Block row align="center" marginBottom={sizes.m}>
          <Block
            flex={0}
            align="center"
            justify="center"
            radius={sizes.s}
            width={sizes.md}
            height={sizes.md}
            marginRight={sizes.s}
            gradient={gradients.primary}>
            <Image source={assets?.settings} color={colors.white} radius={0} />
          </Block>
          <Block>
            <Text semibold>{t('settings.recommended.title')}</Text>
            <Text size={12}>{t('settings.recommended.subtitle')}</Text>
          </Block>
        </Block>
        <Block
          row
          align="center"
          justify="space-between"
          marginBottom={sizes.sm}>
          <Text>{t('settings.recommended.darkmode')}</Text>
          <Switch
            checked={isDark}
            onPress={(checked) => handleIsDark(checked)}
          />
        </Block>
        <Block
          row
          align="center"
          justify="space-between"
          marginBottom={sizes.m}>
          <Text>{t('settings.recommended.language')} EN/FR</Text>
          <Switch
            checked={!isEN}
            onPress={(checked) => setLocale(checked ? 'fr' : 'en')}
          />
        </Block>

        <Block
          row
          align="center"
          justify="space-between"
          marginBottom={sizes.sm}>
          <Text>{t('settings.recommended.faceid')}</Text>
          <Switch checked />
        </Block>
        <Block row align="center" justify="space-between">
          <Text>{t('settings.recommended.autolock')}</Text>
          <Switch />
        </Block>
        <Button
          row
          align="center"
          justify="space-between"
          onPress={() => navigation.navigate('NotificationsSettings')}>
          <Text>{t('settings.recommended.notifications')}</Text>
          <Image
            source={assets.arrow}
            color={colors.icon}
            radius={0}
            height={18}
            width={10}
          />
        </Button>
      </Block>
      {/* payment */}
      <Block card padding={sizes.sm} marginBottom={sizes.sm}>
        <Block row align="center" marginBottom={sizes.s}>
          <Block
            flex={0}
            align="center"
            justify="center"
            radius={sizes.s}
            width={sizes.md}
            height={sizes.md}
            marginRight={sizes.s}
            gradient={gradients.primary}>
            <Image source={assets?.payment} color={colors.white} radius={0} />
          </Block>
          <Block>
            <Text semibold>{t('settings.payment.title')}</Text>
            <Text size={12}>{t('settings.payment.subtitle')}</Text>
          </Block>
        </Block>
        <Button row align="center" justify="space-between">
          <Text>{t('settings.payment.options')}</Text>
          <Image
            source={assets.arrow}
            color={colors.icon}
            radius={0}
            height={18}
            width={10}
          />
        </Button>
        <Button row align="center" justify="space-between">
          <Text>{t('settings.payment.giftcards')}</Text>
          <Image
            source={assets.arrow}
            color={colors.icon}
            radius={0}
            height={18}
            width={10}
          />
        </Button>
      </Block>

      {/* privacy */}
      <Block card padding={sizes.sm} marginBottom={sizes.sm}>
        <Block row align="center" marginBottom={sizes.s}>
          <Block
            flex={0}
            align="center"
            justify="center"
            radius={sizes.s}
            width={sizes.md}
            height={sizes.md}
            marginRight={sizes.s}
            gradient={gradients.primary}>
            <Image source={assets?.document} color={colors.white} radius={0} />
          </Block>
          <Block>
            <Text semibold>{t('settings.privacy.title')}</Text>
            <Text size={12}>{t('settings.privacy.subtitle')}</Text>
          </Block>
        </Block>
        <Button
          row
          align="center"
          justify="space-between"
          onPress={() => navigation.navigate('Agreement')}>
          <Text>{t('settings.privacy.agreement')}</Text>
          <Image
            source={assets.arrow}
            color={colors.icon}
            radius={0}
            height={18}
            width={10}
          />
        </Button>
        <Button
          row
          align="center"
          justify="space-between"
          onPress={() => navigation.navigate('Privacy')}>
          <Text>{t('settings.privacy.privacy')}</Text>
          <Image
            source={assets.arrow}
            color={colors.icon}
            radius={0}
            height={18}
            width={10}
          />
        </Button>
        <Button
          row
          align="center"
          justify="space-between"
          onPress={() => navigation.navigate('About')}>
          <Text>{t('settings.privacy.about')}</Text>
          <Image
            source={assets.arrow}
            color={colors.icon}
            radius={0}
            height={18}
            width={10}
          />
        </Button>
      </Block>
    </Block>
  );
};

export default Settings;
