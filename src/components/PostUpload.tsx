
import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView,  ScrollView, Alert   } from "react-native";
import { Button } from "react-native-paper";

import Swiper from 'react-native-swiper';
import * as Icon from "@expo/vector-icons";
import { COLORS } from "../constants/index";
import { TextInput } from "react-native-paper";
import * as Location from 'expo-location';

import { API_URL } from "../constants/index";

import { db, auth, storage } from "../config/firebase";

import { useSelector, useDispatch } from "react-redux";

import axios from "axios";
import { ToastAndroid, Platform } from "react-native";



import { fetchEventsSearch } from "../modules/data";


export default function PostUpload({ navigation, route }) { 

    const [images, setImages] = useState([]);
    const [location, setLocation] = useState({
        type: 'Point',
        coordinates: [],
      })
    const [currentStep, setCurrentStep] = useState(0);
    const [type, setType] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [newEventForm, setEventForm] = useState({
        title: '',
        author: '',
        description: '',
        location: {
          type: 'Point',
          coordinates: [],
        },
        organizer: '',
        attendees: [],
        images: [],
        requirements: {
          trees: "",
          volunteers: "",
          funds: "",
        },
        landsDescription: '',
        status: '',
    });
    const [newPostForm, setNewPostForm] = useState({
        author: '',
        text: '',
        images: [],
        likes: [],
        comments: [],
        event: '',
        tags: []
    });
    const [newOrganizationForm, setNewOrganizationForm] = useState({
        name: '',
        volunteers: [],
        events: [],
        admin: '',
        moderators: [],
        images: [],
        bio: '',
        location: {
            type: 'Point',
            coordinates: [],
        },
        badges: [],
        notifications: [],
        isVerified: false,
        type: '',
    });
    const [newTreeForm, setNewTreeForm] = useState({
        name: '',
        scientificName: '',
        description: '',
        images: [],
        benefits: '',
        requirements: {
            sun: '',
            soil: '',
            water: '',
            temperature: '',
            fertilizer: '',
        },
    });

    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    const user = useSelector(state => state?.data?.currentUser)
    const eventsSearch = useSelector(state => state?.data?.eventsSearch);
    const mylocation = useSelector(state => state?.campings?.mylocation);

    const [isExisted, setIsExisted] = useState(false);


    const [eventTitle, setEventTitle] = useState("");
    const [inputValue, setInputValue] = useState('');

    const dispatch = useDispatch();


    useEffect(() => {
        (async () => {
            if(!mylocation.longitude && !mylocation.latitude){
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                }
    
                let location = await Location.getCurrentPositionAsync({});
                setEventForm({ ...newEventForm, location: { type: 'Point', coordinates: [location.coords.longitude, location.coords.latitude] } });
                setNewOrganizationForm({ ...newOrganizationForm, location: { type: 'Point', coordinates: [location.coords.longitude, location.coords.latitude] } });
            }
            else {
                setEventForm({ ...newEventForm, location: { type: 'Point', coordinates: [mylocation.longitude, mylocation.latitude] } });
                setNewOrganizationForm({...newOrganizationForm, location: { type: 'Point', coordinates: [mylocation.longitude, mylocation.latitude] } });
            }
        })();
    }, [mylocation.longitude, mylocation.latitude]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
            }

            let location = await Location.getCurrentPositionAsync({});
             setLocation({ type: 'Point', coordinates: [location.coords.latitude, location.coords.longitude] });
        })();
    }, []);



    useEffect(() => {
        if (route.params?.images) {
            setImages(route.params.images);
        } 
    }, [route.params?.images]);


    useEffect(() => {
        if(eventTitle !== ""){
            dispatch(fetchEventsSearch(eventTitle, 5));
        }
    }, [eventTitle])



    useEffect(() => {
        if(type === "newOrganization"){
            axios.get(`${API_URL}/organizations/exist/${newOrganizationForm.name}`)
            .then((response) => {
                console.log(response?.data?.message)
                setIsExisted(true);
            })
            .catch((error) => {
                console.log(error);
                setIsExisted(false);
            })
        }
    }, [newOrganizationForm.name])

    useEffect(() => {
        clearValues();
        setIsExisted(false);
        setLoading(false);
    }, [type])



    const clearValues = () => {
        setEventForm({
            ...newEventForm,
            title: '',
            description: '',
            author: '',
            organizer: '',
            attendees: [],
            images: [],
            requirements: {
              trees: "",
              volunteers: "",
              funds: "",
            },
            landsDescription: '',
            status: '',

        });
        
        setNewPostForm({
            ...newPostForm,
            author: '',
            text: '',
            images: [],
            likes: [],
            comments: [],
            event: '',
            tags: []
        });

        setNewOrganizationForm({
            ...newOrganizationForm,
            name: '',
            volunteers: [],
            events: [],
            admin: '',
            moderators: [],
            images: [],
            bio: '',
            badges: [],
            notifications: [],
            isVerified: false,
            type: '',
        });

        setNewTreeForm({
            ...newTreeForm,
            name: '',
            scientificName: '',
            description: '',
            images: [],
            benefits: '',
            requirements: {
                sun: '',
                soil: '',
                water: '',
                temperature: '',
                fertilizer: '',
            },
        });
    }

   
        

 // this function too much messy, need to refactor

    const handleSubmit = async () => {

        if(type === "newEvent"){
            if(newEventForm.title === "" || newEventForm.description === "" || newEventForm.landsDescription === "" || newEventForm.requirements.trees === "" || newEventForm.requirements.volunteers === "" || newEventForm.requirements.funds === ""){
                Alert.alert('Error', 'Please fill in all the fields', [
                    {
                        text: 'Ok',
                    },
                ])
                return;
            }
        } else if(type === "newPost"){
            if(newPostForm.text === "" || newPostForm.event === ""){
                Alert.alert('Error', 'Please fill in all the fields', [
                    {
                        text: 'Ok',
                    },
                ])
                return;
            }
        } else if(type === "newOrganization"){
            if(newOrganizationForm.name === "" || newOrganizationForm.bio === ""){
                Alert.alert('Error', 'Please fill in all the fields', [
                    {
                        text: 'Ok',
                    },
                ])
                return;
            }
        } else if(type === "newTree"){
            if(images.length > 1){
                Alert.alert('Error', 'Please upload only one image', [
                    {
                        text: 'Ok',
                    },
                ])
                return;
            }
            if(newTreeForm.name === "" || newTreeForm.scientificName === "" || newTreeForm.description === "" || newTreeForm.benefits === "" || newTreeForm.requirements.sun === "" || newTreeForm.requirements.soil === "" || newTreeForm.requirements.water === "" || newTreeForm.requirements.temperature === "" || newTreeForm.requirements.fertilizer === ""){
                Alert.alert('Error', 'Please fill in all the fields', [
                    {
                        text: 'Ok',
                    },
                ])
                return;
            }
        }

        setLoading(true);

        let imagesURL = [];
        images.forEach(async (image, index) => {
            const name = image.uri.split("/").pop();
            const response = await fetch(image.uri);
            const blob = await response.blob();
            const path = `images/${index} + ${name} + ${new Date().getTime()}`;
            await storage.ref().child(path).put(blob)
            .then(async (snapshot) => {
                await snapshot.ref.getDownloadURL()
                .then(async (downloadURL) => {
                    console.log('File available at', downloadURL);
                    imagesURL.push(downloadURL);
                })
                .catch((error) => {
                    console.log(error);
                })
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
                if(Platform.OS === "android"){
                    ToastAndroid.show("Error", ToastAndroid.SHORT);
                }
                return;
            })
            .finally(async () => {
                if(type === "newEvent"){
                    await axios.post(`${API_URL}/events/new`, {
                        ...newEventForm,
                        images: imagesURL,
                        author: user?._id
                    })
                    .then((response) => {
                        console.log(JSON.stringify(response));
                        setLoading(false);
                        setCurrentStep(0)
                        setType("");
                        setImages([]);
                        clearValues();
                        if(Platform.OS === "android"){
                            ToastAndroid.show("Event created successfully", ToastAndroid.SHORT);
                        }
                        navigation.navigate('Home')
                        
                    })
                    .catch((error) => {
                        console.log(error);
                        setLoading(false);
                        if(Platform.OS === "android"){
                            ToastAndroid.show("Error", ToastAndroid.SHORT);
                        }
                    });

                } else if(type === "newPost"){
                    await axios.post(`${API_URL}/posts/new`, {
                        ...newPostForm,
                        images: imagesURL,
                        author: user?._id
                    })
                    .then((response) => {
                        console.log(JSON.stringify(response));
                        setLoading(false);
                        setCurrentStep(0)
                        setType("");
                        setImages([]);
                        clearValues();
                        if(Platform.OS === "android"){
                            ToastAndroid.show("Post created successfully", ToastAndroid.SHORT);
                        }
                        navigation.navigate('Home')
                       
                    })
                    .catch((error) => {
                        console.log(error);
                        setLoading(false);
                        if(Platform.OS === "android"){
                            ToastAndroid.show("Error", ToastAndroid.SHORT);
                        }
                    });
                } else if(type === "newOrganization"){
                    await axios.post(`${API_URL}/organizations/new`,  {
                        ...newOrganizationForm,
                        images: imagesURL,
                        admin: user?._id
                    })
                    .then((response) => {
                        console.log(JSON.stringify(response));
                        setLoading(false);
                        setCurrentStep(0)
                        setType("");
                        setImages([]);
                        clearValues();
                        if(Platform.OS === "android"){
                            ToastAndroid.show("Organization created successfully, Please wait for the admin to verify your organization", ToastAndroid.SHORT);
                        }
                        navigation.navigate('Home')
                    })
                    .catch((error) => {
                        console.log(error);
                        setLoading(false);
                        if(Platform.OS === "android"){
                            ToastAndroid.show("Error", ToastAndroid.SHORT);
                        }
                    })
                } else if(type === "newTree"){
                    await axios.post(`${API_URL}/plants/new`, {
                        ...newTreeForm,
                        images: imagesURL
                    })
                    .then((response) => {
                        console.log(JSON.stringify(response));
                        setLoading(false);
                        setCurrentStep(0)
                        setType("");
                        setImages([]);
                        clearValues();
                        if(Platform.OS === "android"){
                            ToastAndroid.show("Tree created successfully", ToastAndroid.SHORT);
                        }
                        navigation.navigate('Home')
                    })
                    .catch((error) => {
                        console.log(error);
                        setLoading(false);
                        if(Platform.OS === "android"){
                            ToastAndroid.show("Error", ToastAndroid.SHORT);
                        }
                    })
                }
            }
            )
        })
    }


    const handleAddTag = () => {
        if (inputValue.trim() !== '') {
          setNewPostForm({ ...newPostForm, tags: [...newPostForm.tags, inputValue.trim()] });
          setInputValue('');
        }
      };
    
      const handleRemoveTag = (tag) => {
        setNewPostForm({ ...newPostForm, tags: newPostForm.tags.filter((t) => t !== tag) });
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

   

    const eventForm = () => {
        return (
            <View style={styles.formContainer}>
                <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Title</Text>
                    <TextInput
                        style={styles.formInput}
                        value={newEventForm.title}
                        textColor="#fff"
                        onChangeText={(text) => setEventForm({ ...newEventForm, title: text })}
                        required
                    />
                </View>
                <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Description</Text>
                    <TextInput
                        style={{
                            ...styles.formInput,
                            height: 100,
                            textAlignVertical: "top"
                        }}
                        textColor="#fff"
                        value={newEventForm.description}
                        onChangeText={(text) => setEventForm({ ...newEventForm, description: text })}
                        multiline={true}
                        required
                    />
                </View>
                <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Requirements</Text>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1, marginRight: 5 }}>
                            <Text style={styles.formLabel}>Estimated Trees to Plant Needed</Text>
                            <TextInput
                                style={styles.formInput}
                                value={newEventForm.requirements.trees}
                                textColor="#fff"
                                onChangeText={(text) => setEventForm({ ...newEventForm, requirements: { ...newEventForm.requirements, trees: text } })}
                                required
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 5 }}>
                            <Text style={styles.formLabel}>Estimated Volunteers Needed</Text>
                            <TextInput
                                style={styles.formInput}
                                value={newEventForm.requirements.volunteers}
                                textColor="#fff"
                                onChangeText={(text) => setEventForm({ ...newEventForm, requirements: { ...newEventForm.requirements, volunteers: text } })}
                                required
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1, marginRight: 5 }}>
                            <Text style={styles.formLabel}>Estimated Funds Needed</Text>
                            <TextInput
                                style={styles.formInput}
                                value={newEventForm.requirements.funds}
                                textColor="#fff"
                                onChangeText={(text) => setEventForm({ ...newEventForm, requirements: { ...newEventForm.requirements, funds: text } })}
                                required
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Lands Description</Text>
                    <TextInput
                        style={{
                            ...styles.formInput,
                            height: 100,
                            textAlignVertical: "top",
                        }}
                        value={newEventForm.landsDescription}
                        textColor="#fff"
                        onChangeText={(text) => setEventForm({ ...newEventForm, landsDescription: text })}
                        multiline={true}
                        required
                    />
                </View>
               </View>
        );
    };

    const postForm = () => {
        return (
            <View style={styles.formContainer}>
                <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Caption</Text>
                    <TextInput
                        style={{
                            ...styles.formInput,
                            height: 100,
                            textAlignVertical: "top",
                        }}
                        value={newPostForm.text}
                        textColor="#fff"
                        onChangeText={(text) => setNewPostForm({ ...newPostForm, text: text })}
                        multiline={true}
                        required
                    />
                </View>
                <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Tags</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {newPostForm.tags.map((tag, index) => (
                        <TouchableOpacity
                            key={tag}
                            onPress={() => handleRemoveTag(tag)}
                            style={styles.tag}
                        >
                            <Text>{tag}</Text>
                        </TouchableOpacity>
                        ))}
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <TextInput
                            value={inputValue}
                            onChangeText={setInputValue}
                            placeholder="Enter a tag"
                            style={[styles.formInput, { flex: 1, marginRight: 10} ]}
                           
                        />
                        <TouchableOpacity onPress={handleAddTag} style={{ backgroundColor: '#212121', padding: 10, borderRadius: 5, justifyContent: 'center' }}>
                             <Text style={{ color: 'white' }}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Event</Text>
                    <TextInput
                        style={styles.formInput}
                        value={eventTitle}
                        textColor="#fff"
                        onChangeText={(text) => setEventTitle(text)}
                        onFocus={() => setShowSuggestions(true)}
                        required
                    />
                    {eventTitle.length > 0 && showSuggestions && (
                        eventsSearch?.map((event, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    padding: 10,
                                    backgroundColor: "#212121",
                                    borderRadius: 5,
                                    marginTop: 5,
                                }}
                                onPress={() => {
                                    setNewPostForm({ ...newPostForm, event: event._id });
                                    setShowSuggestions(false);
                                    setEventTitle(event.title);
                                }}
                            >
                               <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                                    <Image source={{ uri: event.images[0] }} style={{ width: 50, height: 50, borderRadius: 5 }} />
                                    <View style={{ flexDirection: 'column'}}>
                                        <Text style={{ color: COLORS.white, justifyContent: 'center', paddingLeft: 4 }}> {event.title} </Text>
                                        <Text style={{ color: COLORS.secondary, fontSize: 10, padding: 5}}> {event?.description} </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            </View>
        );
    };

    const organizationForm = () => {
        return (
            <View style={styles.formContainer}>
                <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Name</Text>
                    <TextInput
                        style={styles.formInput}
                        value={newOrganizationForm.name}
                        textColor="#fff"
                        onChangeText={(text) => setNewOrganizationForm({ ...newOrganizationForm, name: text })}
                        required
                    />
                    {isExisted && (
                        <Text style={{ color: 'red' }}>This organization already exists</Text>
                    )}
                </View>
                <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Description</Text>
                    <TextInput
                        style={{
                            ...styles.formInput,
                            height: 100,
                            textAlignVertical: "top",
                        }}
                        value={newOrganizationForm.bio}
                        textColor="#fff"
                        onChangeText={(text) => setNewOrganizationForm({ ...newOrganizationForm, bio: text })}
                        multiline={true}
                        required
                    />
                </View>
            </View>
        );
    };

    const treeForm = () => {
        return (
            <View style={styles.formContainer}>
                <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Name</Text>
                    <TextInput
                        style={styles.formInput}
                        value={newTreeForm.name}
                        textColor="#fff"
                        onChangeText={(text) => setNewTreeForm({ ...newTreeForm, name: text })}
                        required
                    />
                </View>
                <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Scientific Name</Text>
                    <TextInput
                        style={styles.formInput}
                        value={newTreeForm.scientificName}
                        textColor="#fff"
                        onChangeText={(text) => setNewTreeForm({ ...newTreeForm, scientificName: text })}
                        required
                    />
                </View>
                <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Description</Text>
                    <TextInput
                        style={{
                            ...styles.formInput,
                            height: 100,
                            textAlignVertical: "top",
                        }}
                        value={newTreeForm.description}
                        textColor="#fff"
                        onChangeText={(text) => setNewTreeForm({ ...newTreeForm, description: text })}
                        multiline={true}
                        required
                    />
                </View>
                <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Benefits</Text>
                    <TextInput
                        style={styles.formInput}
                        value={newTreeForm.benefits}
                        textColor="#fff"
                        onChangeText={(text) => setNewTreeForm({ ...newTreeForm, benefits: text })}
                        required
                    />
                </View>
                <View style={styles.formItem}>
                    <Text style={styles.formLabel}>Requirements</Text>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1, marginRight: 5 }}>
                            <Text style={styles.formLabel}>Sun</Text>
                            <TextInput
                                style={styles.formInput}
                                value={newTreeForm.requirements.sun}
                                textColor="#fff"
                                onChangeText={(text) => setNewTreeForm({ ...newTreeForm, requirements: { ...newTreeForm.requirements, sun: text } })}
                                required
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 5 }}>
                            <Text style={styles.formLabel}>Soil</Text>
                            <TextInput
                                style={styles.formInput}
                                value={newTreeForm.requirements.soil}
                                textColor="#fff"
                                onChangeText={(text) => setNewTreeForm({ ...newTreeForm, requirements: { ...newTreeForm.requirements, soil: text } })}
                                required    
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1, marginRight: 5 }}>
                            <Text style={styles.formLabel}>Water</Text>
                            <TextInput
                                style={styles.formInput}
                                value={newTreeForm.requirements.water}
                                textColor="#fff"
                                onChangeText={(text) => setNewTreeForm({ ...newTreeForm, requirements: { ...newTreeForm.requirements, water: text } })}
                                required
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 5 }}>
                            <Text style={styles.formLabel}>Temperature</Text>
                            <TextInput
                                style={styles.formInput}
                                value={newTreeForm.requirements.temperature}
                                textColor="#fff"
                                onChangeText={(text) => setNewTreeForm({ ...newTreeForm, requirements: { ...newTreeForm.requirements, temperature: text } })}
                                required
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1, marginRight: 5 }}>
                            <Text style={styles.formLabel}>Fertilizer</Text>
                            <TextInput
                                style={styles.formInput}
                                value={newTreeForm.requirements.fertilizer}
                                textColor="#fff"
                                onChangeText={(text) => setNewTreeForm({ ...newTreeForm, requirements: { ...newTreeForm.requirements, fertilizer: text } })}
                                required
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const renderForm = () => {
        switch (type) {
            case "newEvent":
                return eventForm();
            case "newPost":
                return postForm();
            case "newOrganization":
                return organizationForm();
            case "newTree":
                return treeForm();
            default:
                return eventForm();
        }
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
               
                <View style={styles.typeContainer}>
                    <View style={styles.chooseContainer}>
                        <Text style={styles.chooseText}>Choose a type</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.typeButton, type === "newEvent" ? styles.activeTypeButton : null]}
                        onPress={() => setType("newEvent")}
                    >
                        <Text style={[styles.typeButtonText, type === "newEvent" ? styles.activeTypeButtonText : null]}>Request for Event</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.typeButton, type === "newPost" ? styles.activeTypeButton : null]}
                        onPress={() => setType("newPost")}
                    >
                        <Text style={[styles.typeButtonText, type === "newPost" ? styles.activeTypeButtonText : null]}>Create Post</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.typeButton, type === "newOrganization" ? styles.activeTypeButton : null]}
                    onPress={() => {
                        if(images.length > 1) {
                            if(Platform.OS === "android") {
                                ToastAndroid.show("Only one image allowed for organization", ToastAndroid.SHORT);
                            } else {
                                Alert.alert("Only one image allowed");
                            }
                        } else {
                            setType("newOrganization");
                        }
                    }}
                    >
                        <Text style={[styles.typeButtonText, type === "newOrganization" ? styles.activeChooseButtonText : null]}>Create Organization</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.typeButton, type === "newTree" ? styles.activeTypeButton : null]}
                        onPress={() => setType("newTree")}
                    >
                        <Text style={[styles.typeButtonText, type === "newTree" ? styles.activeTypeButtonText : null]}>Add New Tree </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const ComponentThree = () => {
        return (
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setCurrentStep(1)}
                >
                    <Icon.Ionicons name="md-arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
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


    if(errorMsg !== null){
        return <Text style={{textAlign: 'center', marginTop: 350}}>{errorMsg}</Text>
    }
   
   

    return (
        <View style={styles.container}>
           {renderComponent()}
           {currentStep == 2 ? (
             <View style={styles.container}>
                <ScrollView keyboardShouldPersistTaps="always">
                    {renderForm()}
                    <Button style={[styles.submitButton, { backgroundColor : loading ? COLORS.secondary : COLORS.darkGreen, color: loading ? COLORS.darkgray : COLORS.white }]}
                    onPress={handleSubmit} disabled={loading || isExisted} loading={loading}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </Button>
                </ScrollView>
            </View>
           ) : null}
          
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
    activeChooseButtonText: {
        color: "#fff",
    },
    activeTypeButtonText: {
        color: "#fff",
    },
    activeTypeButton: {
        backgroundColor: COLORS.secondary,
    },
    tag: {
        backgroundColor: COLORS.secondary,
        borderRadius: 5,
        padding: 5,
        marginRight: 5,
        marginBottom: 5,
    },
});


