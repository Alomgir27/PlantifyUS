import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { FAB } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as ICONS from "@expo/vector-icons";
import { COLORS } from "../../constants";
import { API_URL } from "../../constants";
import axios from "axios";
import { fetchUser } from "../../modules/data";
import moment from "moment";


// const userSchema = new Schema({
//     name: String,
//     email: String,
//     password: String,
//     eventsAttending: [{
//         type: Schema.Types.ObjectId,
//         ref: 'Event'
//     }],
//     friends: [{
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     }],
//     posts: [{
//         type: Schema.Types.ObjectId,
//         ref: 'Post'
//     }],
//     image: String,
//     bio: String,
//     location: {
//         type: { type: String, default: 'Point'},
//         coordinates: { type: [Number], default: [0, 0] }
//     },
//     badges: [{
//         type: Schema.Types.ObjectId,
//         ref: 'Badge'
//     }],
//     notifications: [{
//         type: Schema.Types.ObjectId,
//         ref: 'Notification'
//     }],
//     favourites: [{
//         type: Schema.Types.ObjectId,
//         ref: 'Favourite'
//     }],
//     type: String,
//     uuid: String
// }, { timestamps: true });


const Profile = ({ navigation, route }) => {
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [data, setData] = useState([]);
    const [user, setUser] = useState([]);
    const [userLocation, setUserLocation] = useState([]);
    const [userEvents, setUserEvents] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [userBadges, setUserBadges] = useState([]);
    const [userFriends, setUserFriends] = useState([]);
    const [userFavourites, setUserFavourites] = useState([]);
    const [userNotifications, setUserNotifications] = useState([]);
    const [userOrganizations, setUserOrganizations] = useState([]);
    const [userAttending, setUserAttending] = useState([]);

    const dispatch = useDispatch();

    const { currentUser } = useSelector((state) => state?.data);


    const [expanded, setExpanded] = useState(true);

    const handlePress = () => setExpanded(!expanded);
    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== "web") {
                const { status } =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    alert(
                        "Sorry, we need camera roll permissions to make this work!"
                    );
                }
            }
        })();
    }
    , []);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== "web") {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    setErrorMsg("Permission to access location was denied");
                }
                const location = await Location.getCurrentPositionAsync({});
                setLocation(location);
            }
        })();
    }
    , []);

    useEffect(() => {
        if(route?.params?.user) {
            setUser(route?.params?.user);
        }
        else {
            setUser(currentUser);
        }
    }, [route?.params?.user]);


    const fetchData = async () => {
       
    }

   

    const handleLogout = () => {
        auth.signOut().then(() => {
            navigation.replace("Login");
        });
    }

    const handleDelete = () => {
        
    }

    const handleUpdate = async () => {
        
    }

    const handlePickAvatar = async () => {
        try {
            const res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
            if (!res.cancelled) {
                setImage(res.uri);
            }
        } catch (err) {
            console.log(err);
        }
    }   

    const handlePickLocation = async () => {
        try {
            const res = await Location.getCurrentPositionAsync({});
            setLocation(res);
        } catch (err) {
            console.log(err);
        }
    }

   

    return (
        <View style={styles.root}>
            <ScrollView>
                <View style={styles.profileHeader}>
                    <View style={{ flexDirection: "row" }}>
                        <Image
                            style={styles.image}
                            source={{ uri: user?.image }}
                        />
                        <View style={styles.nameContainer}>
                            <Text style={styles.name}>{user?.name}</Text>
                            <Text style={styles.email}>{user?.email}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <ICONS.Ionicons
                            name="location"
                            size={20}
                            color={COLORS.primary}
                        />
                        <Text style={{ marginLeft: 10 }}>
                            {/* {userLocation?.coordinates[0]}, {userLocation?.coordinates[1]} */}
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <ICONS.Ionicons
                            name="calendar"
                            size={20}
                            color={COLORS.primary}
                        />
                        <Text style={{ marginLeft: 10 }}>
                            {moment(user?.createdAt).format("MMMM Do YYYY")}
                        </Text>
                    </View>
                </View>
                <View style={styles.profileBody}>
                    <View style={styles.profileItem}>
                        <Text style={styles.profileItemText}>Events Attending</Text>
                        <Text style={styles.profileItemText}>{userAttending?.length}</Text>
                    </View>
                    <View style={styles.profileItem}>
                        <Text style={styles.profileItemText}>Friends</Text>
                        <Text style={styles.profileItemText}>{userFriends?.length}</Text>
                    </View>
                    <View style={styles.profileItem}>
                        <Text style={styles.profileItemText}>Posts</Text>
                        <Text style={styles.profileItemText}>{userPosts?.length}</Text>
                    </View>
                    <View style={styles.profileItem}>
                        <Text style={styles.profileItemText}>Badges</Text>
                        <Text style={styles.profileItemText}>{userBadges?.length}</Text>
                    </View>
                    <View style={styles.profileItem}>
                        <Text style={styles.profileItemText}>Organizations</Text>
                        <Text style={styles.profileItemText}>{userOrganizations?.length}</Text>
                    </View>
                    <View style={styles.profileItem}>
                        <Text style={styles.profileItemText}>Favourites</Text>
                        <Text style={styles.profileItemText}>{userFavourites?.length}</Text>
                    </View>
                    <View style={styles.profileItem}>
                        <Text style={styles.profileItemText}>Notifications</Text>
                        <Text style={styles.profileItemText}>{userNotifications?.length}</Text>
                    </View>
                </View>
                <View style={styles.profileFooter}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogout}
                    >
                        <ICONS.Ionicons name="log-out-outline" size={20} color={COLORS.primary} />
                        <Text style={{ marginLeft: 10 }}>Logout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleDelete}
                    >
                        <ICONS.Ionicons name="trash-outline" size={20} color={COLORS.primary} />
                        <Text style={{ marginLeft: 10 }}>Delete Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleUpdate}
                    >
                        <ICONS.Ionicons name="cloud-upload-outline" size={20} color={COLORS.primary} />
                        <Text style={{ marginLeft: 10 }}>Update Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handlePickAvatar}
                    >
                        <ICONS.Ionicons name="image-outline" size={20} color={COLORS.primary} />
                        <Text style={{ marginLeft: 10 }}>Pick Avatar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handlePickLocation}
                    >
                        <ICONS.Ionicons name="location-outline" size={20} color={COLORS.primary} />
                        <Text style={{ marginLeft: 10 }}>Pick Location</Text>
                    </TouchableOpacity>
                    
                    
                   
                </View>
            </ScrollView>

            <FAB
                style={styles.fab}
                small
                icon="plus"
                onPress={() => navigation.navigate("CreatePost")}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 100,
        borderRadius: 100,
    },
    nameContainer: {
        marginLeft: 20,
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
    },
    email: {
        fontSize: 15,
        fontWeight: "bold",
    },
    fab: {
        position: "absolute",
        margin: 20,
        right: 0,
        bottom: 0,
    },
    mycard: {
        margin: 5,
    },
    cardView: {
        flexDirection: "row",
        padding: 6,
    },
    text: {
        fontSize: 18,
    },
    root: {
        flex: 1,
    },
    profileHeader: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.secondary,
    },
    profileBody: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.secondary,
    },
    profileFooter: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.secondary,
    },
    profileItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    profileItemText: {
        fontSize: 18,
    },
    button: {
        marginHorizontal: 20,
        marginVertical: 10,
    },

});

export default Profile;
