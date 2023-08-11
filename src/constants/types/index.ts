import i18n from 'i18n-js';
import {ImageSourcePropType} from 'react-native';
import {CalendarBaseProps} from 'react-native-calendars';
import {ITheme} from './theme';

export * from './components';
export * from './theme';

export interface IBadge {
  id?: number | string;
  _id?: string;
  name?: string;
  image?: string;
  description?: string;
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
  onPress?: (event?: any) => void;
}

export interface IPost {
  id?: number | string;
  _id?: string;
  author?: IUser;
  text?: string;
  images?: string[];
  tags?: string[];
  upvotes?: IUser[];
  downvotes?: IUser[];
  comments?: string[];
  event?: IEvent;
  favourites?: IUser[];
  isVerified?: boolean;
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
  onPress?: (event?: any) => void;
}

export interface IEvent {
  id?: number | string;
  _id?: string;
  title?: string;
  description?: string;
  location?: ILocation;
  organizer?: IUser;
  attendees?: IUser[];
  images?: string[];
  requirements?: {
    trees?: string;
    volunteers?: string;
    funds?: string;
  };
  landsDescription?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'completed';
  author?: IUser;
  favourites?: IUser[];
  collectedFunds?: number;
  upvotes?: IUser[];
  downvotes?: IUser[];
  comments?: string[];
  isVerified?: boolean;
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
  onPress?: (event?: any) => void;
}


export interface IUser {
  id: number | string;
  name?: string;
  department?: string;
  avatar?: string;
  stats?: {posts?: number; followers?: number; following?: number};
  social?: {twitter?: string; dribbble?: string};
  about?: string;
  _id?: string;
  email?: string;
  password?: string;
  eventsAttending?: IEvent[];
  friends?: IUser[];
  posts?: IPost[];
  image?: string;
  bio?: string;
  location?: ILocation;
  badges?: IBadge[];
  notifications?: INotification[];
  type?: string;
  uuid?: string;
  createdAt?: Date;
  updatedAt?: Date;
  onPress?: (event?: any) => void;
}

export interface ICategory {
  id?: number;
  name?: string;
}
export interface IArticleOptions {
  id?: number;
  title?: string;
  description?: string;
  type?: 'room' | 'apartment' | 'house'; // private room | entire apartment | entire house
  sleeping?: {total?: number; type?: 'sofa' | 'bed'};
  guests?: number;
  price?: number;
  user?: IUser;
  image?: string;
}
export interface IOrganization {
  _id?: string;
  name?: string;
  bio?: string;
  location?: ILocation;
  images?: string[];
  volunteers?: IUser[];
  events?: IEvent[];
  admin?: IUser;
  moderators?: IUser[];
  badges?: IBadge[];
  notifications?: INotification[];
  joinRequests?: IUser[];
  isVerified?: boolean;
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
  onPress?: (event?: any) => void;
}

export interface IArticle {
  id?: number;
  title?: string;
  description?: string;
  type?: 'room' | 'apartment' | 'house'; // private room | entire apartment | entire house
  sleeping?: {total?: number; type?: 'sofa' | 'bed'};
  guests?: number;
  price?: number;
  user?: IUser;
  image?: string;
  onPress?: (event?: any) => void;
}

export interface IProduct {
  id?: number;
  title?: string;
  description?: string;
  image?: string;
  timestamp?: number;
  linkLabel?: string;
  type: 'vertical' | 'horizontal';
}
export interface ILocation {
  id?: number;
  city?: string;
  country?: string;
  coordinates?: {latitude?: number; longitude?: number};
  type?: string;
}
export interface IUseData {
  isDark: boolean;
  handleIsDark: (isDark?: boolean) => void;
  theme: ITheme;
  setTheme: (theme?: ITheme) => void;
  user: IUser;
  users: IUser[];
  handleUser: (data?: IUser) => void;
  handleUsers: (data?: IUser[]) => void;
  basket: IBasket;
  handleBasket: (data?: IBasket) => void;
  following: IProduct[];
  setFollowing: (data?: IProduct[]) => void;
  trending: IProduct[];
  setTrending: (data?: IProduct[]) => void;
  categories: ICategory[];
  setCategories: (data?: ICategory[]) => void;
  recommendations: IArticle[];
  setRecommendations: (data?: IArticle[]) => void;
  articles: IArticle[];
  setArticles: (data?: IArticle[]) => void;
  article: IArticle;
  handleArticle: (data?: IArticle) => void;
  notifications: INotification[];
  handleNotifications: (data?: INotification[]) => void;
}

export interface ITranslate {
  locale: string;
  setLocale: (locale?: string) => void;
  t: (scope?: i18n.Scope, options?: i18n.TranslateOptions) => string;
  translate: (scope?: i18n.Scope, options?: i18n.TranslateOptions) => string;
}
export interface IExtra {
  id?: number;
  name?: string;
  time?: string;
  image: ImageSourcePropType;
  saved?: boolean;
  booked?: boolean;
  available?: boolean;
  onBook?: () => void;
  onSave?: () => void;
  onTimeSelect?: (id?: number) => void;
}

export interface IBasketItem {
  id?: number;
  image?: string;
  title?: string;
  description?: string;
  stock?: boolean;
  price?: number;
  qty?: number;
  qtys?: number[];
  size?: number | string;
  sizes?: number[] | string[];
}

export interface IBasket {
  subtotal?: number;
  items?: IBasketItem[];
  recommendations?: IBasketItem[];
}

export interface INotification {
  id?: number;
  subject?: string;
  message?: string;
  read?: boolean;
  business?: boolean;
  createdAt?: number | Date;
  type:
    | 'document'
    | 'documentation'
    | 'payment'
    | 'notification'
    | 'profile'
    | 'extras'
    | 'office';
}

export interface ICalendar extends CalendarBaseProps {
  dates?: any[];
  calendar?: {start: number; end: number};
  onClose?: (calendar?: {start?: number; end?: number}) => void;
}
