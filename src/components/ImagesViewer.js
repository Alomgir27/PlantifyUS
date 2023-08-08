import React , { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { COLORS } from "../constants/index";
import Swiper from 'react-native-swiper';



const ImagesViewer = ({ route, images, resizeMode, imageStyle, containerStyle, navigation, item, routeName }) => {
    const [index, setIndex] = useState(0);

   

    
    return (
        <View style={[styles.wrapper, containerStyle]}>
            <Swiper
                style={styles.wrapper}
                showsButtons={true}
                loop={false}
                index={index}
                onIndexChanged={(index) => setIndex(index)}
            >
                {images?.map((image, index) => (
                <TouchableWithoutFeedback style={styles.slide} key={index} onPress={() => navigation.navigate('ImageDetails', { image, item, routeName })}>
                    <Image
                        source={{ uri: image?.uri ? image?.uri : image }}
                        resizeMode={resizeMode ? resizeMode : 'cover'}
                        style={[styles.image, imageStyle]}
                    />
                </TouchableWithoutFeedback>
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
