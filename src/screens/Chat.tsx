import dayjs from 'dayjs';
import {Platform, StyleSheet} from 'react-native';
import React, {useCallback, useState} from 'react';
import {
  GiftedChat,
  Composer,
  Bubble,
  InputToolbar,
} from 'react-native-gifted-chat';

import {Block, Button, Image, Text} from '../components/';
import {useData, useTheme, useTranslation} from '../hooks/';
import {MESSSAGES} from '../constants/mocks';

const Chat = () => {
  const {user} = useData();
  const {t, locale} = useTranslation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(MESSSAGES);
  const {assets, colors, gradients, sizes} = useTheme();

  const handleSend = useCallback(
    (messages = []) => {
      setMessages((state) => GiftedChat.append(state, messages));
      setMessage('');
    },
    [setMessages, setMessage],
  );

  return (
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
        onSend={(messages) => handleSend(messages)}
        user={{_id: user.id, name: user?.name, avatar: user?.avatar}}
        onInputTextChanged={(text) => setMessage(text)}
        renderActions={() => (
          <Button>
            <Image source={assets.image} radius={0} color={colors.icon} />
          </Button>
        )}
        renderComposer={(props) => (
          <Composer
            {...props}
            textInputStyle={{
              marginLeft: 0,
              color: colors.input,
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
              borderColor: colors.gray,
              borderRadius: sizes.inputRadius,
              borderWidth: StyleSheet.hairlineWidth,
              backgroundColor: 'transparent',
            }}
            renderSend={({text}) => {
              if (text?.length === 0) {
                return null;
              }

              return (
                <Button
                  gradient={gradients.primary}
                  onPress={() =>
                    handleSend([
                      {
                        _id: dayjs().unix(),
                        text,
                        createdAt: dayjs().subtract(1, 'm').toDate(),
                        user: {
                          _id: user.id,
                          name: user.name,
                          avatar: user.avatar,
                        },
                      },
                    ])
                  }>
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
          <Text size={12}>
            {dayjs(props?.currentMessage?.createdAt).format('HH:mm A')}
          </Text>
        )}
        renderMessageText={(props) => {
          const isMine = props?.currentMessage?.user?._id === user?.id;
          return (
            <Block card flex={0} black={isMine}>
              <Text white={isMine}>{props?.currentMessage?.text}</Text>
            </Block>
          );
        }}
      />
    </Block>
  );
};

export default Chat;
