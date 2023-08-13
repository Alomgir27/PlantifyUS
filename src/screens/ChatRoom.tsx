import React, {useEffect, useCallback, useState, useLayoutEffect} from 'react';
import dayjs from 'dayjs';
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
import {MESSSAGES} from '../constants/mocks';
import { db, storage } from '../config/firebase';
import { IOrganization } from '../constants/types';
import axios from 'axios';
import { API_URL } from '../constants';
import * as ICONS from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import moment from 'moment';



const ChatRoom = ({route, navigation}: any) => {
  const {isDark} = useData();
  const {t, locale} = useTranslation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const {assets, colors, gradients, sizes} = useTheme();
  const [organization, setOrganization] = useState<any>();
  const user = useSelector((state: any) => state?.data?.currentUser);


  const handleCheck = async (organization: IOrganization) => {
    const organizationRef = db.collection('organizations').doc(organization._id);
    const doc = await organizationRef.get();
    if (!doc.exists) {
      organizationRef.set({
        name: organization?.name,
        description: organization?.bio,
        members: organization?.volunteers?.map((volunteer: any) => volunteer._id),
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
        fileType: 'image',
        location: {},
      });

      }
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


  
const handleSubmit = async (message: any, files: any, user: any) => {
  const organizationRef = db.collection('organizations').doc(organization._id);
  const options = {
    _id: Math.random().toString(36).substring(7),
    text: message,
    createdAt: new Date(),
    system: false,
    user: user,
    files: files || [],
    fileType: 'image',
    location: {}
  }
  setMessage('');
  handleSend([options]);
  await organizationRef.collection('messages').add(options)
  .then(() => {
    console.log('Message sent!');
  }
  )
  

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
          locale={locale}
          renderAvatarOnTop
          messages={messages}
          bottomOffset={-sizes.m}
          placeholder={t('common.message')}
          user={{_id: user._id, name: user?.name, avatar: user?.image}}
          onInputTextChanged={(text) => setMessage(text)}
          renderActions={() => (
            <Button>
              <Image source={assets.image} radius={0} color={colors.primary} />
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
                borderColor: colors.input,
                borderRadius: sizes.inputRadius,
                borderWidth: StyleSheet.hairlineWidth * 2,
                backgroundColor: 'transparent',
              }}
              placeholderTextColor={colors.background}
              renderSend={({text, user, files}) => {
                if (text?.length === 0 && !files?.length) {
                  return null;
                }

                return (
                  <Button
                    gradient={gradients.primary}
                    onPress={() => handleSubmit(text, files, user)}>
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
            <Text size={12} primary p>
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
        />
      </Block>
    </ImageBackground>
  );
};

export default ChatRoom;
