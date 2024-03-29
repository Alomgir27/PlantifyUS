import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { FAB } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as ICONS from "@expo/vector-icons";
import { COLORS } from "../../constants/index";
import { API_URL } from "../../constants/index";
import axios from "axios";
import { fetchUser } from "../../modules/data";
import moment from "moment";

import {
    BottomSheetBackdrop,
    BottomSheetModal,
} from "@gorhom/bottom-sheet";


const Profile = ({ navigation, route }) => {
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [user, setUser] = useState([]);
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

    const bottomSheetModalRef = useRef(null);
    const snapPoints = React.useMemo(() => ["25%", "50%"], []);

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

    const handlePickCover = async () => {
        try {
            const res = await ImagePicker.launchCameraAsync({
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


    const renderContent = () => (
        <View style={styles.panel}>
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.panelTitle}>Upload Photo</Text>
                <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
            </View>
            <TouchableOpacity style={styles.panelButton} onPress={handlePickCover}>
                <Text style={styles.panelButtonTitle}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.panelButton} onPress={handlePickAvatar}>
                <Text style={styles.panelButtonTitle}>Choose From Library</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.panelButton}
                onPress={() => bottomSheetModalRef.current?.close()}
            >
                <Text style={styles.panelButtonTitle}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );

   

    return (
        <View style={styles.root}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10 }}>
               <ICONS.Ionicons name="arrow-back-outline"
               size={24} color={COLORS.primary} onPress={() => navigation.goBack()} />
            </View>

            <ScrollView>
                <View style={styles.profileHeader}>
                    <TouchableOpacity style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",

                    }} onPress={() => bottomSheetModalRef.current?.present()}>
                        <Image
                            style={styles.image}
                            source={{ uri: user?.image }}
                        />
                        <View style={styles.nameContainer}>
                            <Text style={styles.name}>{user?.name}</Text>
                            <Text style={styles.email}>{user?.email}</Text>
                        </View>
                    </TouchableOpacity>
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
                    <TouchableOpacity style={styles.button} onPress={handleLogout}>
                        <Text style={{ color: COLORS.primary }}>Logout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleDelete}>
                        <Text style={{ color: COLORS.primary }}>Delete Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                        <Text style={{ color: COLORS.primary }}>Update Account</Text>
                    </TouchableOpacity>
                </View>
               
            </ScrollView>

           
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                onChange={(index) => {
                    console.log('bsm index:', index);
                }}
                backdropComponent={BottomSheetBackdrop}
            >
                {renderContent()}
            </BottomSheetModal>


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
    panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        height: 600,
    },
    header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: { width: -1, height: -3 },
        shadowRadius: 2,
        shadowOpacity: 0.4,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },

    panelTitle: {
        fontSize: 27,
        height: 35,
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
    },
    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: COLORS.white,
    },

});

export default Profile;
