import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import { LogBox } from "react-native";
import { Platform, StatusBar, StyleSheet, View } from "react-native";


// screens
import { PlantDetail } from "./src/screens/";
// extra screens
import Tabs from "./src/navigation/tabs";

import Campings from "./src/screens/Campings";
import Settings from "./src/screens/Settings";

import store from "./src/modules";

import { Provider } from "react-redux";


import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

import Login from "./src/Auth/Login";
import Signup from "./src/Auth/Signup";
import ForgotPassword from "./src/Auth/ForgotPassword";

// upload post
import PostUpload from "./src/screens/PostUpload";

import { Provider as  PaperProvider } from "react-native-paper";

import { GestureHandlerRootView } from "react-native-gesture-handler";


LogBox.ignoreLogs(["expo-app-loading"]);




const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        border: "transparent",
    },
};

const Stack = createStackNavigator();

export default function App() {
   const [fontLoaded, setFontLoaded] = useState(false);

   const loadFonts = async () => {
        await Font.loadAsync({
            'Roboto-Black': require('./assets/fonts/Roboto-Black.ttf'),
            'Roboto-BlackItalic': require('./assets/fonts/Roboto-BlackItalic.ttf'),
            'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
            'Roboto-BoldItalic': require('./assets/fonts/Roboto-BoldItalic.ttf'),
            'Roboto-Italic': require('./assets/fonts/Roboto-Italic.ttf'),
            'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
            'Roboto-LightItalic': require('./assets/fonts/Roboto-LightItalic.ttf'),
            'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
            'Roboto-MediumItalic': require('./assets/fonts/Roboto-MediumItalic.ttf'),
            'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
            'Roboto-Thin': require('./assets/fonts/Roboto-Thin.ttf'),
            'Roboto-ThinItalic': require('./assets/fonts/Roboto-ThinItalic.ttf'),
            'RobotoCondensed-Bold': require('./assets/fonts/RobotoCondensed-Bold.ttf'),
            'RobotoCondensed-BoldItalic': require('./assets/fonts/RobotoCondensed-BoldItalic.ttf'),
            'RobotoCondensed-Italic': require('./assets/fonts/RobotoCondensed-Italic.ttf'),
            'RobotoCondensed-Light': require('./assets/fonts/RobotoCondensed-Light.ttf'),
            'RobotoCondensed-LightItalic': require('./assets/fonts/RobotoCondensed-LightItalic.ttf'),
            'RobotoCondensed-Regular': require('./assets/fonts/RobotoCondensed-Regular.ttf'),
            'SpaceMono-Regular': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });
    };


    if (!fontLoaded) {
        return (
          <AppLoading
            startAsync={loadFonts}
            onFinish={() => setFontLoaded(true)}
            onError={console.warn}
          />
        );
      }

    return (
        <NavigationContainer theme={theme}>
           <GestureHandlerRootView style={{ flex: 1 }}>
                <PaperProvider>
                    <Provider store={store}>
                        <StatusBar barStyle="default" />
                            <Stack.Navigator
                                screenOptions={{
                                    headerShown: false
                                }}
                                initialRouteName={'Home'}
                            >
                                {/* Tabs */}
                                <Stack.Screen name="Home" component={Tabs} />

                                {/* Screens */}
                                <Stack.Screen name="PlantDetail" component={PlantDetail} options={{ headerShown: false }} />
                                <Stack.Screen name="Box" component={Campings} options={{ headerShown: false}} />
                                <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false}} />
                                
                                {/* Extra Screens */}
                                <Stack.Screen name="Login" component={Login} />
                                <Stack.Screen name="Signup" component={Signup} />
                                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                                <Stack.Screen name="PostUpload" component={PostUpload} />

                            </Stack.Navigator>
                    </Provider>
                </PaperProvider>
            </GestureHandlerRootView>
        </NavigationContainer>
    );
};




