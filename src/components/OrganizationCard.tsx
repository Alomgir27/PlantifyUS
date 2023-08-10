import React from 'react';
import dayjs from 'dayjs';
import {TouchableWithoutFeedback} from 'react-native';

import Text from './Text';
import Block from './Block';
import Image from './Image';
import {useTheme, useTranslation} from '../hooks';
import Button from './Button';
import { useSelector } from 'react-redux';



const OrganizationsGallery = ({item, onPress}: any) => {
  const {assets, sizes,  gradients} = useTheme();
  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
  const IMAGE_VERTICAL_SIZE =
    (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
  const IMAGE_VERTICAL_MARGIN =
    (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;


  return (
    <Block marginTop={sizes.m} paddingHorizontal={sizes.padding}>
      <Text p semibold marginBottom={sizes.s}>
        {dayjs(item.createdAt).format('DD MMMM YYYY')}
      </Text>
      {/* carousel example */}
      <Block marginBottom={sizes.xxl}>
        <Image
          resizeMode="cover"
          source={{uri: item?.images[0]}}
          height={sizes.height / 4}
        />
        <Text p secondary marginTop={sizes.sm} primary>
          {item?.type} • {item?.moderators?.length} moderators • {item?.volunteers?.length} members
        </Text>
        <Text h4 gradient={gradients.primary}>
          {item.name}
        </Text>
        <Text p lineHeight={26}>
          {item.bio}
        </Text>
        <Block row marginTop={sizes.sm}>
          <Button
            primary
            onPress={onPress}
            marginRight={sizes.s}
            width={sizes.width / 3}

            >
            <Text bold>View</Text>
          </Button>
          <Button
           primary
           width={sizes.width / 3}
          >
            <Text bold>Join</Text>
          </Button>
        </Block>
        <Block row marginTop={sizes.sm}>
          <Text p semibold marginRight={sizes.s} secondary>
            Events done: {item?.events?.length}
          </Text>
          <Text p semibold secondary>
            Badges earned: {item?.badges?.length}
          </Text>
        </Block>
      </Block>
    </Block>
  );
}

const OrganizationCard = ({item, type, onPress}: any) => {
  const {t} = useTranslation();
  const {colors, gradients, icons, sizes} = useTheme();
  const user = useSelector((state: any) => state.data.currentUser);

  

  // console.log("item: ", item);
  // console.log("type: ", type);
  // console.log("onPress: ", onPress);


  if ((type === 'all' || type === 'my') && item?.volunteers?.includes(user?.id)) {
      return (
        <TouchableWithoutFeedback onPress={onPress}>
          <Block card white padding={0} marginTop={sizes.sm}>
            <Image
              background
              resizeMode="cover"
              radius={sizes.cardRadius}
              source={{uri: item?.images[0]}}>
              <Block color={colors.overlay} padding={sizes.padding}>
                <Text h4 white marginBottom={sizes.sm}>
                  {item?.name}
                </Text>
                <Text p white>
                  {item?.bio}
                </Text>
                {/* user details */}
                <Block row marginTop={sizes.xxl}>
                  <Image
                    radius={sizes.s}
                    width={sizes.xl}
                    height={sizes.xl}
                    source={{uri: item?.images[0]}}
                    style={{backgroundColor: colors.white}}
                  />
                  <Block justify="center" marginLeft={sizes.s}>
                    <Text p white semibold>
                      {item?.name}
                    </Text>
                    <Text p white>
                      {item?.bio}
                    </Text>
                  </Block>
                </Block>
              </Block>
             </Image>
          </Block>
        </TouchableWithoutFeedback>
      );
  }

  return (
    <TouchableWithoutFeedback onPress={onPress}>
       <OrganizationsGallery item={item} onPress={onPress} />
    </TouchableWithoutFeedback>
  );

  
 
};

export default OrganizationCard;
