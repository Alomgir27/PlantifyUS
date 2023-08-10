import React, { useEffect } from 'react';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetHandle,
} from '@gorhom/bottom-sheet';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, SafeAreaView, ScrollView, TextInput, Alert } from 'react-native';


import { COLORS } from "../constants/index";

import * as ImagePicker from "expo-image-picker";

import { useSelector } from 'react-redux';


const BottomSheet = ({ navigation, sheetRef }) => {
  const snapPoints = React.useMemo(() => ['25%', '50%'], []);
  const user = useSelector(state => state?.data?.currentUser);


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
      if(!user) {
        return Alert.alert("Please login to create event", "You can login from profile tab");
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 0.5,
        allowsMultipleSelection: true,
      });


      if (!result.canceled) {
        navigation.navigate("PostUpload", { images: result.assets });
        sheetRef.current?.close();
      }
    };


    const takePhotoFromCamera = async () => {
      if(!user) {
        return Alert.alert("Please login to create event", "You can login from profile tab");
      }
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 0.5,
        allowsMultipleSelection: true,
      });


      if (!result.canceled) {
        navigation.navigate("PostUpload", { images: result.assets });
        sheetRef.current?.close();
      }
    };

    const onSheetChanges = React.useCallback((index) => {
      console.log('handleSheetChanges', index);
    }, []);





  
  return (
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
        handleIndicatorStyle={{
          backgroundColor: COLORS.gray,
          width: 40,
          height: 4,
          borderRadius: 4,
        }}
        handleStyle={{
          backgroundColor: COLORS.primary,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        style={{
          backgroundColor: COLORS.white,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          
        }}
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
              <Text style={styles.panelTitle}>Upload Photo</Text>
              <Text style={{color: COLORS.gray, fontSize: 12, marginBottom: 10}}>Multiple photos can be uploaded except for organization</Text>
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
    borderRadius: 4,
    backgroundColor: COLORS.gray,
    marginBottom: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: COLORS.white,
    paddingTop: 0,
  },
  panelTitle: {
    fontSize: 27,
    height: 40,
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
