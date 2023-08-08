// import 'react-native-gesture-handler';
// import React, { useEffect, useState } from "react";
// import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

// import { Platform, StatusBar} from "react-native";

// // Main
// import Main from "./src/Main";

// import store from "./src/modules";

// import { Provider } from "react-redux";


// import * as Font from 'expo-font';
// import * as SplashScreen from 'expo-splash-screen';

// import { Provider as  PaperProvider } from "react-native-paper";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

// import { DataProvider } from './src/hooks';
// import AppNavigation from './src/navigation/App';



// const theme = {
//     ...DefaultTheme,
//     colors: {
//         ...DefaultTheme.colors,
//         border: "transparent",
//     },
// };


// export default function App() {
//     return (
//     //  <DataProvider>
//          <NavigationContainer theme={theme}>
//              <PaperProvider>
//                 <GestureHandlerRootView style={{ flex: 1 }}>
//                     <Provider store={store}>
//                         <StatusBar barStyle="dark-content" />
//                          <BottomSheetModalProvider> 
//                            <Main />
//                            {/* <AppNavigation /> */}
//                         </BottomSheetModalProvider>
//                     </Provider>
//                 </GestureHandlerRootView>
//             </PaperProvider>
//         </NavigationContainer> 
//     // </DataProvider>
//     );
// };




import 'react-native-gesture-handler';
import React from 'react';

import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { DataProvider } from './src/hooks';

import { Provider } from 'react-redux';
import store from './src/modules';

import AppNavigation from './src/navigation/App';
import { StatusBar } from 'react-native';



export default function App() {
  return (
    <DataProvider>
        <PaperProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Provider store={store}>
              <BottomSheetModalProvider>
                <AppNavigation />
              </BottomSheetModalProvider>
            </Provider>
          </GestureHandlerRootView>
        </PaperProvider>
     </DataProvider>
  );
}