import React, { useEffect, useState} from "react";
import { View, Text, StyleSheet, Image, FlatList, Alert, TouchableOpacity, Dimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../constants";
import { API_URL } from "../../constants";
import axios from "axios";
import ImagesViewer from './../../components/ImagesViewer';
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import * as ICONS from "@expo/vector-icons";

const { width, height } = Dimensions.get('window');

// const eventSchema = new Schema({
//     title: String,
//     description: String,
//     location: {
//         type: { type: String, default: 'Point'},
//         coordinates: { type: [Number], default: [0, 0] }
//     },
//     organizer: String,
//     attendees: [String],
//     images: [String],
//     requirements:{
//         trees: Number,
//         volunteers: Number,
//         funds: Number
//     },
//     landsDescription: String,
//     status: {
//         type: String,
//         enum: ['pending', 'approved', 'rejected', 'completed'],
//         default: 'pending'
//     },
//     author: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     collectedFunds: Number,
//     upvotes: [String],
//     downvotes: [String],
//     comments: [{
//             type: Schema.Types.ObjectId,
//             ref: 'Comment'
//         }]

// }, { timestamps: true });


const EventDetails = ({ route }) => {
    const { item } = route.params;
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    
    const user = useSelector((state) => state.data.currentUser);
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const [expanded, setExpanded] = useState(true);

    const handlePress = () => setExpanded(!expanded);

   
    
    return (
        <ScrollView>
           <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Events')}>
                        <ICONS.Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Event Details</Text>
                </View>
                <View style={styles.eventContainer}>
                    <View style={styles.eventHeader}>
                        <View style={styles.eventHeaderLeft}>
                            <Image source={{uri: item.author.image}} style={styles.avatar} />
                            <View style={styles.eventHeaderLeftText}>
                                <Text style={styles.eventHeaderLeftTextTitle}>{item.title}</Text>
                                <Text style={styles.eventHeaderLeftTextAuthor}>by {item.author.name}</Text>
                            </View>
                        </View>
                        <View style={styles.eventHeaderRight}>
                            <Text style={styles.eventHeaderRightText}>{item.status}</Text>
                        </View>
                    </View>
                    <View style={styles.eventBody}>
                        <View style={styles.eventBodyImageContainer}>
                            <ImagesViewer
                                images={item.images}
                                resizeMode={'cover'}
                                imageStyle={styles.eventBodyImage}
                                containerStyle={styles.eventBodyImageContainer}
                                navigation={navigation}
                                item={item}
                            />
                        </View>
                        <View style={styles.eventBodyDescription}>
                            <Text style={styles.eventBodyDescriptionText}>{item.description}</Text>
                        </View>
                        <View style={styles.eventBodyDetails}>
                            <View style={styles.eventBodyDetailsItem}>
                                <Text style={styles.eventBodyDetailsItemTitle}>Location</Text>
                                <MapView
                                    style={styles.map}
                                    initialRegion={{
                                        latitude: item?.location?.coordinates[0],
                                        longitude: item?.location?.coordinates[1], 
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}
                                    initialCamera={{
                                        center: {
                                            latitude: item?.location?.coordinates[0],
                                            longitude: item?.location?.coordinates[1],
                                        },
                                        pitch: 0,
                                        heading: 0,
                                        altitude: 1000,
                                        zoom: 10,
                                    }}

                                >
                                    <Marker
                                        coordinate={{
                                            latitude: item?.location?.coordinates[0],
                                            longitude: item?.location?.coordinates[1],
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
                                        <Text style={styles.eventBodyDetailsItemRequirementsItemValue}>{item.requirements.trees}</Text>
                                    </View>
                                    <View style={styles.eventBodyDetailsItemRequirementsItem}>
                                        <Text style={styles.eventBodyDetailsItemRequirementsItemTitle}>Volunteers</Text>
                                        <Text style={styles.eventBodyDetailsItemRequirementsItemValue}>{item.requirements.volunteers}</Text>
                                    </View>
                                    <View style={styles.eventBodyDetailsItemRequirementsItem}>
                                        <Text style={styles.eventBodyDetailsItemRequirementsItemTitle}>Funds</Text>
                                        <Text style={styles.eventBodyDetailsItemRequirementsItemValue}>{item.requirements.funds}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.eventBodyDetailsItem}>
                                <Text style={styles.eventBodyDetailsItemTitle}>Lands Description</Text>
                                <Text style={styles.eventBodyDetailsItemText}>{item.landsDescription}</Text>
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
        backgroundColor: COLORS.white,
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
        backgroundColor: COLORS.white,
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
        backgroundColor: COLORS.lightGray,
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