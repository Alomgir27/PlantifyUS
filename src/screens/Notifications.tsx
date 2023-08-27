import React, {useCallback, useState, useEffect} from 'react';
import dayjs from 'dayjs';
import PagerView from 'react-native-pager-view';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { RefreshControl, View } from 'react-native';

import {useData, useTheme, useTranslation} from '../hooks/';
import {INotification} from '../constants/types';
import {Block, Button, Image, Text} from '../components/';
import { API_URL } from '../constants';
import axios from 'axios';
import * as ICONS from '@expo/vector-icons';

import { useSelector } from 'react-redux';
import { FlatList } from 'react-native-gesture-handler';

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

const Notification = ({item, navigation, handleDelete, handleRead} : any) => {
  const {colors, icons, gradients, sizes} = useTheme();

  return (
    <Block row align="center" marginBottom={sizes.m} marginTop={sizes.m} color={colors.card}>
          <Image
            radius={item?.image ? sizes.s : 0}
            width={item?.image ? 30 : 14}
            height={item?.image ? 30 : 14}
            source={item?.image ? {uri: item?.image} : icons?.[item?.type === 'organization' ? 'office' : 'profile']}
            resizeMode="cover"
          />
      <Button
          onPress={() => {
            handleRead(item?._id);
            if(item?.type === 'organization'){
              navigation.navigate('Organization', {_id: item?.organization});
            } else if(item?.type === 'event'){
              navigation.navigate('Events', {_id: item?.event});
            } else if(item?.type === 'post'){
              navigation.navigate('Posts', {_id: item?.post});
            } else {
              navigation.navigate('Profile', {userId: item?.user});
            }
          }}
          padding={sizes.s}
          flex={0}
          radius={sizes.s}
          marginLeft={sizes.s}
          marginRight={sizes.s}
          justify="space-between"
          align="center"
          
        >
        <Block>
          <Block row justify="space-between" marginLeft={sizes.s}>
            <Text semibold>{item?.title}</Text>
            <Block row flex={0} align="center" marginLeft={sizes.s}>
              <Image source={icons.clock} />
              <Text secondary size={12} marginLeft={sizes.xs}>
                {dayjs().to(dayjs(item?.createdAt))}
              </Text>
            </Block>
          </Block>
          <Text secondary size={12} lineHeight={sizes.sm} marginLeft={sizes.s}>
            {item?.message}
          </Text>
        </Block>
      </Button>
    </Block>
  );
};

const Personal = ({item, navigation, handleDelete, handleRead} : any) => {
  const {colors, icons, gradients, sizes} = useTheme();

  return (
    <Block card padding={sizes.sm} marginBottom={sizes.sm} color={item?.read ? colors.card : colors.gray}>
     <Button onPress={() => {
          handleRead(item?._id);
          if(item?.type === 'organization'){
            navigation.navigate('Organization', {_id: item?.organization});
          } else if(item?.type === 'event'){
            navigation.navigate('Events', {_id: item?.event});
          } else if(item?.type === 'post'){
            navigation.navigate('Posts', {_id: item?.post});
          } else {
            navigation.navigate('Profile', {_id: item?.user});
          }
        }
        }>
      <Block row align="center" marginBottom={sizes.m}>
        <Block
          flex={0}
          width={32}
          height={32}
          align="center"
          justify="center"
          radius={sizes.s}
          marginRight={sizes.s}
          gradient={gradients[!item?.read ? 'primary' : 'secondary']}>
          <Image
            radius={item?.image ? sizes.s : 0}
            width={item?.image ? 30 : 14}
            height={item?.image ? 30 : 14}
            source={item?.image ? {uri: item?.image} : icons?.[item?.type === 'organization' ? 'office' : 'profile']}
            resizeMode="cover"
          />
        </Block>
        <Block>
          <Block row justify="space-between">
            <Text semibold>{item?.title}</Text>
            <Block row flex={0} align="center">
              <Image source={icons.clock} />
              <Text secondary size={12} marginLeft={sizes.xs}>
                {dayjs().to(dayjs(item?.createdAt))}
              </Text>
            </Block>
          </Block>
          <Text secondary size={12} lineHeight={sizes.sm}>
            {item?.message}
          </Text>
        </Block>
      </Block>
    </Button>
      <Block row align="center" justify="space-between" marginTop={-sizes.sm}>
        {item?.read !== true ? (
        <Button
          onPress={() => handleRead(item?._id)}
          >
          <Text size={12} semibold>
            Mark as read
          </Text>
        </Button>
        ) : (
          <Text size={12} semibold>
            Read already
          </Text>
        )}
        <Button
          onPress={() => handleDelete(item?._id)
          }>
          <Text size={12} semibold>
            Delete
          </Text>
        </Button>
      </Block>
    </Block>
  );
}

      

const Notifications = ({ navigation }) => {
  const {t} = useTranslation();
  const [tab, setTab] = useState('organization');
  const pagerRef = React.createRef<PagerView>();
  const {icons, colors, sizes} = useTheme();
  const [loading, setLoading] = useState<boolean>(false);

  const user = useSelector(state => state.data.currentUser);
  const [personal, setPersonal] = useState<any>([]);
  const [read, setRead] = useState<any>([]);
  const [unread, setUnread] = useState<any>([]);



  useEffect(() => {
    if(user?._id){
      (async () => {
        await axios.get(`${API_URL}/notifications/personal/${user?._id}`)
        .then((res) => {
          setPersonal(res?.data?.notifications);
          console.log(res?.data?.notifications);
        })
        .catch((err) => console.log(err));
      }
      )();
    }
  }, [user?._id]);


  useEffect(() => {
    if(user?._id){
      (async () => {
        await axios.get(`${API_URL}/notifications/org/${user?._id}`)
        .then((res) => {
          setRead(res?.data?.read);
          setUnread(res?.data?.unread);
        })
        .catch((err) => console.log(err));
      }
      )();
    }
  }, [user?._id]);

  const handleRead = async (id) => {
    await axios.post(`${API_URL}/notifications/markAsRead/${id}`)
    .then((res) => {  
      setPersonal((prev) => prev.map((notification) => notification._id === id ? {...notification, read: true} : notification));
      if(unread?.map((notification) => notification._id).includes(id)){
        setUnread((prev) => prev.filter((notification) => notification._id !== id));
        setRead((prev) => [...prev, res?.data?.notification]);
      }
    }
    )
    .catch((err) => console.log(err));
  }

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/notifications/delete/${id}`)
    .then((res) => {
      setPersonal((prev) => prev.filter((notification) => notification._id !== id));
      if(unread?.map((notification) => notification._id).includes(id)){
        setUnread((prev) => prev.filter((notification) => notification._id !== id));
      }
      if(read?.map((notification) => notification._id).includes(id)){
        setRead((prev) => prev.filter((notification) => notification._id !== id));
      }
    }
    )
    .catch((err) => console.log(err));
  }







  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => navigation.navigate('NotificationsSettings')}>
          <Image source={icons.settings} radius={0} width={20} height={20} />
        </Button>
      ),
    });
  }
  , [navigation, icons]);





  const handleRefresh = useCallback(async () => {
    setLoading(true);
    const res = await axios.get(`${API_URL}/notifications/personal/${user._id}`);
    setPersonal(res?.data?.notifications);
    setLoading(false);
  }
  , [user]);

  const handleLoadMore = async () => {
    setLoading(true);
    await axios.post(`${API_URL}/notifications/personal/fetchMore`, {
      userId: user._id,
      ids: personal.map((notification) => notification._id),
    })
    .then((res) => {
      setPersonal((prev) => [...prev, ...res?.data?.notifications]);
    })
    .catch((err) => console.log(err));
    setLoading(false);
  }

  const handleLoadMoreOrg = async () => {
    setLoading(true);
    await axios.post(`${API_URL}/notifications/org/fetchMore`, {
      userId: user._id,
      ids: read.map((notification) => notification._id).concat(unread.map((notification) => notification._id)),
    })
    .then((res) => {
      setRead((prev) => [...prev, ...res?.data?.read]);
      setUnread((prev) => [...prev, ...res?.data?.unread]);
    })
    .catch((err) => console.log(err));
    setLoading(false);
  }

  const markAsRead = async () => {
    await axios.post(`${API_URL}/notifications/markAsRead`, {
      ids: personal.map((notification) => notification._id),
    })
    .then((res) => {
      setPersonal((prev) => prev.map((notification) => ({...notification, read: true})));
    })
    .catch((err) => console.log(err));
  }

      


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
          padding={sizes.padding}
          contentContainerStyle={{paddingBottom: sizes.xxl}}
          justify="center"

          
          >
            {personal?.length > 0 && (
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Button onPress={() => markAsRead()}>
                 <Text size={12} semibold lineHeight={sizes.m}>
                    Mark all as read
                 </Text>
                </Button>
              </View>
            )}
          <Block>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={personal}
              renderItem={({item}) => <Personal item={item} navigation={navigation} handleDelete={handleDelete} handleRead={handleRead} />}
              keyExtractor={(item) => item._id}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={handleRefresh}
                />
              }

              ListFooterComponent={
                <Button onPress={() => handleLoadMore()}>
                  <Text size={12} semibold>
                    Show more
                  </Text>
                </Button>
              }

            />

          </Block>
        </Block>

        {/* organization notifications */}
        <Block
          scroll
          padding={sizes.padding}
          contentContainerStyle={{paddingBottom: sizes.xxl}}
                
          >
          {unread?.length > 0 && (
            <Block card padding={sizes.sm} marginBottom={sizes.sm}>
              <Text p semibold marginBottom={sizes.sm}>
                {t('notifications.unread')}
              </Text>
              {unread?.map((notification) => (
                <Notification
                  key={`unread-${notification._id}`}
                  item={notification}
                  navigation={navigation}
                  handleDelete={handleDelete}
                  handleRead={handleRead}
                />
              ))}
             <Button onPress={() => handleLoadMoreOrg()}>
              <Text size={12} semibold>
                Show more
              </Text>
            </Button>
            </Block>
           

          )}

          {read?.length > 0 && (
            <Block card padding={sizes.sm}>
              <Text p semibold marginBottom={sizes.sm}>
                {t('notifications.read')}
              </Text>
              {read?.map((notification) => (
                <Notification
                  key={`read-${notification?._id}`}
                  item={notification}
                  navigation={navigation}
                  handleDelete={handleDelete}
                  handleRead={handleRead}
                />
              ))}
            <Button onPress={() => handleLoadMoreOrg()}>
              <Text size={12} semibold>
                Show more
              </Text>
            </Button>
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
