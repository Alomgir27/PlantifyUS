import React from 'react';
import dayjs from 'dayjs';
import {Alert, TouchableWithoutFeedback} from 'react-native';

import Text from './Text';
import Block from './Block';
import Image from './Image';
import {useTheme, useTranslation} from '../hooks';
import Button from './Button';
import { useSelector } from 'react-redux';


const OrganizationsGallery = ({item, onPress, type, navigation}: any) => {
  const {assets, sizes, colors, gradients} = useTheme();
  const user = useSelector((state: any) => state.data.currentUser);
  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
  const IMAGE_VERTICAL_SIZE =
    (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
 
  const handlePress = (_id: string) => {
    if(item?.joinRequests?.includes(user?._id)) {
      Alert.alert(
        'Request',
        'You have already requested to join this organization',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Withdraw',
            onPress: () => onPress('Join', _id),
          }
        ],
        {cancelable: true},
      );
        
    } else {
      onPress('Join', _id);
    }
  };


    



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
        <Block row marginBottom={sizes.s}>
            <Text  p secondary marginTop={sizes.sm} primary>
               {item?.type} • {item?.moderators?.length} moderators • 
            </Text>
            <Block row marginTop={sizes.sm} marginLeft={sizes.s}>
                {item?.volunteers?.map((volunteer: any) => (
                  volunteer?.image &&
                      <Image
                        radius={10}
                        width={20}
                        height={20}
                        source={{uri: volunteer?.image}}
                        style={{backgroundColor: colors.white, marginRight: -5 , zIndex: 1, marginTop: 2}}
                        overlay
                      />
                ))}
                <Text p primary marginLeft={sizes.s}>
                  {item?.volunteers?.length} members
                </Text>
            </Block>
          </Block>
        <Text h4 gradient={gradients.primary}>
          {item.name}
        </Text>
        <Text p lineHeight={26}>
          {item.bio}
        </Text>
        <Block row marginTop={sizes.sm}>
          <Button
            primary
            onPress={() => navigation.navigate('Organization', { _id: item?._id})}
            marginRight={sizes.s}
            width={sizes.width / 3}
            >
            <Text bold>View</Text>
          </Button>
          {type !== 'pending' && (
            <Button
            primary
            width={sizes.width / 3}
            onPress={() => handlePress(item?._id)}
            >
              <Text bold>
                {item?.joinRequests?.includes(user?._id) ? 'Requested' : 'Join'}
              </Text>
            </Button>
          )}
          {type === 'pending' && !(user?.type === 'admin' || user?.type === 'moderator') && !item?.isVerified && (
            <Button
              primary
              width={sizes.width / 3}
              onPress={() => onPress('Approve', item?._id)}
            >
              <Text bold>
                Approve
              </Text>
            </Button>
          )}
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

const OrganizationCard = ({item, type, onPress, navigation}: any) => {
  const {t} = useTranslation();
  const {colors, gradients, icons, sizes} = useTheme();
  const user = useSelector((state: any) => state.data.currentUser);


  if ((type === 'all' && item?.volunteers?.map((item : any) => item?._id ? item?._id : item).includes(user?._id)) || type === 'my') {
      return (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Organization', { _id: item?._id})} key={item?._id} >
          <Block card white padding={0} marginTop={sizes.sm}>
            <Image
              background
              resizeMode="cover"
              radius={sizes.cardRadius}
              source={{uri: item?.images[0]}}>
              <Block color={colors.overlay} padding={sizes.padding}>
                <Text h4 white marginBottom={sizes.sm} gradient={gradients.primary}>
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
                    source={{uri: item?.admin?.image}}
                    style={{backgroundColor: colors.white}}
                  />
                  <Block marginLeft={sizes.s} justify="center">
                      <Text p white semibold>
                        <Text bold primary onPress={() => navigation.navigate('Profile', { _id: item?.admin?._id})}> {item?.admin?.name}</Text> created this organization
                      </Text>
                      <Block row marginTop={sizes.s}>
                        {item?.volunteers?.map((volunteer: any) => (
                          volunteer?.image &&
                              <Image
                                radius={10}
                                width={20}
                                height={20}
                                source={{uri: volunteer?.image}}
                                style={{backgroundColor: colors.white, marginRight: -5 , zIndex: 1}}
                                overlay
                              />
                        ))}
                        <Text p  marginLeft={sizes.s}>
                          You and {item?.volunteers?.length} others are members
                        </Text>
                      </Block>
                    </Block>
                </Block>
                <Block marginTop={sizes.sm}>
                    <Button
                      gradient={gradients.primary}
                      radius={sizes.sm}
                      marginRight={sizes.s}
                      onPress={() => navigation.navigate('ChatRoom', { _id: item?._id})}>
                      <Text bold white>
                        ChatRoom
                      </Text>
                    </Button>
                  </Block>
              </Block>
             </Image>
          </Block>
        </TouchableWithoutFeedback>
      );
  }

  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate('Organization', { _id: item?._id})} key={item?._id} >
       <OrganizationsGallery item={item} onPress={onPress} type={type} navigation={navigation} />
    </TouchableWithoutFeedback>
  );

  
 
};

export default OrganizationCard;
