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
      <Image 
        source={image} 
        height={100} 
        marginTop={-50} 
        marginBottom={sizes.sm}
        width={100}
        />
      <Text p bold marginTop={sizes.sm} marginBottom={sizes.xs}>
        {name}
      </Text>
      
      <Block row justify="center" marginTop={sizes.sm}>
        <Button
          onPress={() => onBook?.()}
          gradient={booked ? gradients.success : gradients.primary}>
          <Text bold white transform="uppercase" marginHorizontal={sizes.sm}>
            Proceeds to Checkout
          </Text>
        </Button>
      </Block>
    </Block>
  );
};

const Donations = ({ navigation }) => {
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
          Your Donations are 
        </Text>
        <Text h3 gradient={gradients.primary} end={[0.7, 0]}>
          appreciated and will 
        </Text>
        <Text h3 gradient={gradients.primary} end={[0.7, 0]}>
          be used to help the 
        </Text>
        <Text h3 gradient={gradients.primary} end={[0.7, 0]}>
          community.
        </Text>
        <Text h4 bold marginTop={sizes.sm}>
          Thank you for your support.
        </Text>
        <Text p marginVertical={sizes.sm}>
          We are a 501(c)(3) non-profit organization. Your donations will help us to continue to provide services to the community.
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
          {t('extras.contactUs') + ' to get more information'}
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

export default Donations;
