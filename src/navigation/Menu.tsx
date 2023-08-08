import React, {useCallback, useEffect, useRef, useState} from 'react';


import {Block, Text, Switch, Button, Image} from '../components';
import {useData, useTheme, useTranslation} from '../hooks';

import {
  About,
  Agreement,
  Articles,
  Chat,
  Components,
  Extras,
  Home,
  Notifications,
  Privacy,
  Profile,
  Register,
  Login,
  Rental,
  Rentals,
  Booking,
  Settings,
  Shopping,
  NotificationsSettings,
} from '../screens';

import Main from '../Main';

/* drawer menu navigation */
export default () => {
  const {isDark} = useData();
  const {gradients} = useTheme();

  return (
    <Block gradient={gradients[isDark ? 'dark' : 'light']}>
      {/* <About />
      <Agreement /> */}
      {/* <Articles /> */}
      {/* <Chat /> */}
      {/* <Components />   */}
      {/* <Extras /> */}
      <Main />
      {/* <Notifications /> */}
      {/* <Privacy /> */}
      {/* <Profile /> */}
      {/* <Register /> */}
      {/* <Login /> */}
      {/* <Rental /> */}
      {/* <Rentals /> */}
      {/* <Booking /> */}
      {/* <Settings /> */}
      {/* <Shopping /> */}
      {/* <NotificationsSettings /> */}
      
    </Block>
  );
};
