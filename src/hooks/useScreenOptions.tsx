import React from 'react';
import {TouchableOpacity} from 'react-native';
import {
  StackHeaderTitleProps,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {DrawerActions} from '@react-navigation/native';
import {StackHeaderOptions} from '@react-navigation/stack/lib/typescript/src/types';
import {useNavigation} from '@react-navigation/native';

import {useData} from './useData';
import {useTranslation} from './useTranslation';

import Image from '../components/Image';
import Text from '../components/Text';
import useTheme from '../hooks/useTheme';
import Button from '../components/Button';
import Block from '../components/Block';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

export default () => {
  const {t} = useTranslation();
  const {basket} = useData();
  const navigation = useNavigation();
  const {icons, colors, gradients, sizes} = useTheme();
  const user = useSelector((state) => state?.data?.currentUser);


  const menu = {
    headerStyle: {elevation: 0},
    headerTitleAlign: 'left',
    headerTitleContainerStyle: {marginLeft: -sizes.sm},
    headerLeftContainerStyle: {paddingLeft: sizes.s},
    headerRightContainerStyle: {paddingRight: sizes.s},
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    headerTitle: ({children}: StackHeaderTitleProps) => (
      <Text p>{children}</Text>
    ),
    headerLeft: () => (
      <Button onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
        <Image source={icons.menu} radius={0} color={colors.icon} />
      </Button>
    ),
    headerRight: () => (
      <Block row flex={0} align="center" marginRight={sizes.padding}>
        <TouchableOpacity
          style={{marginRight: sizes.sm}}
          onPress={() =>
            navigation.navigate('Screens', {
              screen: 'Notifications',
            })
          }>
          <Image source={icons.bell} radius={0} color={colors.icon} />
          <Block
            flex={0}
            right={0}
            width={sizes.s}
            height={sizes.s}
            radius={sizes.xs}
            position="absolute"
            gradient={gradients?.primary}
          />
          <Block
            flex={0}
            padding={0}
            justify="center"
            position="absolute"
            top={-sizes.s}
            right={-sizes.s}
            width={sizes.sm}
            height={sizes.sm}
            radius={sizes.sm / 2}
            gradient={gradients?.primary}>
            <Text white center bold size={10} lineHeight={10} paddingTop={3}>
              {basket?.items?.length}
            </Text>
          </Block>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => user ? navigation.navigate('Screens', {screen: 'Profile', userId: user?._id }) : navigation.navigate('Screens', {screen: 'AuthLanding'})
          }>
            {user?.image ? (
              <Image  
                radius={6}
                width={24}
                height={24}
                source={{uri: user?.image}}
              />
            ) : (
              <Ionicons name="person-circle-outline" size={24} color={colors.icon} />
            )}          
        </TouchableOpacity>
      </Block>
    ),
  } as StackHeaderOptions;

  const options = {
    stack: menu,
    components: {
      ...menu,
      headerTitle: () => (
        <Text p white>
          {t('navigation.components')}
        </Text>
      ),
      headerRight: () => null,
      headerLeft: () => (
        <Button
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
          <Image source={icons.menu} radius={0} color={colors.white} />
        </Button>
      ),
    },
    notifications: {
      ...menu,
      headerRight: () => null,
      headerLeft: () => (
        <Button
          onPress={() =>
            navigation.navigate('Screens', {
              screen: 'Settings',
            })
          }>
          <Image
            radius={0}
            width={10}
            height={18}
            color={colors.icon}
            source={icons.arrow}
            transform={[{rotate: '180deg'}]}
          />
        </Button>
      ),
    },
    back: {
      ...menu,
      headerRight: () => null,
      headerLeft: () => (
        <Button onPress={() => navigation.goBack()}>
          <Image
            radius={0}
            width={10}
            height={18}
            color={colors.icon}
            source={icons.arrow}
            transform={[{rotate: '180deg'}]}
          />
        </Button>
      ),
    },
    profile: {
      ...menu,
      headerLeft: () => (
        <Button onPress={() => navigation.goBack()}>
          <Image source={icons.arrow} radius={0} color={colors.icon} style={{transform: [{rotate: '180deg'}]}} />
        </Button>
      ),
      headerRight: () => (
        <Block row flex={0} align="center" marginRight={sizes.padding}>
          <TouchableOpacity
            style={{marginRight: sizes.sm}}
            onPress={() =>
              navigation.navigate('Screens', {
                screen: 'Notifications',
              })
            }>
            <Image source={icons.bell} radius={0} color={colors.icon} />
            <Block
              flex={0}
              right={0}
              width={sizes.s}
              height={sizes.s}
              radius={sizes.xs}
              position="absolute"
              gradient={gradients?.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.dispatch(
                DrawerActions.jumpTo('Screens', {screen: 'Profile', userId: user?._id }),
              )
            }>
            <Image
              radius={6}
              width={24}
              height={24}
              source={{uri: user?.image}}
            />
          </TouchableOpacity>
        </Block>
      ),
    },
    plants: {
      ...menu,
      headerRight: () => null,
      headerLeft: () => (
        <Button onPress={() => navigation.goBack()}>
          <Image source={icons.arrow} radius={0} color={colors.icon} style={{transform: [{rotate: '180deg'}]}} />
        </Button>
      ),
    },
    
  };

  return options;
};
