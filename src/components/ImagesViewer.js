import React , { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { COLORS } from "../constants";
import Swiper from 'react-native-swiper';


const ImagesViewer = ({ images, resize }) => {
    const [index, setIndex] = useState(0);
    
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.black }}>
            <Swiper
                style={styles.wrapper}
                showsButtons={true}
                loop={false}
                index={index}
                onIndexChanged={(index) => setIndex(index)}
            >
                {images.map((image, index) => (
                <View style={styles.slide} key={index}>
                    <Image
                    source={{ uri: image.uri ? image.uri : image }}
                    resizeMode={resize ? resize : 'cover'}
                    style={styles.image}
                    />
                </View>
                ))}
            </Swiper>
            <View style={styles.pagination}>
                <Text style={{ color: COLORS.white }}>
                {index + 1} / {images.length}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {},
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    pagination: {
        position: 'absolute',
        top: 40,
        right: 20,
    },
});

export default ImagesViewer;
