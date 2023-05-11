
import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView } from "react-native";
import Swiper from 'react-native-swiper';
import * as Icon from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { COLORS } from "../constants";
import { TextInput } from "react-native-paper";




export default function PostUpload({ navigation, route }) { 

    const [images, setImages] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [organization, setOrganization] = useState("");
    const [event, setEvent] = useState("");
    const [type, setType] = useState("");

   
    


    useEffect(() => {
        if (route.params?.images) {
            setImages(route.params.images);
        }
    }, [route.params?.images]);


    const handleSubmit = async () => {
        const data = new FormData();
        data.append("name", name);
        data.append("title", title);
        data.append("description", description);
        data.append("location", location);
        data.append("organization", organization);
        data.append("type", type);
        images.forEach((image, index) => {
            data.append("images", {
                name: `image${index}`,
                type: image.type,
                uri: image.uri,
            });
        });
    };




    const renderImages = () => {
        return (
            <Swiper
                style={styles.wrapper}
                dotStyle={{
                    backgroundColor: "#000",
                    borderColor: "#000",
                    borderWidth: 1,
                    width: 10,
                    height: 10,
                    borderRadius: 10,
                }}
                activeDotColor="#fff"
                activeDotStyle={{
                    borderColor: "#000",
                    borderWidth: 1,
                    width: 10,
                    height: 10,
                    borderRadius: 10,
                }}

            >
                {images.map((image, index) => (
                    <View key={index} style={styles.slide}>
                        <Image
                            source={{ uri: image.uri }}
                            resizeMode="cover"
                            style={styles.image}
                        />
                    </View>
                ))}
            </Swiper>
        );
    };

    const ComponentOne = () => {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => currentStep === 0 ? navigation.goBack() : setCurrentStep(currentStep - 1)}
                    >
                        <Icon.Ionicons name="md-arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.nextButton} onPress={() => setCurrentStep(1)}>
                        <Text style={styles.nextButtonText}>Next</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.imageContainer}>
                    {images.length > 0 ? renderImages() : null}
                </View>
            </SafeAreaView>
        );
    };

    const ComponentTwo = () => {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => setCurrentStep(0)}
                    >
                        <Icon.Ionicons name="md-arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.nextButton} onPress={() => setCurrentStep(2)} disabled={type === ""}>
                        <Text style={styles.nextButtonText}>Next</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.chooseContainer}>
                    <Text style={styles.chooseText}>Choose a type</Text>
                </View>
                <View style={styles.typeContainer}>
                    <TouchableOpacity
                        style={[styles.typeButton, type === "newEvent" ? styles.activeTypeButton : null]}
                        onPress={() => setType("newEvent")}
                    >
                        <Text style={[styles.typeButtonText, type === "newEvent" ? styles.activeTypeButtonText : null]}>New Event</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.typeButton, type === "newPost" ? styles.activeTypeButton : null]}
                        onPress={() => setType("newPost")}
                    >
                        <Text style={[styles.typeButtonText, type === "newPost" ? styles.activeTypeButtonText : null]}>New Post</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.typeButton, type === "newTree" ? styles.activeTypeButton : null]}
                        onPress={() => setType("newTree")}
                    >
                        <Text style={[styles.typeButtonText, type === "newTree" ? styles.activeTypeButtonText : null]}>New Tree</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const ComponentThree = () => {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => setCurrentStep(1)}
                    >
                        <Icon.Ionicons name="md-arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    
                </View>
                <View style={styles.formContainer}>
                    <ScrollView>
                        <View style={styles.formItem}>
                            <Text style={styles.formLabel}>Name</Text>
                            <TextInput
                                placeholder="Enter name"
                                placeholderTextColor="#666"
                                style={styles.formInput}
                                value={name}
                                onChangeText={(text) => setName(text)}

                            />
                        </View>
                        <View style={styles.formItem}>
                            <Text style={styles.formLabel}>Title</Text>
                            <TextInput
                                placeholder="Enter title"
                                placeholderTextColor="#666"
                                style={styles.formInput}
                                value={title}
                                onChangeText={(text) => setTitle(text)}
                            />
                        </View>
                        <View style={styles.formItem}>
                            <Text style={styles.formLabel}>Description</Text>
                            <TextInput
                                placeholder="Enter description"
                                placeholderTextColor="#666"
                                style={styles.formInput}
                                value={description}
                                onChangeText={(text) => setDescription(text)}
                            />
                        </View>
                        <View style={styles.formItem}>
                            <Text style={styles.formLabel}>Location</Text>
                            <TextInput
                                placeholder="Enter location"
                                placeholderTextColor="#666"
                                style={styles.formInput}
                                value={location}
                                onChangeText={(text) => setLocation(text)}
                            />
                        </View>
                        <View style={styles.formItem}>
                            <Text style={styles.formLabel}>Organization</Text>
                            <TextInput
                                placeholder="Enter organization"
                                placeholderTextColor="#666"
                                style={styles.formInput}
                                value={organization}
                                onChangeText={(text) => setOrganization(text)}
                            />
                        </View>
                    </ScrollView>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };



    const renderComponent = () => {
        switch (currentStep) {
            case 0:
                return <ComponentOne />;
            case 1:
                return <ComponentTwo />;
            case 2:
                return <ComponentThree />;
            default:
                return <ComponentOne />;
        }
    };
   
   

    return (
        <View style={styles.container}>
           {renderComponent()}
        </View>
    );
}
             




const styles = StyleSheet.create({
    container: {
        backgroundColor: "#000",
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
    },
    backButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(21,22,48,0.1)",
        justifyContent: "center",
        alignItems: "center",
    },
    nextButton: {
        width: 80,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.secondary,
        justifyContent: "center",
        alignItems: "center",

    },
    nextButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
    imageContainer: {
        flex: 1,
    },
    slide: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",

    },
    typeContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

    },
    typeButton: {
        width: 300,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#212121",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
    typeButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
    formContainer: {
        flex: 1,
        padding: 15,
    },
    formItem: {
        marginBottom: 15,
    },
    formLabel: {
        color: "#666",
        marginBottom: 5,
    },
    formInput: {
        width: "100%",
        height: 40,
        backgroundColor: "#212121",
        borderRadius: 5,
        paddingHorizontal: 10,
        color: "#fff",
    },
    stepStyle: {
        display: "none",
    },
    activeTypeButton: {
        backgroundColor: COLORS.secondary,
    },
    submitButton: {
        width: "100%",
        height: 50,
        borderRadius: 5,
        backgroundColor: COLORS.secondary,
        justifyContent: "center",
        alignItems: "center",
    },
    submitButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
    chooseContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
    chooseButton: {
        width: "48%",
        height: 50,
        borderRadius: 5,
        backgroundColor: "#212121",
        justifyContent: "center",
        alignItems: "center",
    },
    chooseButtonText: {
        color: 'white',
        fontWeight: "600",
    },
    activeChooseButton: {
        backgroundColor: COLORS.secondary,
    },
    activeChooseButtonText: {
        color: "#fff",
    },
    chooseText: {
        color: "#666",
        marginBottom: 5,
    },
});


