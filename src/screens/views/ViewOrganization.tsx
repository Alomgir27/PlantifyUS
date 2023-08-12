import React, {useLayoutEffect, useState, useEffect } from 'react';
import {FlatList, TouchableOpacity} from 'react-native';


import {useTheme, useData} from './../../hooks/';
import {Block, Button, Input, Image, Switch, Modal, Text} from './../../components/';
import * as ICONS from '@expo/vector-icons';
import { API_URL } from '../../constants';
import axios from 'axios';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RefreshControl } from 'react-native';




const DetailOrganizations = ({item, navigation}: any) => {
    const {assets, sizes, colors} = useTheme();
    const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
    const IMAGE_VERTICAL_SIZE =
      (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
    const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;

    const user = useSelector((state: any) => state.data.currentUser);
    const [id, setId] = useState<string>(item?._id);
    
    
    const [lengthMembers, setLengthMembers] = useState<number>(6);
    const [lengthEvents, setLengthEvents] = useState<number>(6);
    const [requestedEvents, setRequestedEvents] = useState<any>([]);

    const handleApprove = async (eventId: string) => {
        await axios.post(`${API_URL}/events/approve`, { eventId, organizationId: id })
        .then((res) => {
            console.log(res?.data);
            let newRequestedEvents = requestedEvents.filter((event: any) => event?._id !== eventId);
            setRequestedEvents(newRequestedEvents);
        })
        .catch((err) => {
            console.log(err);
        })
    };

    const handleReject = async (eventId: string) => {
        await axios.delete(`${API_URL}/events/reject/${eventId}`)
        .then((res) => {
            console.log(res?.data);
            let newRequestedEvents = requestedEvents.filter((event: any) => event?._id !== eventId);
            setRequestedEvents(newRequestedEvents);
        })
        .catch((err) => {
            console.log(err);
        })
    };


    useEffect(() => {
        if(item?._id) {
            (async () => {
                await axios.get(`${API_URL}/events/getRequestedEvents/${item?._id}`)
                .then((res) => {
                    setRequestedEvents(res?.data?.events);
                })
                .catch((err) => {
                    console.log(err);
                })
            })();
        }
        setId(item?._id)
    }, [item?._id]);

    useEffect(() => {
       navigation.setOptions({
        headerTitle: item?.name?.length > 20 ? item?.name?.substring(0, 20) + '...' : item?.name,
       });
    }
    , [item?.name]);

    const EventItem = ({item}: any) => {
        return (
        <Block column align="center" marginBottom={sizes.sm} key={item?._id}>
            <Block card row align="center" marginBottom={sizes.sm} key={item?._id}>
                {item?.images?.length > 0 && (
                    <Image
                        resizeMode="cover"
                        source={{uri: item?.images[0]}}
                        style={{
                            height: IMAGE_VERTICAL_SIZE,
                            width: IMAGE_VERTICAL_SIZE,
                        }}
                    />
                )}

                
                <Block padding={sizes.s} justify="space-between">
                    <Text p numberOfLines={1} semibold marginBottom={sizes.s}>{item?.title}</Text>
                    <Text p numberOfLines={2} marginBottom={sizes.s}>{item?.description}</Text>
                   <TouchableOpacity onPress={() => {
                        AsyncStorage.setItem('route', 'Organization')
                        navigation.navigate('Events', { _id: item?._id, id })
                     }}>
                          
                         <Block row align="center">
                          <Text p semibold marginRight={sizes.s} color={colors.link}>
                            See More
                            </Text>
                          <Image source={assets.arrow} color={colors.link} />
                       </Block>
                    </TouchableOpacity>
                </Block>
                {item?.isVerified && <ICONS.Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
            </Block>
            {item?.moderators?.includes(user?._id) && item?.admin?._id !== user?._id && !item?.isVerified && (
                <Block row align="center" justify="space-between" width={sizes.width - sizes.padding * 2}>
                    <Button
                        primary
                        width={sizes.width / 3}
                        onPress={() => handleApprove(item?._id)}
                    >
                        <Text bold>
                            Approve
                        </Text>
                    </Button>
                    <Button
                        danger
                        width={sizes.width / 3}
                        onPress={() => handleReject(item?._id)}
                    >
                        <Text bold white>
                            Reject
                        </Text>
                    </Button>
                </Block>
            )}
        </Block>
        );
    };
  
    return (
      <Block marginTop={sizes.m} paddingHorizontal={sizes.padding}>
        <Text p semibold marginBottom={sizes.s}>
          {item?.isVerified ? 'Verified' : 'Not Verified'} <ICONS.Ionicons name="checkmark-circle-outline" size={sizes?.base * 2} color={item?.isVerified ? 'green' : 'red'} /> •{' '} {dayjs(item?.createdAt).format('DD MMMM YYYY')}
        </Text>

        <Block marginBottom={sizes.xxl}>
          <Image
            resizeMode="cover"
            source={{uri: item?.images[0]}}
            style={{width: '100%'}}
            height={sizes.height / 3}
          />
          <Text p secondary marginTop={sizes.sm}>
            {item?.moderators?.length} moderators •{' '} <Text primary>{item?.volunteers?.length}</Text> Members
          </Text>
          <Text h4 marginVertical={sizes.s}>
            {item?.name}
          </Text>
          <Text p lineHeight={26}>
            {item?.bio}
          </Text>
        </Block>
        {/* photo gallery */}
        <Block>
          <Block row align="center" justify="space-between" marginBottom={sizes.s}>
            <Text h5 semibold>
              members {item?.volunteers?.length > 0 && <Text primary>({item?.volunteers?.length})</Text>}
            </Text>
            <Button onPress={() => setLengthMembers(lengthMembers === 6 ? item?.volunteers?.length : 6)}>
              <Text p primary semibold>
                {lengthMembers === 6 ? 'View More' : 'View Less'}
              </Text>
            </Button>
          </Block>
          <Block row wrap="wrap">
            {item?.volunteers?.slice(0, lengthMembers).map((volunteer: any) => (
             <Block key={volunteer?._id} justify="center" align="center" marginBottom={IMAGE_MARGIN}>
                <Button onPress={() => navigation.navigate('Profile', { userId: volunteer?._id})} >
                  {volunteer?.image &&
                    <Image
                        resizeMode="cover"
                        source={{uri: volunteer?.image}}
                        style={{
                            height: IMAGE_SIZE,
                            width: IMAGE_SIZE,
                        }}
                    />
                  }
                    <Text p primary semibold center marginBottom={sizes.s}>
                        {volunteer?.name}
                    </Text>
                </Button>
                </Block>
            ))}
          </Block>
        </Block>

        <Block>
            <Block row align="center" justify="space-between" marginBottom={sizes.s}>
                <Text h5 semibold>
                    Requested Events {requestedEvents?.length > 0 && <Text primary>({requestedEvents?.length})</Text>}
                </Text>
                <Button onPress={() => setLengthEvents(lengthEvents === 6 ? requestedEvents?.length : 6)}>
                    <Text p primary semibold>
                        View More
                    </Text>
                </Button>
            </Block>
            
            {requestedEvents?.length > 0 && (
                requestedEvents?.slice(0, lengthEvents).map((event: any) => (
                    <EventItem item={event} />
                ))
            )}
        </Block>
  

        <Block>
            <Block row align="center" justify="space-between" marginBottom={sizes.s}>
                <Text h5 semibold>
                    Past Events {item?.events?.length > 0 && <Text primary>({item?.events?.length})</Text>}
                </Text>
            </Block>

            {item?.events?.length > 0 && (
                item?.events?.map((event: any) => (
                    <EventItem item={event} />
                ))
            )}
        </Block>
      </Block>
    );
  };
  
  const ViewOrganization = ({route, navigation}: any) => {
    const {sizes, colors} = useTheme();
    const { isDark } = useData();
    const [organization, setOrganization] = useState<any>();
    const user = useSelector((state: any) => state.data.currentUser);
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        if(route?.params?._id) {
            axios.get(`${API_URL}/organizations/getOne/${route?.params?._id}`)
            .then((res) => {
                setOrganization(res?.data?.organization);
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }, [route?.params?._id]);

    const onRefresh = () => {
        setLoading(true);
        axios.get(`${API_URL}/organizations/getOne/${route?.params?._id}`)
        .then((res) => {
            setOrganization(res?.data?.organization);
            setLoading(false);
        })
        .catch((err) => {
            console.log(err);
            setLoading(false);
        }
        )
    }


  
    useLayoutEffect(() => {
      navigation.setOptions({
        backgroundColor: 'transparent',
        headerTitle: null,
        headerTransparent: true,
        headerTintColor: isDark ? colors.white : colors.black,
        headerLeft: () => (
            <ICONS.Ionicons
                name="chevron-back"
                size={sizes?.base * 2.5}
                color={isDark ? colors.white : colors.black}
                onPress={() => navigation.goBack()}
                style={{marginLeft: sizes?.padding}}
            />
        ),
        headerRight: () => (
            <Block row>
                <Button
                marginRight={sizes?.s}
                onPress={() => navigation.navigate('Chat')}>
                <ICONS.Ionicons
                    name="chatbubble-ellipses-outline"
                    size={sizes?.base * 2.5}
                    color={isDark ? colors.white : colors.black}
                />
                </Button>
                <Button
                marginRight={sizes?.s}
                onPress={() => navigation.navigate('Notifications')}>
                <ICONS.Ionicons
                    name="notifications-outline"
                    size={sizes?.base * 2.5}
                    color={isDark ? colors.white : colors.black}
                />
                </Button>
            </Block>
        ),
      });
    }, [navigation]);

  
    return (
      <Block safe>
        <Block
            scroll
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingVertical: sizes.padding * 2}}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={onRefresh}
                />
            }
          >
          <Block>
            <DetailOrganizations item={organization} navigation={navigation} />
          </Block>
        </Block>
      </Block>
    );
  };


export default ViewOrganization;