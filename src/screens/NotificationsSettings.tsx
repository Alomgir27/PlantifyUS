import React from 'react';

import {useTheme, useTranslation} from '../hooks/';
import {Block, Image, Switch, Text} from '../components/';

import * as ICONS from '@expo/vector-icons';

const Notifications = ({ navigation }) => {
  const {t} = useTranslation();
  const {assets, colors, gradients, sizes} = useTheme();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Block row justify="center" align="center" marginRight={sizes.m}>
          <Block
            flex={0}
            align="center"
            justify="center"
            radius={sizes.s}
            width={sizes.md}
            height={sizes.md}
            marginLeft={sizes.s}
            gradient={gradients.primary}>
            <Image source={assets?.settings} color={colors.white} radius={0} />
          </Block>
        </Block>
      ),
      headerLeft: () => (
        <Block row justify="center" align="center" marginLeft={sizes.m}>
          <ICONS.Ionicons
            name="chevron-back-outline"
            color={colors.text}
            size={sizes.m}
            onPress={() => navigation.goBack()}
          />
        </Block>
      ),

    });
  }
  , [navigation]);

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
            <Text semibold>{t('settings.notifications.title')}</Text>
            <Text size={12}>{t('settings.notifications.subtitle')}</Text>
          </Block>
        </Block>
        <Block
          row
          align="center"
          justify="space-between"
          marginBottom={sizes.sm}>
          <Text>{t('settings.notifications.mentions')}</Text>
          <Switch checked />
        </Block>
        <Block
          row
          align="center"
          justify="space-between"
          marginBottom={sizes.sm}>
          <Text>{t('settings.notifications.follows')}</Text>
          <Switch />
        </Block>
        <Block
          row
          align="center"
          justify="space-between"
          marginBottom={sizes.sm}>
          <Text>{t('settings.notifications.comments')}</Text>
          <Switch checked />
        </Block>
      </Block>
    </Block>
  );
};

export default Notifications;
