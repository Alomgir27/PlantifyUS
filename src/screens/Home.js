import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList
} from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';

import { images, icons, COLORS, FONTS, SIZES } from '../constants';

import * as ICONS from "@expo/vector-icons";

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import { fetchAllDefaultData } from '../modules/data';



const Home = ({ navigation }) => {

    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState([]);

    const events = useSelector(state => state?.data?.events);
    const trees = useSelector(state => state?.data?.trees); 
    const posts = useSelector(state => state?.data?.posts);
    const user = useSelector(state => state?.data?.currentUser);

    const dispatch = useDispatch();
    

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(fetchAllDefaultData());
        }
        );
        return unsubscribe;
    }, [])


    // Dummy Data
    const [newPlants, setNewPlants] = React.useState([
        {
            id: 0,
            name: "Plant 1",
            img: images.plant1,
            favourite: false,
        },
        {
            id: 1,
            name: "Plant 2",
            img: images.plant2,
            favourite: true,
        },
        {
            id: 2,
            name: "Plant 3",
            img: images.plant3,
            favourite: false,
        },
        {
            id: 3,
            name: "Plant 4",
            img: images.plant4,
            favourite: false,
        },
    ]);

    const [friendList, setFriendList] = React.useState([
        {
            id: 0,
            img: images.profile1,
        },
        {
            id: 1,
            img: images.profile2,
        },
        {
            id: 2,
            img: images.profile3,
        },
        {
            id: 3,
            img: images.profile4,
        },
        {
            id: 4,
            img: images.profile5,
        },
    ]);

    React.useEffect(() => {
    }, []);

    // Render

    function renderNewPlants(item, index) {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: SIZES.base }}>
                <Image
                    source={item.img}
                    resizeMode="cover"
                    style={{
                        width: SIZES.width * 0.23,
                        height: '82%',
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
                    <Text style={{ color: COLORS.white, ...FONTS.body4 }}>{item.name}</Text>
                </View>

                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        top: '15%',
                        left: 7,
                    }}
                    onPress={() => { console.log("Focus on pressed") }}
                >
                    <Image
                        source={item.favourite ? icons.heartRed : icons.heartGreenOutline}
                        resizeMode="contain"
                        style={{
                            width: 20,
                            height: 20
                        }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    function renderFriendsComponent() {
        if (friendList.length == 0) {
            return (
                <View></View>
            )
        } else if (friendList.length <= 3) {
            return (
                friendList.map((item, index) => (
                    <View
                        key={`friend-${index}`}
                        style={index == 0 ? { flexDirection: 'row' } : { flexDirection: 'row', marginLeft: -20 }}
                    >
                        <Image
                            source={item.img}
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
                    {friendList.map((item, index) => {
                        if (index <= 2) {
                            return (
                                <View
                                    key={`friend-${index}`}
                                    style={index == 0 ? {} : { marginLeft: -20 }}
                                >
                                    <Image
                                        source={item.img}
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

                    <Text style={{ marginLeft: 5, color: COLORS.secondary, ...FONTS.body3 }}>+{friendList.length - 3} More</Text>
                </View>
            )
        }
    }

    function renderEvent(item, index) {
        if(item?.images?.length === 1) {
            //if only one image then cover the whole card with the image and show the title
            return (
                <TouchableOpacity
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        marginVertical: SIZES.base,
                        borderRadius: 20,
                        backgroundColor: COLORS.white,
                        ...styles.shadow
                    }}
                    
                    onPress={() => { console.log("Event on pressed") }}
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
                            height: 60,
                            width: SIZES.width * 0.3,
                            backgroundColor: COLORS.white,
                            borderTopRightRadius: SIZES.radius,
                            borderBottomLeftRadius: SIZES.radius,
                            alignItems: 'center',
                            justifyContent: 'center',
                            ...styles.shadow
                        }}>
                            <Text style={{ ...FONTS.h4 }}>{item?.title}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        } else if(item?.images?.length === 2) {
            //if there are 2 images then show the images in a collage
            return (
                <TouchableOpacity
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        marginVertical: SIZES.base,
                        borderRadius: 20,
                        backgroundColor: COLORS.white,
                        ...styles.shadow
                    }}
                    onPress={() => { console.log("Event on pressed") }}
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
                            height: 60,
                            width: SIZES.width * 0.3,
                            backgroundColor: COLORS.white,
                            borderTopRightRadius: SIZES.radius,
                            borderBottomLeftRadius: SIZES.radius,
                            alignItems: 'center',
                            justifyContent: 'center',
                            ...styles.shadow
                        }}>
                            <Text style={{ ...FONTS.h4 }}>{item?.title}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }   else if(item?.images?.length === 3) {
            //if there are 3 images then show the first two images like a collage and show the third image as a full image
            return (
                <TouchableOpacity
                    style={{ flex: 1, marginRight: index == events.length - 1 ? 0 : SIZES.padding }}
                    onPress={() => { console.log("Event on pressed") }}
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
                            height: 60,
                            width: SIZES.width * 0.3,
                            backgroundColor: COLORS.white,
                            borderTopRightRadius: SIZES.radius,
                            borderBottomLeftRadius: SIZES.radius,
                            alignItems: 'center',
                            justifyContent: 'center',
                            ...styles.shadow
                        }}>
                            <Text style={{ ...FONTS.h4 }}>{item?.title}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
        else {
            //if there are more than 3 images then show the first image and show the number of images on top of the image
            return (
                <TouchableOpacity
                    style={{ flex: 1, marginRight: index == events.length - 1 ? 0 : SIZES.padding }}
                    onPress={() => { console.log("Event on pressed") }}
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
                              >{item?.images?.length}+ photo</Text>

                         </View>
                        </View>
                        <View style={{
                            position: 'absolute',
                            bottom: 0,
                            height: 60,
                            width: SIZES.width * 0.3,
                            backgroundColor: COLORS.white,
                            borderTopRightRadius: SIZES.radius,
                            borderBottomLeftRadius: SIZES.radius,
                            alignItems: 'center',
                            justifyContent: 'center',
                            ...styles.shadow
                        }}>
                            <Text style={{ ...FONTS.h4 }}>{item?.title}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
         }
    }

    function ListFooterComponent(){
        if(events?.length > 3) {
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
                    backgroundColor: COLORS.white,
                    ...styles.shadow
                }}
                onPress={() => { console.log("View All on pressed") }}
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
                    marginHorizontal: SIZES.base,
                    ...styles.shadow
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
                ListFooterComponent={ListFooterComponent}
                onEndReachedThreshold={0.5} // Adjust the threshold as needed
                
            />
        )
    }, [events])
                   




    return (
        <ScrollView style={styles.container}>
            {/* New Plants */}
            <View style={{ flex: 1, backgroundColor: COLORS.white }}>
                {/* notification & signup */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',  backgroundColor: COLORS.primary, paddingTop: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {user && (
                        <Text style={{ 
                            marginLeft: 10, 
                            color: COLORS.white,
                            ...FONTS.body3
                        }}>Welcome {user?.name} </Text>
                    )}
                    
                  </View>
                  <View style={{  flexDirection: 'row', alignItems: 'center' }}>
                  {!user ? (
                     <ICONS.Ionicons name="person-add" size={24} color={COLORS.white} onPress={() => navigation.navigate("AuthLanding")} />
                   ) : (
                        <ICONS.Ionicons name="person" size={24} color={COLORS.white} onPress={() => navigation.navigate("Profile")} />
                     )}

                    <ICONS.Ionicons name="notifications" size={24} color={COLORS.white} onPress={() => navigation.navigate("Notifications")}style={{
                        paddingHorizontal: SIZES.padding
                    }} />
                    {notification.some(item => item?.read === false) && (
                        <View style={{
                            position: 'absolute',
                            top: 15,
                            right: 27,
                            height: 10,
                            width: 10,
                            borderRadius: 5,
                            backgroundColor: COLORS.red,
                        }}></View>
                    )}
                  </View>

                </View>
                <View style={{
                    flex: 1,
                    borderBottomLeftRadius: 50,
                    borderBottomRightRadius: 50,
                    backgroundColor: COLORS.primary,
                }}>
                
                    <View style={{ marginHorizontal: SIZES.padding, marginTop: 10  }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ color: COLORS.white, ...FONTS.h2, }}>New Plants</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    onPress={() => { console.log("Focus on pressed") }}
                                >
                                    <Image
                                        source={icons.focus}
                                        resizeMode="contain"
                                        style={{
                                            width: 20,
                                            height: 20
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>

                        </View>
                        
                        <View style={{ marginTop: SIZES.base }}>
                            <FlatList
                                style={{ height: 130 }}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={newPlants}
                                keyExtractor={item => item.id.toString()}
                                renderItem={({ item, index }) => renderNewPlants(item, index)}
                            />
                        </View>
                    </View>
                </View>
            </View>

           


            {/* Today's Events */}
            <View style={{ flex: 1 }}>
                <View style={{
                    flex: 1,
                    borderBottomLeftRadius: 50,
                    borderBottomRightRadius: 50,
                    backgroundColor: COLORS.white
                }}>
                    <View style={{ marginTop: SIZES.font, marginHorizontal: SIZES.padding }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ color: COLORS.secondary, ...FONTS.h2, }}>Today's Events</Text>

                            <TouchableOpacity
                                onPress={() => { console.log("See All on pressed") }}
                            >
                                <Text style={{ color: COLORS.secondary, ...FONTS.body3 }}>See All</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: 400, marginTop: SIZES.base }}>
                           
                           {renderEvents()}

                            {/* <View style={{ flex: 1 }}>
                                <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onPress={() => { navigation.navigate("PlantDetail") }}
                                >
                                    <Image
                                        source={images.plant5}
                                        resizeMode="cover"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: 20
                                        }}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{ flex: 1, marginTop: SIZES.font }}
                                    onPress={() => { navigation.navigate("PlantDetail") }}
                                >
                                    <Image
                                        source={images.plant6}
                                        resizeMode="cover"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: 20
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1.3 }}>
                                <TouchableOpacity
                                    style={{ flex: 1, marginLeft: SIZES.font }}
                                    onPress={() => { navigation.navigate("PlantDetail") }}
                                >
                                    <Image
                                        source={images.plant7}
                                        resizeMode="cover"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: 20
                                        }}
                                    />
                                </TouchableOpacity>
                            </View> */}
                        </View>
                    </View>
                </View>
            </View>

            {/* Added Friend */}
            <View style={{ backgroundColor: COLORS.lightGray }}>
                <View style={{
                    flex: 1,
                    backgroundColor: COLORS.lightGray
                }}>
                    <View style={{ marginTop: SIZES.radius, marginHorizontal: SIZES.padding }}>
                        <Text style={{ color: COLORS.secondary, ...FONTS.h2, }}>Added Friends</Text>
                        <Text style={{ color: COLORS.secondary, ...FONTS.body3, }}>{friendList.length} total</Text>
                        <View style={{ flexDirection: 'row' }}>
                            {/* Friends */}
                            <View style={{ flex: 1.3, flexDirection: 'row', alignItems: 'center' }}>
                                {renderFriendsComponent()}
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
                                    onPress={() => { console.log("Add friend on pressed") }}
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray,
        flexDirection: 'column'
    },
});

export default Home;
