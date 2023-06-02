import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';

import { FlatList , RefreshControl} from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-gesture-handler';

import { images, icons, COLORS, FONTS, SIZES } from './../../constants';
import MapView, { Marker } from 'react-native-maps';

import * as ICONS from "@expo/vector-icons";

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import moment from 'moment';

import { fetchEvents, clearData, handleComments, handleDownVote, handleUpVote } from './../../modules/data';

import { API_URL } from "./../../constants";

import axios from "axios";

import { useNavigation } from "@react-navigation/native";



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




const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const Events = ({ navigation }) => {
    
        const [refreshing, setRefreshing] = useState(false);
        const [collapsed, setCollapsed] = useState(true);
        const [scrollTop, setScrollTop] = useState(false);
    
        const dispatch = useDispatch();
    
        const { events } = useSelector((state) => state?.data);


       
    
        const onRefresh = useCallback(() => {
            setRefreshing(true);
            dispatch(clearData());
            dispatch(fetchEvents());
            wait(2000).then(() => setRefreshing(false));
        }, []);

        const fetchMore = () => {
            setRefreshing(true);
            dispatch(fetchEvents());
            setRefreshing(false);
        }

        const toggleExpanded = () => {
            setCollapsed(!collapsed);
        };

        const handleUpVote = (id) => {
            dispatch(handleUpVote(id));
        }

        const handleDownVote = (id) => {
            dispatch(handleDownVote(id));
        }

        const handleComments = (id) => {
            dispatch(handleComments(id));
        }


        const renderList = (item) => {
            return (
                <View
                    style={styles.card}
                >
                    <View style={styles.author}>
                        <View style={styles.authorImgWrapper}>
                            <Image
                                source={{ uri: item?.author?.image }}
                                resizeMode="cover"
                                style={styles.authorImg}
                            />
                        </View>
                        <View style={styles.authorInfo}>
                            <Text style={styles.authorName}>{item?.author?.name}</Text>
                            <Text style={styles.time}>{moment(item?.createdAt).fromNow()}</Text>
                        </View>
                    </View>
                    <View style={styles.cardImgWrapper}
                        onPress={() => navigation.navigate("Event", { item })}
                    >
                        {item?.images?.length === 1 && (
                            <Image
                                source={{ uri: item?.images[0] }}
                                resizeMode="cover"
                                style={styles.cardImg}
                            />
                        )}
                        {item?.images?.length > 1 && (
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={item?.images}
                                renderItem={({ item }) => (
                                    <Image
                                        source={{ uri: item }}
                                        resizeMode="cover"
                                        style={styles.cardImg}
                                    />
                                )}
                                keyExtractor={(item) => item}
                                ItemSeparatorComponent={() => <View style={{ margin: 5 }} />}
                            />
                        )}
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle}>{item?.title}</Text>
                            <Text numberOfLines={2} style={styles.cardDetails}>
                                {item?.description}
                            </Text>
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginHorizontal: 20,
                                    marginVertical: 10,
                                    borderBottomColor: COLORS.lightGray,
                                    borderBottomWidth: 1,
                                }}
                                onPress={toggleExpanded}
                            >
                                {collapsed ? (
                                    <ICONS.Ionicons name="chevron-down" size={24} color={COLORS.primary} />
                                ) : (
                                    <ICONS.Ionicons name="chevron-up" size={24} color={COLORS.primary} />
                                )}
                            </TouchableOpacity>
                            {!collapsed && (
                                <View>
                                    <Text style={styles.cardDetails}>
                                        {item?.landsDescription}
                                    </Text>
                                    <Text style={styles.cardDetails}>
                                        {item?.requirements?.trees} trees
                                    </Text>
                                    <Text style={styles.cardDetails}>
                                        {item?.requirements?.volunteers} volunteers
                                    </Text>
                                </View>
                            )}

                        </View>
                    </View>
                    <View style={styles.MapView}>
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: item?.location?.coordinates[0],
                                longitude: item?.location?.coordinates[1], 
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                            initialCamera={{
                                center: {
                                    latitude: item?.location?.coordinates[0],
                                    longitude: item?.location?.coordinates[1],
                                },
                                pitch: 0,
                                heading: 0,
                                altitude: 1000,
                                zoom: 10,
                            }}

                        >
                            <Marker
                                coordinate={{
                                    latitude: item?.location?.coordinates[0],
                                    longitude: item?.location?.coordinates[1],
                                }}
                                title={item?.title}
                                description={item?.description}
                                zoomEnabled={true}
                                zoomControlEnabled={true}
                                zoomTapEnabled={true}
                                draggable={true}
                                flat={true}
                                onPress={() => console.log('Marker Pressed')}
                                onDragEnd={(e) => console.log('Marker Dragged', e.nativeEvent.coordinate)}


                            />
                        </MapView>
                    </View>
                    <View style={styles.fundsInfo}>
                        <Text style={styles.fundsTitle}>Funds</Text>
                        <View style={styles.funds}>
                            <Text style={styles.fundsDetails}>
                                collected: {item?.collectedFunds} $ / required: {item?.requirements?.funds} $
                            </Text>
                            <Text style={styles.fundsDetails}>
                                {item?.collectedFunds / item?.requirements?.funds * 100} %
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Donate</Text>
                        </TouchableOpacity>
                    </View>
                    {/* upvotes downvotes and comments */}
                    <ScrollView  
                       horizontal={true} 
                       showsHorizontalScrollIndicator={false} 
                       contentContainerStyle={styles.UpDownComments}
                    >
                        <TouchableOpacity style={styles.upvotes}
                            onPress={() => handleUpVote(item?._id)}
                        >
                            <Text style={styles.upvotesIcon}>
                                <ICONS.Ionicons name="thumbs-up" size={24} color={COLORS.primary} />
                            </Text>
                            <Text style={styles.upvotesText}>
                                {item?.upvotes?.length || 100} upvotes
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.downvotes}
                            onPress={() => handleDownVote(item?._id)}
                        >
                            <Text style={styles.downvotesIcon}>
                                <ICONS.Ionicons name="thumbs-down" size={24} color={COLORS.primary} />
                            </Text>
                            <Text style={styles.downvotesText}>
                                {item?.downvotes?.length || 69} downvotes
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.comments}
                            onPress={() => handleComments(item?._id)}
                        >
                            <Text style={styles.commentsIcon}>
                                <ICONS.Ionicons name="chatbox-ellipses" size={24} color={COLORS.primary} />
                            </Text>
                            <Text style={styles.commentsText}>
                                {item?.comments?.length || 13} comments
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.share}
                            onPress={() => console.log('share')}
                        >
                            <Text style={styles.shareIcon}>
                                <ICONS.Ionicons name="share-social" size={24} color={COLORS.primary} />
                            </Text>
                            <Text style={styles.shareText}>
                                {item?.shares?.length || 13} share
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.favorite}
                            onPress={() => console.log('favorite')}
                        >
                            <Text style={styles.favoriteIcon}>
                                {item?.favorites?.includes(user?._id) ? (
                                    <ICONS.Ionicons name="heart" size={24} color={COLORS.primary} />
                                ) : (
                                    <ICONS.Ionicons name="heart-outline" size={24} color={COLORS.primary} />
                                )}
                            </Text>
                            <Text style={styles.favoriteText}>
                                {item?.favorites?.includes(user?._id) ? 'my favorite' : 'add to favorite'}
                            </Text>
                            
                        </TouchableOpacity>

                    </ScrollView>
                    
                </View>
            );
        }

       
       

        return (
            <View style={styles.container}>
                {!scrollTop && (
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
                )}
                

                <FlatList
                    data={events}
                    renderItem={({ item }) => renderList(item)}
                    keyExtractor={(item) => item._id}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    onEndReached={fetchMore}
                    onScroll={(e) => {
                        if(e.nativeEvent.contentOffset.y > 0) {
                            setScrollTop(true);
                        } else {
                            setScrollTop(false);
                        }
                    }
                    }
                    
                />
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





       