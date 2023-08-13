import React, { useState, useCallback, useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from "../../../constants/index";
import {
    BottomSheet,
    BottomSheetModal,
    BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

import { icons } from "../../../constants/index";
import { db, auth } from "../firebase";
import axios from "axios";
import { API_URL } from "../../../constants/index";
import { useSelector } from "react-redux";

const ChatList = ({ chatRoom, navigation }) => {
    const [chatMessages, setChatMessages] = useState([]);
    const user = useSelector(state => state?.data?.currentUser);
    const [lastMessage, setLastMessage] = useState("");
    const [lastMessageTime, setLastMessageTime] = useState("");
    const [lastMessageUser, setLastMessageUser] = useState("");


    useEffect(() => {
        const unsubscribe = db
            .collection("chatRooms")
            .doc(chatRoom.id)
            .collection("messages")
            .orderBy("createdAt", "desc")
            .onSnapshot((snapshot) =>
                setChatMessages(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data(),
                    }))
                )
            );

        return unsubscribe;
    }
    , [chatRoom.id]);

    useEffect(() => {
        if (chatMessages.length > 0) {
            setLastMessage(chatMessages[0].data.message);
            setLastMessageTime(chatMessages[0].data.createdAt);
            setLastMessageUser(chatMessages[0].data.user);
        }
    }
    , [chatMessages]);

    const sheetRef = useRef(null);

    const openBottomSheet = useCallback(() => {
        sheetRef.current?.expand();
    }
    , []);

    const closeBottomSheet = useCallback(() => {
        sheetRef.current?.close();
    }
    , []);


    const renderContent = useCallback(() => (
        <View style={styles.contentContainer}>
            <View style={styles.contentHeader}>
                <View style={styles.contentIndicator} />
            </View>
            <View style={styles.contentBody}>
                <View style={styles.contentBodyContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("ChatRoom", {
                                id: chatRoom.id,
                                name: chatRoom.data.name,
                            });
                            closeBottomSheet();
                        }
                        }
                        style={styles.contentBodyItem}
                    >
                        <Image
                            source={{ uri: chatRoom.data.imageUri }}
                            style={styles.contentBodyItemImage}
                        />
                        <Text style={styles.contentBodyItemText}>
                            {chatRoom.data.name}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
    , [chatRoom, closeBottomSheet, navigation]);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("ChatRoom", {
                        id: chatRoom.id,
                        name: chatRoom.data.name,
                    });
                }
                }
                style={styles.chatContainer}
            >
                <Image
                    source={{ uri: chatRoom.data.imageUri }}
                    style={styles.chatImage}
                />
                <View style={styles.chatTextContainer}>
                    <Text style={styles.chatText}>{chatRoom.data.name}</Text>
                    <Text style={styles.chatText}>{lastMessageUser}</Text>
                    <Text style={styles.chatText}>{lastMessage}</Text>
                </View>
                <View style={styles.chatTimeContainer}>
                    <Text style={styles.chatTime}>{lastMessageTime}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    openBottomSheet();
                }
                }
                style={styles.chatOptionsContainer}
            >
                <Image
                    source={icons.options}
                    style={styles.chatOptionsImage}
                />
            </TouchableOpacity>
            <BottomSheetModal
                ref={sheetRef}
                index={1}
                snapPoints={[0, "50%"]}
                backdropComponent={BottomSheetBackdrop}
            >
                {renderContent()}
            </BottomSheetModal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 100,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    chatContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "80%",
    },
    chatImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    chatTextContainer: {
        width: "60%",
        marginLeft: 10,
    },
    chatText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    chatTimeContainer: {
        width: "20%",
        alignItems: "flex-end",
    },
    chatTime: {
        fontSize: 12,
        color: COLORS.gray,
    },
    chatOptionsContainer: {
        width: "20%",
        alignItems: "flex-end",
    },
    chatOptionsImage: {
        width: 30,
        height: 30,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    contentHeader: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
    },
    contentIndicator: {
        width: 40,
        height: 5,
        borderRadius: 5,
        backgroundColor: COLORS.lightGray,
    },
    contentBody: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    contentBodyContainer: {
        width: "100%",
        paddingHorizontal: 20,
    },
    contentBodyItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingVertical: 10,
    },
    contentBodyItemImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    contentBodyItemText: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
    },
});

export default ChatList;