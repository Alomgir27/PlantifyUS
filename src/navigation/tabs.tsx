import React, { useRef } from "react";
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Campings from "../screens/Campings";

import { Home, SearchScreen } from "../screens";

import BottomSheet from "../components/BottomSheet";

import { COLORS } from "../constants/index";

const Tab = createBottomTabNavigator();

const tabOptions = {
    showLabel: false,
    style: {
        height: "10%",
    },
};


const Tabs = ({ navigation}) => {

    const sheetRef = useRef(null);



    const CameraButton = () => {
        return (
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: COLORS.primary,
                }}
            >
                <Image
                    source={require('../../assets/icons/camera.png')}
                    resizeMode="contain"
                    style={{
                        flex: 1,
                        width: 23,
                        height: 23
                    }}
                />
            </View>
        );
    };

    const EmptyScreen = () => (
        <View />
    )
    

    const handlaCameraTabPress = () => {
        sheetRef.current?.present();
        return false;
    };



    return (
        <>
        <Tab.Navigator
            tabBarOptions={tabOptions}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    const tintColor = focused ? COLORS.primary : COLORS.gray;

                    switch (route.name) {
                        case "Home":
                            return (
                                <Image
                                    source={require('../../assets/icons/flash_icon.png')}
                                    resizeMode="contain"
                                    style={{
                                        flex: 1,
                                        tintColor: tintColor,
                                        width: 25,
                                        height: 25
                                    }}
                                />
                            );
                        case "Box":
                            return (
                                <Image
                                    source={require('../../assets/icons/cube_icon.png')}
                                    resizeMode="contain"
                                    style={{
                                        flex: 1,
                                        tintColor: tintColor,
                                        width: 25,
                                        height: 25
                                    }}
                                />
                            );
                        case "Camera":
                            return (
                                <CameraButton />
                            );
                        case "Search":
                            return (
                                <Image
                                    source={require('../../assets/icons/search_icon.png')}
                                    resizeMode="contain"
                                    style={{
                                        flex: 1,
                                        tintColor: tintColor,
                                        width: 25,
                                        height: 25
                                    }}
                                />
                            );
                        case "Favourite":
                            return (
                                <Image
                                    source={require('../../assets/icons/heart_icon.png')}
                                    resizeMode="contain"
                                    style={{
                                        flex: 1,
                                        tintColor: tintColor,
                                        width: 25,
                                        height: 25
                                    }}
                                />
                            );
                    }
                }
            })}
        >
            <Tab.Screen
                name="Home"
                component={Home}
            />
            <Tab.Screen
                name="Box"
                component={Campings}
            />
            <Tab.Screen
                name="Camera"
                options={{
                    tabBarButton: (props) => (
                        <TouchableOpacity {...props} onPress={handlaCameraTabPress} >
                            {props.children}
                        </TouchableOpacity>
                    )
                }}
                component={EmptyScreen}
             />
            <Tab.Screen
                name="Search"
                component={SearchScreen}
            />
            <Tab.Screen
                name="Favourite"
                component={Home}
            />
        </Tab.Navigator>
       <BottomSheet sheetRef={sheetRef} navigation={navigation} />
       </>
    );
};

export default Tabs;
