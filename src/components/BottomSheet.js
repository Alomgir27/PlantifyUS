import React, { useEffect } from 'react';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetHandle,
} from '@gorhom/bottom-sheet';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, SafeAreaView, ScrollView, TextInput } from 'react-native';


import { COLORS } from "../constants";

import * as ImagePicker from "expo-image-picker";

import { useSelector } from 'react-redux';


const BottomSheet = ({ navigation }) => {
  const [visible, setVisible] = React.useState(true);
  const sheetRef = React.useRef(null);
  const snapPoints = React.useMemo(() => ['25%', '50%'], []);

  const user = useSelector(state => state?.data?.currentUser);

  useEffect(() => {
    if(!user){
      setVisible(false);
      navigation.navigate("AuthLanding");
    }
  }, [user, navigation, visible]);

  useEffect(() => {
    sheetRef.current?.present();
    }, [visible]);

    useEffect(() => {
      (async () => {
        if (Platform.OS !== 'web') {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
      })();
    }, []);

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 0.5,
        allowsMultipleSelection: true,
      });

      console.log(result);

      if (!result.canceled) {
        navigation.navigate("PostUpload", { images: result.assets });
      }
    };


    const takePhotoFromCamera = async () => {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 0.5,
        allowsMultipleSelection: true,
      });

      console.log(result);

      if (!result.canceled) {
        navigation.navigate("PostUpload", { images: result.assets });
      }
    };

    const onSheetChanges = React.useCallback((index) => {
      console.log('handleSheetChanges', index);
      setVisible(index === -1 ? false : true);
      console.log('visible', visible);
    }, []);



 

  if(!visible) {
    return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity onPress={() => { setVisible(!visible) }} style={{backgroundColor: COLORS.primary, padding: 20, borderRadius: 10}}>
        <Text style={{color: COLORS.white}}>Create Event</Text>
      </TouchableOpacity>
    </View>
  }

  
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        index={1}
        backgroundComponent={BottomSheetBackdrop}
        handleComponent={BottomSheetHandle}
        backdropComponent={BottomSheetBackdrop}
        dismissOnPanDown={true}
        dismissOnTouchOutside={true}
        enableDismissOnClose={true}
        enablePanDownToClose={true}
        enableTouchThrough={true}
        animationDuration={500}
        animationEasing="ease-in-out"
        handleIndicatorStyle={{backgroundColor: COLORS.primary}}
        handleStyle={{backgroundColor: COLORS.primary}}
        style={{backgroundColor: COLORS.white}}
        backdropStyle={{backgroundColor: COLORS.black}}
        onChange={onSheetChanges}

      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.panelHeader}>
              <View style={styles.panelHandle} />
            </View>
          </View>
          <View style={styles.panel}>
            <View style={{alignItems: 'center'}}>
              {/* Tree plantation event creation */}
              <Text style={styles.panelTitle}>Create Event</Text>
              <Text style={styles.panelSubtitle}>Create a new event</Text>
            </View>
            <TouchableOpacity style={styles.panelButton} onPress={takePhotoFromCamera}>
              <Text style={styles.panelButtonTitle}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.panelButton} onPress={pickImage}>
              <Text style={styles.panelButtonTitle}>Choose From Library</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.panelButton}
              onPress={() => sheetRef.current?.close()}
            >
              <Text style={styles.panelButtonTitle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: 16,
    height: '100%',
  },
  header: {
    alignItems: 'center',
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 2,
    borderRadius: 4,
    backgroundColor: COLORS.gray,
    marginBottom: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: COLORS.white,
    paddingTop: 20,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});


export default BottomSheet;
