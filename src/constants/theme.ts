import {Dimensions, Platform} from 'react-native';
const { width, height } = Dimensions.get("window");

import {
  ICommonTheme,
  ThemeAssets,
  ThemeFonts,
  ThemeIcons,
  ThemeLineHeights,
  ThemeWeights,
} from './types';


export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // font sizes
  largeTitle: 50,
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,

  // app dimensions
  width,
  height
};


// Naming source: https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#Common_weight_name_mapping
export const WEIGHTS: ThemeWeights = {
  text: 'normal',
  h1: Platform.OS === 'ios' ? '700' : 'normal',
  h2: Platform.OS === 'ios' ? '700' : 'normal',
  h3: Platform.OS === 'ios' ? '700' : 'normal',
  h4: Platform.OS === 'ios' ? '700' : 'normal',
  h5: Platform.OS === 'ios' ? '600' : 'normal',
  p: 'normal',

  thin: Platform.OS === 'ios' ? '100' : 'normal',
  extralight: Platform.OS === 'ios' ? '200' : 'normal',
  light: Platform.OS === 'ios' ? '300' : 'normal',
  normal: Platform.OS === 'ios' ? '400' : 'normal',
  medium: Platform.OS === 'ios' ? '500' : 'normal',
  semibold: Platform.OS === 'ios' ? '600' : 'normal',
  bold: Platform.OS === 'ios' ? '700' : 'normal',
  extrabold: Platform.OS === 'ios' ? '800' : 'normal',
  black: Platform.OS === 'ios' ? '900' : 'normal',
};

export const ICONS: ThemeIcons = {
  apple: require('../assets/icons/apple.png'),
  google: require('../assets/icons/google.png'),
  facebook: require('../assets/icons/facebook.png'),
  arrow: require('../assets/icons/arrow.png'),
  articles: require('../assets/icons/articles.png'),
  basket: require('../assets/icons/basket.png'),
  bell: require('../assets/icons/bell.png'),
  calendar: require('../assets/icons/calendar.png'),
  chat: require('../assets/icons/chat.png'),
  check: require('../assets/icons/check.png'),
  clock: require('../assets/icons/clock.png'),
  close: require('../assets/icons/close.png'),
  components: require('../assets/icons/components.png'),
  document: require('../assets/icons/document.png'),
  documentation: require('../assets/icons/documentation.png'),
  extras: require('../assets/icons/extras.png'),
  flight: require('../assets/icons/flight.png'),
  home: require('../assets/icons/home.png'),
  hotel: require('../assets/icons/hotel.png'),
  image: require('../assets/icons/image.png'),
  location: require('../assets/icons/location.png'),
  menu: require('../assets/icons/menu.png'),
  more: require('../assets/icons/more.png'),
  notification: require('../assets/icons/notification.png'),
  office: require('../assets/icons/office.png'),
  payment: require('../assets/icons/payment.png'),
  profile: require('../assets/icons/profile.png'),
  register: require('../assets/icons/register.png'),
  rental: require('../assets/icons/rental.png'),
  search: require('../assets/icons/search.png'),
  settings: require('../assets/icons/settings.png'),
  star: require('../assets/icons/star.png'),
  train: require('../assets/icons/train.png'),
  users: require('../assets/icons/users.png'),
  warning: require('../assets/icons/warning.png'),
};

export const ASSETS: ThemeAssets = {
  // fonts
  OpenSansLight: require('../assets/fonts/OpenSans-Light.ttf'),
  OpenSansRegular: require('../assets/fonts/OpenSans-Regular.ttf'),
  OpenSansSemiBold: require('../assets/fonts/OpenSans-SemiBold.ttf'),
  OpenSansExtraBold: require('../assets/fonts/OpenSans-ExtraBold.ttf'),
  OpenSansBold: require('../assets/fonts/OpenSans-Bold.ttf'),

  // backgrounds/logo
  logo: require('../assets/images/logo.png'),
  header: require('../assets/images/header.png'),
  background: require('../assets/images/background.png'),

  // cards
  card1: require('../assets/images/card1.png'),
  card2: require('../assets/images/card2.png'),
  card3: require('../assets/images/card3.png'),
  card4: require('../assets/images/card4.png'),
  card5: require('../assets/images/card5.png'),

  // gallery photos
  photo1: require('../assets/images/photo1.png'),
  photo2: require('../assets/images/photo2.png'),
  photo3: require('../assets/images/photo3.png'),
  photo4: require('../assets/images/photo4.png'),
  photo5: require('../assets/images/photo5.png'),
  photo6: require('../assets/images/photo6.png'),
  carousel1: require('../assets/images/carousel1.png'),

  // avatars
  avatar1: require('../assets/images/avatar1.png'),
  avatar2: require('../assets/images/avatar2.png'),

  // cars
  x5: require('../assets/images/x5.png'),
  gle: require('../assets/images/gle.png'),
  tesla: require('../assets/images/tesla.png'),
};

export const FONTS: ThemeFonts = {
  // based on font size
  text: 'OpenSans-Regular',
  h1: 'OpenSans-Bold',
  h2: 'OpenSans-Bold',
  h3: 'OpenSans-Bold',
  h4: 'OpenSans-Bold',
  h5: 'OpenSans-SemiBold',
  p: 'OpenSans-Regular',

  // based on fontWeight
  thin: 'OpenSans-Light',
  extralight: 'OpenSans-Light',
  light: 'OpenSans-Light',
  normal: 'OpenSans-Regular',
  medium: 'OpenSans-SemiBold',
  semibold: 'OpenSans-SemiBold',
  bold: 'OpenSans-Bold',
  extrabold: 'OpenSans-ExtraBold',
  black: 'OpenSans-ExtraBold',

  // based on font family
    largeTitle: { fontFamily: "OpenSans-ExtraBold", fontSize: SIZES.largeTitle, lineHeight: 55 },
    H1: { fontFamily: "OpenSans-Bold", fontSize: SIZES.h1, lineHeight: 36 },
    H2: { fontFamily: "OpenSans-Bold", fontSize: SIZES.h2, lineHeight: 30 },
    H3: { fontFamily: "OpenSans-Bold", fontSize: SIZES.h3, lineHeight: 22 },
    H4: { fontFamily: "OpenSans-Bold", fontSize: SIZES.h4, lineHeight: 22 },
    body1: { fontFamily: "OpenSans-Regular", fontSize: SIZES.body1, lineHeight: 36 },
    body2: { fontFamily: "OpenSans-Regular", fontSize: SIZES.body2, lineHeight: 30 },
    body3: { fontFamily: "OpenSans-Regular", fontSize: SIZES.body3, lineHeight: 22 },
    body4: { fontFamily: "OpenSans-Regular", fontSize: SIZES.body4, lineHeight: 22 },

    // largeTitle: { fontSize: SIZES.largeTitle, lineHeight: 55 },
    // h1: { fontSize: SIZES.h1, lineHeight: 36 },
    // h2: { fontSize: SIZES.h2, lineHeight: 30 },
    // h3: { fontSize: SIZES.h3, lineHeight: 22 },
    // h4: { fontSize: SIZES.h4, lineHeight: 22 },
    // body1: { fontSize: SIZES.body1, lineHeight: 36 },
    // body2: { fontSize: SIZES.body2, lineHeight: 30 },
    // body3: { fontSize: SIZES.body3, lineHeight: 22 },
    // body4: { fontSize: SIZES.body4, lineHeight: 22 },

    
  
};

export const LINE_HEIGHTS: ThemeLineHeights = {
  // font lineHeight
  text: 22,
  h1: 60,
  h2: 55,
  h3: 43,
  h4: 33,
  h5: 24,
  p: 22,
};

export const THEME: ICommonTheme = {
  icons: ICONS,
  assets: {...ICONS, ...ASSETS},
  fonts: FONTS,
  weights: WEIGHTS,
  lines: LINE_HEIGHTS,
  sizes: {width, height},
};



export const COLORS = {
    // base colors
    primary: "#00996D", // Green
    secondary: "#606d87",   // Gray

    // colors
    black: "#1E1F20",
    white: "#FFFFFF",
    lightGray: "#eff2f5",
    gray: "#BEC1D2",
    darkgray: '#898C95',
    lightGreen: '#e6f7f2',
    lightGreen2: '#e9f9f7',
    lightGreen3: '#ebf6f7',
    lightBlue: '#a7c5eb',
    lightGray2: '#f6f6f7',
    transparent: 'transparent',
    darkGreen: '#00996D',
    darkGreen2: '#00816A',
    darkGreen3: '#006C5F',
    darkGreen4: '#005C55',
    darkGreen5: '#004C4C',
    darkGreen6: '#003C43',
    darkGreen7: '#00313A',
    darkGreen8: '#002630',
    darkGreen9: '#001B27',
    darkGreen10: '#00111D',
    red: '#FF0000',
    red2: '#D60000',
    red3: '#B30000',
    red4: '#8C0000',
    red5: '#660000',
    red6: '#3F0000',
    green: '#008C00',
    
    
};


const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
