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
            <View style={styles.root}>
                <View style={styles.container}>
                    <View style={styles.ImageContainer}>
                        <ImagesViewer images={item.images} resizeMode="cover" />
                    </View>
                    <View style={styles.detailsContainer}>
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: item.location.coordinates[0],
                                longitude: item.location.coordinates[1],
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                        >
                            <Marker
                                coordinate={{
                                    latitude: item.location.coordinates[0],
                                    longitude: item.location.coordinates[1],
                                }}
                                title={item.title}
                                description={item.description}
                            />
                        </MapView>
                     </View>    
                    <View style={styles.detailsContainer}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                        <Text style={styles.description}>{item.landsDescription}</Text>
                    </View>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.title}>Requirements</Text>
                        <Text style={styles.description}>Trees: {item.requirements.trees}</Text>
                        <Text style={styles.description}>Volunteers: {item.requirements.volunteers}</Text>
                        <Text style={styles.description}>Funds: {item.requirements.funds}</Text>
                    </View>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.title}>Organizer</Text>
                        <Text style={styles.description}>{item.organizer}</Text>
                    </View>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.title}>Attendees</Text>
                        <Text style={styles.description}>{item.attendees}</Text>
                    </View>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.title}>Status</Text>
                        <Text style={styles.description}>{item.status}</Text>
                    </View>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.title}>Author</Text>
                        <Image
                            style={{ width: 60, height: 60, borderRadius: 30 }}
                            source={{ uri: item.author.image }}
                        />
                        <Text style={styles.description}>{item.author.name}</Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.scrollView}
                    >
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => console.log("Button pressed")}
                        >
                            <ICONS.FontAwesome
                                name="thumbs-up"
                                size={24}
                                color={COLORS.white}
                            />
                            <Text style={styles.buttonText}>Upvote</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => console.log("Button pressed")}
                        >
                            <ICONS.FontAwesome
                                name="thumbs-down"
                                size={24}
                                color={COLORS.white}
                            />
                            <Text style={styles.buttonText}>Downvote</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => console.log("Button pressed")}
                        >
                            <ICONS.FontAwesome
                                name="comment"
                                size={24}
                                color={COLORS.white}
                            />
                            <Text style={styles.buttonText}>Comment</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => console.log("Button pressed")}
                        >
                            <ICONS.FontAwesome
                                name="share"
                                size={24}
                                color={COLORS.white}
                            />
                            <Text style={styles.buttonText}>Share</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
    },
    detailsContainer: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    description: {
        fontSize: 18,
        marginBottom: 10,
    },
    map: {
        width: "100%",
        height: 200,
        marginBottom: 10,
    },
    scrollView: {
        flexDirection: "row",
        marginHorizontal: 20,
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        padding: 10,
        margin: 10,
        flexDirection: "row",
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        marginLeft: 10,
    },
    ImageContainer: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: COLORS.white,
        width: width,
        height: height / 1.5,
    },
});

export default EventDetails;

                    