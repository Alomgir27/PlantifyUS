import React, {useEffect, useCallback, useState, useLayoutEffect} from 'react';
import {Platform, StyleSheet} from 'react-native';
import {
  GiftedChat,
  Composer,
  Bubble,
  InputToolbar,
} from 'react-native-gifted-chat';
import { Linking, Alert, ImageBackground } from 'react-native';
import {Block, Button, Image, Text} from '../components';
import {useData, useTheme, useTranslation} from '../hooks';
import { db, storage } from '../config/firebase';
import { IOrganization } from '../constants/types';
import axios from 'axios';
import { API_URL } from '../constants';
import * as ICONS from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
// import * as DocumentPicker from 'expo-document-picker';
// import * as FileSystem from 'expo-file-system';
// import * as MediaLibrary from 'expo-media-library';
// import * as Permissions from 'expo-permissions';
// import * as Location from 'expo-location';
// import * as ImageManipulator from 'expo-image-manipulator';
// import * as VideoThumbnails from 'expo-video-thumbnails';
import * as ICON from '@expo/vector-icons';
import { set } from 'mongoose';



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
    files: file ? file : [],
    fileType: type === 'image' ? 'image' : type === 'video' ? 'video' : type === 'file' ? 'file' : '',
    location: {},
    edited: false,
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
                  options.files = [url];
                  options.fileType = 'image';
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
                  options.files = [url];
                  options.fileType = 'video';
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
                  options.files = [url];
                  options.fileType = 'file';
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
 
  if(type === 'text') {
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
            <Image
              source={{uri: props?.currentMessage?.user?.avatar}}
              radius={sizes.s}
              width={sizes.s * 3.5}
              height={sizes.s * 3.5}
            />
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
                        alert('Sorry, we need camera roll permissions to make this work!');
                      }
                      else {
                        let result = await ImagePicker.launchImageLibraryAsync({
                          mediaTypes: ImagePicker.MediaTypeOptions.All,
                          // allowsEditing: true,
                          // aspect: [4, 3],
                          quality: 1,
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
                      // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                      // if (status !== 'granted') {
                      //   alert('Sorry, we need camera roll permissions to make this work!');
                      // }
                      // else {
                      //   let result = await ImagePicker.launchImageLibraryAsync({
                      //     mediaTypes: ImagePicker.MediaTypeOptions.All,
                      //     allowsEditing: true,
                      //     aspect: [4, 3],
                      //     quality: 1,
                      //   });
                    
                      //   console.log(result);
                    
                      //   if (!result.cancelled) {
                      //     setVideo(result.uri);
                      //     setFileType(result.type);
                      //   }
                      // }
                    }}>
                    <ICON.Ionicons name="videocam" size={sizes.base * 2.5} color={colors.text} />
                  </Button>
                  <Button
                    onPress={async () => {
                      // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                      // if (status !== 'granted') {
                      //   alert('Sorry, we need camera roll permissions to make this work!');
                      // }
                      // else {
                      //   let result = await ImagePicker.launchImageLibraryAsync({
                      //     media
                      //     Types: ImagePicker.MediaTypeOptions.All,
                      //     allowsEditing: true,
                      //     aspect: [4, 3],
                      //     quality: 1,
                      //   })
                      // }
                    }}>
                    <ICON.Ionicons name="document" size={sizes.base * 2.5} color={colors.text} />
                  </Button>
                  <Button
                    onPress={async () => {
                      // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                      // if (status !== 'granted') {
                      //   alert('Sorry, we need camera roll permissions to make this work!');
                      // }
                      // else {
                      //   let result = await ImagePicker.launchImageLibraryAsync({
                      //     mediaTypes: ImagePicker.MediaTypeOptions.All,
                      //     allowsEditing: true,
                      //     aspect: [4, 3],
                      //     quality: 1,
                      //   })
                      // }
                    }}>
                    <ICON.Ionicons name="location" size={sizes.base * 2.5} color={colors.text} />
                  </Button>
                </Block>
              </Block>
            );
          }}
          renderCustomView={(props) => {
            if (props?.currentMessage?.location?.latitude && props?.currentMessage?.location?.longitude) {
              return (
                <Block
                  card
                  flex={0}
                  align="center"
                  justify="center"
                  radius={sizes.sm}
                  marginVertical={sizes.sm / 5}
                  height={200}>
                  <Image
                    source={{
                      uri: `https://maps.googleapis.com/maps/api/staticmap?center=${props?.currentMessage?.location?.latitude},${props?.currentMessage?.location?.longitude}&zoom=13&size=300x300&maptype=roadmap&markers=color:red%7Clabel:C%7C${props?.currentMessage?.location?.latitude},${props?.currentMessage?.location?.longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
                    }}
                    width={300}
                    height={300}
                  />
                </Block>
              );
            }
            if (props?.currentMessage?.fileType === 'image') {
              return (
                <Block
                  flex={0}
                  align="center"
                  justify="center"
                  radius={sizes.sm}
                  marginVertical={sizes.sm / 5}
                  height={200}>
                  <Image
                    source={{uri: props?.currentMessage?.files[0]}}
                    width={200}
                    height={200}
                  />
                </Block>
              );
            }
            // if (props?.currentMessage?.fileType === 'video') {
            //   return (
            //     <Block
            //       card
            //       flex={0}
            //       align="center"
            //       justify="center"
            //       radius={sizes.sm}
            //       marginVertical={sizes.sm / 5}
            //       height={200}>
            //       <Video
            //         source={{uri: props?.currentMessage?.files[0]}}
            //         width={300}
            //         height={300}
            //         useNativeControls
            //         resizeMode="contain"
            //       />
            //     </Block>
            //   );
            // }
            // if (props?.currentMessage?.fileType === 'file') {
            //   return (
            //     <Block
            //       card
            //       flex={0}
            //       align="center"
            //       justify="center"
            //       radius={sizes.sm}
            //       marginVertical={sizes.sm / 5}
            //       height={200}>
            //       <Text>{props?.currentMessage?.files[0]}</Text>
            //     </Block>
            //   );
            // }
            return null;
          }
        }
     
          
          
        />
      </Block>
    </ImageBackground>
  );
};

export default ChatRoom;
