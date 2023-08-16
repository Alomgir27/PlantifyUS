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

import {  RefreshControl} from 'react-native-gesture-handler';

import { FONTS, SIZES } from '../../constants/index';


import { useSelector } from "react-redux";


import moment from 'moment';
import axios from "axios";
import { API_URL } from "../../constants/index";


import { COLORS } from "../../constants/index";
import { Block, Text as Text2 } from "../../components/";

const Favourite = ({ navigation}: any) => {
    const [refreshing, setRefreshing] = useState<Boolean>(false);
    const [mounted, setMounted] = useState<Boolean>(true);
    const [events, setEvents] = useState<any>([]);
    const [posts, setPosts] = useState<any>([]);

    const user = useSelector(state => state?.data?.currentUser);

    useEffect(() => {
        if(mounted && user?._id) {
            fetchEvents();
            fetchPosts();
        }
    }, [mounted, user?._id]);


      
     useEffect(() => {
        setMounted(true);
        return () => {
            setMounted(false);
        }
    }, []);

 
  
   

    const onRefresh = () => {
        setRefreshing(true);
        setEvents([]);
        setPosts([]);
        setTimeout(() => {
            fetchEvents();
            fetchPosts();
            setRefreshing(false);
        }, 3000);
       
    }

    const fetchEvents = async () => {
        await axios.post(`${API_URL}/events/getEvents`, { 
            userId: user?._id, 
            ids: events?.map((event) => event?._id)
        })
        .then((res) => {
            if(res?.data?.success) {
                setEvents((prevEvents) => [...prevEvents, ...res?.data?.events]);
            }
        })
        .catch((err) => {
            console.log(err);
        }
        )
        
    }

    const fetchPosts = async () => {
        await axios.post(`${API_URL}/posts/getPosts`, {
            userId: user?._id,
            ids: posts?.map((post) => post?._id)
        })
        .then((res) => {
            if(res?.data?.success) {
                setPosts((prevPosts) => [...prevPosts, ...res?.data?.posts]);
            }
        })
        .catch((err) => {
            console.log(err);
        }
        )
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

  

    const renderEvents = useCallback(() => {
        return (
            <FlatList
                style={{ flex: 1 }}
                data={events}
                keyExtractor={item => item._id.toString()}
                renderItem={({ item, index }) => renderEvent(item, index)}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                onEndReachedThreshold={0.5} // Adjust the threshold as needed
                onEndReached={() => fetchEvents()}
            />
        )
    }, [events])



    const renderPosts = useCallback(() => {
        return (
            <FlatList
                style={{ flex: 1 }}
                data={posts}
                keyExtractor={item => item._id.toString()}
                renderItem={({ item, index }) => renderPost(item, index)}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
                onEndReached={() => fetchEvents()}
                onEndReachedThreshold={0.5} // Adjust the threshold as needed
            />
        )

    }, [posts])
    

   


    return (
        <Block scroll
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
           style={styles.container}
        >
           
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
                        </View>

                        <View style={{ marginTop: SIZES.base }}>
                            {renderPosts()}
                        </View>
                    </View>
                </View>
            </View>
        </Block>
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

export default Favourite;
