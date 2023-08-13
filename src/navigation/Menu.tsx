import React from 'react';

import {Block} from '../components';
import {useData, useTheme} from '../hooks';


import Main from '../Main';

/* drawer menu navigation */
export default () => {
  const {isDark} = useData();
  const {gradients} = useTheme();

  return (
    <Block gradient={gradients[isDark ? 'dark' : 'light']}>
      <Main />
    </Block>
  );
};
