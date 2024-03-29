//@ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Alert,
    Animated,
    Easing,
    Dimensions,
    Share,
    TouchableWithoutFeedback,
} from 'react-native';

import { 
    FlatList , 
} from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-gesture-handler';

import { images, icons, COLORS, FONTS, SIZES} from '../../../constants/index';
import MapView, { Marker } from 'react-native-maps';
import { Block, Text } from '../../../components';

import * as ICONS from "@expo/vector-icons";


import moment from 'moment';
import { connect } from 'react-redux';

import Comments from '../../../components/Comments';
import { Button } from './../../../components/index';
import { useTheme } from '../../../hooks';
import { API_URL } from '../../../constants/index';


import sendPushNotification from '../../../modules/notfications';


export class EventItem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
            user: null,
            isVisible: false,
            shareText: `${this.props.item.title}`,
            shareUrl: `events/${this.props.item._id}`,
            shareTitle: `${this.props.item.title}`
        };
        this.toggleExpanded = this.toggleExpanded.bind(this);
        this.handleUpVote = this.handleUpVote.bind(this);
        this.handleDownVote = this.handleDownVote.bind(this);
        this.handleComments = this.handleComments.bind(this);
        this.handleToggleComments = this.handleToggleComments.bind(this);
        this.handleShare = this.handleShare.bind(this);
        this.handleToggleFavorite = this.handleToggleFavorite.bind(this);

    }


    componentDidMount() {
        this.setState({ user: this.props.user });
    }

    toggleExpanded = () => {
        this.setState({ collapsed: !this.state.collapsed });
    };

    handleUpVote = (id) => {
        if(!this.state.user) {
            return Alert.alert('You need to login first', 'Please login to upvote');
        }
        const { handlePress } = this.props;
        const notification = {
            title: 'Upvote',
            message: `${this.state.user?.name} upvoted your event`,
            type: 'event',
            _id: id,
            image: this.props.item?.images[0],
            userId: this.props.item?.author?._id,
        }
        if(this.props.item?.author?._id !== this.state.user?._id){
          sendPushNotification(this.props.item?.author?.pushToken, notification.title, notification.message, notification.type, notification._id, notification.image, notification.userId);
        }
        handlePress('upvote', id);
    }

    handleDownVote = (id) => {
        if(!this.state.user) {
            return Alert.alert('You need to login first', 'Please login to downvote');
        }
        const { handlePress } = this.props;
        handlePress('downvote', id);
    }

    handleToggleComments = () => {
        this.setState({ isVisible: !this.state.isVisible });
    }

    handleComments = (id) => {
        if(!this.state.user) {
            return Alert.alert('You need to login first', 'Please login to comment');
        }
        this.handleToggleComments();
    }

    handleToggleFavorite = (id) => {
        if(!this.state.user) {
            return Alert.alert('You need to login first', 'Please login to add to favorite');
        }
        const { handlePress } = this.props;
        if(this.props.item?.favourites?.includes(this.state.user?._id)) {
            handlePress('unfavorite', id);
        } else {
            handlePress('favorite', id);
        }
    }



    handleShare = async () => {
        try {
            const result = await Share.share({
                message: this.state.shareText,
                url: this.state.shareUrl,
                title: this.state.shareTitle,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('shared with activity type of', result.activityType);
                } else {
                    console.log('shared');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('dismissed');
            }
        } catch (error) {
            console.log(error.message);
        }
    }





    render() {
        const { item, navigation } = this.props;
        const { colors } = this.props;
        return (
        <>
            <View
                style={[styles.card, { backgroundColor: colors.card }]}
                key={item?._id}

            >
                <View style={styles.author}>
                    <View style={styles.authorImgWrapper}>
                        <Image
                            source={{ uri: item?.author?.image }}
                            resizeMode="cover"
                            style={styles.authorImg}
                        />
                    </View>
                    <TouchableOpacity style={styles.authorInfo} onPress={() => navigation.navigate("Profile", { userId: item?.author?._id })}>
                        <Text bold primary style={styles.authorName}>{item?.author?.name} </Text>
                        <Text style={styles.time}>{moment(item?.createdAt).fromNow()}</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                        <TouchableOpacity
                            onPress={() => console.log('more')}
                        >
                            <ICONS.MaterialCommunityIcons name="dots-vertical" size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableWithoutFeedback style={styles.cardImgWrapper}
                    onPress={() => navigation.navigate("Event", { _id: item?._id })}
                >
                  <View>
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
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderBottomColor: COLORS.lightGray,
                                borderBottomWidth: 1,
                            }}
                            onPress={this.toggleExpanded}
                        >
                        
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            {this.state.collapsed && (
                                <Text numberOfLines={1} style={styles.cardTitle} primary bold>
                                    {item?.title}
                                </Text>
                            )}
                           </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                {this.state.collapsed ? (
                                    <ICONS.Ionicons name="chevron-down" size={24} color={COLORS.primary} />
                                ) : (
                                    <ICONS.Ionicons name="chevron-up" size={24} color={COLORS.primary} />
                                )}
                            </View>

                        </View>
                        </TouchableOpacity>
                       {this.state.collapsed && (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text black numberOfLines={1} style={{ ...FONTS.body4, color: COLORS.secondary }}>
                                {item?.description}
                            </Text>
                        </View>
                        )}
                        {!this.state.collapsed && (
                            <View>
                                <Text style={styles.cardTitle} primary bold>{item?.title}</Text>
                                <Text black numberOfLines={2} style={styles.cardDetails}>
                                    {item?.description}
                                </Text>
                                <Text black style={styles.cardDetails}>
                                    {item?.landsDescription}
                                </Text>
                                <Text black style={styles.cardDetails}>
                                    {item?.requirements?.trees} trees
                                </Text>
                                <Text black style={styles.cardDetails}>
                                    {item?.requirements?.volunteers} volunteers
                                </Text>
                            </View>
                        )}

                    </View>
                  </View>
                </TouchableWithoutFeedback>
                <View style={styles.MapView}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: item?.location?.coordinates[1],
                            longitude: item?.location?.coordinates[0], 
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        initialCamera={{
                            center: {
                                latitude: item?.location?.coordinates[1],
                                longitude: item?.location?.coordinates[0],
                            },
                            pitch: 0,
                            heading: 0,
                            altitude: 1000,
                            zoom: 10,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: item?.location?.coordinates[1],
                                longitude: item?.location?.coordinates[0],
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
                    <Text style={styles.fundsTitle}>Funds {" "}
                        {item?.status === 'pending' && (
                            <Text style={{ ...FONTS.body4, color: COLORS.secondary }}>pending</Text>
                        )}
                        {item?.status === 'approved' && (
                            <Text style={{ ...FONTS.body4, color: COLORS.primary }}>approved</Text>
                        )}
                        {item?.status === 'rejected' && (
                            <Text style={{ ...FONTS.body4, color: COLORS.red }}>rejected</Text>
                        )}
                        {item?.status === 'completed' && (
                            <Text style={{ ...FONTS.body4, color: COLORS.green }}>completed</Text>
                        )}
                    </Text>
                    <View style={styles.funds}>
                        <Text style={styles.fundsDetails}>
                            collected: {item?.collectedFunds} $ / required: {item?.requirements?.funds} $
                        </Text>
                        <Text style={styles.fundsDetails}>
                            {item?.collectedFunds / item?.requirements?.funds * 100} %
                        </Text>
                    </View>
                   
                    <Button
                        onPress={() => navigation.navigate("Donation", { _id: item?._id })}
                        gradient={parseInt(item?.collectedFunds) / parseInt(item?.requirements?.funds) * 100 === 100 ? ['#3A416F', '#141727'] : ["#00996D", "#606d87"]}
                    >
                        <Text bold white transform="uppercase" marginHorizontal={10}>
                            Donate Now
                        </Text>
                    </Button>
                </View>
                <View style={styles.fundsInfo}>
                    {item?.hostDetails?.message && (
                        <Text p numberOfLines={2} paddingLeft={10} paddingBottom={10}>{item?.hostDetails?.message}</Text>
                    )}
                    {item?.hostDetails && (
                        <Text p primary bold numberOfLines={2} paddingLeft={10} paddingBottom={10}>Host time: {new Date(parseInt(item?.hostDetails?.year), parseInt(item?.hostDetails?.month) - 1, parseInt(item?.hostDetails?.day), parseInt(item?.hostDetails?.startTime)) > new Date() ? moment(new Date(parseInt(item?.hostDetails?.year), parseInt(item?.hostDetails?.month) - 1, parseInt(item?.hostDetails?.day), parseInt(item?.hostDetails?.startTime))).fromNow() : "Event has ended"}</Text>
                    )}
                </View>
                {/* upvotes downvotes and comments */}
                <ScrollView  
                    horizontal={true} 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.UpDownComments}
                >
                    <TouchableOpacity style={styles.upvotes}
                        onPress={() => this.handleUpVote(item?._id)}
                    >
                        <Text style={styles.upvotesIcon}>
                            <ICONS.Ionicons name="thumbs-up" size={24} color={COLORS.primary} />
                        </Text>
                        <Text style={styles.upvotesText}>
                            {item?.upvotes?.length} upvotes
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.downvotes}
                        onPress={() => this.handleDownVote(item?._id)}
                    >
                        <Text style={styles.downvotesIcon}>
                            <ICONS.Ionicons name="thumbs-down" size={24} color={COLORS.primary} />
                        </Text>
                        <Text style={styles.downvotesText}>
                            {item?.downvotes?.length} downvotes
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.comments}
                        onPress={() => this.handleComments(item?._id)}
                    >
                        <Text style={styles.commentsIcon}>
                            <ICONS.Ionicons name="chatbox-ellipses" size={24} color={COLORS.primary} />
                        </Text>
                        <Text style={styles.commentsText}>
                            {item?.comments?.length} comments
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.share}
                        onPress={() => this.handleShare()}
                    >
                        <Text style={styles.shareIcon}>
                            <ICONS.Ionicons name="share-social" size={24} color={COLORS.primary} />
                        </Text>
                        <Text style={styles.shareText}>
                            {item?.shares?.length} share
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.favorite}
                        onPress={() => this.handleToggleFavorite(item?._id)}
                    >
                        <Text style={styles.favoriteIcon}>
                            {item?.favourites?.includes(this.state.user?._id) ? (
                                <ICONS.Ionicons name="heart" size={24} color={COLORS.primary} />
                            ) : (
                                <ICONS.Ionicons name="heart-outline" size={24} color={COLORS.primary} />
                            )}
                        </Text>
                        <Text style={styles.favoriteText}>
                            {item?.favourites?.includes(this.state.user?._id) ? 'my favorite' : 'add to favorite'}
                        </Text>
                        
                    </TouchableOpacity>

                </ScrollView>
                
            </View>
            {/* comments */}
            {this.state.isVisible && (
               <Comments item={item} isVisible={this.state.isVisible} handleToggleComments={this.handleToggleComments} type={'event'} callBack={this.props.callBack} />
            )}
        </>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        flex: 1,
        margin: 10,
        borderRadius: 8,
        shadowColor: COLORS.lightGray,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
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
        // borderBottomLeftRadius: 8,
        // borderBottomRightRadius: 8,
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
        ...FONTS.H3,
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
        ...FONTS.H2,
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
        ...FONTS.H3,
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


const mapStateToProps = (state) => {
     const { colors } = useTheme();

    return {
        user: state.data.currentUser,
        colors
    }
}

export default connect(mapStateToProps)(EventItem);