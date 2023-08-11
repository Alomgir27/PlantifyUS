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
    Easing
} from "react-native";

import { COLORS, FONTS, SIZES } from "../constants/index";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { TextInput, FlatList, RefreshControl} from "react-native-gesture-handler";

import { API_URL } from "../constants/index";

import moment from "moment";

import {
    Modal,
    Portal,
    Provider,
    Button,
    Paragraph,
    Dialog,
} from "react-native-paper";


import { 
    handleCommentDownvote, 
    handleCommentUpvote, 
    handleCommentShow, 
    handleCommentHide, 
    fetchComments, 
    fetchCommentsReset,
    handleCommentSubmit,
    handleCommentDelete
} from "../modules/data";

import * as ICONS from "@expo/vector-icons";

import {
    BottomSheetBackdrop,
    BottomSheetModal,
} from "@gorhom/bottom-sheet";



import { Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Platform , ToastAndroid } from "react-native";

const { width, height } = Dimensions.get("window");

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const Comments = ({  item, isVisible, handleToggleComments, type, callBack } : any) => {
    const comments = useSelector((state) => state?.data?.comments);
    const commentsShow = useSelector((state) => state?.data?.commentsShow);
    const currentUser = useSelector((state) => state?.data?.currentUser);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const dispatch = useDispatch();

    const navigation = useNavigation();


    const [refreshing, setRefreshing] = useState(false);

    const [comment, setComment] = useState("");

    const [commentId, setCommentId] = useState("");
    const [commentForDelete, setCommentForDelete] = useState("");


    const [currentComment, setCurrentComment] = useState("");

    const sheetRef = useRef(null);
    const inputRef = useRef(null)

    useEffect(() => {
        if(callBack) {
            callBack(item?._id);
        }
    }, [comments]);

    

    const onRefresh = () => {
        setRefreshing(true);
        dispatch(fetchCommentsReset());
        dispatch(fetchComments(item?.comments));
        wait(2000).then(() => setRefreshing(false));
    }

    const onReplayRefresh = () => {
        setRefreshing(true);
        dispatch(fetchCommentsReset());
        dispatch(fetchComments(currentComment?.replyTo));
        wait(2000).then(() => setRefreshing(false));
    }

    const handleCommentUpvotePress = (commentId, commentIndex) => {
        dispatch(handleCommentUpvote(commentId, commentIndex));
        if(Platform.OS === 'android') {
            ToastAndroid.show("Upvoted", ToastAndroid.SHORT);
        }

    }

    const handleCommentDownvotePress = (commentId, commentIndex) => {
        dispatch(handleCommentDownvote(commentId, commentIndex));
        if(Platform.OS === 'android') {
            ToastAndroid.show("Downvoted", ToastAndroid.SHORT);
        }
    }

   

    const handleCommentReplySubmit = () => {
        if (comment) {
            dispatch(handleCommentSubmit('replyTo', currentComment?._id, comment, setCurrentComment));
            setComment("");
            inputRef.current?.clear();
            Keyboard.dismiss();
            if(Platform.OS === 'android') {
                ToastAndroid.show("Replied", ToastAndroid.SHORT);
            }
        }
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
            setComment("");
            setCommentId("");
            setCurrentComment("");
        }
        else {
            sheetRef.current?.close();
        }
    }, [commentsShow, isVisible]);

    const handleSubmit = () => {
        if (comment) {
            if(commentId !== "") {
                handleCommentReplySubmit();
                return;
            } else {
                dispatch(handleCommentSubmit(type, item?._id, comment));
                setComment("");
                inputRef.current?.clear();
                Keyboard.dismiss();
                if(Platform.OS === 'android') {
                    ToastAndroid.show("Commented", ToastAndroid.SHORT);
                }
            }
        }
    }

    
   
    const handleCommentReply = (commentId, item) => {
        dispatch(fetchCommentsReset());
        setCommentId(commentId);
        setCurrentComment(item);
    }

    const handleCommentReplyCancel = () => {
        dispatch(fetchCommentsReset());
        setCommentId("");
        setCurrentComment("");
       
    }

   

    const handleCommentDeleteConfirm = (Id) => {
        if (commentId !== "") {
            dispatch(handleCommentDelete('replyTo', commentId, Id, setCurrentComment));
            if(Id === currentComment?._id) {
                setCommentId("");
                setCurrentComment("");
            }
            if(Platform.OS === 'android') {
                ToastAndroid.show("Deleted", ToastAndroid.SHORT);
            }
        } else {
            dispatch(handleCommentDelete(type, item?._id, Id));
            if(Platform.OS === 'android') {
                ToastAndroid.show("Deleted", ToastAndroid.SHORT);
            }
        }
        setIsModalOpen(false);
        setCommentForDelete("");
    }


    const handleDelete = (commentId) => {
        setIsModalOpen(true);
        setCommentForDelete(commentId);
    }

    const renderComment = ({ item, index }) => {
        return (
            <View style={styles.commentContainer}>
                <View style={styles.commentHeader}>
                    <View style={styles.commentHeaderLeft}>
                        <Image source={{ uri: item?.author?.image}} style={{width : 40, height: 40, borderRadius: 25}} />
                    </View>
                    <TouchableOpacity style={styles.commentHeaderRight} onPress={() => {
                        sheetRef.current?.close();
                        navigation.navigate('Profile', { userId: item?.author })
                    }}>
                        <Text style={styles.commentHeaderLeftText}>{item?.author?.name}</Text>
                        <Text style={styles.commentHeaderLeftTextTime}>{moment(item?.createdAt).fromNow()}</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingRight: 10}}>
                        {item?.author?._id === currentUser?._id && (
                            <TouchableOpacity onPress={() => handleDelete(item?._id)} style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 10}}>
                                <ICONS.MaterialCommunityIcons name="dots-vertical" size={20} color={COLORS.white} />
                            </TouchableOpacity>
                        )}
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
                        <TouchableOpacity onPress={() => handleCommentReply(item?._id, item)}>
                            <View style={{ flex: 1, flexDirection: 'row', marginLeft: 10, marginTop: 5}} >
                                 <ICONS.Ionicons name='chatbox-ellipses' size={20} color={COLORS.black} style={[styles.commentFooterLeftText, { fontSize: 20 }]} />
                                <Text style={styles.commentFooterLeftText}>{item?.replyTo?.length}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.commentFooterRight}>
                        <TouchableOpacity onPress={() => handleCommentReply(item?._id, item)}>
                            <Text style={[styles.commentFooterRightText, { color: COLORS.white}]}>Reply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    const renderCommentReply = ({ item, index }) => {
        return (
            <View style={[styles.commentContainer, { marginLeft: 40}]}>
                <View style={styles.commentHeader}>
                    <View style={styles.commentHeaderLeft}>
                        <Image source={{ uri: item?.author?.image}} style={{width : 40, height: 40, borderRadius: 25}} />
                    </View>
                    <View style={styles.commentHeaderRight}>
                        <Text style={styles.commentHeaderLeftText}>{item?.author?.name}</Text>
                        <Text style={styles.commentHeaderLeftTextTime}>{moment(item?.createdAt).fromNow()}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingRight: 10}}>
                        <TouchableOpacity onPress={() => handleCommentReplyCancel()} style={{ flex: 1 / 12, height: 40, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10}} >
                            <ICONS.Ionicons name="arrow-back" size={30} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>

                    {item?.author?._id === currentUser?._id && (
                        <TouchableOpacity onPress={() => handleDelete(item?._id)} style={{  flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 10}}>
                            <ICONS.MaterialCommunityIcons name="dots-vertical" size={20} color={COLORS.white} />
                        </TouchableOpacity>
                    )}

                   

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
                    {commentId !== "" && (
                     <View style={styles.header}>
                        <TouchableOpacity onPress={() => handleCommentReplyCancel()} style={{ flex: 1 / 12, height: 40, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10}} >
                            <ICONS.Ionicons name="arrow-back" size={30} color={COLORS.black} />
                        </TouchableOpacity>
                      </View>
                     )}
                    <View style={styles.body}>
                      {commentId !== "" ? (
                            <FlatList
                                ListHeaderComponent={() => renderComment({ item: currentComment , index: 0})}
                                data={comments}
                                renderItem={renderCommentReply}
                                keyExtractor={(item) => `${item?._id}`}
                                showsVerticalScrollIndicator={false}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onReplayRefresh}
                                    />
                                }
                                onEndReachedThreshold={0.5}
                                onEndReached={() => dispatch(fetchComments(currentComment?.replyTo))}
                            />
                        ) : (
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
                            onEndReachedThreshold={0.5}
                         /> 
                        )}
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

                <Modal
                    visible={isModalOpen}
                    onDismiss={() => setIsModalOpen(false)}
                    contentContainerStyle={{
                        backgroundColor: COLORS.white,
                        padding: 20,
                        margin: 20,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 200,
                        width: 300,
                        alignSelf: 'center'

                    }}

                >
                <View style={{ flex: 1}}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 20}}>
                        <ICONS.MaterialCommunityIcons name="alert-circle" size={30} color={COLORS.black} />
                        <Text style={{ color: COLORS.black, fontSize: 20, fontWeight: 'bold', marginLeft: 10}}>Delete Comment</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 20}}>
                        <Text style={{ color: COLORS.black, fontSize: 16, fontWeight: 'bold', marginLeft: 10}}>Are you sure you want to delete this comment?</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                        <TouchableOpacity onPress={() => setIsModalOpen(false)} style={{ marginRight: 10}}>
                            <Text style={{ color: COLORS.black, fontSize: 16, fontWeight: 'bold'}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleCommentDeleteConfirm(commentForDelete)} style={{ marginRight: 10}}>
                            <Text style={{ color: COLORS.black, fontSize: 16, fontWeight: 'bold'}}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                    
                </Modal>

                
                    

         </BottomSheetModal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: COLORS.white,
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
   
