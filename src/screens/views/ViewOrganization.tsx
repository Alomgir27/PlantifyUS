import React, {useLayoutEffect, useState, useEffect, useCallback } from 'react';
import {FlatList, TouchableOpacity, View } from 'react-native';


import {useTheme, useData} from './../../hooks/';
import {Block, Button, Input, Image, Switch, Modal, Text} from './../../components/';
import * as ICONS from '@expo/vector-icons';
import { API_URL } from '../../constants';
import axios from 'axios';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { RefreshControl } from 'react-native';
import { Modal as Modal2 } from 'react-native-paper';
import { Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import sendPushNotification from '../../modules/notfications';



const DetailOrganizations = ({item, navigation, setOrganization}: any) => {
    const {assets, sizes, colors} = useTheme();
    const { isDark } = useData();
    const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
    const IMAGE_VERTICAL_SIZE =
      (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
    const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;

    const user = useSelector((state: any) => state.data.currentUser);
    const [id, setId] = useState<string>(item?._id);
    const [loading, setLoading] = useState<boolean>(false);
    
    
    const [lengthMembers, setLengthMembers] = useState<number>(6);
    const [lengthEvents, setLengthEvents] = useState<number>(6);
    const [lengthModerators, setLengthModerators] = useState<number>(6);
    const [requestedEvents, setRequestedEvents] = useState<any>([]);
    const [showModal, setModal] = useState<boolean>(false);
    const [showModalUser, setModalUser] = useState<boolean>(false);
    const [showAchievements, setShowAchievements] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<any>({});
    const [showModalEvent, setModalEvent] = useState<boolean>(false);
    const [event, setEvent] = useState<any>({});
    const [text, setText] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<any>({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        startHour: 0,
        length: 1,
    });

   
    

    const handleApprove = async (eventId: string) => {
        setLoading(true);
        await axios.post(`${API_URL}/events/approve`, { eventId, organizationId: id , ...selectedDate, text, userId: user?._id})
        .then((res) => {
            console.log(res?.data);

            const notification = {
                title: 'Your event has been approved',
                message: 'You can now see the event details',
                type: 'event',
                _id: res?.data?.event?._id,
                image: res?.data?.event?.images[0],
                userId: res?.data?.event?.author?._id,
            };
            sendPushNotification(res?.data?.event?.author?.pushToken, notification.title, notification.message, notification.type, notification._id, notification.image, notification.userId);

            item?.volunteers?.map((volunteer: any) => {
                let pushToken = volunteer?.pushToken;
                const notification = {
                    title: 'New event has been hosted',
                    message: res?.data?.event?.title + ' has been hosted by ' + item?.name,
                    type: 'event',
                    _id: res?.data?.event?._id,
                    image: res?.data?.event?.images[0],
                    userId: volunteer?._id,
                };
                sendPushNotification(pushToken, notification.title, notification.message, notification.type, notification._id, notification.image, notification.userId);
            })
            

            setOrganization({...item, events: [...item?.events, res?.data?.event]});
            let newRequestedEvents = requestedEvents.filter((event: any) => event?._id !== eventId);
            setRequestedEvents(newRequestedEvents);
            setModalEvent(false);
            setSelectedDate({
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                day: new Date().getDate(),
                length: 1,
            });
            setText('');
        })
        .catch((err) => {
            console.log(err);
        })
        setLoading(false);
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

    const approveJoinRequest = async (userId: string) => {
        await axios.post(`${API_URL}/organizations/approveJoinRequest`, { userId, organizationId: id })
        .then((res) => {
            console.log(res?.data);
            let pushToken = item?.joinRequests?.filter((user: any) => user?._id === userId)[0]?.pushToken;
            const notification = {
                title: 'You have been accepted to join ' + item?.name,
                message: 'You can now see the organization details',
                type: 'organization',
                _id: item?._id,
                image: item?.images[0],
                userId: userId,
            };
            sendPushNotification(pushToken, notification.title, notification.message, notification.type, notification._id, notification.image, notification.userId);

            let requestUser = item?.joinRequests?.filter((user: any) => user?._id === userId)[0];
            let newItems = item?.joinRequests?.filter((user: any) => user?._id !== userId);
             //now notify all the volunteers 
             newItems?.map((volunteer: any) => {
                let pushToken = volunteer?.pushToken;
                const notification = {
                    title: 'New member joined ' + item?.name,
                    message: requestUser?.name + ' has joined ' + item?.name,
                    type: 'organization',
                    _id: item?._id,
                    image: item?.images[0],
                    userId: volunteer?._id,
                };
                sendPushNotification(pushToken, notification.title, notification.message, notification.type, notification._id, notification.image, notification.userId);
            })
            setOrganization({...item, joinRequests: newItems});
        })
        .catch((err) => {
            console.log(err);
        })
    };

    const rejectJoinRequest = async (userId: string) => {
        await axios.post(`${API_URL}/organizations/rejectJoinRequest`, { userId, organizationId: id })
        .then((res) => {
            console.log(res?.data);
            let newItems = item?.joinRequests?.filter((user: any) => user?._id !== userId);
            setOrganization({...item, joinRequests: newItems});
        })
        .catch((err) => {
            console.log(err);
        })
    };

    const handleAddModerator = async (userId: string) => {
        await axios.post(`${API_URL}/organizations/addModerator`, { userId, organizationId: id })
        .then((res) => {
            console.log(res?.data);
            let newItems = item?.moderators;
            newItems.push(res?.data?.user);
            setOrganization({...item, moderators: newItems});
        })
        .catch((err) => {
            console.log(err);
        })
    };

    const handleRemoveModerator = async (userId: string) => {
        await axios.post(`${API_URL}/organizations/removeModerator`, { userId, organizationId: id })
        .then((res) => {
            console.log(res?.data);
            let newItems = item?.moderators?.filter((user: any) => user?._id !== userId);
            setOrganization({...item, moderators: newItems});
        })
        .catch((err) => {
            console.log(err);
        })
    };

    const handleRemoveVolunteer = async (userId: string) => {
        await axios.post(`${API_URL}/organizations/removeVolunteer`, { userId, organizationId: id })
        .then((res) => {
            console.log(res?.data);
            let newItems = item?.volunteers?.filter((user: any) => user?._id !== userId);
            let newItems2 = item?.moderators?.filter((user: any) => user?._id !== userId);
            setOrganization({...item, volunteers: newItems, moderators: newItems2});
        }
        )
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

    const EventItem = ({nowItem}: any) => {
        return (
         <Block>
            <Block column align="center" marginBottom={sizes.sm} key={item?._id}>
                <Block card row align="center" marginBottom={sizes.sm} key={item?._id}>
                    {nowItem?.images?.length > 0 && (
                        <Image
                            resizeMode="cover"
                            source={{uri: nowItem?.images[0]}}
                            style={{
                                height: IMAGE_VERTICAL_SIZE,
                                width: IMAGE_VERTICAL_SIZE,
                            }}
                        />
                    )}

                    
                    <Block padding={sizes.s} justify="space-between">
                        <Text p numberOfLines={1} semibold marginBottom={sizes.s}>{nowItem?.title}</Text>
                        <Text p numberOfLines={2} marginBottom={sizes.s}>{nowItem?.description}</Text>
                        <Text p size={10} marginBottom={sizes.s / 5} color={colors.text} numberOfLines={3}>
                            {nowItem?.hostDetails?.message}
                        </Text>
                    <TouchableOpacity onPress={() => {
                            navigation.navigate('Events', { _id: nowItem?._id, id })
                        }}>
                            
                            <Block row align="center">
                            <Text p semibold marginRight={sizes.s} color={colors.link}>
                                See More
                                </Text>
                            <Image source={assets.arrow} color={colors.link} />
                        </Block>
                        </TouchableOpacity>
                    </Block>
                    {nowItem?.isVerified && <ICONS.Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
                </Block>
                {(item?.moderators?.map((moderator: any) => moderator?._id).includes(user?._id) || item?.admin?._id === user?._id) && !nowItem?.isVerified && nowItem?.status === 'pending' && (
                    <Block row align="center" justify="space-between" width={sizes.width - sizes.padding * 2}>
                        <Button
                            danger
                            width={sizes.width / 3}
                            onPress={() => handleReject(nowItem?._id)}
                        >
                            <Text bold white>
                                Reject
                            </Text>
                        </Button>
                        <Button
                            primary
                            width={sizes.width / 3}
                            onPress={() => Alert.alert('Are you sure you want to host this event?', 'Please check the event details before hosting it.',
                            [
                                {
                                    text: 'Cancel',
                                    onPress: () => console.log('Cancel Pressed'),
                                    style: 'cancel'
                                },
                                { text: 'Yes, I checked', onPress: () => {setEvent(nowItem); setModalEvent(true)} }
                            ])}
                        >
                            <Text bold>
                                Approved
                            </Text>
                        </Button>
                    </Block>
                )}
            </Block>
          </Block>
        );
    };

  
 


  
    return (
    <Block>
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

          <Block row align="center" justify="center" marginTop={sizes.sm}>
            <Button
                row
                onPress={() => setShowAchievements(!showAchievements)}
            >
                <Text p  marginRight={sizes.s} color={colors.link}>
                    Our Achievements
                </Text>
                <Image source={assets.arrow} />
            </Button>
          </Block>
            {showAchievements && item?.badges?.length > 0 && (
                <Block row wrap="wrap" justify="center" align="center">
                    {item?.badges?.map((badge: any) => (
                        <Block key={badge?._id} justify="center" align="center" marginBottom={IMAGE_MARGIN}>
                            <Image
                                resizeMode="cover"
                                source={{uri: badge?.image}}
                                style={{
                                    height: IMAGE_SIZE,
                                    width: IMAGE_SIZE,
                                }}
                            />
                            <Text p primary semibold center marginBottom={sizes.s}>
                                {badge?.name}
                            </Text>
                        </Block>
                    ))}
                </Block>
            )}
        
          <Text h4 marginVertical={sizes.s}>
            {item?.name}
          </Text>
          <Text p lineHeight={26}>
            {item?.bio}
          </Text>
        </Block>
        {/* Join Request */}
        <Block  justify="flex-start" marginBottom={sizes.s}>
            <Text h5 semibold marginLeft={sizes.s}>
                joinRequests {item?.joinRequests?.length > 0 && <Text primary>({item?.joinRequests?.length})</Text>}
            </Text>
            <Button onPress={() => setModal(true)} padding={sizes.s} primary width={sizes.width / 3} marginTop={sizes.s} marginLeft={sizes.s}>
                <Text p white semibold>
                    Waiting ({item?.joinRequests?.length})
                </Text>
            </Button>
            
            <Modal visible={showModal} onRequestClose={() => setModal(false)}>
                <FlatList
                    keyExtractor={(item) => item?._id}
                    data={item?.joinRequests}
                    renderItem={({item}) => (
                        <Block
                            align="center"
                            justify="center"
                            marginBottom={sizes.s}
                            key={item?._id}
                        >
                            <Image
                                resizeMode="cover"
                                source={{uri: item?.image}}
                                style={{
                                    height: IMAGE_SIZE / 2,
                                    width: IMAGE_SIZE / 2,
                                    borderRadius: 100,
                                }}
                            />
                            <Text p semibold>
                                {item?.name}
                            </Text>
                         <Block row align="center" justify="space-between" width={sizes.padding * 8}>
                            <Button onPress={() => navigation.navigate('Profile', { userId: item?._id})}>
                                <Text p primary semibold>
                                    View Profile
                                </Text>
                            </Button>
                            {!(item?.admin?._id === user?._id || item?.moderators?.map((moderator: any) => moderator?._id).includes(user?._id)) ? (
                              <Block row align="center" justify="space-between" width={sizes.padding * 8}>
                                <Button onPress={() => approveJoinRequest(item?._id)}>
                                    <Text p primary semibold marginLeft={sizes.s}>
                                        Accept
                                    </Text>
                                </Button>
                                <Button onPress={() => rejectJoinRequest(item?._id)}>
                                    <Text p semibold marginLeft={sizes.s} danger>
                                        Reject
                                    </Text>
                                </Button>
                               </Block>
                            ) : (
                                <Text p primary semibold>
                                    pending
                                </Text>
                            )}

                          </Block>
                        </Block>
                    )}
                />
            </Modal>
        </Block>
        {/* moderator */}
        <Block row align="center" justify="space-between" marginBottom={sizes.s}>
            <Text h5 semibold>
                moderators {item?.moderators?.length > 0 && <Text primary>({item?.moderators?.length})</Text>}
            </Text>
            <Button onPress={() => setLengthModerators(lengthModerators === 6 ? item?.moderators?.length : 6)}>
                <Text p primary semibold>
                    {lengthModerators === 6 ? 'View More' : 'View Less'}
                </Text>
            </Button>
        </Block>
        
        <Block row wrap="wrap">
            {item?.moderators?.slice(0, lengthModerators).map((moderator: any) => (
                <Block key={moderator?._id} justify="center" align="center" marginBottom={IMAGE_MARGIN}>
                    <Button onPress={() => {
                        setSelectedUser(moderator);
                        setModalUser(true);
                    }}>
                        {moderator?.image &&
                            <Image
                                resizeMode="cover"
                                source={{uri: moderator?.image}}
                                style={{
                                    height: IMAGE_SIZE,
                                    width: IMAGE_SIZE,
                                }}
                            />
                        }
                        <Text p primary semibold center marginBottom={sizes.s}>
                            {moderator?.name}
                        </Text>
                    </Button>
                </Block>
            ))}
        </Block>


        {/* general members */}
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
                <Button onPress={() => {
                    setSelectedUser(volunteer);
                    setModalUser(true);
                }}>
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
                    <EventItem nowItem={event} key={event?._id} />
                ))
            )}
        </Block>
  

        <Block>
            <Block row align="center" justify="space-between" marginBottom={sizes.s}>
                <Text h5 semibold>
                    Hosted Events {item?.events?.length > 0 && <Text primary>({item?.events?.length})</Text>}
                </Text>
            </Block>

            {item?.events?.length > 0 && (
                item?.events?.map((event: any) => (
                    <EventItem nowItem={event} key={event?._id} />
                ))
            )}
        </Block>
      </Block>

      {/* modal handle */}
       <Modal2
        visible={showModalUser}
        onDismiss={() => {
                setSelectedUser({});
                setModalUser(false);
         }}
        contentContainerStyle={{
            backgroundColor: isDark ? colors.card : colors.white,
            padding: sizes.padding,
            borderRadius: sizes.radius,
            width: sizes.width - sizes.padding * 2,
            alignSelf: 'center',
        }}

        >
            
                <Block align="center" justify="center" marginBottom={sizes.s} key={item?._id} padding={sizes.padding} >
                    {item?.admin?._id === user?._id && selectedUser?._id !== user?._id && (
                        <Block row align="center" justify="space-between" padding={sizes.padding} marginBottom={sizes.padding}>
                            {item?.moderators?.map((moderator: any) => moderator?._id).includes(selectedUser?._id) ? (
                                <Button onPress={() => handleRemoveModerator(selectedUser?._id)}>
                                    <Text p primary semibold>
                                        Remove {selectedUser?.name} from Moderators
                                    </Text>
                                </Button>
                            ) : (
                                <Button onPress={() => handleAddModerator(selectedUser?._id)}>
                                    <Text p primary semibold>
                                        Add {selectedUser?.name} as Moderator
                                    </Text>
                                </Button>
                            )}
                        </Block>
                    )}

                    {item?.moderators?.map((moderator: any) => moderator?._id).includes(user?._id) && selectedUser?._id !== user?._id && selectedUser?._id !== item?.admin?._id && (
                        <Block row align="center" justify="space-between" padding={sizes.padding} marginBottom={sizes.padding}>
                            {item?.volunteers?.map((volunteer: any) => volunteer?._id).includes(selectedUser?._id) && (
                                <Button onPress={() => handleRemoveVolunteer(selectedUser?._id)}>
                                    <Text p primary semibold>
                                        Remove {selectedUser?.name} from Volunteers
                                    </Text>
                                </Button>
                            )}
                        </Block>
                    )}
                    
                    <Block row align="center" justify="space-between" marginBottom={sizes.padding}>
                        <Button onPress={() => navigation.navigate('Profile', { userId: selectedUser?._id})}>
                            <Text p primary semibold>
                                View Profile
                            </Text>
                        </Button>
                    </Block>
                </Block>
        </Modal2>
        <Modal2 visible={showModalEvent} 
              onDismiss={() => setModalEvent(false)}
              contentContainerStyle={{
                  backgroundColor: isDark ? colors.card : colors.white,
                  padding: sizes.padding,
                  borderRadius: sizes.radius,
                  width: sizes.width - sizes.padding * 2,
                  alignSelf: 'center',

              }}
      
          >
            <Text p primary semibold marginBottom={sizes.padding}>
                At least 24 hours before the event, you can approve or reject the event
            </Text>
                    <View  style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text p>
                            day
                        </Text>
                        <TextInput
                            style={{
                                height: 40,
                                width: 100,
                                borderColor: colors.border,
                                borderWidth: 1,
                                borderRadius: sizes.radius,
                                marginTop: sizes.padding,
                                marginBottom: sizes.padding,
                                paddingLeft: sizes.padding,

                            }}
                            onChangeText={(text) => setSelectedDate({...selectedDate, day: text})}
                            placeholder="day"
                            keyboardType="numeric"
                            value={selectedDate?.day}
                        />
                    </View>
                    <View  style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text p>
                            month
                        </Text>
                        <TextInput
                            style={{
                                height: 40,
                                width: 100,
                                borderColor: colors.border,
                                borderWidth: 1,
                                borderRadius: sizes.radius,
                                marginTop: sizes.padding,
                                marginBottom: sizes.padding,
                                paddingLeft: sizes.padding,

                            }}
                            onChangeText={(text) => setSelectedDate({...selectedDate, month: text})}
                            placeholder="month"
                            keyboardType="numeric"
                            value={selectedDate?.month}
                        />
                    </View>
                    

                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text p>
                            year
                        </Text>
                        <TextInput
                            style={{
                                height: 40,
                                width: 100,
                                borderColor: colors.border,
                                borderWidth: 1,
                                borderRadius: sizes.radius,
                                marginTop: sizes.padding,
                                marginBottom: sizes.padding,
                                marginLeft: sizes.padding,
                                paddingLeft: sizes.padding,

                            }}
                            onChangeText={(text) => setSelectedDate({...selectedDate, year: text})}
                            placeholder="year"
                            keyboardType="numeric"
                            value={selectedDate?.year}

                        />
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text p>
                            Length of event
                        </Text>
                        <TextInput
                            style={{
                                height: 40,
                                width: 100,
                                borderColor: colors.border,
                                borderWidth: 1,
                                borderRadius: sizes.radius,
                                marginTop: sizes.padding,
                                marginBottom: sizes.padding,
                                marginLeft: sizes.padding,
                                paddingLeft: sizes.padding,
                            }}
                            onChangeText={(text) => setSelectedDate({...selectedDate, length: text})}
                            value={selectedDate?.length}
                            placeholder="hours"
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text p>
                            Start Hour
                        </Text>
                        <TextInput
                            style={{
                                height: 40,
                                width: 100,
                                borderColor: colors.border,
                                borderWidth: 1,
                                borderRadius: sizes.radius,
                                marginTop: sizes.padding,
                                marginBottom: sizes.padding,
                                marginLeft: sizes.padding,
                                paddingLeft: sizes.padding,
                            }}
                            onChangeText={(text) => setSelectedDate({...selectedDate, startHour: text})}
                            value={selectedDate?.startHour}
                            placeholder="start hour"
                            keyboardType="numeric"
                        />
                    </View>


                {dayjs(`${selectedDate?.year}-${selectedDate?.month}-${selectedDate?.day}`).isBefore(dayjs()) && (
                    <Text p danger>
                        Please select a valid date
                    </Text>
                )}
                {parseInt(selectedDate?.length) > 24 && (
                    <Text p danger>
                        Please select a valid length of event
                        </Text>
                    )}
                {parseInt(selectedDate?.day) > 31 || parseInt(selectedDate?.month) > 12 && (
                    <Text p danger>
                        Please select a valid date
                        </Text>
                )}
                {parseInt(selectedDate?.length) + parseInt(selectedDate?.startHour) > 24 && (
                    <Text p danger>
                        Please select a valid length of event
                        </Text>
                )}
                <Text p>
                    Write a message to the volunteers
                </Text>

              <TextInput
                  multiline
                  numberOfLines={4}
                  style={{
                      height: 100,
                      width: '100%',
                      borderColor: colors.border,
                      borderWidth: 1,
                      borderRadius: sizes.radius,
                      padding: sizes.padding,
                      marginTop: sizes.padding,
                      marginBottom: sizes.padding,
                  }}
                  onChangeText={(text) => setText(text)}
                  value={text}
                  placeholder="Write a message to the volunteers"
              />
              <Button
                  primary
                  width={sizes.width / 3}
                  disabled={dayjs(`${selectedDate?.year}-${selectedDate?.month}-${selectedDate?.day}`).isBefore(dayjs()) || !dayjs(`${selectedDate?.year}-${selectedDate?.month}-${selectedDate?.day}`).isValid() || parseInt(selectedDate?.length) > 24 || parseInt(selectedDate?.length) + parseInt(selectedDate?.startHour) > 24 || parseInt(selectedDate?.day) > 31 || parseInt(selectedDate?.month) > 12 || parseInt(selectedDate?.length) < 1 || parseInt(selectedDate?.startHour) < 0 || loading}
                  onPress={() => {
                    handleApprove(event?._id);
                  }}
              >
                  <Text bold>
                      Approved
                  </Text>
              </Button>
              </Modal2>

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
            console.log(res?.data?.organization);
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
                {organization?.volunteers?.map((volunteer: any) => volunteer?._id).includes(user?._id) && (
                    <Button
                        marginRight={sizes?.s}
                        onPress={() => navigation.navigate('ChatRoom', { _id: organization?._id })}>
                        <ICONS.Ionicons
                            name="chatbubble-ellipses-outline"
                            size={sizes?.base * 2.5}
                            color={isDark ? colors.white : colors.black}
                        />
                    </Button>
                )}
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
    }, [navigation, isDark, colors, sizes, organization, user, route?.params?._id]);

  
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
            <DetailOrganizations item={organization} navigation={navigation} setOrganization={setOrganization} />
          </Block>
        </Block>
      </Block>
    );
  };


export default ViewOrganization;