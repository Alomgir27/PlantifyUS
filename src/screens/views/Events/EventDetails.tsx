import React, { useEffect, useState} from "react";
import { View, StyleSheet, Image, FlatList, Alert, TouchableOpacity, Dimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../../constants/index";
import { API_URL } from "../../../constants/index";
import axios from "axios";
import ImagesViewer from '../../../components/ImagesViewer';
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import * as ICONS from "@expo/vector-icons";


import { Text as Text } from '../../../components/';
import { Text as Text2 } from 'react-native-elements';
import { IEvent } from "../../../constants/types";
import moment from "moment";


const EventDetails = ({ route , navigation}) => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    
    const user = useSelector((state) => state.data.currentUser);
    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const [expanded, setExpanded] = useState(true);

    const handlePress = () => setExpanded(!expanded);
    const [item, setItem] = useState<IEvent>({title: '', description: '', images: [], location: {coordinates: [0, 0]}, requirements: {trees: 0, volunteers: 0, funds: 0}, landsDescription: ''});

    useEffect(() => {
        if(route.params?._id) {
            (async () => {
                await axios.get(`${API_URL}/events/${route?.params?._id}`)
                .then((res) => {
                    setItem(res.data.event);
                })
                .catch((err) => {
                    console.log(err);
                })
            })();
        }
    }, [route.params?._id]);

   
    
    return (
        <ScrollView>
           <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Events', { _id: route?.params?._id })} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <ICONS.Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                    <Text  style={styles.headerTitle}>Event Details</Text>
                </View>
                <View style={styles.eventContainer}>
                    <View style={styles.eventHeader}>
                        <View style={styles.eventHeaderLeft}>
                            <Image source={{uri: item?.author?.image}} style={styles.avatar} />
                            <View style={styles.eventHeaderLeftText}>
                                <Text2 style={[styles.eventHeaderLeftTextTitle, { color: COLORS.primary}]}>{item?.title}</Text2>
                                <Text style={styles.eventHeaderLeftTextAuthor}>by {item?.author?.name}</Text>
                            </View>
                        </View>
                        <View style={[styles.eventHeaderRight, {
                            backgroundColor: item?.status === 'pending' ? COLORS.gray : item?.status === 'approved' ? COLORS.primary : item?.status === 'rejected' ? COLORS.red : COLORS.green
                        }]}>
                            <Text style={styles.eventHeaderRightText}>{item?.status}</Text>
                        </View>
                    </View>
                    <View style={styles.eventBody}>
                        <View style={styles.eventBodyImageContainer}>
                            <ImagesViewer
                                images={item?.images ? item?.images : []}
                                resizeMode={'cover'}
                                imageStyle={styles.eventBodyImage}
                                containerStyle={styles.eventBodyImageContainer}
                                navigation={navigation}
                                item={item}
                                routeName={'Event'}
                            />
                        </View>
                        <View style={styles.eventBodyDescription}>
                            <Text style={styles.eventBodyDescriptionText}>{item?.description}</Text>
                        </View>
                        <View style={styles.eventBodyDetailsItem}>
                            {item?.hostDetails?.message && (
                                <Text p numberOfLines={2} paddingLeft={10} paddingBottom={10}>{item?.hostDetails?.message}</Text>
                            )}
                            {item?.hostDetails && (
                                <Text p primary bold numberOfLines={2} paddingLeft={10} paddingBottom={10}>Host time: {new Date(parseInt(item?.hostDetails?.year), parseInt(item?.hostDetails?.month) - 1, parseInt(item?.hostDetails?.day), parseInt(item?.hostDetails?.startTime)) > new Date() ? moment(new Date(parseInt(item?.hostDetails?.year), parseInt(item?.hostDetails?.month) - 1, parseInt(item?.hostDetails?.day), parseInt(item?.hostDetails?.startTime))).fromNow() : "Event has ended"}</Text>
                            )}
                        </View>
                        <View style={styles.eventBodyDetails}>
                            <View style={styles.eventBodyDetailsItem}>
                                <Text style={styles.eventBodyDetailsItemTitle}>Location</Text>
                                <MapView
                                    style={styles.map}
                                    initialRegion={{
                                        latitude: parseFloat(item?.location?.coordinates[1]),
                                        longitude: parseFloat(item?.location?.coordinates[0]),
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}
                                    initialCamera={{
                                        center: {
                                            latitude: parseFloat(item?.location?.coordinates[1]),
                                            longitude: parseFloat(item?.location?.coordinates[0]),
                                        },
                                        pitch: 0,
                                        heading: 0,
                                        altitude: 1000,
                                        zoom: 10,
                                    }}

                                >
                                    <Marker
                                        coordinate={{
                                            latitude: parseFloat(item?.location?.coordinates[1]),
                                            longitude: parseFloat(item?.location?.coordinates[0]),
                                        }}
                                        title={item?.title}
                                        description={item?.description}
                                        zoomEnabled={true}
                                        zoomControlEnabled={true}
                                        zoomTapEnabled={true}
                                        draggable={true}
                                        flat={true}
                                        onPress={() => console.log('Marker Pressed')}
                                        onDragEnd={(e) => console.log('Marker Dragged', e.nativeEvent.coordinate)}
                                    />
                              </MapView>
                            </View>
                            <View style={styles.eventBodyDetailsItem}>
                                <Text style={styles.eventBodyDetailsItemTitle}>Requirements</Text>
                                <View style={styles.eventBodyDetailsItemRequirements}>
                                    <View style={styles.eventBodyDetailsItemRequirementsItem}>
                                        <Text style={styles.eventBodyDetailsItemRequirementsItemTitle}>Trees</Text>
                                        <Text style={styles.eventBodyDetailsItemRequirementsItemValue}>{item?.requirements?.trees}</Text>
                                    </View>
                                    <View style={styles.eventBodyDetailsItemRequirementsItem}>
                                        <Text style={styles.eventBodyDetailsItemRequirementsItemTitle}>Volunteers</Text>
                                        <Text style={styles.eventBodyDetailsItemRequirementsItemValue}>{item?.requirements?.volunteers}</Text>
                                    </View>
                                    <View style={styles.eventBodyDetailsItemRequirementsItem}>
                                        <Text style={styles.eventBodyDetailsItemRequirementsItemTitle}>Funds</Text>
                                        <Text style={styles.eventBodyDetailsItemRequirementsItemValue}>{item?.requirements?.funds}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.eventBodyDetailsItem}>
                                <Text style={styles.eventBodyDetailsItemTitle}>Lands Description</Text>
                                <Text style={styles.eventBodyDetailsItemText}>{item?.landsDescription}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

                                
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    eventContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    eventHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    eventHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    eventHeaderLeftText: {
        marginLeft: 10,
    },
    eventHeaderLeftTextTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    eventHeaderLeftTextAuthor: {
        fontSize: 14,
        color: COLORS.gray,
    },
    eventHeaderRight: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    eventHeaderRightText: {
        color: COLORS.white,
        fontSize: 14,
    },
    eventBody: {
        flex: 1,
    },
    eventBodyImageContainer: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
    },
    eventBodyImage: {
        width: '100%',
        height: '100%',
    },
    eventBodyDescription: {
        marginBottom: 20,
    },
    eventBodyDescriptionText: {
        fontSize: 16,
        color: COLORS.gray,
    },
    eventBodyDetails: {
        marginBottom: 20,
    },
    eventBodyDetailsItem: {
        marginBottom: 20,
    },
    eventBodyDetailsItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    eventBodyDetailsItemText: {
        fontSize: 16,
        color: COLORS.gray,
    },
    eventBodyDetailsItemRequirements: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    eventBodyDetailsItemRequirementsItem: {
        width: '30%',
        // backgroundColor: COLORS.lightGray,
        borderRadius: 5,
        padding: 10,
    },
    eventBodyDetailsItemRequirementsItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    eventBodyDetailsItemRequirementsItemValue: {
        fontSize: 16,
        color: COLORS.gray,
    },
    map: {
        flex: 1,
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
});

export default EventDetails;