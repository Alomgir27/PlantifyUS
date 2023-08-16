import React, { useState, useEffect } from "react";
import {  View, Text, Image, TouchableOpacity, StatusBar, StyleSheet } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';


import {
    PlantDetail,
    Campings,
    Settings,
    Donation,
    AuthLanding,
    Login,
    Signup,
    ForgotPassword,
    PostUpload,
    ProfileScreen,
    PostsScreen,
    EventsScreen,
    EventDetailsScreen,
    OrganizationsScreen,
    ImageDetails,
    Images,
    TreeIdentify,
    About,
    Agreement,
    ChatRoom,
    Components,
    Notifications,
    NotificationsSettings,
    Privacy,
    Register,
    Rental,
    Rentals,
    Shopping,
    ViewOrganization,
    Plants
} from "./screens";

import Tabs from "./navigation/tabs";
import {createStackNavigator} from '@react-navigation/stack';


// constants
import { COLORS } from "./constants/index";
import { fetchUser, fetchAllDefaultData, clearData } from "./modules/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setMyLocation, setLocation } from "./modules/campings";
import * as Location from 'expo-location';
import * as ICONS from '@expo/vector-icons'
import { Text as Text2 } from './components';

import {useScreenOptions, useTranslation} from './hooks';

const Stack = createStackNavigator();

// const Drawer = createDrawerNavigator();
export default function Main() {  
    const {t} = useTranslation();
    const screenOptions = useScreenOptions();
    const [loading, setLoading] = useState<boolean>(false);
    const user = useSelector(state => state?.data?.currentUser)
    const organizations = useSelector(state => state?.data?.organizations)

    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const user = await AsyncStorage.getItem('user');
            let _id: any = null;
            if(user) {
                _id = JSON.parse(user)?._id
            }
            dispatch(fetchUser(_id, setLoading))
        })();
    }, [])

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            dispatch(setMyLocation(location?.coords));
            dispatch(setLocation(location?.coords));
        })()
    }, [])

    useEffect(() => {
        if(loading){
            dispatch(clearData())
            dispatch(fetchAllDefaultData());
            setLoading(false);
        }
    }, [loading])


    return (
        <Stack.Navigator screenOptions={screenOptions.stack} initialRouteName="Main">
            <Stack.Screen
                name="Main"
                component={Tabs}
                options={{title: t('navigation.home')}}
            />
            <Stack.Screen
                name="PlantDetail"
                component={PlantDetail}
                options={{title: t('navigation.plantDetail'), headerShown: false }}
            />
            <Stack.Screen
                name="Settings"
                component={Settings}
                options={{title: t('navigation.settings')}}
            />
            <Stack.Screen
                name="Donation"
                component={Donation}
                options={{title: t('navigation.donation')}}
            />
            <Stack.Screen
                name="PostUpload"
                component={PostUpload}
                options={{title: t('navigation.postUpload'), headerShown: false }}
            />
            <Stack.Screen
                name="AuthLanding"
                component={AuthLanding}
                options={{title: t('navigation.authLanding'), headerShown: false }}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={{title: t('navigation.login'), headerShown: false }}
            />
            <Stack.Screen
                name="Signup"
                component={Signup}
                options={{title: t('navigation.signup'), headerShown: false }}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{title: t('navigation.forgotPassword')}}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{title: t('navigation.profile'), headerShown: false }}
            />
            <Stack.Screen
                name="Events"
                component={EventsScreen}
                options={{title: t('navigation.events'),  headerShown: false }}
            />
            <Stack.Screen
                name="Event"
                component={EventDetailsScreen}
                options={{title: t('navigation.event'), headerShown: false }}
            />
            <Stack.Screen
                name="ImageDetails"
                component={ImageDetails}
                options={{title: t('navigation.imageDetails'), headerShown: false }}
            />
            <Stack.Screen
                name="Posts"
                component={PostsScreen}
                options={{title: t('navigation.posts'), headerShown: false }}
            />
            <Stack.Screen
                name="Organizations"
                component={OrganizationsScreen}
                options={{title: t('navigation.organizations'), headerShown: false }}
            />
            <Stack.Screen
                name="Images"
                component={Images}
                options={{title: t('navigation.images'), headerShown: false }}
            />
            <Stack.Screen
                name="TreeIdentify"
                component={TreeIdentify}
                options={{title: t('navigation.treeIdentify'), headerShown: false }}
            />
            <Stack.Screen
                name="About"
                component={About}
                options={{title: t('navigation.about')}}
            />
            <Stack.Screen
                name="Agreement"
                component={Agreement}
                options={{title: t('navigation.agreement')}}
            />
            <Stack.Screen
                name="ChatRoom"
                component={ChatRoom}
                options={{title: t('navigation.chatRoom')}}
            />
            <Stack.Screen
                name="Components"
                component={Components}
                options={{title: t('navigation.components')}}
            />
            <Stack.Screen
                name="Notifications"
                component={Notifications}
                options={{title: t('navigation.notifications')}}
            />
            <Stack.Screen   
                name="NotificationsSettings"
                component={NotificationsSettings}
                options={{title: t('navigation.notificationsSettings')}}
            />
            <Stack.Screen
                name="Privacy"  
                component={Privacy}
                options={{title: t('navigation.privacy')}}
            />
            <Stack.Screen
                name="Register"
                component={Register}
                options={{title: t('navigation.register'), headerShown: false }}
            />
            <Stack.Screen
                name="Rental"
                component={Rental}
                options={{title: t('navigation.rental')}}
            />
            <Stack.Screen
                name="Rentals"
                component={Rentals}
                options={{title: t('navigation.rentals')}}
            />
            <Stack.Screen
                name="Shopping"
                component={Shopping}
                options={{title: t('navigation.shopping')}}
            />
            <Stack.Screen
                name="Organization"
                component={ViewOrganization}
                options={{title: t('navigation.organization')}}
            />
            <Stack.Screen
                name="Plants"
                component={Plants}
                options={{title: t('navigation.plants'), ...screenOptions.plants}}
            />
           

       </Stack.Navigator>
                    
    );
};


  
