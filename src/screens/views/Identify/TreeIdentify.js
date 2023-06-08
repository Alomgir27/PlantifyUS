import React , { useEffect, useState } from "react";
import { COLORS } from "../../../constants";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as ICONS from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { API_URL } from "../../../constants";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
import { Linking } from 'react-native';
import { ActivityIndicator } from "react-native-paper";



const { width, height } = Dimensions.get('window');

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const TreeIdentify = ({ navigation }) => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [treeData, setTreeData] = useState(null);
    const [error, setError] = useState(null);



    const handleSelectImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
            else {
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    quality: 1,
                    base64: true
                });
                if (!result.canceled) {
                    setImage(result);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }


    const handleTakeImage = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
            else {
                let result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    quality: 1,
                    base64: true
                });
                if (!result.canceled) {
                    setImage(result);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }


    const handleIdentify = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('image', {
                uri: image.uri,
                type: 'image/jpeg',
                name: 'image.jpg'
            });
            await axios.post(`${API_URL}/identify`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                setTreeData(res.data);
                console.log(res.data);
                setLoading(false);
            }).catch((err) => {
                setError(err.message);
                console.log(err)
                setLoading(false);
            });
           
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }

    const handleReset = () => {
        setImage(null);
        setTreeData(null);
        setError(null)
    }

    

    

    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ICONS.Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Identify Tree</Text>
            </View>
            <ScrollView>
            <View style={styles.body}>
              {!treeData && (<>
                    <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 16 }}>Upload an image of a tree to identify it.</Text>
                    <Text style={{ fontFamily: 'Roboto-Regular', marginTop: 10 }}>Note: The image should be of a tree and not a leaf or flower. The image should be clear and not blurry.</Text>
                    <View style={styles.imageContainer}>
                        {image ? (
                            <Image source={{ uri: image.uri }} style={styles.image} />
                        ) : (
                            <Text>No Image Selected</Text>
                        )}
                    </View>
                </>)}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleSelectImage}>
                        <Text style={styles.buttonText}>Select Image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleTakeImage}>
                        <Text style={styles.buttonText}>Take Image</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleIdentify}>
                        <Text style={styles.buttonText}>Identify</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleReset}>
                        <Text style={styles.buttonText}>Reset</Text>
                    </TouchableOpacity>
                </View>
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color={COLORS.primary} />
                        <Text style={styles.loadingText}>Identifying...</Text>
                    </View>
                )}
                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
                {treeData && (
                    <View style={styles.treeContainer}>
                        <View style={styles.treeImageContainer}>
                            <Image source={{ uri: image?.uri }} style={styles.treeImage} />
                        </View>
                        <View style={styles.externalLinkContainer}>
                            <TouchableOpacity onPress={() => Linking.openURL(treeData[0].url)}>
                                <Text style={styles.externalLinkText}>More Info</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.treeDetailsContainer}>
                            <Text style={styles.treeName}>{treeData[0].name}</Text>
                            <Text style={styles.treeScientificName}>{treeData[0].genus} {treeData[0].family}</Text>
                            <Text style={styles.treeDescription}>{treeData[0].description}</Text>
                            <Text style={styles.treeDetails}>Common Name: {treeData[0].commonName}</Text>
                            <Text style={styles.treeDetails}>Family: {treeData[0].family}</Text>
                            <Text style={styles.treeDetails}>Genus: {treeData[0].genus}</Text>
                            <Text style={styles.treeDetails}>Probability: {treeData[0].probability}</Text>
                        </View>
                    </View>
                )}
            </View>
            </ScrollView>
        </View>
    );
}


                        


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray
    },
    headerTitle: {
        marginLeft: 10,
        fontSize: 20,
        fontFamily: 'Roboto-Bold'
    },
    body: {
        flex: 1,
        padding: 10
    },
    imageContainer: {
        width: width - 20,
        height: 200,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: width - 20,
        height: 200,
        borderRadius: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    button: {
        width: width / 2 - 20,
        height: 50,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: COLORS.white,
        fontFamily: 'Roboto-Bold'
    },
    loadingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    loadingText: {
        marginLeft: 10,
        fontFamily: 'Roboto-Bold'
    },
    errorContainer: {
        marginTop: 10
    },
    errorText: {
        color: COLORS.red,
        fontFamily: 'Roboto-Bold'
    },
    treeContainer: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: 10,
        padding: 10
    },
    treeImageContainer: {
        width: width - 40,
        height: 200,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    treeImage: {
        width: width - 40,
        height: 200,
        borderRadius: 10
    },
    externalLinkContainer: {
        marginTop: 10,
        alignItems: 'flex-end'
    },
    externalLinkText: {
        color: COLORS.primary,
        fontFamily: 'Roboto-Bold'
    },
    treeDetailsContainer: {
        marginTop: 10
    },
    treeName: {
        fontFamily: 'Roboto-Bold',
        fontSize: 20
    },
    treeScientificName: {
        fontFamily: 'Roboto-Bold',
        fontSize: 16,
        color: COLORS.gray
    },
    treeDescription: {
        marginTop: 10,
        fontFamily: 'Roboto-Regular'
    },
    treeDetails: {
        marginTop: 10,
        fontFamily: 'Roboto-Regular'
    }
});

export default TreeIdentify;