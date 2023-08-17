import React, {useCallback, useState, useEffect} from 'react';
import dayjs from 'dayjs';
import PagerView from 'react-native-pager-view';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

import {useData, useTheme, useTranslation} from '../hooks/';
import {INotification} from '../constants/types';
import {Block, Button, Image, Text} from '../components/';
import { API_URL } from '../constants';
import axios from 'axios';

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

const Notification = ({item, navigation} : any) => {
  const {colors, icons, gradients, sizes} = useTheme();

  return (
    <Block row align="center" marginBottom={sizes.m}>
      {/* <Block
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
      </Block> */}
    </Block>
  );
};

const Personal = ({item}: any) => {
  const {colors, icons, gradients, sizes} = useTheme();
  console.log(item);

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
          gradient={gradients[!item?.read ? 'primary' : 'secondary']}>
          <Image
            source={{uri: item?.user?.image}}
            width={42}
            height={42}
            radius={sizes.s}
          />
           
        </Block>
        <Block row justify="space-between" flex={1} marginLeft={sizes.s}>
          <Block justify="flex-start">
            <Text primary>
              {item?.user?.name}
            </Text>
            <Text gray marginLef={sizes.s}>
              {item?.user?.type}
            </Text>
          </Block>
          <Block row flex={0} align="center">
            <Image source={icons.clock} radius={0} />
            <Text secondary size={12} marginLeft={sizes.xs}>
              {dayjs().to(dayjs(item?.createdAt))}
            </Text>
          </Block>
        </Block>
        

      </Block>
      <Text p semibold gray marginTop={sizes.sm}>
            {item?.title}
       </Text>
      <Block row align="center" justify="flex-start" marginTop={sizes.s}>
        {item?.image && (
          <Image
            source={{uri: item?.image}}
            width={40}
            height={40}
            radius={sizes.s * 5}
            style={{marginRight: sizes.s}}
          />
        )}
        <Text secondary lineHeight={22}>
          {item?.message}
        </Text>
      </Block>
    </Block>
  );
};

const Notifications = ({navigation}) => {
  const {t} = useTranslation();
  const [tab, setTab] = useState('organization');
  const pagerRef = React.createRef<PagerView>();
  const {icons, colors, sizes} = useTheme();
  const [notifications, setNotifications] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const user = useSelector(state => state.data.currentUser);


  useEffect(() => {
    if(user?._id){
      (async () => {
        await axios.get(`${API_URL}/notifications/${user?._id}`)
        .then((res) => {
          setNotifications(res?.data?.notifications);
          console.log(res?.data?.notifications);
        })
        .catch((err) => console.log(err));
      }
      )();
    }
  }, [user?._id]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => navigation.navigate('NotificationsSettings')}>
          <Image source={icons.settings} radius={0} width={20} height={20} />
        </Button>
      ),
      headerLeft: () => (
        <Button onPress={() => navigation.goBack()}>
          <Image source={icons.arrow}  width={10} height={20} color={colors.text} style={{transform: [{rotate: '180deg'}]}} />
        </Button>
      ),
    });
  }
  , [navigation, icons]);

  const handleRead = useCallback(
    (_id) => {
      setNotifications(
        notifications.map((notification) =>
          notification._id === _id ? {...notification, read: true} : notification,
        ),
      );
    }
    ,
    [notifications],

  );

  const handleDelete = useCallback(
    (_id) => {
      setNotifications(notifications.filter((notification) => notification._id !== _id));
    }
    ,
    [notifications],
  );

  const handlePress = useCallback(
    (notification) => {
      handleRead(notification._id);
     
    }
    ,
    [handleRead],
  );

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    const res = await axios.get(`${API_URL}/notifications/${user._id}`);
    setNotifications(res?.data?.notifications);
    setLoading(false);
  }
  , [user]);

  const handleLoadMore = useCallback(async () => {
    setLoading(true);
    await axios.post(`${API_URL}/notifications/fetchMore`, {
      userId: user._id,
      ids: notifications.map((notification) => notification._id),
    })
    .then((res) => {
      setNotifications([...notifications, ...res?.data?.notifications]);
    })
    .catch((err) => console.log(err));
    setLoading(false);
  }
  , [user, notifications]);


      

  const unread = notifications?.filter(
    (notification) => !notification?.read && notification.type === 'organization',
  );
  const read = notifications?.filter(
    (notification) => notification?.read && notification.type === 'organization',
  );
  const personal = notifications?.filter(
    (notification) => notification?.type !== 'organization'
  );

  console.log(unread, read, personal)

  const handleTab = useCallback(
    (key) => {
      setTab(key);
      pagerRef.current?.setPage(key === 'organization' ? 1 : 0);
    },
    [setTab, pagerRef],
  );

  return (
    <Block>
      <PagerView
        ref={pagerRef}
        style={{flex: 1}}
        scrollEnabled
        onPageSelected={(e) => setTab(e.nativeEvent.position === 1 ? 'organization' : 'personal')}
        initialPage={tab === 'organization' ? 1 : 0}>
        
        {/* person notifications */}
        <Block
          scroll
          nestedScrollEnabled
          padding={sizes.padding}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: sizes.xxl}}>
          {personal?.map((notification) => (
            <Personal key={`personal-${notification.id}`} item={notification} navigation={navigation} />
          ))}
        </Block>

        {/* organization notifications */}
        <Block
          scroll
          nestedScrollEnabled
          padding={sizes.padding}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: sizes.xxl}}>
          {/* {unread?.length && (
            <Block card padding={sizes.sm} marginBottom={sizes.sm}>
              <Text p semibold marginBottom={sizes.sm}>
                {t('notifications.unread')}
              </Text>
              {unread?.map((notification) => (
                <Notification
                  key={`unread-${notification._id}`}
                  item={notification}
                  navigation={navigation}
                />
              ))}
            </Block>
          )} */}

          {/* {read?.length && (
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
          )} */}
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
          <Button onPress={() => handleTab('organization')}>
            <Image
              radius={0}
              width={20}
              height={20}
              source={icons.office}
              color={colors[tab === 'organization' ? 'primary' : 'secondary']}
            />
            <Text
              semibold
              size={12}
              primary={tab === 'organization'}
              secondary={tab !== 'organization'}>
              {t('notifications.organizations')}
            </Text>
          </Button>
        </Block>
      </Block>
    </Block>
  );
};

export default Notifications;
