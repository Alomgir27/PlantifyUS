import React, {useCallback, useState} from 'react';
import dayjs from 'dayjs';
import PagerView from 'react-native-pager-view';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

import {useData, useTheme, useTranslation} from '../hooks/';
import {INotification} from '../constants/types';
import {Block, Button, Image, Text} from '../components/';

import { useSelector } from 'react-redux';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: '%ds',
    m: '%dm',
    mm: '%dm',
    h: '%dh',
    hh: '%dh',
    d: '%dh',
    dd: '%dd',
    M: '%dm',
    MM: '%dm',
    y: '%dy',
    yy: '%dy',
  },
});

const Notification = ({
  subject,
  message,
  type,
  read,
  createdAt,
}: INotification) => {
  const {colors, icons, gradients, sizes} = useTheme();

  return (
    <Block row align="center" marginBottom={sizes.m}>
      <Block
        flex={0}
        width={32}
        height={32}
        align="center"
        justify="center"
        radius={sizes.s}
        marginRight={sizes.s}
        gradient={gradients[!read ? 'primary' : 'secondary']}>
        <Image
          radius={0}
          width={14}
          height={14}
          color={colors.white}
          source={icons?.[type]}
        />
      </Block>
      <Block>
        <Block row justify="space-between">
          <Text semibold>{subject}</Text>
          <Block row flex={0} align="center">
            <Image source={icons.clock} />
            <Text secondary size={12} marginLeft={sizes.xs}>
              {dayjs().to(dayjs(createdAt))}
            </Text>
          </Block>
        </Block>
        <Text secondary size={12} lineHeight={sizes.sm}>
          {message}
        </Text>
      </Block>
    </Block>
  );
};

const Personal = ({subject, message, type, read, createdAt}: INotification) => {
  const {colors, icons, gradients, sizes} = useTheme();

  return (
    <Block card padding={sizes.sm} marginBottom={sizes.sm}>
      <Block row align="center" justify="space-between">
        <Block
          flex={0}
          width={32}
          height={32}
          align="center"
          justify="center"
          radius={sizes.s}
          gradient={gradients[!read ? 'primary' : 'secondary']}>
          <Image
            radius={0}
            width={12}
            height={12}
            color={colors.white}
            source={icons[type]}
          />
        </Block>
        <Block row flex={0} align="center">
          <Image source={icons.clock} radius={0} />
          <Text secondary size={12} marginLeft={sizes.xs}>
            {dayjs().to(dayjs(createdAt))}
          </Text>
        </Block>
      </Block>
      <Block marginTop={sizes.s}>
        <Text p semibold marginBottom={sizes.s}>
          {subject}
        </Text>
        <Text secondary lineHeight={22}>
          {message}
        </Text>
      </Block>
    </Block>
  );
};

const Notifications = ({navigation}) => {
  const {t} = useTranslation();
  const {notifications} = useData();
  const [tab, setTab] = useState('business');
  const pagerRef = React.createRef<PagerView>();
  const {icons, colors, sizes} = useTheme();
  const user = useSelector(state => state.data.currentUser);

  const unread = notifications?.filter(
    (notification) => !notification?.read && notification.business,
  );
  const read = notifications?.filter(
    (notification) => notification?.read && notification.business,
  );
  const personal = notifications?.filter(
    (notification) => !notification.business,
  );

  const handleTab = useCallback(
    (key) => {
      setTab(key);
      pagerRef.current?.setPage(key === 'business' ? 1 : 0);
    },
    [setTab, pagerRef],
  );

  return (
    <Block>
      <PagerView
        ref={pagerRef}
        style={{flex: 1}}
        scrollEnabled={false}
        initialPage={tab === 'business' ? 1 : 0}>
        {/* person notifications */}
        <Block
          scroll
          nestedScrollEnabled
          padding={sizes.padding}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: sizes.xxl}}>
          {personal?.map((notification) => (
            <Personal key={`personal-${notification.id}`} {...notification} />
          ))}
        </Block>

        {/* business notifications */}
        <Block
          scroll
          nestedScrollEnabled
          padding={sizes.padding}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: sizes.xxl}}>
          {/* render unread notifications */}
          {unread?.length && (
            <Block card padding={sizes.sm} marginBottom={sizes.sm}>
              <Text p semibold marginBottom={sizes.sm}>
                {t('notifications.unread')}
              </Text>
              {unread?.map((notification) => (
                <Notification
                  key={`unread-${notification.id}`}
                  {...notification}
                />
              ))}
            </Block>
          )}

          {/* render read notifications */}
          {read?.length && (
            <Block card padding={sizes.sm}>
              <Text p semibold marginBottom={sizes.sm}>
                {t('notifications.read')}
              </Text>
              {read?.map((notification) => (
                <Notification
                  key={`read-${notification.id}`}
                  {...notification}
                />
              ))}
            </Block>
          )}
        </Block>
      </PagerView>
      {/* notifications tabs */}
      <Block safe flex={0} color={colors.card}>
        <Block
          row
          flex={0}
          align="center"
          paddingTop={sizes.sm}
          justify="space-evenly">
          <Button onPress={() => handleTab('personal')}>
            <Image
              radius={0}
              width={20}
              height={20}
              source={icons.profile}
              color={colors[tab === 'personal' ? 'primary' : 'secondary']}
            />
            <Text
              semibold
              size={12}
              primary={tab === 'personal'}
              secondary={tab !== 'personal'}>
              {t('notifications.personal')}
            </Text>
          </Button>
          <Button onPress={() => handleTab('business')}>
            <Image
              radius={0}
              width={20}
              height={20}
              source={icons.office}
              color={colors[tab === 'business' ? 'primary' : 'secondary']}
            />
            <Text
              semibold
              size={12}
              primary={tab === 'business'}
              secondary={tab !== 'business'}>
              {t('notifications.business')}
            </Text>
          </Button>
        </Block>
      </Block>
    </Block>
  );
};

export default Notifications;
