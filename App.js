import React, { useEffect, useState } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import { Platform, StatusBar} from "react-native";

// Main
import Main from "./src/Main";

import store from "./src/modules";

import { Provider } from "react-redux";


import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';



import { Provider as  PaperProvider } from "react-native-paper";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';






const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        border: "transparent",
    },
};


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

    useEffect(() => {
        (async () => {
            await SplashScreen.preventAutoHideAsync();
            await loadFonts();
            await SplashScreen.hideAsync();
            setFontLoaded(true);
        })();
    }, []);

    if (!fontLoaded) {
        return null;
    }

    
    return (
        <NavigationContainer theme={theme}>
             <PaperProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <Provider store={store}>
                        <StatusBar barStyle="dark-content" />
                         <BottomSheetModalProvider>
                           <Main />
                        </BottomSheetModalProvider>
                    </Provider>
                </GestureHandlerRootView>
            </PaperProvider>
        </NavigationContainer>
    );
};




