// @ts-nocheck

import React, { useState, useEffect, useCallback } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    TouchableWithoutFeedback,
} from 'react-native';

import { ScrollView , RefreshControl} from 'react-native-gesture-handler';
import { TextInput } from 'react-native-gesture-handler';

import { images, icons, FONTS, SIZES } from '../constants/index';

import * as ICONS from "@expo/vector-icons";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";


import moment from 'moment';

import { fetchAllDefaultData, clearData } from '../modules/data';
import RecommendUsers from '../components/RecommendUsers';

import { COLORS } from "../constants/index";
import { Block, Button, Text as Text2, Image as Image2 } from "../components/";
import { useData, useTheme } from "../hooks/";
import { ActivityIndicator } from "react-native-paper";

const Home = ({ navigation}: any) => {
    const { assets, colors, gradients, sizes } = useTheme();
    const [loading, setLoading] = useState<Boolean>(false);

    const [showRecommendUsers, setShowRecommendUsers] = useState(false);

    const events = useSelector(state => state?.data?.events);
    const trees = useSelector(state => state?.trees?.trees); 
    const organizations = useSelector(state => state?.data?.organizations);
    const posts = useSelector(state => state?.data?.posts);
    const user = useSelector(state => state?.data?.currentUser);
    const friends = useSelector(state => state?.data?.users);
    const loadingData = useSelector(state => state?.data?.loading);




    const dispatch = useDispatch();

    const IMAGE_VERTICAL_SIZE =
      (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
    


    const onRefresh = () => {
        setLoading(true);
        dispatch(clearData())
        dispatch(fetchAllDefaultData(setLoading));
    }




   

    React.useEffect(() => {
    }, []);

    // Render

    function renderNewPlants(item: any, index: any) {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: SIZES.base }}>
               <TouchableOpacity
                    onPress={() => navigation.navigate('Plants', { _id : item?._id})}
                >
                <Image
                    source={{ uri: item?.images[0] }}
                    resizeMode="cover"
                    style={{
                        width: SIZES.width * 0.23,
                        height: '90%',
                        borderRadius: 15
                    }}
                />

                <View
                    style={{
                        position: 'absolute',
                        bottom: '17%',
                        right: 0,
                        backgroundColor: COLORS.primary,
                        paddingHorizontal: SIZES.base,
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                    }}
                >
                    <Text p numberOfLines={1} style={{ color: COLORS.white, ...FONTS.body4 }}>{item?.name}</Text>
                </View>
                </TouchableOpacity>
            </View>
        )
    }

    const ListNewPlantsFooterComponent = () => {
        if(trees.length > 3) {
            return (
                <Button row  middle shadow style={{ width: SIZES.width * 0.23, height: '90%', borderRadius: 15 }} onPress={() => navigation.navigate('Plants')}>
                    <Image
                        source={icons.chevron}
                        resizeMode="contain"
                        style={{
                            marginLeft: SIZES.base,
                            width: 30,
                            height: 30,
                        }}
                    />
                </Button>
            )
        } else {
            return (
                <View></View>
            )
        }
    }

    function renderFriendsComponent() {
        if (friends.length === 0) {
            return (
                <View></View>
            )
        } else if (friends.length <= 3) {
            return (
                friends?.map((item: any, index: any) => (
                    <View
                        key={`friend-${index}`}
                        style={index == 0 ? { flexDirection: 'row' } : { flexDirection: 'row', marginLeft: -20 }}
                    >
                        <Image
                            source={{ uri: item?.image }}
                            resizeMode="cover"
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                borderWidth: 3,
                                borderColor: COLORS.primary
                            }}
                        />
                    </View>
                ))
            )
        } else {
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {friends?.slice(0, 3).map((item, index) => {
                        if (index <= 2) {
                            return (
                                <View
                                    key={`friend-${index}`}
                                    style={index == 0 ? {} : { marginLeft: -20 }}
                                >
                                    <Image
                                        source={{ uri: item?.image }}
                                        resizeMode="cover"
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                            borderWidth: 3,
                                            borderColor: COLORS.primary
                                        }}
                                    />
                                </View>
                            )
                        }
                    })}

                    <Text style={{ marginLeft: 5, color: COLORS.secondary, ...FONTS.body3 }}>+{friends.length - 3} More</Text>
                </View>
            )
        }
    }

    function renderEvent(item, index) {
        if(item?.images?.length === 1) {
            //if only one image then cover the whole card with the image and show the title
            return (
                <TouchableWithoutFeedback
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        marginVertical: SIZES.base,
                        borderRadius: 20,
                        backgroundColor: COLORS.white,
                        ...styles.shadow
                    }}
                    
                    onPress={() => navigation.navigate('Events', { _id: item?._id})}
                >
                    <View style={{ marginBottom: SIZES.padding }}>
                        <Image
                            source={{ uri: item?.images[0] }}
                            resizeMode="cover"
                            style={{
                                flex: 1,
                                width: 320,
                                height: 320,
                                borderRadius: SIZES.radius * 2
                            }}
                        />

                        <View style={{
                            position: 'absolute',
                            bottom: 0,
                            // height: 80,
                            width: SIZES.width * 0.6,
                            backgroundColor: COLORS.white,
                            borderTopRightRadius: SIZES.radius,
                            borderBottomLeftRadius: SIZES.radius,
                            opacity: 0.9,
                            justifyContent: 'center',
                            ...styles.shadow
                        }}> 
                            <View style={{ flexDirection: 'column', marginTop: SIZES.radius, paddingLeft: 10 }}>
                               <Text2 numberOfLines={1} style={{ ...FONTS.H4 }}>{item?.title}</Text2>
                                {item?.status === "pending" && (
                                    <Text style={{ ...FONTS.body4, color: COLORS.gray }}>Pending</Text>
                                )}
                                {item?.status === "approved" && (
                                    <Text style={{ ...FONTS.body4, color: COLORS.green }}>Approved</Text>
                                )}
                                {item?.status === "rejected" && (
                                    <Text style={{ ...FONTS.body4, color: COLORS.red }}>Rejected</Text>
                                )}
                                {item?.status === "completed" && (
                                    <Text style={{ ...FONTS.body4, color: COLORS.primary }}>Completed</Text>
                                )}
                            </View>

                            <Text2 p primary paddingLeft={10} paddingBottom={0}>About the Organization</Text2>
                            <View style={{ flexDirection: 'row', paddingLeft: 10}}>
                                {item?.organization?.name && (
                                    <Text2 p secondary numberOfLines={1} >{item?.organization?.name}</Text2>
                                )}
                            </View>
                              {item?.hostDetails?.message && (
                                    <Text2 p secondary numberOfLines={2} paddingLeft={10} paddingBottom={10}>{item?.hostDetails?.message}</Text2>
                             )}
                             {item?.hostDetails && (
                                    <Text2 p primary bold numberOfLines={2} paddingLeft={10} paddingBottom={10}>Host time: {new Date(parseInt(item?.hostDetails?.year), parseInt(item?.hostDetails?.month) - 1, parseInt(item?.hostDetails?.day), parseInt(item?.hostDetails?.startTime)) > new Date() ? moment(new Date(parseInt(item?.hostDetails?.year), parseInt(item?.hostDetails?.month) - 1, parseInt(item?.hostDetails?.day), parseInt(item?.hostDetails?.startTime))).fromNow() : "Event has ended"}</Text2>
                             )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            )
        } else if(item?.images?.length === 2) {
            //if there are 2 images then show the images in a collage
            return (
                <TouchableWithoutFeedback
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        marginVertical: SIZES.base,
                        borderRadius: 20,
                        backgroundColor: COLORS.white,
                        ...styles.shadow
                    }}
                    onPress={() => navigation.navigate('Events', { _id: item?._id})}
                >
                    <View style={{ marginBottom: SIZES.padding }}>
                        <Image
                            source={{ uri: item?.images[0] }}
                            resizeMode="contain"
                            style={{
                                width: 300,
                                height: 150,
                                borderRadius: SIZES.radius,
                            }}
                        />

                        <Image
                            source={{ uri: item?.images[1] }}
                            resizeMode="contain"
                            style={{
                                marginTop: SIZES.radius,
                                width: 300,
                                height: 150,
                                borderRadius: SIZES.radius
                            }}
                        />
                        <View style={{
                            position: 'absolute',
                            bottom: 0,
                            // height: 80,
                            width: SIZES.width * 0.3,
                            backgroundColor: COLORS.white,
                            borderTopRightRadius: SIZES.radius,
                            borderBottomLeftRadius: SIZES.radius,
                            opacity: 0.9,
                            justifyContent: 'center',
                            ...styles.shadow
                        }}>
                             <View style={{ flexDirection: 'column', marginTop: SIZES.radius, paddingLeft: 10 }}>
                               <Text2 numberOfLines={1} style={{ ...FONTS.H4 }}>{item?.title}</Text2>
                                {item?.status === "pending" && (
                                    <Text style={{ ...FONTS.body4, color: COLORS.gray }}>Pending</Text>
                                )}
                                {item?.status === "approved" && (
                                    <Text style={{ ...FONTS.body4, color: COLORS.green }}>Approved</Text>
                                )}
                                {item?.status === "rejected" && (
                                    <Text style={{ ...FONTS.body4, color: COLORS.red }}>Rejected</Text>
                                )}
                                {item?.status === "completed" && (
                                    <Text style={{ ...FONTS.body4, color: COLORS.primary }}>Completed</Text>
                                )}
                            </View>

                            <Text2 p primary paddingLeft={10} paddingBottom={0}>About the Organization</Text2>
                            <View style={{ flexDirection: 'row', paddingLeft: 10}}>
                                {item?.organization?.name && (
                                    <Text2 p secondary numberOfLines={1} >{item?.organization?.name}</Text2>
                                )}
                            </View>
                              {item?.hostDetails?.message && (
                                    <Text2 p secondary numberOfLines={2} paddingLeft={10} paddingBottom={10}>{item?.hostDetails?.message}</Text2>
                             )}
                           </View>
                    </View>
                </TouchableWithoutFeedback>
            )
        }   else if(item?.images?.length === 3) {
            //if there are 3 images then show the first two images like a collage and show the third image as a full image
            return (
                <TouchableWithoutFeedback
                    style={{ flex: 1, marginRight: index == events.length - 1 ? 0 : SIZES.padding }}
                    onPress={() => navigation.navigate('Events', { _id: item?._id})}
                >
                    <View style={{ marginBottom: SIZES.padding }}>
                        <Image
                            source={{ uri: item?.images[0] }}
                            resizeMode="contain"
                            style={{
                                width: 300,
                                height: 150,
                                borderRadius: SIZES.radius
                            }}
                        />
                        
                        <View style={{ flexDirection: 'row', marginTop: SIZES.radius }}>
                            <Image
                                source={{ uri: item?.images[1] }}
                                resizeMode="contain"
                                style={{
                                    width: 150,
                                    height: 150,
                                    borderRadius: SIZES.radius,
                                    marginRight: SIZES.radius
                                }}
                            />
                            <Image
                                source={{ uri: item?.images[2] }}
                                resizeMode="contain"
                                style={{
                                    width: 150,
                                    height: 150,
                                    borderRadius: SIZES.radius
                                }}
                            />
                        </View>
                        <View style={{
                            position: 'absolute',
                            bottom: 0,
                            // height: 80,
                            width: SIZES.width * 0.3,
                            backgroundColor: COLORS.white,
                            borderTopRightRadius: SIZES.radius,
                            borderBottomLeftRadius: SIZES.radius,
                            opacity: 0.9,
                            justifyContent: 'center',
                            ...styles.shadow
                        }}>
                             <View style={{ flexDirection: 'column', marginTop: SIZES.radius, paddingLeft: 10 }}>
                               <Text2 numberOfLines={1} style={{ ...FONTS.H4 }}>{item?.title}</Text2>
                                {item?.status === "pending" && (
                                    <Text style={{ ...FONTS.body4, color: COLORS.gray }}>Pending</Text>
                                )}
                                {item?.status === "approved" && (
                                    <Text style={{ ...FONTS.body4, color: COLORS.green }}>Approved</Text>
                                )}
                                {item?.status === "rejected" && (
                                    <Text style={{ ...FONTS.body4, color: COLORS.red }}>Rejected</Text>
                                )}
                                {item?.status === "completed" && (
                                    <Text style={{ ...FONTS.body4, color: COLORS.primary }}>Completed</Text>
                                )}
                            </View>

                            <Text2 p primary paddingLeft={10} paddingBottom={0}>About the Organization</Text2>
                            <View style={{ flexDirection: 'row', paddingLeft: 10}}>
                                {item?.organization?.name && (
                                    <Text2 p numberOfLines={1} >{item?.organization?.name}</Text2>
                                )}
                            </View>
                              {item?.hostDetails?.message && (
                                    <Text2 p  secondary numberOfLines={2} paddingLeft={10} paddingBottom={10}>{item?.hostDetails?.message}</Text2>
                             )}
                             {item?.hostDetails?.startTime && (
                                    <Text2 p secondary numberOfLines={2} paddingLeft={10} paddingBottom={10}>{item?.hostDetails?.startTime}</Text2>
                                )}
                           </View>
                    </View>
                </TouchableWithoutFeedback>
            )
        }
        else {
            //if there are more than 3 images then show the first image and show the number of images on top of the image
            return (
                <TouchableWithoutFeedback
                    style={{ flex: 1, marginRight: index == events.length - 1 ? 0 : SIZES.padding }}
                    onPress={() => navigation.navigate('Events', { _id: item?._id})}
                >
                    <View style={{ marginBottom: SIZES.padding }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={{ uri: item?.images[0] }}
                                resizeMode="contain"
                                style={{
                                    width: 150,
                                    height: 150,
                                    borderRadius: SIZES.radius,
                                    marginRight: SIZES.radius
                                }}
                            />
                            <Image
                                source={{ uri: item?.images[1] }}
                                resizeMode="contain"
                                style={{
                                    width: 150,
                                    height: 150,
                                    borderRadius: SIZES.radius
                                }}
                            />
                        </View>
                        
                        <View style={{ flexDirection: 'row', marginTop: SIZES.radius }}>
                            <Image
                                source={{ uri: item?.images[2] }}
                                resizeMode="contain"
                                style={{
                                    width: 150,
                                    height: 150,
                                    borderRadius: SIZES.radius,
                                    marginRight: SIZES.radius
                                }}
                            />
                         <View style={{ flex: 1}}>
                            <Image
                                source={{ uri: item?.images[3] }}
                                resizeMode="contain"
                                style={{
                                    width: 150,
                                    height: 150,
                                    borderRadius: SIZES.radius
                                }}
                            />
                            <Text
                              style={{
                                position: 'absolute',
                                justifyContent: 'center',
                                alignItems:'center',
                                color: COLORS.white,
                                top: 50,
                                left: 30,
                                fontSize: 25
                              }}
                              >{item?.images?.length - 3}+</Text>

                         </View>
                        </View>
                        <View style={{
                            position: 'absolute',
                            bottom: 0,
                            // height: 80,
                            width: SIZES.width * 0.3,
                            backgroundColor: COLORS.white,
                            opacity: 0.9,
                            borderTopRightRadius: SIZES.radius,
                            borderBottomLeftRadius: SIZES.radius,
                            justifyContent: 'center',
                            ...styles.shadow
                        }}>
                            <View style={{ flexDirection: 'column', marginTop: SIZES.radius, paddingLeft: 10 }}>
                               <Text2 numberOfLines={1} style={{ ...FONTS.H4 }}>{item?.title}</Text2>
                                {item?.status === "pending" && (
                                    <Text style={{ ...FONTS.body4, color: COLORS.gray }}>Pending</Text>
                                )}
                                {item?.status === "approved" && (
                                    <Text style={{ ...FONTS.body4, color: COLORS.green }}>Approved</Text>
                                )}
                                {item?.status === "rejected" && (
                                    <Text style={{ ...FONTS.body4, color: COLORS.red }}>Rejected</Text>
                                )}
                                {item?.status === "completed" && (
                                    <Text style={{ ...FONTS.body4, color: COLORS.primary }}>Completed</Text>
                                )}
                            </View>

                            <Text2 p primary paddingLeft={10} paddingBottom={0}>About the Organization</Text2>
                            <View style={{ flexDirection: 'row', paddingLeft: 10}}>
                                {item?.organization?.name && (
                                    <Text2 p secondary numberOfLines={1} >{item?.organization?.name}</Text2>
                                )}
                            </View>
                              {item?.hostDetails?.message && (
                                    <Text2 p secondary numberOfLines={2} paddingLeft={10} paddingBottom={10}>{item?.hostDetails?.message}</Text2>
                             )}
                           </View>
                    </View>
                </TouchableWithoutFeedback>
            )
         }
    }

    function renderPost(item, index){            
        return (
            <TouchableWithoutFeedback
                style={{ flex: 1, marginBottom: SIZES.padding * 2 , paddingRight: index == posts?.length - 1 ? SIZES.padding * 2 : 0 }}
                onPress={() => navigation.navigate('Posts', { _id: item?._id})}
            >
            <View>
                <View style={{ flex: 1, marginBottom: SIZES.padding }}>
                    {/* Post Image */}
                    {item?.images?.length === 1 && (
                        <Image
                            source={{ uri: item?.images[0] }}
                            resizeMode="cover"
                            style={{
                                width: 300,
                                height: 400,
                                borderRadius: SIZES.radius
                            }}
                        />
                    )
                    }
                    {item?.images?.length === 2 && (
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={{ uri: item?.images[0] }}
                                resizeMode="cover"
                                style={{
                                    width: 150,
                                    height: 400,
                                    borderRadius: SIZES.radius,
                                    marginRight: SIZES.radius - 5
                                }}
                            />
                            <Image
                                source={{ uri: item?.images[1] }}
                                resizeMode="cover"
                                style={{
                                    width: 150,
                                    height: 400,
                                    borderRadius: SIZES.radius
                                }}
                            />
                        </View>
                    )
                    }
                    {item?.images?.length === 3 && (
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={{ uri: item?.images[0] }}
                                resizeMode="cover"
                                style={{
                                    width: 150,
                                    height: 400,
                                    borderRadius: SIZES.radius,
                                    marginRight: SIZES.radius
                                }}
                            />
                            <View style={{ flex: 1 }}>
                                <Image
                                    source={{ uri: item?.images[1] }}
                                    resizeMode="cover"
                                    style={{
                                        width: 150,
                                        height: 200,
                                        borderRadius: SIZES.radius,
                                        marginBottom: SIZES.radius
                                    }}
                                />
                                <Image
                                    source={{ uri: item?.images[2] }}
                                    resizeMode="cover"
                                    style={{
                                        width: 150,
                                        height: 200,
                                        borderRadius: SIZES.radius
                                    }}
                                />
                            </View>
                        </View>
                    )
                    }
                    {item?.images?.length > 3 && (
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Image
                                    source={{ uri: item?.images[0] }}
                                    resizeMode="cover"
                                    style={{
                                        width: 150,
                                        height: 200,
                                        borderRadius: SIZES.radius,
                                        marginBottom: SIZES.radius,
                                        marginRight: SIZES.radius
                                    }}
                                />
                                <Image
                                    source={{ uri: item?.images[1] }}
                                    resizeMode="cover"
                                    style={{
                                        width: 150,
                                        height: 200,
                                        borderRadius: SIZES.radius,
                                        marginBottom: SIZES.radius,
                                    }}
                                />
                                <View style={{ position: 'absolute', top: '20%', right: '40%', backgroundColor: COLORS.transparent, width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: COLORS.white, ...FONTS.H3 }}>{item?.images?.length - 3}+</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Image
                                    source={{ uri: item?.images[2] }}
                                    resizeMode="cover"
                                    style={{
                                        width: 150,
                                        height: 200,
                                        borderRadius: SIZES.radius,
                                        marginBottom: SIZES.radius,
                                        marginRight: SIZES.radius
                                    }}
                                />
                                <Image
                                    source={{ uri: item?.images[3] }}
                                    resizeMode="cover"
                                    style={{
                                        width: 150,
                                        height: 200,
                                        borderRadius: SIZES.radius,
                                        marginBottom: SIZES.radius,
                                    }}
                                />
                            </View>
                        </View>
                    )
                    }

                </View>
               
                {/* Post Details */}
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    width: SIZES.width * 0.80,
                    backgroundColor: COLORS.white,
                    opacity: 0.9,
                    borderRadius: SIZES.radius,
                    justifyContent: 'center',
                    ...styles.shadow
                }}>
                    {/* Post Tag */}
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        backgroundColor: COLORS.primary,
                        paddingHorizontal: SIZES.padding,
                        paddingVertical: SIZES.base,
                        borderTopLeftRadius: SIZES.radius,
                        borderBottomRightRadius: SIZES.radius,
                        marginBottom: SIZES.padding,

                    }}>
                      
                        <Text style={{ color: COLORS.white, ...FONTS.H4 }} numberOfLines={1}>{item?.tags?.map((tag) => "#" +tag + " ")} </Text>
                    </View>

                    {/* Post caption */}
                    <Text 
                      style={{ color: COLORS.secondary, ...FONTS.body3, marginTop: 15, paddingTop: SIZES.padding, paddingLeft: SIZES.padding, paddingBottom: SIZES.padding - 10 }}
                        numberOfLines={1}
                     >
                        {item?.text }
                    </Text>

                    {/* Event details */}
                    <View style={{ flexDirection: 'row', marginLeft: SIZES.padding }}>
                        <Image
                            source={{ uri: item?.event?.images[0] }}
                            resizeMode='cover'
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                marginRight: SIZES.base,
                                marginTop: SIZES.base
                            }}
                        />
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                          <Text style={{ color: COLORS.secondary, ...FONTS.body3 }}>{item?.event?.title?.length > 20 ? item?.event?.title.slice(0, 20) + "..." : item?.event?.title}</Text>
                          <Text style={{ color: COLORS.gray, ...FONTS.body4 }}>{item?.event?.status}</Text>
                        </View>
                    </View>

                    {/* Post Author */}
                    <View style={{ flex: 1, justifyContent: 'flex-end', marginHorizontal: SIZES.padding, marginBottom: SIZES.padding }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={{ uri: item?.author?.image }}
                                resizeMode="cover"
                                style={{ width: 40, height: 40, borderRadius: 20 }}
                            />
                            <View style={{
                                flex: 1
                            }}>
                              <Text style={{ marginLeft: SIZES.base, color: COLORS.black, ...FONTS.body3 }}>{item?.author?.name}</Text> 
                              <Text style={{ marginLeft: SIZES.base, color: COLORS.gray, ...FONTS.body4 }}>{item?.author?.type === 'user' ? 'User' : 'Admin'} {" / "} {moment(item?.createdAt).format('MMMM Do YYYY, h:mm a')}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            </TouchableWithoutFeedback>
        )
    }

    function ListFooterComponent({ routeName, length, navigation }) {
        if(length > 3) {
            return (
                <TouchableOpacity style={{
                    flex: 1,
                    width: 150,
                    height: 300,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: SIZES.base,
                    borderRadius: 20,
                    marginHorizontal: SIZES.base * 2,
                    // backgroundColor: COLORS.white,
                    // ...styles.shadow
                }}
                onPress={() => navigation.navigate(routeName)}
                >
                <View style={{
                    backgroundColor: COLORS.gray,
                    width: 100,
                    height: 100,
                    padding: 10,
                    borderRadius: 50,
                    marginRight: 20,
                    marginLeft: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: SIZES.base * 2,
                    // ...styles.shadow
                }}

                >
                    <Image
                        source={icons.chevron}
                        style={{
                            width: 40,
                            height: 40,
                            tintColor: COLORS.white,
                            alignSelf: 'center',
                        }}
                        />
                </View>
                </TouchableOpacity>
            )
        } else {
            return (
                <View style={{ marginBottom: 20 }}></View>
            )
        }
    }

    const renderHeader = useCallback(() => {
        return (
            <View style={{ paddingHorizontal: SIZES.padding }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text2 h3 style={{ color: COLORS.white, ...FONTS.H2 }}>Hello! <ICONS.MaterialCommunityIcons name="leaf" size={30} color={colors.text} /></Text2>
                        <Text2 p style={{ color: COLORS.white, ...FONTS.body3 }}>What would you like to find?</Text2>
                    </View>
                </View>
            </View>
        )
    }, [user, colors]);

    const renderSearch = useCallback(() => {
        return (
            <View style={{
                flexDirection: 'row',
                height: 50,
                alignItems: 'center',
                marginHorizontal: SIZES.padding,
                paddingHorizontal: SIZES.radius,
                borderRadius: 10,
                backgroundColor: COLORS.lightGray
            }}>
                <Image
                    source={icons.search}
                    style={{
                        width: 20,
                        height: 20,
                        tintColor: COLORS.gray
                    }}
                />
                <TextInput
                    style={{
                        flex: 1,
                        marginLeft: SIZES.radius,
                        ...FONTS.body3
                    }}
                    placeholderTextColor={COLORS.gray}
                    placeholder="what are you looking for?"
                    onFocus={() => navigation.navigate("Search")}
                />
            </View>
        )
    }, [])

    const renderEvents = useCallback(() => {
        return (
            <FlatList
                style={{ flex: 1 }}
                data={events}
                keyExtractor={item => item._id.toString()}
                renderItem={({ item, index }) => renderEvent(item, index)}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                spacing={10}
                ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                ListFooterComponent={() => <ListFooterComponent routeName="Events" navigation={navigation} length={events.length} />}
                onEndReachedThreshold={0.5} // Adjust the threshold as needed
                
            />
        )
    }, [events])

    const renderPlants = useCallback(() => {
        return (
            <FlatList
                style={{ height: 130 }}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={trees}
                keyExtractor={item => item._id.toString()}
                renderItem={({ item, index }) => renderNewPlants(item, index)}
                ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
                ListFooterComponent={() => <ListNewPlantsFooterComponent />}
                onEndReachedThreshold={0.5} // Adjust the threshold as needed

            />
        )
    }, [trees])

    const renderPosts = useCallback(() => {
        return (
            <FlatList
                style={{ flex: 1 }}
                data={posts}
                keyExtractor={item => item._id.toString()}
                renderItem={({ item, index }) => renderPost(item, index)}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                spacing={10}
                ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
                ListFooterComponent={() => <ListFooterComponent routeName="Posts" navigation={navigation} length={posts.length} />}
                onEndReachedThreshold={0.5} // Adjust the threshold as needed
            />
        )

    }, [posts])

    const renderFriends = useCallback(() => {
        return (
            <View style={{ flexDirection: 'row', marginVertical: SIZES.base, marginLeft: SIZES.padding }}>
                {renderFriendsComponent()}
            </View>
        )
    }
    , [friends])

    const organizationItem = useCallback(({ item, index }) => {
        return (
            <TouchableWithoutFeedback
                onPress={() => navigation.navigate('Organization', { _id: item?._id})}
            >
            <Block column justify="space-between" wrap="wrap">
                <Block center middle>
                    <Image2
                        resizeMode="cover"
                        source={{ uri: item?.images[0] }}
                        style={{
                        width: IMAGE_VERTICAL_SIZE * 2,
                        height: IMAGE_VERTICAL_SIZE * 1.5,
                        }}
                    />
                </Block>
                <Block>
                    <Text style={{ ...FONTS.body3, color: COLORS.primary }}>
                        {item?.name}{item?.isVerified && ( <ICONS.MaterialCommunityIcons name="check-circle" size={20} color={COLORS.primary} />)}
                    </Text>
                    <Text2 p numberOfLines={1}>{item?.bio?.length > 35 ? item?.bio?.slice(0, 35) + "..." : item?.bio}</Text2>
                    <Text2 p primary semibold>
                        {item?.volunteers?.length} members
                    </Text2>
                </Block>
            </Block>
            </TouchableWithoutFeedback>
        )
    }, [])

    const renderOrganizations = useCallback(() => {
        return (
            <FlatList
                style={{ flex: 1 }}
                horizontal
                data={organizations}
                keyExtractor={item => item._id.toString()}
                renderItem={organizationItem}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
                contentContainerStyle={{ paddingHorizontal: sizes.padding }}
            />
        )
    }, [organizations])


    if(loadingData && !loading) {
        return (
            <Block center>
                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text2 p primary semibold style={{ marginTop: 10 }}>Loading...</Text2>
                </View>
            </Block>
        )
    }
   
        

    return (
      <>
        <Block scroll
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={onRefresh} />
            }
           style={styles.container}
        >
            {/* New Plants */}
            <View style={{ flex: 1 }}>
            
                 {/* Header */}
                 <View style={{ backgroundColor: COLORS.primary , paddingTop: 10 }}>
                        {renderHeader()}
                 </View>
                {/* Search */}
                 <View style={{ backgroundColor: COLORS.primary, paddingTop: 10 }}>
                        {renderSearch()}
                </View>


                <View style={{
                    flex: 1,
                    borderBottomLeftRadius: 50,
                    borderBottomRightRadius: 50,
                    backgroundColor: COLORS.primary,
                }}>
                
                    <View style={{ marginHorizontal: SIZES.padding, marginTop: 10  }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text2 h4  style={{ color: COLORS.white, ...FONTS.H2, }}>Plants</Text2>
                            <View style={{ flexDirection: 'row' }}>
                                <Button
                                    onPress={() => navigation.navigate("TreeIdentify")}
                                >
                                    <Image
                                        source={icons.focus}
                                        resizeMode="contain"
                                        style={{
                                            width: 20,
                                            height: 20
                                        }}
                                    />
                                </Button>
                            </View>

                        </View>
                        
                        <View style={{ marginTop: SIZES.base }}>
                           {renderPlants()}
                        </View>
                    </View>
                </View>
            </View>

              {/* vertical image */}
            <View style={{ flex: 1, paddingHorizontal: SIZES.base * 2 }}>
            <Block>
                <Block row align="center" justify="space-between" marginBottom={sizes.s} marginTop={sizes.m} wrap="wrap">
                <Text style={{ color: COLORS.secondary, ...FONTS.H2 }}>Organizations
                </Text>
                <Button onPress={() => navigation.navigate("Organizations")}>
                    <Text2 p primary semibold>
                    View All
                    </Text2>
                </Button>
                </Block>
                {renderOrganizations()}
            </Block>
            </View>
            
            {/* New Events */}
            <View style={{ flex: 1 }}>
                <View style={{
                    flex: 1,
                    borderBottomLeftRadius: 50,
                    borderBottomRightRadius: 50,
                }}>
                    <View style={{ marginTop: SIZES.font, marginHorizontal: SIZES.padding }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ color: COLORS.secondary, ...FONTS.H2, }}>Events</Text>
                            <Button 
                               onPress={() => navigation.navigate("Events")}
                              >
                                <Text2 p primary semibold>
                                     View All
                                </Text2>
                            </Button>
                        </View>

                        <View style={{marginTop: SIZES.base }}>
                           {renderEvents()}
                        </View>
                    </View>
                </View>
            </View>
           
           
            <View style={{ flex: 1 }}>
                <View style={{
                    flex: 1,
                    marginTop: SIZES.padding,
                    borderBottomLeftRadius: 50,
                    borderBottomRightRadius: 50,
                }}>
                    <View style={{ marginTop: SIZES.font, marginHorizontal: SIZES.padding }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ color: COLORS.secondary, ...FONTS.H2, }}>Posts</Text>
                            <Button 
                               onPress={() => navigation.navigate("Posts")}
                              >
                                <Text2 p primary semibold>
                                     View All
                                </Text2>
                            </Button>
                        </View>

                        <View style={{ marginTop: SIZES.base }}>
                            {renderPosts()}
                        </View>
                    </View>
                </View>
            </View>
            

            {/* Added Friend */}
            <View style={{ paddingVertical: SIZES.padding }}>
                <View style={{ flex: 1 }}>
                    <View style={{ marginTop: SIZES.radius, marginHorizontal: SIZES.padding }}>
                        <Text style={{ color: COLORS.secondary, ...FONTS.H2 }}>Added Friends</Text>
                        <Text style={{ color: COLORS.secondary, ...FONTS.body3}}>{friends.length} Total</Text>
                        <View style={{ flexDirection: 'row' }}>
                            {/* Friends */}
                            <View style={{ flex: 1.3, flexDirection: 'row', alignItems: 'center' }}>
                                {renderFriends()}
                            </View>

                            {/* Add Friend */}
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Text style={{ color: COLORS.secondary, ...FONTS.body3 }}>Add New</Text>
                                <TouchableOpacity
                                    style={{
                                        marginLeft: SIZES.base,
                                        width: 40,
                                        height: 40,
                                        borderRadius: 10,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: COLORS.gray
                                    }}
                                    onPress={() => setShowRecommendUsers(true)}
                                >
                                    <Image
                                        source={icons.plus}
                                        resizeMode="contain"
                                        style={{
                                            width: 20,
                                            height: 20
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

        </Block>
            {showRecommendUsers && (
                <RecommendUsers navigation={navigation} setShowRecommendUsers={setShowRecommendUsers} />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    shadow: {
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    }
});

export default Home;
