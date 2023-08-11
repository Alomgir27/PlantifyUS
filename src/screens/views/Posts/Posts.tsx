import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    Animated,
    Easing,
    Dimensions,
    ActivityIndicator
} from 'react-native';

import { FlatList , RefreshControl} from 'react-native-gesture-handler';
import { images, icons, COLORS, FONTS, SIZES } from '../../../constants/index';

import * as ICONS from "@expo/vector-icons";

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ToastAndroid, Platform } from 'react-native';

import { fetchPosts, handleResetPostsData } from '../../../modules/data';

import { API_URL } from "../../../constants/index";

import { IPost } from '../../../constants/types';

import axios from "axios";
import { handlePostDownvote, handlePostUpvote, handleAddToFavorite, handleRemoveFromFavorite } from '../../../modules/data';

import PostItem from './PostItem';

const { width, height } = Dimensions.get('window');

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const Posts = ({ route,  navigation }) => {
    const [refreshing, setRefreshing] = useState(false);

    const dispatch = useDispatch();

    const { posts } = useSelector((state) => state?.data);
    const user = useSelector((state) => state?.data.currentUser);

    const [selectedPost, setSelectedPost] = useState<IPost[]>([]);


    useEffect(() => {
        if(!route?.params?._id) {
            setSelectedPost(posts);
        }
    }, [posts, route?.params?._id])

    useEffect(() => {
        if(route?.params?._id) {
            (async () => {
                await axios.get(`${API_URL}/posts/${route?.params?._id}`)
                .then((res) => {
                    setSelectedPost([res?.data?.post]);
                })
                .catch((err) => {
                    console.log(err);
                })
            })();
        }
    }, [route?.params?._id])

    const handleFetchPosts = async () => {
        let ids = selectedPost?.map((item) => item?._id);
        await axios.post(`${API_URL}/posts/fetchMore`, { ids, userId: user?._id })
        .then((res) => {
            setSelectedPost([...selectedPost, ...res?.data?.posts]);
        })
        .catch((err) => {
            console.log(err);
        })
    }


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        if(route?.params?._id) {
            (async () => {
                await axios.get(`${API_URL}/posts/${route?.params?._id}`)
                .then((res) => {
                    setSelectedPost([res?.data?.post]);
                })
                .catch((err) => {
                    console.log(err);
                })
            })();
        } else {
            dispatch(handleResetPostsData());
            dispatch(fetchPosts());
        }
        wait(2000).then(() => setRefreshing(false));
    }
    , []);

    const fetchMore = () => {
       if(!route?.params?._id) {
            handleFetchPosts();
       }
    }

    const renderHeader = () => {
        return (
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <ICONS.Ionicons name="ios-arrow-back" size={24} color={COLORS.primary} onPress={() => navigation?.goBack()} />
                    <Text style={[styles.headerText, { color: COLORS.gray }]}>Posts</Text>
                </View>
                <View style={styles.headerRight}>
                    <Text style={{ ...FONTS.body3, color: COLORS.primary }}>Sort by: </Text>
                    <TouchableOpacity style={styles.headerRightButton}>
                        <Text style={{ ...FONTS.body3, color: COLORS.primary }}>Newest</Text>
                    </TouchableOpacity>

                </View>
            </View>
        )
    }

    const updatePost = (post: IPost) => {
        let index = selectedPost.findIndex((item) => item?._id === post?._id);
        let newPosts = [...selectedPost];
        newPosts[index] = post;
        setSelectedPost(newPosts);
    }

    const handlePress = (type: String, _id: String) => {
        console.log(type, _id);
        if(type === 'upvote') {
            dispatch(handlePostUpvote(_id, updatePost));
        } else if(type === 'downvote') {
            dispatch(handlePostDownvote(_id, updatePost));
        } else if(type === 'favorite') {
            dispatch(handleAddToFavorite('post', _id, updatePost));
        } else if(type === 'unfavorite') {
            dispatch(handleRemoveFromFavorite('post', _id, updatePost));
        }

        if(Platform.OS === 'android') {
            ToastAndroid.showWithGravityAndOffset(
                type === 'upvote' ? 'Upvoted' : type === 'downvote' ? 'Downvoted' : type === 'favorite' ? 'Added to favorites' : 'Removed from favorites',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        }

    }

    const callBack = (_id : String) => {
        (async () => {
             await axios.get(`${API_URL}/posts/${_id}`)
             .then((res) => {
                    let index = selectedPost.findIndex((item) => item?._id === _id);
                    let newPosts = [...selectedPost];
                    newPosts[index] = res?.data?.post;
                    setSelectedPost(newPosts);
             })
             .catch((err) => {
                 console.log(err);
             })
         })();
     }

    const renderPosts = useCallback(() => {
        return (
            <FlatList
                data={selectedPost}
                renderItem={({ item }) => <PostItem item={item} navigation={navigation} type={route?.params?._id ? 'single' : 'all'} handlePress={handlePress} callback={callBack}/>}
                keyExtractor={item => `${item._id}`}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => {
                    return (
                        <View style={{ width: width, height: 1, backgroundColor: COLORS.lightGray }}></View>
                    )
                }}
                onEndReached={fetchMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        )
    }, [posts, selectedPost, refreshing])

    return (
        <View style={styles.container}>
            {renderHeader()}
            {renderPosts()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray2
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerText: {
        marginLeft: SIZES.padding,
        ...FONTS.H2
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerRightButton: {
        padding: 10,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.lightGray2
    }
})

export default Posts;