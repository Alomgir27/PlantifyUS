import React from 'react';

import {useTheme, useTranslation} from '../hooks/';
import {Block, Image, Switch, Text} from '../components/';

const Notifications = () => {
  const {t} = useTranslation();
  const {assets, colors, gradients, sizes} = useTheme();

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
        <Block row align="center" justify="space-between">
          <Text>{t('settings.notifications.offers')}</Text>
          <Switch checked />
        </Block>
      </Block>
    </Block>
  );
};

export default Notifications;
