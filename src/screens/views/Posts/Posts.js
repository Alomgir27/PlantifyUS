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
    Dimensions
} from 'react-native';

import { FlatList , RefreshControl} from 'react-native-gesture-handler';

import { images, icons, COLORS, FONTS, SIZES } from '../../../constants/index';
import MapView, { Marker } from 'react-native-maps';

import * as ICONS from "@expo/vector-icons";

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import moment from 'moment';

import { fetchPosts, handleResetPostsData } from '../../../modules/data';

import { API_URL } from "../../../constants/index";

import axios from "axios";



import PostItem from './PostItem';

const { width, height } = Dimensions.get('window');

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const Posts = ({ route,  navigation }) => {
    const [refreshing, setRefreshing] = useState(false);

    const dispatch = useDispatch();

    const { posts } = useSelector((state) => state?.data);

    const [selectedPost, setSelectedPost] = useState([]);

    useEffect(() => {
        setSelectedPost([]);
        if(route?.params?.item) {
            if(route?.params?.item?.length > 0) {
                route?.params?.item?.map((item) => {
                    setSelectedPost((prev) => [...prev, item?._id])
                })
            }
            else {
                setSelectedPost((prev) => [...prev, route?.params?.item?._id])
            }
        }
    }, [route?.params?.item])


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dispatch(handleResetPostsData());
        dispatch(fetchPosts());
        wait(2000).then(() => setRefreshing(false));
    }
    , []);

    const fetchMore = () => {
        dispatch(fetchPosts());
    }

    const renderHeader = () => {
        return (
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <ICONS.MaterialCommunityIcons name="format-list-bulleted" size={24} color={COLORS.primary} onPress={() => navigation.openDrawer()} />
                    <Text style={styles.headerText}>Posts</Text>
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

    const renderPosts = useCallback(() => {
        return (
            <FlatList
                data={selectedPost?.length > 0 ? posts?.filter((item) => selectedPost?.includes(item?._id)) : posts}
                renderItem={({ item }) => <PostItem item={item} navigation={navigation} />}
                keyExtractor={item => `${item._id}`}
                showsVerticalScrollIndicator={false}
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
        backgroundColor: COLORS.white
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
        ...FONTS.h2
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