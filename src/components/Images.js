import React , { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { COLORS } from "../constants/index";
import Swiper from 'react-native-swiper';
import * as ICONS from "@expo/vector-icons";


export default function Images({ route, navigation }) {
    const { images} = route.params;

    const [index, setIndex] = useState(0);

    useEffect(() => {
        if(route?.params?.index) {
            setIndex(route?.params?.index);
        }
    }, [route?.params?.index]);

    return (
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={{ position: 'absolute', top: 20, left: 20, zIndex: 1 }}
                    onPress={() => navigation.navigate('Posts')}
                >
                    <ICONS.Ionicons name="arrow-back" size={30} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            <Swiper
                showsButtons={true}
                loop={false}
                index={index}
                onIndexChanged={(index) => setIndex(index)}
            >
                {images?.map((image, index) => (
                    <TouchableWithoutFeedback style={styles.slide} key={index}>
                        <Image
                            source={{ uri: image?.uri ? image?.uri : image }}
                            resizeMode={'cover'}
                            style={styles.image}
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
    wrapper: {
        flex: 1,
        backgroundColor: COLORS.black,
    },
    header: {
        width: '100%',
        height: 80,
        backgroundColor: COLORS.black,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    pagination: {
        position: 'absolute',
        top: 40,
        right: 20,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },



});



