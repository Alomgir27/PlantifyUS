import React, {useEffect, useCallback, useState, useLayoutEffect} from 'react';
import {Platform, StyleSheet} from 'react-native';
import {
  GiftedChat,
  Composer,
  Bubble,
  InputToolbar,
} from 'react-native-gifted-chat';
import { Linking, Alert, ImageBackground } from 'react-native';
import {Block, Button, Image, Modal, Text} from '../components';
import {useData, useTheme, useTranslation} from '../hooks';
import { db, storage } from '../config/firebase';
import { IOrganization } from '../constants/types';
import axios from 'axios';
import { API_URL } from '../constants';
import * as ICONS from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import * as ICON from '@expo/vector-icons';
import { Video, AVPlaybackStatus, Audio } from 'expo-av';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { ToastAndroid } from 'react-native';
import SoundPlayer from './SoundPlayer';

let recording = new Audio.Recording();

const ChatRoom = ({route, navigation}: any) => {
  const {isDark} = useData();
  const {t, locale} = useTranslation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const {assets, colors, gradients, sizes} = useTheme();
  const [organization, setOrganization] = useState<any>();
  const user = useSelector((state: any) => state?.data?.currentUser);
  const [isTyping, setIsTyping] = useState(false);
  const [showAccessory, setShowAccessory] = useState(false);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [nowTime, setNowTime] = useState<any>(null);
  const [loadingFileDownloader, setLoaingFileDownloader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<any>({});

  


  const handleCheck = async (organization: IOrganization) => {
    const organizationRef = db.collection('organizations').doc(organization._id);
    const doc = await organizationRef.get();
    if (!doc.exists) {
      organizationRef.set({
        name: organization?.name,
        description: organization?.bio,
        whoIsTyping: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      organizationRef.collection('messages').add({
        _id: Math.random().toString(36).substring(7),
        text: `Welcome to ${organization?.name}!`,
        createdAt: new Date(),
        system: true,
        user: {
          _id: 'bot',
          name: 'Bot',
          avatar: 'https://i.imgur.com/7k12EPD.png',
        },
        files: [],
        fileType: '',
        location: {},
      });

      }
    }

    
    useEffect(() => {
      if(!organization?._id)return;
      if(message.length > 0) {
       (async () => {
         await db.collection('organizations')
        .doc(organization._id)
        .get()
        .then((doc) => {
          if(doc.exists) {
            db.collection('organizations')
            .doc(organization._id)
            .update({
              whoIsTyping: [...doc.data()?.whoIsTyping.filter((id: string) => id !== user._id), user._id]
            })
          }
        }
        )
        .catch((err) => {
          console.log(err);
        })
        })();
      }
      else {
        (async () => {
          db.collection('organizations')
          .doc(organization._id)
          .get()
          .then((doc) => {
            if(doc.exists) {
              db.collection('organizations')
              .doc(organization._id)
              .update({
                whoIsTyping: doc.data()?.whoIsTyping.filter((id: string) => id !== user._id)
              })
            }
          }
          )
          .catch((err) => {
            console.log(err);
          }
          )

        })();
      }
       
    }, [message]);

    useEffect(() => {
      if(organization?._id) {
       (async () => {
        await db.collection('organizations')
        .doc(organization?._id)
        .onSnapshot((doc) => {
          if(doc.exists) {
            setIsTyping(doc.data()?.whoIsTyping.filter((id: string) => id !== user._id).length > 0);
          }
        }
        )

        })();
    }
    }
    , []);


    const handleStartRecording = async () => {
      if(nowTime) return;
      if(isAudioRecording)return;
      setIsAudioRecording(true);
      setNowTime(new Date().getTime())
      try {
        console.log('Requesting permissions..');
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        console.log('Starting recording..');
        await recording.prepareToRecordAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        await recording.startAsync();
        console.log('Recording started');
      } catch (err) {
        console.error('Failed to start recording', err);
      }
    
      
    }

    const handleStopRecording = async () => {
      setIsAudioRecording(false);
      let delay = new Date().getTime() - nowTime;
      setNowTime(null);
      if(delay >= 1000) {
        console.log('Stopping recording..');
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log(uri);
        if(uri) {
           handleSubmit(message, uri, 'audio', {_id: user._id, name: user?.name, avatar: user?.image});
        }

        console.log('Recording stopped and stored at', uri);
      }
      recording.setOnRecordingStatusUpdate(null);
    }





  
    useEffect(() => {
      if(route?.params?._id) {
          axios.get(`${API_URL}/organizations/getOne/${route?.params?._id}`)
          .then((res) => {
              setOrganization(res?.data?.organization);
              handleCheck(res?.data?.organization);
              console.log(res?.data?.organization);
          })
          .catch((err) => {
              console.log(err);
          })
      }
  }, [route?.params?._id]);

    useEffect(() => {
      if(route?.params?._id) {
          db.collection('organizations')
          .doc(route?.params?._id)
          .collection('messages')
          .orderBy('createdAt', 'desc')
          .limit(20)
          .onSnapshot((snapshot) => {
              let messages: any = [];
              snapshot.forEach((doc) => {
                  messages.push({
                      ...doc.data(),
                      createdAt: doc.data().createdAt.toDate(),
                      _id: doc.id
                  })
              })
              setMessages(messages);
          }
          )
      }
  }, [route?.params?._id]);

  const hadleVideoMeeting = async () => {
    Alert.alert(
      'Video Meeting',
      'Currently, we only support Zoom meetings. Would you like to open Zoom?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: 'Open', onPress: () => Linking.openURL('https://zoom.us/') }
      ],
      { cancelable: false }
    );
  }

  


useLayoutEffect(() => {
  navigation.setOptions({
    headerTitle: () => (
      <Block align="flex-start" justify="center">
        <Text primary bold>
          {organization?.name}
        </Text>
        <Text gray caption>
          {organization?.volunteers?.length} members
        </Text>
      </Block>
    ),
    headerTitleAlign: 'left',
    showHeaderTitle: true,
    disableHeaderShadow: true,
    headerStyle: {
      backgroundColor: isDark ? colors.card : colors.white,
      borderBottomWidth: 0,
      elevation: 0,
    },

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
      <Block row align="center">
        <Button
          onPress={() => hadleVideoMeeting()}>
          <Text semibold marginHorizontal={sizes?.s}>
            {/* zoom meeting */}
            <ICONS.Ionicons name="videocam" size={sizes?.base * 2.5} />
          </Text>
        </Button>
      <Button
        onPress={() => navigation.navigate('Organization', { _id: organization?._id })}>
        <Image
          source={{uri: user?.image}}
          radius={sizes?.s}
          width={sizes?.s * 3.5}
          height={sizes?.s * 3.5}
        />
      </Button>
    </Block>
    ),
  });
}, [navigation, isDark, colors, sizes, organization]);


  
const handleSubmit = async (message: any, file: any, type: any,  user: any) => {
  const organizationRef = db.collection('organizations').doc(organization._id);
  const options = {
    _id: Math.random().toString(36).substring(7),
    text: message,
    createdAt: new Date(),
    system: false,
    user: user,
    fileType: type === 'image' ? 'image' : type === 'video' ? 'video' : type === 'file' ? 'file' : type === 'location' ? 'location' : '',
    location: type === 'location' ? file : {},
    edited: false,
    image: type === 'image' ? file : '',
    video: type === 'video' ? file : '',
    audio: type === 'audio' ? file : '',
    file: type === 'file' ? file : '',
    sent: false,
    received: false,
    pending: true,
    // quickReplies: {
    //   type: 'radio', // or 'checkbox',
    //   keepIt: true,
    //   values: [
    //     {
    //       title: '😋 Yes',
    //       value: 'yes',
    //     },
    //     {
    //       title: '📷 Yes, let me show you with a picture!',
    //       value: 'yes_picture',
    //     },
    //     {
    //       title: '😞 Nope. What?',
    //       value: 'no',
    //     },
    //   ],
    // },

  }
  setMessage('');
  handleSend([options]);
  if(type === 'image') {
    const response = await fetch(file);
    const blob = await response.blob();
    const uploadTask = storage.ref(`images/${blob._data.name}`).put(blob);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
          console.log(error);
      },
      () => {
          storage
              .ref("images")
              .child(blob._data.name)
              .getDownloadURL()
              .then((url) => {
                  options.image = url;
                  options.fileType = 'image';
                  options.sent = true;
                  options.received = true;
                  options.pending = false;
                  organizationRef.collection('messages').add(options)
                  .then(() => {
                    console.log('Message sent!');
                    return;
                  }
                  )
                  .catch((err) => {
                    console.log(err);
                  })
              });
      }
  );
  }
  if(type === 'video') {
    const response = await fetch(file);
    const blob = await response.blob();
    const uploadTask = storage.ref(`videos/${blob._data.name}`).put(blob);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
          console.log(error);
      },
      () => {
          storage
              .ref("videos")
              .child(blob._data.name)
              .getDownloadURL()
              .then((url) => {
                  options.video = url;
                  options.fileType = 'video';
                  options.sent = true;
                  options.received = true;
                  options.pending = false;
                  organizationRef.collection('messages').add(options)
                  .then(() => {
                    console.log('Message sent!');
                    
                    return;
                  }
                  )
                  .catch((err) => {
                    console.log(err);
                  })
              });
      }
  );
  }
  if(type === 'file') {
    const response = await fetch(file);
    const blob = await response.blob();
    const uploadTask = storage.ref(`files/${blob._data.name}`).put(blob);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
          console.log(error);
      },
      () => {
          storage
              .ref("files")
              .child(blob._data.name)
              .getDownloadURL()
              .then((url) => {
                  options.fileType = 'file';
                  options.file = url;
                  options.sent = true;
                  options.received = true;
                  options.pending = false;
                  organizationRef.collection('messages').add(options)
                  .then(() => {
                    console.log('Message sent!');
                    return;
                  }
                  )
                  .catch((err) => {
                    console.log(err);
                  })
              });
      }
  );
  }

  if(type === 'audio') {
    const response = await fetch(file);
    const blob = await response.blob();
    const uploadTask = storage.ref(`files/${blob._data.name}`).put(blob);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
          console.log(error);
      },
      () => {
          storage
              .ref("files")
              .child(blob._data.name)
              .getDownloadURL()
              .then((url) => {
                  options.fileType = 'audio';
                  options.audio = url;
                  options.sent = true;
                  options.received = true;
                  options.pending = false;
                  organizationRef.collection('messages').add(options)
                  .then(() => {
                    console.log('Message sent!');
                    return;
                  }
                  )
                  .catch((err) => {
                    console.log(err);
                  })
              });
      }
  );
  }

  
 
  if(type === 'text' || type === 'location') {
    options.sent = true;
    options.received = true;
    options.pending = false;
    organizationRef.collection('messages').add(options)
    .then(() => {
      console.log('Message sent!');
    }
    )
    .catch((err) => {
      console.log(err);
    }
    )
  }
  

 
  

};
  
  const handleSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );
  }
  , []);



  const loadEarlierMessages = async () => {
    if (isLoadingEarlier) {
      return;
    }
    setIsLoadingEarlier(true);

    // Fetch older messages from your data source
    const olderMessages = await db.collection('organizations')
    .doc(organization._id)
    .collection('messages')
    .orderBy('createdAt', 'desc')
    .startAfter(messages[messages.length - 1].createdAt)
    .limit(20)
    .get()
    .then((snapshot) => {
        let messages: any = [];
        snapshot.forEach((doc) => {
            messages.push({
                ...doc.data(),
                createdAt: doc.data().createdAt.toDate(),
                _id: doc.id
            })
        }
        )
        return messages;
    }
    )

    // Concatenate older messages with existing messages
    setMessages((previousMessages) =>
      GiftedChat.prepend(previousMessages, olderMessages)
    );

    setIsLoadingEarlier(false);
  };


  

  return (
   <ImageBackground
      source={require('../../assets/images/Background.jpg')}
      style={{flex: 1}}>
      <Block paddingHorizontal={sizes.s}>
        <GiftedChat
          alignTop
          text={message}
          showUserAvatar
          showAvatarForEveryMessage
          scrollToBottom
          infiniteScroll
          locale={locale}
          renderAvatarOnTop
          messages={messages}
          bottomOffset={-sizes.m}
          placeholder={t('common.message')}
          user={{_id: user._id, name: user?.name, avatar: user?.image}}
          onInputTextChanged={(text) => setMessage(text)}
          renderUsernameOnMessage
          isTyping={isTyping}
          renderAvatar={(props) => (
            <TouchableOpacity onPress={() => navigation.navigate('Profile', {userId: props?.currentMessage?.user?._id})}>
              <Image
                source={{uri: props?.currentMessage?.user?.avatar}}
                radius={sizes.s}
                width={sizes.s * 3.5}
                height={sizes.s * 3.5}
              />
            </TouchableOpacity>
          )}
          timeTextStyle={{left: {color: colors.text}, right: {color: colors.text}}}
          renderActions={() => (
            <Button onPress={() => setShowAccessory(!showAccessory)}>
              <ICON.Ionicons name="add" size={sizes.base * 2.5} color={colors.text} />
            </Button>
          )}
          renderComposer={(props) => (
            <Composer
              {...props}
              textInputStyle={{
                marginLeft: 0,
                color: colors.text,
                paddingTop: Platform.OS === 'android' ? 0 : sizes.s,
              }}
            />
          )}
          renderInputToolbar={(props) => (
            <InputToolbar
              {...props}
              optionTintColor={String(colors.input)}
              containerStyle={{
                paddingTop: 0,
                marginTop: 0,
                marginBottom: sizes.sm,
                backgroundColor: 'transparent',
              }}
              primaryStyle={{
                alignItems: 'center',
                borderRadius: sizes.inputRadius,
                borderWidth: StyleSheet.hairlineWidth * 2,
                borderColor: colors.input,
              }}
              // @ts-ignore
              placeholderTextColor={colors.background}
              accessoryStyle={{
                height: showAccessory ? 50 : 0,
                width: '100%',
                opacity: showAccessory ? 1 : 0,
              }}
              renderSend={({text, user}: any) => {
                if (text?.length === 0) {
                  return null;
                }

                return (
                  <Button
                    gradient={gradients.primary}
                    onPress={() => handleSubmit(text, null,  'text', user)}>
                    <Text
                      semibold
                      marginHorizontal={sizes.m}
                      transform="uppercase">
                      {t('common.send')}
                    </Text>
                  </Button>
                );
              }}
            />
          )}
          renderBubble={(props) => (
            <Bubble
              {...props}
              wrapperStyle={{
                left: {backgroundColor: 'transparent'},
                right: {backgroundColor: 'transparent'},
              }}
            />
          )}
          renderTime={(props) => (
            <Text size={10} black p>
              {moment(props?.currentMessage?.createdAt).format('LT')}
            </Text>
          )}
          renderMessageText={(props) => {
            const isMine = props?.currentMessage?.user?._id === user?._id;
            return (
              <Block card flex={0} black={isMine}>
                <Text white={isMine}>{props?.currentMessage?.text}</Text>
              </Block>
            );
          }}
          renderSystemMessage={(props) => (
            <Block flex={0} align="center" justify="center">
              <Text black size={12}>
                {props?.currentMessage?.text}
              </Text>
            </Block>
          )}
          renderAccessory={() => {
            if (!showAccessory) {
              return null;
            }
            return (
              <Block
                row
                flex={0}
                align="center"
                justify="space-between"
                paddingHorizontal={sizes.sm}
                paddingVertical={sizes.s}
                radius={sizes.sm}
                height={50}
                marginVertical={sizes.sm / 5}
                >

                <Block row align="center" justify="space-between">
                  <Button
                    onPress={async () => {
                      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                      if (status !== 'granted') {
                        Alert.alert('Sorry, we need camera roll permissions to make this work!');
                      }
                      else {
                        let result = await ImagePicker.launchImageLibraryAsync({
                          mediaTypes: ImagePicker.MediaTypeOptions.Images,
                          allowsEditing: true,
                          quality: 0.5,
                        });
                    
                        console.log(result);
                    
                        if (!result.canceled) {
                          handleSubmit(message, result.uri, result.type, {_id: user._id, name: user?.name, avatar: user?.image});
                        }
                      }
                    }}>
                    <ICON.Ionicons name="image" size={sizes.base * 2.5} color={colors.text} />
                  </Button>
                  <Button
                    onPress={async () => {
                      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                      if (status !== 'granted') {
                        Alert.alert('Sorry, we need camera roll permissions to make this work!');
                      }
                      else {
                        let result = await ImagePicker.launchImageLibraryAsync({
                          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                          allowsEditing: true,
                          quality: 0.3,
                        });
                    
                        console.log(result);
                    
                        if (!result.canceled) {
                          handleSubmit(message, result.uri, result.type, {_id: user._id, name: user?.name, avatar: user?.image});
                        }
                      }
                    }}>
                    <ICON.Ionicons name="videocam" size={sizes.base * 2.5} color={colors.text} />
                  </Button>
                  <Button
                    onPress={async () => {
                      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                      if (status !== 'granted') {
                        Alert.alert('Sorry, we need camera roll permissions to make this work!');
                      }
                      else {
                        let result = await ImagePicker.launchImageLibraryAsync({
                          mediaTypes: ImagePicker.MediaTypeOptions.All,
                          quality: 1,
                        })

                        console.log(result);

                        if (!result.canceled) {
                          handleSubmit(message, result.uri, 'file', {_id: user._id, name: user?.name, avatar: user?.image});
                        } 
                      }
                    }}>
                    <ICON.Ionicons name="document" size={sizes.base * 2.5} color={colors.text} />
                  </Button>
                  <Button
                    onPressIn={handleStartRecording}
                    onPressOut={handleStopRecording}>
                    <ICON.Ionicons 
                       name="mic" 
                       size={sizes.base * 2.5} 
                       color={isAudioRecording ? colors.primary : colors.text}
                       style={{
                          bottom: isAudioRecording ? sizes.base * 4 : 0, 
                          transform: isAudioRecording ? [{scale: 5.5}] : [{scale: 1}],
                          opacity: isAudioRecording ? 0.9 : 1,
                        }}
                        />
                  </Button>

                  <Button
                    onPress={async () => {
                      Alert.alert(
                        'Are you sure you want to send your location?',
                        'Your location will be sent to all members of this organization.',
                        [
                          {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel'
                          },
                          { text: 'Send', onPress: async () => {
                            const { status } = await Location.requestForegroundPermissionsAsync();
                            if (status !== 'granted') {
                              Alert.alert('Sorry, we need location permissions to make this work!');
                            }
                            else {
                              let result = await Location.getCurrentPositionAsync({});
                              console.log(result);
                              if(result) {
                                handleSubmit(message, result, 'location', {_id: user._id, name: user?.name, avatar: user?.image});
                              }
                            }
                          } }
                        ],
                        { cancelable: false }
                      );
                    }}>
                    <ICON.Ionicons name="location" size={sizes.base * 2.5} color={colors.text} />
                  </Button>
                </Block>
              </Block>
            );
          }}
          renderCustomView={(props) => {
            if (props?.currentMessage?.fileType === 'location') {
              return (
                <Block
                  // card
                  flex={0}
                  align="center"
                  justify="center"
                  radius={sizes.sm * 2}
                  marginVertical={sizes.sm / 5}
                  height={150}
                  width={250}
                  >
                  <MapView
                    style={{width: '100%', height: '100%'}}
                    initialRegion={{
                      latitude: props?.currentMessage?.location?.coords?.latitude,
                      longitude: props?.currentMessage?.location?.coords?.longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}>
                    <Marker
                      coordinate={{
                        latitude: props?.currentMessage?.location?.coords?.latitude,
                        longitude: props?.currentMessage?.location?.coords?.longitude,
                      }}
                    />
                  </MapView>
                </Block>
              );
            }
            if (props?.currentMessage?.fileType === 'file') {
              return (
                <Block
                  card
                  flex={0}
                  align="center"
                  justify="center"
                  radius={sizes.sm}
                  marginVertical={sizes.sm / 5}
                  height={60}
                  width={250}
                  >
                  <Button
                    disabled={loadingFileDownloader}
                    onPress={async () => {
                      setLoaingFileDownloader(true);
                      try {
                         const uri = props?.currentMessage?.file;
                         const fileType = uri.substring(uri.lastIndexOf('.') + 1);
                         const url = await FileSystem.downloadAsync(uri, `${FileSystem.documentDirectory}file.${fileType}`);
                         if(url) {
                          const { status } = await MediaLibrary.requestPermissionsAsync();
                          if (status !== 'granted') {
                            Alert.alert('Sorry, we need camera roll permissions to make this work!');
                          }
                          else {
                            const asset = await MediaLibrary.createAssetAsync(url.uri);
                            await MediaLibrary.createAlbumAsync('PlantifyUS', asset, false);
                            if(Platform.OS === 'android') {
                              ToastAndroid.show('File downloaded!', ToastAndroid.SHORT);
                            }
                            else {
                              Alert.alert('File downloaded!');
                            }
                          }
                         }
                      } catch (err) {
                        console.error(err);
                      }
                      finally {
                        setLoaingFileDownloader(false);
                      }
                    }}>
                      <ICON.Ionicons name="document" size={sizes.base * 2.5} color={colors.text} />
                      <Text size={12} black p>
                        download file
                      </Text>
                  </Button>

                </Block>
              );
            }
            return null;
          }
        }
        
        scrollToBottomComponent={() => (
          <ICON.Ionicons name="chevron-down" size={sizes.base * 2.5} color={colors.text} />
        )}
        isLoadingEarlier={isLoadingEarlier}
        onLoadEarlier={loadEarlierMessages}
        renderLoadEarlier={() => (
          <Block flex={0} align="center" justify="center" paddingVertical={sizes.sm}>
            <Button onPress={loadEarlierMessages}>
              <ICON.Ionicons name="chevron-up" size={sizes.base * 2.5} color={colors.text} />
            </Button>
          </Block>
        )}
        loadEarlier={messages.length > 20}
        renderMessageVideo={(props) => {
          return (
            <Block
              // card
              flex={0}
              align="center"
              justify="center"
              radius={sizes.sm}
              marginVertical={sizes.sm / 5}
              height={180}
              width={250}
              >
              <Video
                source={{uri: props?.currentMessage?.video}}
                style={{width: '100%', height: '100%', borderRadius: sizes.sm}}
                resizeMode="cover"
                useNativeControls
                
              />
            </Block>
          );
        }
        }
        renderMessageAudio={(props) => {
          return (
            <Block
              flex={0}
              align="center"
              justify="center"
              radius={sizes.sm}
              marginVertical={sizes.sm / 5}
              height={60}
              width={250}
              >
              <SoundPlayer uri={props?.currentMessage?.audio} />
            </Block>
          );
        }
        }
        onPress={(props) => {
          setCurrentMessage(props?.currentMessage);
          setShowModal(true);
        }
        }
        />
      </Block>
      {/* <Modal isVisible={showModal} onBackdropPress={() => setShowModal(false)}>
        <Block flex={0} align="center" justify="center" paddingVertical={sizes.sm}>
          <Button onPress={() => {
            setShowModal(false);
            navigation.navigate('Profile', {userId: currentMessage?.user?._id});
          }
          }>
            <Text size={12} black p>
              view profile
            </Text>
          </Button>
        </Block>
      </Modal> */}



    </ImageBackground>
  );
};

export default ChatRoom;
