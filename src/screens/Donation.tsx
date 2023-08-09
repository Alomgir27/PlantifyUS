import React, {useCallback, useState} from 'react';

import {Block, Button, Image, Modal, Text} from '../components/';
import {useTheme, useTranslation} from '../hooks/';
import {EXTRAS} from '../constants/mocks';
import {IExtra} from '../constants/types';
import {FlatList} from 'react-native';
import dayjs from 'dayjs';

const Extra = ({
  id,
  name,
  time,
  image,
  saved,
  booked,
  available,
  onBook,
  onSave,
  onTimeSelect,
}: IExtra) => {
  const {t} = useTranslation();
  const {assets, colors, gradients, sizes} = useTheme();

  return (
    <Block card align="center" padding={sizes.sm} marginTop={sizes.base * 8}>
      <Image source={image} height={100} marginTop={-50} />
      <Text p semibold marginTop={sizes.sm} marginBottom={sizes.xs}>
        {name}
      </Text>
      <Text
        p
        bold
        transform="uppercase"
        success={available}
        danger={!available}>
        {t(`extras.${available ? 'available' : 'unavailable'}`)}
      </Text>
      <Block row justify="space-evenly" marginTop={sizes.sm}>
        <Button
          flex={0.5}
          gradient={gradients.secondary}
          onPress={() => onTimeSelect?.(id)}>
          <Block
            row
            align="center"
            justify="space-between"
            paddingHorizontal={sizes.sm}>
            <Text bold white transform="uppercase" marginRight={sizes.sm}>
              {time}
            </Text>
            <Image
              source={assets.arrow}
              color={colors.white}
              transform={[{rotate: '90deg'}]}
            />
          </Block>
        </Button>
        <Button
          flex={1}
          onPress={() => onSave?.()}
          marginHorizontal={sizes.s}
          gradient={saved ? gradients.success : gradients.secondary}>
          <Text bold white transform="uppercase" marginHorizontal={sizes.s}>
            {t(saved ? 'extras.saved' : 'extras.save')}
          </Text>
        </Button>
        <Button
          flex={0.5}
          disabled={!available}
          onPress={() => onBook?.()}
          gradient={booked ? gradients.success : gradients.primary}>
          <Text bold white transform="uppercase" marginHorizontal={sizes.sm}>
            {t(booked ? 'extras.booked' : 'extras.book')}
          </Text>
        </Button>
      </Block>
    </Block>
  );
};

const Extras = () => {
  const {t} = useTranslation();
  const {gradients, sizes} = useTheme();
  const [extras, setExtras] = useState(EXTRAS);
  const [modal, setModal] = useState<IExtra['id']>();

  /* handle time selection */
  const handleTime = useCallback(
    (time) => {
      const newExtras = extras?.map((extra) =>
        extra?.id === modal ? {...extra, time} : extra,
      );
      setExtras(newExtras);
      setModal(undefined);
    },
    [extras, modal, setExtras, setModal],
  );

  /* handle save for later */
  const handleSave = useCallback(
    (id) => {
      const newExtras = extras?.map((extra) =>
        extra?.id === id ? {...extra, saved: true} : extra,
      );
      setExtras(newExtras);
    },
    [extras, setExtras],
  );

  /* handle book */
  const handleBook = useCallback(
    (id) => {
      const newExtras = extras?.map((extra) =>
        extra?.id === id ? {...extra, booked: true} : extra,
      );
      setExtras(newExtras);
    },
    [extras, setExtras],
  );

  return (
    <Block safe marginHorizontal={sizes.padding} paddingBottom={sizes.sm}>
      <Block
        scroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingVertical: sizes.md}}>
        <Text h3 gradient={gradients.primary} end={[0.7, 0]}>
          {t('extras.title1')}
        </Text>
        <Text h3 gradient={gradients.primary} end={[0.7, 0]}>
          {t('extras.title2')}
        </Text>
        <Text p marginVertical={sizes.sm}>
          {t('extras.description')}
        </Text>
        <Text p semibold>
          {t('extras.schedule')}
        </Text>

        {/* using map for items due to nested scrolls on same direction (vertical) */}
        {extras?.map((extra) => (
          <Extra
            {...extra}
            key={`extra-${extra?.id}`}
            onSave={() => handleSave(extra?.id)}
            onBook={() => handleBook(extra?.id)}
            onTimeSelect={() => setModal(extra?.id)}
          />
        ))}
      </Block>

      {/* contact us */}
      <Button gradient={gradients.primary} marginTop={sizes.s}>
        <Text bold white transform="uppercase" marginHorizontal={sizes.sm}>
          {t('extras.contactUs')}
        </Text>
      </Button>

      {/* change time modal */}
      <Modal
        visible={Boolean(modal)}
        onRequestClose={() => setModal(undefined)}>
        <FlatList
          keyExtractor={(index) => `${index}`}
          /* generate time list with +30min incrementals */
          data={[
            dayjs().add(30, 'm'),
            dayjs().add(60, 'm'),
            dayjs().add(90, 'm'),
            dayjs().add(120, 'm'),
            dayjs().add(150, 'm'),
          ]}
          renderItem={({item}) => (
            <Button
              marginBottom={sizes.sm}
              onPress={() => handleTime(dayjs(item).format('hh:mm'))}>
              <Text p white semibold transform="uppercase">
                {dayjs(item).format('hh:mm')}
              </Text>
            </Button>
          )}
        />
      </Modal>
    </Block>
  );
};

export default Extras;
