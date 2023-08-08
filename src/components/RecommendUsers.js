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

import { COLORS, FONTS, SIZES } from "./../constants/index";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { TextInput, FlatList, RefreshControl} from "react-native-gesture-handler";

import { API_URL } from "./../constants/index";

import moment from "moment";



import * as ICONS from "@expo/vector-icons";

import { fetchUsers , clearUsers} from "../modules/data";


import axios from "axios";


const { width, height } = Dimensions.get("window");

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const  RecommendUsers = ({ navigation, setShowRecommendUsers }) => {
    const [refreshing, setRefreshing] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [tab, setTab] = useState('recommend');
    const [friends, setFriends] = useState([]);

    const [search, setSearch] = useState('');

    const dispatch = useDispatch();

    const inputRef = useRef(null);
 

    const currentUser = useSelector((state) => state.data.currentUser);
    const location = useSelector((state) => state.campings.location);
    const nowfriends = useSelector((state) => state?.data?.users);


    const handleSearch = async (search) => {
        setLoading(true);
        await axios.get(`${API_URL}/users/search`, {
            params: {
                search: search,
                limit: 10,
                type: tab === 'recommend' ? 'recommend' : 'friends'
            }
        })
            .then(response => {
                console.log(response.data.message, 'RecommendUsers.js')
                if(tab === 'recommend') {
                    setUsers(response.data.users);
                }
                else {
                    setFriends(response.data.users);
                }
            })
            .catch(error => {
                console.log(error);
                console.log(error.response.data.message, 'RecommendUsers.js')
            })
            .finally(() => {
                setLoading(false);
            }
            )
    }


    const handleRefresh = () => {
        setRefreshing(true);
        setPage(1);
        if(tab !== 'recommend' && currentUser?._id) {
            dispatch(clearUsers());
            dispatch(fetchUsers(currentUser._id));
        }
        wait(2000).then(() => setRefreshing(false));
    };

   

    const handleLoadMoreFriends = () => {
        if(currentUser?._id) {
        dispatch(fetchUsers(currentUser._id));
        }
    }

    const handleLoadMore = () => {
        setPage(page + 1);
    }

    const handleFetchUsers = async () => {
        await axios.get(`${API_URL}/users/recommend`, {
            params: {
                user: currentUser?._id || '',
                location: location,
                page: page
            }
        })
            .then(response => {
                console.log(response.data.message, 'RecommendUsers.js')
                setUsers(response.data.users);
            })
            .catch(error => {
                console.log(error);
                console.log(error.response.data.message, 'RecommendUsers.js')
            })
    }

    useEffect(() => {
        handleFetchUsers();
    }
    , [page]);

    useEffect(() => {
        setFriends(nowfriends);
    }, [nowfriends]);

    const handleFollow = async (user) => {
        await axios.put(`${API_URL}/users/follow`, {
            user: currentUser?._id,
            friend: user?._id
        })
            .then(response => {
                dispatch({
                    type: 'USER_STATE_CHANGE',
                    currentUser: response.data.user
                })
            })
            .catch(error => {
                console.log(error);
                console.log(error.response.data.message, 'RecommendUsers.js')
            })
    }

    const handleUnfollow = async (user) => {
        await axios.put(`${API_URL}/users/unfollow`, {
            user: currentUser?._id,
            friend: user?._id
        })
            .then(response => {
                dispatch({
                    type: 'USER_STATE_CHANGE',
                    currentUser: response.data.user
                })
                console.log(response.data.message, 'RecommendUsers.js')
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleViewProfile = (user) => {
        navigation.navigate('Profile', { user });
    }

   

   


  

    const renderRecommendUser = ({ item }) => (
        <View style={styles.recommendUserContainer}>
            <View style={styles.recommendUser}>
                <View style={styles.recommendUserImageContainer}>
                    <TouchableOpacity onPress={() => handleViewProfile(item)}>
                        <Image
                            source={{ uri: item.image} }
                            resizeMode="cover"
                            style={styles.recommendUserImage}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.recommendUserDetails}>
                    <View style={styles.recommendUserDetailsTop}>
                        <TouchableOpacity onPress={() => handleViewProfile(item)}>
                            <Text style={styles.recommendUserName}>{item.name}</Text>
                            <Text style={styles.recommendUserFriends}>{item.friends.length} friends</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Text style={{ ...FONTS.body4, color: COLORS.gray }}>member since {moment(item.createdAt).format('MMM YYYY')}</Text>
                    </View>
                    <View style={styles.recommendUserDetailsBottom}>
                        <TouchableOpacity onPress={() => handleFollow(item)} disabled={currentUser?.friends.includes(item?._id)}>
                            <Text style={[styles.recommendUserFollow, { color: currentUser?.friends.includes(item?._id) ? COLORS.gray : COLORS.primary }]}>{currentUser?.friends.includes(item?._id) ? 'Following' : 'Follow'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderFriend = ({ item }) => (
        <View style={styles.recommendUserContainer}>
            <View style={styles.recommendUser}>
                <View style={styles.recommendUserImageContainer}>
                    <TouchableOpacity onPress={() => handleViewProfile(item)}>
                        <Image
                            source={{ uri: item.image }}
                            resizeMode="cover"
                            style={styles.recommendUserImage}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.recommendUserDetails}>
                    <View style={styles.recommendUserDetailsTop}>
                        <TouchableOpacity onPress={() => handleViewProfile(item)}>
                            <Text style={styles.recommendUserName}>{item.name}</Text>
                            <Text style={styles.recommendUserFriends}>{item.friends.length} friends</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Text style={{ ...FONTS.body4, color: COLORS.gray }}>member since {moment(item.createdAt).format('DD MMM YYYY')}</Text>
                    </View>

                    <View style={styles.recommendUserDetailsBottom}>
                        <TouchableOpacity onPress={() => handleUnfollow(item)} disabled={!currentUser?.friends.includes(item?._id)}>
                            <Text style={[styles.recommendUserFollow, { color: !currentUser?.friends.includes(item?._id) ? COLORS.gray : COLORS.primary }]}>{!currentUser?.friends.includes(item?._id) ? 'Not Following' : 'Unfollow'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );






    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerSubContainer}>
                    <TouchableOpacity onPress={() => setShowRecommendUsers(false)}>
                        <ICONS.Ionicons name="arrow-back" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{tab === 'recommend' ? 'Recommend Users' : 'Friends'}</Text>
                    <TouchableOpacity onPress={() => setTab(tab === 'recommend' ? 'friends' : 'recommend')}>
                        <ICONS.Ionicons name={tab === 'recommend' ? "git-compare" : "git-compare-outline"} size={24} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.action}>
                <TextInput
                    placeholder={tab === 'recommend' ? "Search for users" : "Search for friends"}
                    placeholderTextColor={COLORS.primary}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => setSearch(val)}
                    onSubmitEditing={() => handleSearch(search)}
                    ref={inputRef}
                />
            </View>
            <View style={styles.body}>
                {tab === 'recommend' ? (
                    <FlatList
                        data={users}
                        renderItem={renderRecommendUser}
                        keyExtractor={item => `${item._id}`}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                            />
                        }
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                    />
                ) : (
                    <FlatList
                        data={friends}
                        renderItem={renderFriend}
                        keyExtractor={item => `${item._id}`}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                            />
                        }
                        onEndReached={handleLoadMoreFriends}
                        onEndReachedThreshold={0.5}
                    />
                )}
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    headerContainer: {
        backgroundColor: COLORS.primary,
        height: 60,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 10
    },
    headerSubContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    headerTitle: {
        color: COLORS.white,
        ...FONTS.h3
    },
    body: {
        flex: 1,
        paddingHorizontal: 20
    },
    recommendUserContainer: {
        marginBottom: 20
    },
    recommendUser: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    recommendUserImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden'
    },
    recommendUserImage: {
        width: '100%',
        height: '100%'
    },
    recommendUserDetails: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    recommendUserDetailsTop: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    recommendUserName: {
        ...FONTS.body3
    },
    recommendUserFriends: {
        ...FONTS.body4
    },
    recommendUserDetailsBottom: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    recommendUserFollow: {
        color: COLORS.primary,
        ...FONTS.body3
    },
    header: {
        backgroundColor: COLORS.primary,
        height: 60,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 10
    },
   
    action: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray2,
        paddingBottom: 5,
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.red,
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: -12,
        paddingLeft: 10,
        color: COLORS.primary,
    },
    commandButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        marginTop: 10,
    },
   
});


export default RecommendUsers;

