import React, { useState } from "react";
import {  View, Text } from "react-native";
import { createDrawerNavigator } from '@react-navigation/drawer';

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


// upload post
import PostUpload from "./components/PostUpload";

// constants
import { COLORS } from "./constants";


const Drawer = createDrawerNavigator();
export default function Main() {  
    return (
       <View style={{ flex: 1 }}>
            <Drawer.Navigator
                screenOptions={{
                    headerShown: false,
                    drawerStyle: {
                        backgroundColor: COLORS.primary,
                    },
                    drawerActiveTintColor: COLORS.gray,
                    drawerInactiveTintColor: COLORS.white
                }}
                initialRouteName={'Main'}
                
            >
                {/* Tabs */}
                <Drawer.Screen name="Main" component={Tabs} options={{
                   drawerLabel : ({ focused }) => <Text style={{
                            color: focused ? COLORS.white : COLORS.gray,
                            fontSize: 15,
                            fontWeight: 'bold'

                   }}>Home</Text>,
                   title: 'Home'
                }}/>

                {/* Screens */}
                <Drawer.Screen name="PlantDetail" component={PlantDetail} options={{ headerShown: false }} />
                <Drawer.Screen name="Box" component={Campings} options={{ headerShown: false}} />
                <Drawer.Screen name="Settings" component={Settings} options={{ headerShown: false}} />

                {/* views Screens */}
                <Drawer.Screen name="PostUpload" component={PostUpload} options={{ 
                    headerShown: false,
                    drawerItemStyle: { height: 0 }
                }}
                />
                <Drawer.Screen name="Donation" component={Donation} options={{ headerShown: false}} />


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




