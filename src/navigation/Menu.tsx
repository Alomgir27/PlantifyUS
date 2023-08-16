// import React from 'react';

// import {Block} from '../components';
// import {useData, useTheme} from '../hooks';


// import Main from '../Main';

// /* drawer menu navigation */
// export default () => {
//   const {isDark} = useData();
//   const {gradients} = useTheme();

//   return (
//     <Block gradient={gradients[isDark ? 'dark' : 'light']}>
//       <Main />
//     </Block>
//   );
// };


import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Linking, StyleSheet} from 'react-native';

import {
  useIsDrawerOpen,
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { DrawerItem } from '@react-navigation/drawer';
import { View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
// import { clearData } from '../redux/actions';
import { Text as Text2 } from 'react-native';



import Main from './../Main';
import {Block, Text, Switch, Button, Image} from '../components';
import {useData, useTheme, useTranslation} from '../hooks';
import * as ICONS from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { COLORS } from '../constants';

const Drawer = createDrawerNavigator();

/* drawer menu screens navigation */
const ScreensStack = () => {
  const {colors} = useTheme();
  const isDrawerOpen = useIsDrawerOpen();
  const animation = useRef(new Animated.Value(0)).current;

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.88],
  });

  const borderRadius = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  const animatedStyle = {
    borderRadius: borderRadius,
    transform: [{scale: scale}],
  };

  useEffect(() => {
    Animated.timing(animation, {
      duration: 200,
      useNativeDriver: true,
      toValue: isDrawerOpen ? 1 : 0,
    }).start();
  }, [isDrawerOpen, animation]);

  return (
    <Animated.View
      style={StyleSheet.flatten([
        animatedStyle,
        {
          flex: 1,
          overflow: 'hidden',
          borderColor: colors.card,
          borderWidth: isDrawerOpen ? 1 : 0,
        },
      ])}>
      {/*  */}
      <Main />
    </Animated.View>
  );
};

/* custom drawer menu */
const DrawerContent = (
  props: DrawerContentComponentProps<DrawerContentOptions>,
) => {
  const {navigation} = props;
  const {isDark, handleIsDark} = useData();
  const {t} = useTranslation();
  const [active, setActive] = useState('Home');
  const {assets, colors, gradients, sizes} = useTheme();
  const labelColor = isDark ? colors.white : colors.text;
  const user = useSelector(state => state?.data?.currentUser);
  const organizations = useSelector(state => state?.data?.organizations);

  const handleNavigation = useCallback(
    (to) => {
      setActive(to);
      navigation.navigate(to);
    },
    [navigation, setActive],
  );

  const handleWebLink = useCallback((url) => Linking.openURL(url), []);

  // screen list for Drawer menu
  
  const screens = [
    {name: t('screens.home'), to: 'Home', icon: assets.home, isCustom: true},
    {name: t('screens.components'), to: 'Components', icon: assets.components, isCustom: true},
    {name: t('screens.articles'), to: 'Articles', icon: assets.document, isCustom: true},
    {name: t('screens.profile'), to: 'Profile', icon: assets.profile, isCustom: true},
    {name: t('screens.settings'), to: 'Settings', icon: assets.settings, isCustom: true},
    {name: t('screens.register'), to: 'Register', icon: assets.register, isCustom: true},
    {name: t('screens.extra'), to: 'Extra', icon: assets.extras, isCustom: true},
    {name: t('screens.login'), to: 'Login', icon: 'log-in', isCustom: false},
    {name: t('screens.donation'), to: 'Donation', icon: 'cash', isCustom: false},
    {name: t('screens.shopping'), to: 'Shopping', icon: 'cart', isCustom: false},
    {name: t('screens.rental'), to: 'Rental', icon: 'home', isCustom: false},
    {name: t('screens.rentals'), to: 'Rentals', icon: 'home', isCustom: false},
    {name: t('screens.events'), to: 'Events', icon: 'calendar', isCustom: false},
    {name: t('screens.organizations'), to: 'Organizations', icon: 'people', isCustom: false},
    {name: t('screens.treeIdentify'), to: 'TreeIdentify', icon: 'leaf', isCustom: false},
    {name: t('screens.notifications'), to: 'Notifications', icon: 'notifications', isCustom: false},
    {name: t('screens.box'), to: 'Box', icon: 'cube', isCustom: false},
    {name: t('screens.posts'), to: 'Posts', icon: 'book', isCustom: false},
    {name: t('screens.signup'), to: 'Signup', icon: 'person-add', isCustom: false},
    {name: t('screens.plants'), to: 'Plants', icon: 'leaf', isCustom: false},
  ];

  return (
    <DrawerContentScrollView
      {...props}
      scrollEnabled
      removeClippedSubviews
      renderToHardwareTextureAndroid
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: sizes.padding}}>
      <Block paddingHorizontal={sizes.padding}>
        <Block flex={0} row align="center" marginBottom={sizes.md}>
          {user?.image ? (
          <Block marginRight={sizes.s} marginTop={sizes.md} >
            <Image
              radius={sizes.md * 2.5}
              width={sizes.md * 2.5}
              height={sizes.md * 2.5}
              source={{uri: user?.image}}
            />
            <Text bold primary paddingLeft={sizes.s} paddingTop={sizes.s}>{user?.name}</Text>
          </Block>
          ) : (
            <Block>
             <ICONS.Ionicons name="person-circle-outline" size={50} color={colors.text} />
          </Block>
          )}
        </Block>

        {screens?.map((screen, index) => {
          const isActive = active === screen.to;
          return (
            <Button
              row
              justify="flex-start"
              marginBottom={sizes.s}
              key={`menu-screen-${screen.name}-${index}`}
              onPress={() => handleNavigation(screen.to)}>
              <Block
                flex={0}
                radius={6}
                align="center"
                justify="center"
                width={sizes.md}
                height={sizes.md}
                marginRight={sizes.s}
                gradient={gradients[isActive ? 'primary' : 'white']}>
                  {screen.isCustom ? (
                    <Image
                      radius={0}
                      width={14}
                      height={14}
                      source={screen.icon}
                      color={colors[isActive ? 'white' : 'black']}
                    />
                  ) : (
                    <ICONS.Ionicons
                      name={screen.icon}
                      size={14}
                      color={colors[isActive ? 'white' : 'black']}
                    />
                  )}
                
              </Block>
              <Text p semibold={isActive} color={labelColor}>
                {screen.name}
              </Text>
            </Button>
          );
        })}

        <Block
          flex={0}
          height={1}
          marginRight={sizes.md}
          marginVertical={sizes.sm}
          gradient={gradients.menu}
        />

        <Text semibold transform="uppercase" opacity={0.5}>
          {t('menu.documentation')}
        </Text>

        <Button
          row
          justify="flex-start"
          marginTop={sizes.sm}
          marginBottom={sizes.s}
          onPress={() =>
            handleWebLink('https://play.google.com/store/apps/details?id=com.plantifyus')
          }>
          <Block
            flex={0}
            radius={6}
            align="center"
            justify="center"
            width={sizes.md}
            height={sizes.md}
            marginRight={sizes.s}
            gradient={gradients.white}>
            <Image
              radius={0}
              width={14}
              height={14}
              color={colors.black}
              source={assets.documentation}
            />
          </Block>
          <Text p color={labelColor}>
            {t('menu.started')}
          </Text>
        </Button>
            {!user && (<>
            <Block flex={0} height={1} marginRight={sizes.md} marginVertical={sizes.sm} gradient={gradients.menu} />
                  <Button row justify="flex-start" marginTop={sizes.sm} marginBottom={sizes.s} onPress={() => props.navigation.navigate('Login')}>
                      <Block flex={0} radius={6} align="center" justify="center" width={sizes.md} height={sizes.md} marginRight={sizes.s} gradient={gradients.white}>
                          <Image radius={0} width={14} height={14} color={colors.black} source={assets.documentation} />
                      </Block>
                      <Text p color={labelColor}>Login</Text>
                  </Button>
                  <Button row justify="flex-start" marginTop={sizes.sm} marginBottom={sizes.s} onPress={() => props.navigation.navigate('Signup')}>
                      <Block flex={0} radius={6} align="center" justify="center" width={sizes.md} height={sizes.md} marginRight={sizes.s} gradient={gradients.white}>
                          <Image radius={0} width={14} height={14} color={colors.black} source={assets.documentation} />
                      </Block>
                      <Text p color={labelColor}>Signup</Text>
                  </Button>
                </>
                )}

       <Block
          flex={0}
          height={1}
          marginRight={sizes.md}
          marginVertical={sizes.sm}
          gradient={gradients.menu}
        />

        <Text semibold transform="uppercase" opacity={0.5}>
          {t('menu.community')}
        </Text>

        {organizations?.map((organization, index) => (
          <Button
            row
            justify="flex-start"
            marginTop={sizes.sm}
            marginBottom={sizes.s}
            key={`menu-screen-${organization.name}-${index}`}
            onPress={() => props.navigation.navigate('Organization', { _id: organization._id })}>
            <Block
              flex={0}
              radius={6}
              align="center"
              justify="center"
              width={sizes.md}
              height={sizes.md}
              marginRight={sizes.s}
              gradient={gradients.white}>
              <Image
                radius={5}
                width={35}
                height={35}
                source={{uri: organization.images[0]}}
              />
            </Block>
            <Text p color={labelColor}>
              {organization.name}
            </Text>
          </Button>
        ))}

        <Block
          flex={0}
          height={1}
          marginRight={sizes.md}
          marginVertical={sizes.sm}
          gradient={gradients.menu}
        />

        <Text semibold transform="uppercase" opacity={0.5}>
          {t('menu.mode')}
        </Text>

        <Block row justify="space-between" marginTop={sizes.sm}>
          <Text color={labelColor}>{t('darkMode')}</Text>
          <Switch
            checked={isDark}
            onPress={(checked) => handleIsDark(checked)}
          />
        </Block>
        
            

          
          {!user ? (<>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.white }}></View>
              <View>
                  <Text style={{ width: 50, textAlign: 'center', color: COLORS.white }}>OR</Text>
                  <Text style={{ width: 50, textAlign: 'center', color: COLORS.white }}>Login with</Text>
              </View>
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.white }}></View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }} onPress={() => props.navigation.navigate('Login')}>
                      <ICONS.Ionicons name="mail" size={24} color={COLORS.primary} />
                      <Text style={{ marginLeft: 10 }}>Email</Text>
                  </TouchableOpacity>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }} onPress={() => props.navigation.navigate('Login')}>
                      <ICONS.Ionicons name="logo-google" size={24} color={COLORS.primary} />
                      <Text style={{ marginLeft: 10 }} primary>Google</Text>
                  </TouchableOpacity>
              </View>
          </View>
          </>
            ) : (<>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.white }}></View>
              <View>
                  <Text style={{ width: 50, textAlign: 'center', color: COLORS.white }}>OR</Text>
                  <Text style={{ width: 50, textAlign: 'center', color: COLORS.white }}>Logout</Text>
              </View>
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.white }}></View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.secondary, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }} onPress={() => {
                      AsyncStorage.removeItem('user');
                      props.navigation.closeDrawer();
                  }}>
                      <ICONS.Ionicons name="log-out" size={24} color={COLORS.primary} />
                      <Text style={{ marginLeft: 10 }} primary>Logout</Text>
                  </TouchableOpacity>
              </View>
          </View>
            </>
            )}

          <View style={{ height: 50 }}></View>

        
      </Block>
    </DrawerContentScrollView>
  );
};

/* drawer menu navigation */
export default () => {
  const {isDark} = useData();
  const {gradients} = useTheme();

  return (
    <Block gradient={gradients[isDark ? 'dark' : 'light']}>
      <Drawer.Navigator
        drawerType="slide"
        overlayColor="transparent"
        sceneContainerStyle={{backgroundColor: 'transparent'}}
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {width: '60%', backgroundColor: 'transparent'},
          drawerType: 'slide',
          overlayColor: 'transparent',
          sceneContainerStyle: {backgroundColor: 'transparent'},
          drawerActiveTintColor: 'transparent',
          drawerInactiveTintColor: 'transparent',
        }}
        drawerStyle={{
          flex: 1,
          width: '60%',
          borderRightWidth: 0,
          backgroundColor: 'transparent',
        }}
        drawerContentOptions={{
          activeTintColor: 'transparent',
          inactiveTintColor: 'transparent',
        }}
        initialRouteName="Screens">
        <Drawer.Screen name="Screens" component={ScreensStack} />
      </Drawer.Navigator>
    </Block>
  );
};
