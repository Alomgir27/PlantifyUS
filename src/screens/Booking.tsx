import React, {useCallback, useEffect, useState} from 'react';
import {FlatList} from 'react-native';

import dayjs from 'dayjs';
import {RouteProp} from '@react-navigation/native';
// import {useNavigation, useRoute} from '@react-navigation/core';

import {useData, useTheme, useTranslation} from '../hooks/';
import {IArticleOptions, ITheme} from '../constants/types';
import {Block, Button, Calendar, Image, Text, Modal} from '../components/';

interface IBookingRoute {
  route: RouteProp<{params: {optionId?: number}}, 'params'>;
}

interface ITouchableInput {
  icon: keyof ITheme['assets'];
  label?: string;
  value?: number | string;
  onPress?: () => void;
}

const ROOM_TYPES: {
  [key: string]: string;
} = {'1': 'Standard', '2': 'Luxury', '3': 'Exclusive'};

const TouchableInput = ({label, value, icon, onPress}: ITouchableInput) => {
  const {assets, colors, sizes} = useTheme();

  return (
    <Button
      align="flex-start"
      marginBottom={sizes.sm}
      onPress={() => onPress?.()}>
      <Text bold marginBottom={sizes.s}>
        {label}
      </Text>
      <Block
        row
        gray
        outlined
        width="100%"
        align="center"
        radius={sizes.inputRadius}
        height={sizes.inputHeight}>
        <Image
          radius={0}
          color={colors.icon}
          source={assets?.[icon]}
          marginHorizontal={sizes.inputPadding}
        />
        <Text p gray>
          {value}
        </Text>
      </Block>
    </Button>
  );
};

const Booking = () => {
  const {article} = useData();
  const {t} = useTranslation();
  // const navigation = useNavigation();
  // const {params} = useRoute<IBookingRoute['route']>();
  const [option, setOption] = useState<IArticleOptions>();
  const [persons, setPersons] = useState(1);
  const [type, setType] = useState(ROOM_TYPES['2']);
  const {assets, colors, gradients, sizes} = useTheme();
  const [calendar, setCalendar] = useState({start: 0, end: 0});
  const [checkin, setCheckin] = useState(t('common.selectDate'));
  const [modal, setModal] = useState<
    'calendar' | 'persons' | 'type' | undefined
  >();

  // handleType
  const handleType = useCallback(
    (value: string) => {
      setType(value);
      // hide modal / reset modal state
      setModal(undefined);
    },
    [setType, setModal],
  );

  // handlePersons
  const handlePersons = useCallback(
    (persons) => {
      setPersons(persons);
      // hide modal / reset modal state
      setModal(undefined);
    },
    [setPersons, setModal],
  );

  // handleCalendar
  const handleCalendar = useCallback(
    (calendar) => {
      const startDate = dayjs(calendar.start).format('YYYY-MM-DD');
      const endDate = dayjs(calendar.end).format('YYYY-MM-DD');

      setCheckin(`${startDate} to ${endDate}`);
      setCalendar(calendar);
    },
    [setCheckin, setCalendar],
  );

  // find the article option based on option ID
  // set the option to local state
  useEffect(() => {
    const articleOption = article?.options?.find(
      (item) => item?.id === params?.optionId,
    );

    setOption(articleOption);
  }, [ article?.options]);

  return (
    <Block
      scroll
      padding={sizes.padding}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: sizes.xxl}}>
      <Image source={{uri: article?.image}} height={260} />

      <Block
        row
        flex={0}
        align="center"
        justify="space-between"
        marginVertical={sizes.sm}>
        <Block>
          <Text h4>{option?.title}</Text>
        </Block>
        <Block row flex={0} align="flex-end" justify="flex-end">
          <Text h4 primary>
            ${option?.price}
          </Text>
          <Text primary bold>
            /{t('common.night')}
          </Text>
        </Block>
      </Block>

      <Text p marginBottom={sizes.sm}>
        {option?.description}
      </Text>

      <Block row marginBottom={sizes.m}>
        <Block row>
          <Image
            radius={sizes.s}
            width={sizes.xl}
            height={sizes.xl}
            source={{uri: option?.user?.avatar}}
            style={{backgroundColor: colors.white}}
          />
          <Block marginLeft={sizes.s}>
            <Text p semibold>
              {option?.user?.name || '-'}
            </Text>
            <Text p secondary>
              {option?.user?.department || '-'}
            </Text>
          </Block>
        </Block>
        <Button
          round
          height={40}
          gradient={gradients.dark}
          onPress={() =>
            navigation.navigate('Chat', {userId: option?.user?.id})
          }>
          <Image source={assets.chat} radius={0} />
        </Button>
      </Block>

      <Block card paddingVertical={sizes.m} paddingHorizontal={sizes.sm}>
        {/* calendar selection */}
        <TouchableInput
          icon="calendar"
          value={checkin}
          label={t('common.checkInOut')}
          onPress={() => setModal('calendar')}
        />
        {/* adults selection */}
        <TouchableInput
          icon="users"
          value={`0${persons}`}
          label={t('common.adults')}
          onPress={() => setModal('persons')}
        />
        {/* room type selection */}
        <TouchableInput
          icon="hotel"
          value={type}
          label={t('common.roomType')}
          onPress={() => setModal('type')}
        />

        <Button gradient={gradients.primary}>
          <Text white semibold transform="uppercase">
            {t('common.booknow')}
          </Text>
        </Button>
      </Block>
      <Modal
        visible={Boolean(modal)}
        onRequestClose={() => setModal(undefined)}>
        {modal !== 'calendar' && (
          <FlatList
            keyExtractor={(index) => `${index}`}
            data={modal === 'persons' ? [1, 2, 3, 4, 5] : [1, 2, 3]}
            renderItem={({item}) => (
              <Button
                marginBottom={sizes.sm}
                onPress={() =>
                  modal === 'persons'
                    ? handlePersons(item)
                    : handleType(ROOM_TYPES[item])
                }>
                <Text p white semibold transform="uppercase">
                  {modal === 'persons' ? item : ROOM_TYPES[item]}
                </Text>
              </Button>
            )}
          />
        )}
        {modal === 'calendar' && (
          <Calendar
            calendar={calendar}
            onClose={(calendar) => handleCalendar(calendar)}
          />
        )}
      </Modal>
    </Block>
  );
};

export default Booking;
