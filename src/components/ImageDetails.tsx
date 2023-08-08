import React from "react";
import { View, Text, TouchableOpacity, Image , StyleSheet } from 'react-native';
import { COLORS } from "../constants/index";

import * as ICONS from "@expo/vector-icons";



const ImageDetails = ({ route, navigation}) => {
    const { image, item, routeName } = route.params;


    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={{ position: 'absolute', top: 20, right: 20, zIndex: 1 }}
                onPress={() => navigation.navigate(routeName, { item })}
            >
                <ICONS.Ionicons name="close" size={30} color={COLORS.white} />
            </TouchableOpacity>

            <Image
                source={{ uri: image?.uri ? image?.uri : image }}
                resizeMode={'cover'}
                style={styles.image}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    image: {
        width: '100%',
        height: '100%',
    },

});

export default ImageDetails;
