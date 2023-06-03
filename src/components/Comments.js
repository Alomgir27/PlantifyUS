import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    TouchableWithoutFeedback,
    Dimensions,
    Alert,
    Animated,
    Easing,
    RefreshControl,
} from "react-native";

import { COLORS, FONTS, SIZES } from "./../constants";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { TextInput, FlatList} from "react-native-gesture-handler";

import { API_URL } from "./../constants";

import moment from "moment";

import { 
    handleCommentDownvote, 
    handleCommentUpvote, 
    handleCommentShow, 
    handleCommentHide, 
    fetchComments, 
    fetchCommentsReset,
    handleCommentSubmit,
    handleCommentReply
} from "./../modules/data";

import * as ICONS from "@expo/vector-icons";

import {
    BottomSheetBackdrop,
    BottomSheetModal,
} from "@gorhom/bottom-sheet";



import { Keyboard } from "react-native";


const { width, height } = Dimensions.get("window");

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const Comments = ({ item, isVisible, handleToggleComments }) => {
    const comments = useSelector((state) => state?.data?.comments);
    const commentsShow = useSelector((state) => state?.data?.commentsShow);

    const dispatch = useDispatch();


    const [refreshing, setRefreshing] = useState(false);

    const [comment, setComment] = useState("");

    const [commentId, setCommentId] = useState("");

    const [commentIndex, setCommentIndex] = useState("");

    const sheetRef = useRef(null);
    const inputRef = useRef(null)

    

    const onRefresh = () => {
        setRefreshing(true);
        dispatch(fetchCommentsReset());
        dispatch(fetchComments(item?.comments));
        wait(2000).then(() => setRefreshing(false));
    }

    const handleCommentUpvotePress = (commentId, commentIndex) => {
        dispatch(handleCommentUpvote(commentId, commentIndex));
    }

    const handleCommentDownvotePress = (commentId, commentIndex) => {
        dispatch(handleCommentDownvote(commentId, commentIndex));
    }

    
    useEffect(() => {
        if (isVisible) {
            dispatch(fetchCommentsReset());
            dispatch(fetchComments(item?.comments));
            dispatch(handleCommentShow());
        }
        else   {
            dispatch(handleCommentHide());
        }
    }, [isVisible]);

    useEffect(() => {
        if (commentsShow && isVisible) {
            sheetRef.current?.present();
        }
        else {
            sheetRef.current?.close();
        }
    }, [commentsShow, isVisible]);

    const handleSubmit = () => {
        if (comment) {
            dispatch(handleCommentSubmit('event', item?._id, comment));
            setComment("");
            inputRef.current?.clear();
            Keyboard.dismiss();
        }
    }

    
   
    const handleCommentReply = (commentId, commentIndex) => {
        setCommentId(commentId);
        setCommentIndex(commentIndex);
    }

    const handleCommentReplyCancel = () => {
        setCommentId("");
        setCommentIndex("");
        dispatch(handleCommentHide());
    }

    const handleCommentReplySubmit = () => {
        if (comment) {
            dispatch(handleCommentHide());
            dispatch(fetchCommentsReset());
            dispatch(fetchComments());
            setComment("");
            Keyboard.dismiss();
        }
    }

    const renderComment = ({ item, index }) => {
        return (
            <View style={styles.commentContainer}>
                <View style={styles.commentHeader}>
                    <View style={styles.commentHeaderLeft}>
                        <Image source={{ uri: item?.author?.image}} style={{width : 40, height: 40, borderRadius: 25}} />
                    </View>
                    <View style={styles.commentHeaderRight}>
                        <Text style={styles.commentHeaderLeftText}>{item?.author?.name}</Text>
                        <Text style={styles.commentHeaderLeftTextTime}>{moment(item?.createdAt).fromNow()}</Text>
                    </View>
                </View>
                <View style={styles.commentBody}>
                    <Text style={styles.commentBodyText}>{item?.text}</Text>
                </View>
                <View style={styles.commentFooter}>
                    <View style={styles.commentFooterLeft}>
                        <TouchableOpacity onPress={() => handleCommentUpvotePress(item?._id, index)}>
                           <View style={{ flex: 1, flexDirection: 'row'}} >
                               <ICONS.Ionicons name='thumbs-up' size={20} color={COLORS.black} style={[styles.commentFooterLeftText, { fontSize: 20 }]} />
                               <Text style={styles.commentFooterLeftText}>{item?.upvotes?.length}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleCommentDownvotePress(item?._id, index)}>
                            <View style={{ flex: 1, flexDirection: 'row', marginLeft: 10, marginTop: 4}} >
                               <ICONS.Ionicons name='thumbs-down' size={20} color={COLORS.black} style={[styles.commentFooterLeftText, { fontSize: 20 }]} />
                               <Text style={styles.commentFooterLeftText}>{item?.downvotes?.length}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.commentFooterRight}>
                        <TouchableOpacity onPress={() => handleCommentReply(item?._id, index)}>
                            <Text style={[styles.commentFooterRightText, { color: COLORS.white}]}>Reply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    const renderCommentReply = ({ item, index }) => {
        return (
            <View style={styles.commentContainer}>
                <View style={styles.commentHeader}>
                    <View style={styles.commentHeaderLeft}>
                        <Text style={styles.commentHeaderLeftText}>{item?.user?.name}</Text>
                        <Text style={styles.commentHeaderLeftTextTime}>{moment(item?.createdAt).fromNow()}</Text>
                    </View>
                    <View style={styles.commentHeaderRight}>
                        <TouchableOpacity onPress={() => handleCommentReplyCancel()}>
                            <Text style={styles.commentHeaderRightText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.commentBody}>
                    <Text style={styles.commentBodyText}>{item?.text}</Text>
                </View>
                <View style={styles.commentFooter}>
                    <View style={styles.commentFooterLeft}>
                        <TouchableOpacity onPress={() => handleCommentUpvotePress(item?._id, index)}>
                            <Text style={styles.commentFooterLeftText}>{item?.upvotes?.length}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleCommentDownvotePress(item?._id, index)}>
                            <Text style={styles.commentFooterLeftText}>{item?.downvotes?.length}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.commentFooterRight}>
                        <TouchableOpacity onPress={() => handleCommentReply(item?._id, index)}>
                            <Text style={[styles.commentFooterRightText, { color: COLORS.white}]}>Reply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <BottomSheetModal
                ref={sheetRef}
                index={1}
                snapPoints={[height * 0.5, height * 0.9]}
                backdropComponent={(props) => (
                    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />
                )}
                backgroundComponent={({ style }) => (
                    <View style={[style, { backgroundColor: COLORS.white }]} />
                )}
                handleComponent={() => null}
                handleIndicatorComponent={() => null}
                dismissOnPanDown={true}
                dismissOnTap={true}
                onDismiss={handleToggleComments}
                
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', color: COLORS.black, fontSize: 20, fontWeight: 'bold', padding: 10}}>Comments</Text>
                        <TouchableOpacity onPress={() => sheetRef.current?.close()}>
                            <ICONS.Ionicons name="close" size={30} color={COLORS.black} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.body}>
                        <FlatList
                            data={comments}
                            renderItem={renderComment}
                            keyExtractor={(item) => `${item?._id}`}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                />
                            }
                            onEndReached={() => dispatch(fetchComments(item?.comments))}
                        />
                    </View>
                    <View style={styles.commentFooter}>
                        <View style={styles.commentFooterLeft}>
                            <TextInput
                                ref={inputRef}
                                style={styles.footerLeftInput}
                                placeholder="Comment"
                                placeholderTextColor={COLORS.black}
                                onChangeText={(text) => setComment(text)}
                            />
                        </View>
                        <View style={styles.commentFooterRight}>
                            <TouchableOpacity onPress={() => handleSubmit()}>
                                <Text style={styles.commentFooterRightText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
         </BottomSheetModal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: 20,
    },
    body: {
        flex: 8,
    },
    commentContainer: {
        flex: 1,
        margin: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
    },
    commentHeader: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    commentHeaderLeft: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    commentHeaderLeftText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "bold",
        marginLeft: 10,
    },
    commentHeaderRight: {
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    commentHeaderRightText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "bold",
    },
    commentHeaderLeftTextTime: {
        color: COLORS.gray,
        fontSize: 10,
        marginLeft: 10
    },
    commentBody: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    commentBodyText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "bold",
        padding: 5,
    },
    commentFooter: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    commentFooterLeft: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: '85%'

    },
    commentFooterLeftText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "bold",
        marginRight: 10,
    },
    commentFooterRight: {
        // flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        width: '15%'
    },
    commentFooterRightText: {
        color: COLORS.black,
        fontSize: 12,
        fontWeight: "bold",
        marginRight: 12,

    },
    footer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    footerLeft: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    footerLeftInput: {
        flex: 1,
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.black,
        color: COLORS.black,
        fontSize: 12,
        marginLeft: 10,
        marginRight: 10,
        paddingLeft: 10,
        paddingRight: 10,

    },
    footerRight: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    footerRightText: {
        color: COLORS.black,
        fontSize: 12,
        fontWeight: "bold",
        marginLeft: 10,
    },
});

export default Comments;
   