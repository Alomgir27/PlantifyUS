import React, { useState, useEffect } from "react";
import {  View, Text, Image, TouchableOpacity } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

// screens
import { PlantDetail } from "./screens/";
// extra screens
import Tabs from "./navigation/tabs";

// views screens
import Campings from "./screens/Campings";
import Settings from "./screens/Settings";
import Donation from "./screens/Donation";


//auth screens
import AuthLanding from "./Auth/AuthLanding";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import ForgotPassword from "./Auth/ForgotPassword";

import * as ICONS from '@expo/vector-icons'


// upload post
import PostUpload from "./components/PostUpload";

// constants
import { COLORS, icons } from "./constants";

import { fetchUser } from "./modules/data";

import { useDispatch, useSelector } from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Drawer = createDrawerNavigator();
export default function Main() {  

    const user = useSelector(state => state.data.currentUser)

    const dispatch = useDispatch();

    useEffect(() => {
      (async () => {
        const user = await AsyncStorage.getItem('user');
        if(user){
            dispatch(fetchUser(JSON.parse(user)?._id));
        }
      })()
    }, [])

    const CustomDrawerContent = (props) => {
        return (
            <DrawerContentScrollView {...props}>
                <View style={{ flex: 1, paddingHorizontal: 20 }}>
                    <TouchableOpacity style={{ alignItems: 'flex-start', marginTop: 20 }} onPress={() => props.navigation.closeDrawer()}>
                        {user ? (
                        <Image source={{ uri: user?.image }} style={{ width: 60, height: 60, borderRadius: 30 }} /> 
                        ) : (
                         <ICONS.Ionicons name="person-circle-outline" size={60} color={COLORS.white} />
                        )}
                        {user ? (
                            <Text style={{ color: COLORS.white, fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>{user?.name}</Text>
                        ) : (
                            <Text style={{ color: COLORS.white, fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>Guest</Text>
                        )}
                    </TouchableOpacity>
                    <View style={{ marginTop: 30 }}>
                        <DrawerItem
                            label="Home"
                            labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                            onPress={() => props.navigation.navigate('Home')}
                            icon={() => <ICONS.Ionicons name="home" size={24} color={COLORS.white} />}
                        />
                        <DrawerItem
                            label="Plant Detail"
                            labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                            onPress={() => props.navigation.navigate('PlantDetail')}
                            icon={() => <ICONS.Ionicons name="leaf" size={24} color={COLORS.white} />}
                        />
                        <DrawerItem
                            label="Campings"
                            labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                            onPress={() => props.navigation.navigate('Campings')}
                            icon={() => <ICONS.Ionicons name="map" size={24} color={COLORS.white} />}
                        />
                        <DrawerItem
                            label="Settings"
                            labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                            onPress={() => props.navigation.navigate('Settings')}
                            icon={() => <ICONS.Ionicons name="settings" size={24} color={COLORS.white} />}
                        />
                        <DrawerItem
                            label="Donation"
                            labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                            onPress={() => props.navigation.navigate('Donation')}
                            icon={() => <ICONS.Ionicons name="cash" size={24} color={COLORS.white} />}
                        />
                        <DrawerItem
                            label="Post Upload"
                            labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                            onPress={() => props.navigation.navigate('Camera')}
                            icon={() => <ICONS.Ionicons name="cloud-upload" size={24} color={COLORS.white} />}
                        />
                    </View>
                </View>
            </DrawerContentScrollView>
        )
    }



    return (
       <View style={{ flex: 1 }}>
            <Drawer.Navigator
                screenOptions={{
                    headerShown: false,
                    drawerStyle: {
                        backgroundColor: COLORS.primary,
                    },
                    drawerActiveTintColor: COLORS.gray,
                    drawerInactiveTintColor: COLORS.white,
                    drawerActiveBackgroundColor: COLORS.primary,
                    drawerInactiveBackgroundColor: COLORS.primary,
                    drawerLabelStyle: {
                        fontSize: 15,
                        fontWeight: 'bold'
                    },
                    drawerItemStyle: { marginVertical: 5 },
                }}
                drawerContent={props => <CustomDrawerContent {...props} />}
                initialRouteName={'Main'}
            >
                {/* Tabs */}
                <Drawer.Screen name="Main" component={Tabs} options={{
                   drawerLabel : ({ focused }) => <Text style={{
                            color: focused ? COLORS.white : COLORS.gray,
                            fontSize: 15,
                            fontWeight: 'bold'

                   }}>Home</Text>,
                   title: 'Home',
                     drawerIcon: ({ focused }) => (
                        <ICONS.Ionicons name="home" size={24} color={focused ? COLORS.white : COLORS.gray} />
                        ),
                }}/>

                {/* Screens */}
                <Drawer.Screen name="PlantDetail" component={PlantDetail} options={{ 
                    headerShown: false,
                    drawerIcon: ({ focused }) => (
                        <ICONS.Ionicons name="leaf" size={24} color={focused ? COLORS.white : COLORS.gray} />
                        ),
                 }} />
                <Drawer.Screen name="Box" component={Campings} options={{
                     headerShown: false,
                        drawerIcon: ({ focused }) => (
                        <ICONS.Ionicons name="cube" size={24} color={focused ? COLORS.white : COLORS.gray} />
                        ),
                }} />
                <Drawer.Screen name="Settings" component={Settings} options={{ 
                    headerShown: false,
                    drawerIcon: ({ focused }) => (
                        <ICONS.Ionicons name="settings" size={24} color={focused ? COLORS.white : COLORS.gray} />
                        ),
                }} />

               
                <Drawer.Screen name="Donation" component={Donation} options={{ 
                    headerShown: false,
                    drawerIcon: ({ focused }) => (
                        <ICONS.Ionicons name="cash" size={24} color={focused ? COLORS.white : COLORS.gray} />
                        ),
                }} />

                  {/* views Screens */}
                <Drawer.Screen name="PostUpload" component={PostUpload} options={{ 
                    headerShown: false,
                    drawerItemStyle: { height: 0 }
                }}
                />

                {/* Auth Screens */}
                <Drawer.Screen name="AuthLanding" component={AuthLanding} options={{ 
                    headerShown: false,
                    drawerItemStyle: { height: 0 }
                }}/>
                <Drawer.Screen name="Login" component={Login} 
                options={{
                    headerShown: false,
                    drawerItemStyle: { height: 0 }
                }}/>
                <Drawer.Screen name="Signup" component={Signup} options={{
                    headerShown: false,
                    drawerItemStyle: { height: 0 }
                }}/>
                <Drawer.Screen name="ForgotPassword" component={ForgotPassword} options={{
                    headerShown: false,
                    drawerItemStyle: { height: 0 }
                }}/>
                
            </Drawer.Navigator>
       </View>
                    
    );
};




