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
    Chat,
    Components,
    Notifications,
    NotificationsSettings,
    Privacy,
    Profile,
    Register,
    Rental,
    Rentals,
    Shopping,
    ViewOrganization,
} from "./screens";

import Tabs from "./navigation/tabs";

// constants
import { COLORS } from "./constants/index";
import { fetchUser, fetchAllDefaultData, clearData } from "./modules/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setMyLocation, setLocation } from "./modules/campings";
import * as Location from 'expo-location';
import * as ICONS from '@expo/vector-icons'
import { Text as Text2 } from './components';


const Drawer = createDrawerNavigator();
export default function Main() {  

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
                            <Text style={{ color: COLORS.white, fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>Hello, Guest</Text>
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
                            label="Profile"
                            labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                            onPress={() => props.navigation.navigate('Profile')}
                            icon={() => <ICONS.Ionicons name="person" size={24} color={COLORS.white} />}
                        />
                        <DrawerItem
                            label="Campings"
                            labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                            onPress={() => props.navigation.navigate('Campings')}
                            icon={() => <ICONS.Ionicons name="map" size={24} color={COLORS.white} />}
                        />
                        <DrawerItem
                            label="Events"
                            labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                            onPress={() => props.navigation.navigate('Events')}
                            icon={() => <ICONS.Ionicons name="calendar" size={24} color={COLORS.white} />}
                        />
                        <DrawerItem
                            label="Chat"
                            labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                            onPress={() => props.navigation.navigate('Chat')}
                            icon={() => <ICONS.Ionicons name="chatbubbles" size={24} color={COLORS.white} />}
                        />
                        <DrawerItem
                            label="Organizations"
                            labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                            onPress={() => props.navigation.navigate('Organizations')}
                            icon={() => <ICONS.Ionicons name="people" size={24} color={COLORS.white} />}
                        />
                        <DrawerItem
                            label="Notifications"
                            labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                            onPress={() => props.navigation.navigate('Notifications')}
                            icon={() => <ICONS.Ionicons name="notifications" size={24} color={COLORS.white} />}
                        />
                        <DrawerItem
                            label="Saved"
                            labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                            onPress={() => props.navigation.navigate('Saved')}
                            icon={() => <ICONS.Ionicons name="bookmark" size={24} color={COLORS.white} />}
                        />
                        
                        
                        <DrawerItem
                            label="Components"
                            labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                            onPress={() => props.navigation.navigate('Components')}
                            icon={() => <ICONS.Ionicons name="construct" size={24} color={COLORS.white} />}
                        />
                        
                        <DrawerItem
                            label="Profile"
                            labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                            onPress={() => props.navigation.navigate('Profile')}
                            icon={() => <ICONS.Ionicons name="person" size={24} color={COLORS.white} />}
                        />
                        <DrawerItem
                            label="Rental"
                            labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                            onPress={() => props.navigation.navigate('Rental')}
                            icon={() => <ICONS.Ionicons name="car-sport" size={24} color={COLORS.white} />}
                        />
                        <DrawerItem
                            label="Rentals"
                            labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                            onPress={() => props.navigation.navigate('Rentals')}
                            icon={() => <ICONS.Ionicons name="car-sport" size={24} color={COLORS.white} />}
                        />
                        
                        <DrawerItem
                            label="Shopping"
                            labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                            onPress={() => props.navigation.navigate('Shopping')}
                            icon={() => <ICONS.Ionicons name="cart" size={24} color={COLORS.white} />}
                        />

                        {/* auth screens */}
                        {!user && (
                            <>
                             <DrawerItem
                             label="Login"
                             labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                             onPress={() => props.navigation.navigate('Login')}
                             icon={() => <ICONS.Ionicons name="log-in" size={24} color={COLORS.white} />}
                            />
                            <DrawerItem
                                label="Signup"
                                labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                                onPress={() => props.navigation.navigate('Signup')}
                                icon={() => <ICONS.Ionicons name="person-add" size={24} color={COLORS.white} />}
                            />
                         </>
                         )}
                         
                         <DrawerItem
                            label="Donation"
                            labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                            onPress={() => props.navigation.navigate('Donation')}
                            icon={() => <ICONS.Ionicons name="cash" size={24} color={COLORS.white} />}
                        />
                        <DrawerItem
                            label="Settings"
                            labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                            onPress={() => props.navigation.navigate('Settings')}
                            icon={() => <ICONS.Ionicons name="settings" size={24} color={COLORS.white} />}
                        />
                        {/* organizations */}
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                            <Text style={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}>Organizations</Text>
                        </View>
                        {organizations?.map((item, index) => (
                            <DrawerItem
                                key={index}
                                label={() => <View>
                                    <Text2 numberOfLines={1}> {item?.name}</Text2>
                                    <Text numberOfLines={1} style={{ color: COLORS.gray }}> {item?.bio}</Text>
                                </View>}

                                labelStyle={{ color: COLORS.white, fontSize: 15, fontWeight: 'bold' }}
                                onPress={() => props.navigation.navigate('OrganizationDetail', { organization: item })}
                                icon={() => <Image source={{ uri: item?.images[0] }} style={{ width: 40, height: 40, borderRadius: 20 }} />}
                            />
                        ))}


                        <View style={{ height: 50 }}></View>

                        
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
                                    <Text style={{ marginLeft: 10 }}>Google</Text>
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
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }} onPress={() => {
                                    AsyncStorage.removeItem('user');
                                    dispatch(clearData());
                                    props.navigation.closeDrawer();
                                }}>
                                    <ICONS.Ionicons name="log-out" size={24} color={COLORS.primary} />
                                    <Text style={{ marginLeft: 10 }}>Logout</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                         </>
                         )}

                        <View style={{ height: 50 }}></View>
                    </View>
                </View>
            </DrawerContentScrollView>
        )
    }



    return (
       <View style={style.container}>
            <Drawer.Navigator
                screenOptions={style.screenOptions}
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
                <Drawer.Screen name="Profile" component={ProfileScreen} options={{
                    headerShown: false,
                    drawerItemStyle: { height: 0 }
                }}/>
                <Drawer.Screen name="Events" component={EventsScreen} options={{
                    drawerItemStyle: { height: 0 }
                }}/>
                <Drawer.Screen name="Event" component={EventDetailsScreen} options={{
                    drawerItemStyle: { height: 0 }
                }}/>
                <Drawer.Screen name="ImageDetails" component={ImageDetails} options={{
                    drawerItemStyle: { height: 0 }
                }}/>
                <Drawer.Screen name="Posts" component={PostsScreen} options={{
                    drawerItemStyle: { height: 0 }
                }}/>
                <Drawer.Screen name="Organizations" component={OrganizationsScreen} options={{
                    drawerItemStyle: { height: 0 }
                }}/>
                <Drawer.Screen name="Images" component={Images} options={{
                    drawerItemStyle: { height: 0 }
                }}/>
                <Drawer.Screen name="TreeIdentify" component={TreeIdentify} options={{
                    drawerItemStyle: { height: 0 }
                }}/>
                <Drawer.Screen name="About" component={About} options={{
                    drawerItemStyle: { height: 0 }
                }}/>
                <Drawer.Screen name="Agreement" component={Agreement} options={{
                    drawerItemStyle: { height: 0 }
                }}/>
                <Drawer.Screen name="Chat" component={Chat} options={{
                    drawerItemStyle: { height: 0 }
                }}/>
                <Drawer.Screen name="Components" component={Components} options={{
                    drawerItemStyle: { height: 0 }
                }}/>
                <Drawer.Screen name="Notifications" component={Notifications} options={{
                    drawerItemStyle: { height: 0 }
                }}/>
                <Drawer.Screen name="NotificationsSettings" component={NotificationsSettings} options={{
                    drawerItemStyle: { height: 0 }
                }}/>
                <Drawer.Screen name="Privacy" component={Privacy} options={{
                    drawerItemStyle: { height: 0 }
                }}/>
                <Drawer.Screen name="Register" component={Register} options={{
                    drawerItemStyle: { height: 0 }
                }}/>
                <Drawer.Screen name="Rental" component={Rental} options={{
                    drawerItemStyle: { height: 0 }
                }}/>
                <Drawer.Screen name="Rentals" component={Rentals} options={{
                    drawerItemStyle: { height: 0 }
                }}/>
                <Drawer.Screen name="Shopping" component={Shopping} options={{
                    drawerItemStyle: { height: 0 }
                }}/>
                <Drawer.Screen name="Organization" component={ViewOrganization} options={{
                    drawerItemStyle: { height: 0 },
                    headerShown: true,
                    headerTitle: 'Organization'
                }}/>
               
                
            </Drawer.Navigator>
       </View>
                    
    );
};


const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    screenOptions: {
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
    }
})
