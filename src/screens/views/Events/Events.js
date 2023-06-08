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

import { images, icons, COLORS, FONTS, SIZES } from '../../../constants';
import MapView, { Marker } from 'react-native-maps';

import * as ICONS from "@expo/vector-icons";

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import moment from 'moment';

import { fetchEvents, handleResetEventsData } from '../../../modules/data';

import { API_URL } from "../../../constants";

import axios from "axios";

import { useNavigation } from "@react-navigation/native";


import EventItem from './EventItem';

const { width, height } = Dimensions.get('window');

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const Events = ({ route, navigation }) => {
    
        const [refreshing, setRefreshing] = useState(false);

    
        const dispatch = useDispatch();

        const [selectedEvent, setSelectedEvent] = useState([]);

       
        const { events } = useSelector((state) => state?.data);


        useEffect(() => {
            setSelectedEvent([]);
            if(route?.params?.item) {
                if(route?.params?.item?.length > 0) {
                    route?.params?.item?.map((item) => {
                        setSelectedEvent((prev) => [...prev, item?._id])
                    })
                }
                else {
                    setSelectedEvent((prev) => [...prev, route?.params?.item?._id])
                }
            }
        }, [route?.params?.item])
    
        const onRefresh = useCallback(() => {
            setRefreshing(true);
            dispatch(handleResetEventsData());
            dispatch(fetchEvents());
            wait(2000).then(() => setRefreshing(false));
        }, []);

        const fetchMore = () => {
            setRefreshing(true);
            dispatch(fetchEvents());
            setRefreshing(false);
        }
       
        const renderHeader = useCallback(() => {
            return (
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: 20,
                        marginVertical: 10,
                        borderBottomColor: COLORS.lightGray,
                        borderBottomWidth: 1,
                        animation: 'fadeIn',
                        animationDuration: '0.5s',
                        animationTimingFunction: 'ease-in-out'

                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                       <ICONS.Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'column', alignItems: 'flex-start', marginHorizontal: 20, marginVertical: 10 }}>
                        <Text style={{ ...FONTS.body4, color: COLORS.secondary }}>Together we can make a difference</Text>
                        <Text style={{ ...FONTS.body4, color: COLORS.primary }}>#TogetherWeCan</Text>
                    </View>
                </View>
            )
        }, []);

        const renderEvents = useCallback(() => {
            return (
                <FlatList
                    ListHeaderComponent={renderHeader}
                    data={selectedEvent.length > 0 ? events?.filter((item) => selectedEvent?.includes(item?._id)) : events}
                    renderItem={({ item }) => <EventItem item={item} />}
                    keyExtractor={(item) => item._id.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    onEndReached={fetchMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={() => {
                        return (
                            <View style={{ height: 100 }}></View>
                        )
                    }}
                    
                />
            )
        }, [events, selectedEvent, refreshing]);



        return (
            <View style={styles.container}>
                {renderEvents()}
            </View>
        );
    }
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: COLORS.white,
        },
        card: {
            marginHorizontal: 20,
            marginVertical: 10,
            backgroundColor: COLORS.white,
            borderRadius: 10,
            shadowColor: COLORS.shadow,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            animation: 'fadeIn',
            animationDuration: '0.5s',
            animationTimingFunction: 'ease-in-out'
            
        },
        cardImgWrapper: {
            flex: 1,
        },
        cardImg: {
            height: 350,
            width: 300,
            alignSelf: 'center',
            borderRadius: 8,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
        },
        cardInfo: {
            position: 'absolute',
            bottom: 0,
            padding: 10,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            backgroundColor: COLORS.white,
            opacity: 0.9,
            width: '100%',
        },

        MapView: {
            flex: 1,
            height: 100,
            padding: 10,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
        },
        map: {
            ...StyleSheet.absoluteFillObject,

        },
        fundsInfo: {
            flex: 1,
            padding: 10,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
        },
        fundsTitle: {
            ...FONTS.h3,
            color: COLORS.primary,
            marginBottom: 5,
        },
        funds: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 5,
        },
        fundsDetails: {
            ...FONTS.body4,
            color: COLORS.secondary,
        },
        button: {
            backgroundColor: COLORS.primary,
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
        },
        buttonText: {
            ...FONTS.body3,
            color: COLORS.white,
        },
        cardTitle: {
            ...FONTS.h2,
            color: COLORS.primary,
            marginBottom: 5,
        },
        cardDetails: {
            ...FONTS.body3,
            color: COLORS.secondary,
        },
        author: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            margin: 10,
        },
        authorImgWrapper: {
            flex: 1,
        },
        authorImg: {
            height: 50,
            width: 50,
            borderRadius: 25,
        },
        authorInfo: {
            flex: 5,
            marginHorizontal: 10,
            marginVertical: 5,
        },
        authorName: {
            ...FONTS.h3,
            color: COLORS.primary,
        },
        time: {
            ...FONTS.body4,
            color: COLORS.secondary,
        },
        UpDownComments: {
            flexGrow: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 5,
        },
        upvotes: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            margin: 10,
        },
        upvotesIcon: {
            marginRight: 5,
        },
        upvotesText: {
            ...FONTS.body4,
            color: COLORS.secondary,
        },
        downvotes: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            margin: 10,
        },
        downvotesIcon: {
            marginRight: 5,
        },
        downvotesText: {
            ...FONTS.body4,
            color: COLORS.secondary,
        },
        comments: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            margin: 10,
        },
        commentsIcon: {
            marginRight: 5,
        },
        commentsText: {
            ...FONTS.body4,
            color: COLORS.secondary,
        },
        favorite: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            margin: 10,
        },
        favoriteIcon: {
            marginRight: 5,
        },
        favoriteText: {
            ...FONTS.body4,
            color: COLORS.secondary,
        },
        share: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            margin: 10,
        },
        shareIcon: {
            marginRight: 5,
        },
        shareText: {
            ...FONTS.body4,
            color: COLORS.secondary,
        },
    });


export default Events;





       