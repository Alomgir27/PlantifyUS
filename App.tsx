import 'react-native-gesture-handler';
import React, { useEffect} from 'react';

import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { DataProvider } from './src/hooks';

import { Provider } from 'react-redux';
import store from './src/modules';

import AppNavigation from './src/navigation/App';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


export default function App() {

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

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