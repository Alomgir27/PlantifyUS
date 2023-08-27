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
    TouchableWithoutFeedback
} from 'react-native';

import { 
    FlatList , 
    RefreshControl
} from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-gesture-handler';

import { images, icons, COLORS, FONTS, SIZES } from '../../../constants/index';
import MapView, { Marker } from 'react-native-maps';

import * as ICONS from "@expo/vector-icons";

import { Text } from '../../../components';
import { Text as Text2 } from 'react-native-elements';

import moment from 'moment';


import { API_URL } from "../../../constants/index";
import { connect } from 'react-redux';
import Comments from '../../../components/Comments';
import sendPushNotification from '../../../modules/notfications';


const { width, height } = Dimensions.get('window');


export class PostItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           collapsed: true,
           eventCollapsed: true,
           isVisible: false,
           user : {}
        };
        this.toggleExpanded = this.toggleExpanded.bind(this);
        this.handleUpVote = this.handleUpVote.bind(this);
        this.handleDownVote = this.handleDownVote.bind(this);
        this.handleToggleComments = this.handleToggleComments.bind(this);
        this.handleShare = this.handleShare.bind(this);
        this.handleToggleFavorite = this.handleToggleFavorite.bind(this);
        this.handleEventCollapse = this.handleEventCollapse.bind(this);
    }

    componentDidMount() {
        this.setState({user: this.props.user});
    }

    toggleExpanded() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    handleUpVote() {
        if(!this.props.user) {
            Alert.alert('Please login to upvote', 'Please login to upvote', [{text: 'OK'}]);
            return;
        }
        const { handlePress } : any = this.props;
        const { item } : any = this.props;
        const notification = {
            title: 'Upvote',
            message: `${this.props.user?.name} upvoted your post`,
            type: 'post',
            _id: item?._id,
            image: item?.images[0],
            userId: item?.author?._id
        }
        if(item?.author?._id !== this.props.user?._id){
          sendPushNotification(item?.author?.pushToken, notification.title, notification.message, notification.type, notification._id, notification.image, notification.userId);
        }
        handlePress('upvote', item?._id);        
    }

    handleDownVote() {
        if(!this.props.user) {
            Alert.alert('Please login to downvote', 'Please login to downvote', [{text: 'OK'}]);
            return;
        }
        const { handlePress } = this.props;
        const { item } = this.props;
        handlePress('downvote', item?._id);
    }

   

    handleToggleComments() {
        if(!this.props.user) {
            Alert.alert('Please login to comment', 'Please login to comment', [{text: 'OK'}]);
            return;
        }
        this.setState({isVisible: !this.state.isVisible});
    }

    handleEventCollapse() {
        this.setState({eventCollapsed: !this.state.eventCollapsed});
    }

    handleShare() {
        if(!this.props.user) {
            Alert.alert('Please login to share', 'Please login to share', [{text: 'OK'}]);
            return;
        }
        const { item } = this.props;
        Share.share({
            message: item.text,
            url: `${API_URL}/posts/${item?._id}`,
            title: item.text
        }, {
            // Android only:
            dialogTitle: 'Share this post',
            // iOS only:
            excludedActivityTypes: [
                'com.apple.UIKit.activity.PostToTwitter'
            ]
        })
    }

    handleToggleFavorite() {
       if(!this.props.user) {
            Alert.alert('Please login to favorite', 'Please login to favorite', [{text: 'OK'}]);
            return;
        }
        const { item } = this.props;
        if(item?.favourites?.includes(this.props.user?._id)) {
            const { handlePress } = this.props;
            handlePress('unfavorite', item?._id);

        }
        else {
            const { handlePress } = this.props;
            handlePress('favorite', item?._id);
        }
    }

    render() {
        const { item, navigation } = this.props;
        const { collapsed, isVisible } = this.state;
        const { user, type } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.postHeader}>
                    <View style={styles.postHeaderLeft}>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile', {userId: item?.author?._id})}>
                            <Image
                                source={{uri: item?.author?.image }}
                                style={styles.avatar}
                            />
                        </TouchableOpacity>
                        <View style={styles.postHeaderLeftText}>
                            <TouchableOpacity onPress={() => navigation.navigate('Profile', {userId: item?.author?._id})}>
                                <Text2 style={[styles.name, { color: COLORS.primary}]}>{item?.author?.name}</Text2>
                            </TouchableOpacity>
                            <Text2 style={styles.date}>{moment(item?.createdAt).fromNow()}</Text2>
                        </View>
                    </View>                    
                    <View style={styles.postHeaderRight}>
                        {item?.author?._id === user?._id && (
                            <TouchableOpacity onPress={() => this.props.handlePress('delete', item?._id)}>
                                <ICONS.Ionicons name="close" size={24} color={COLORS.primary} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <View style={styles.postBody}>
                   <TouchableOpacity onPress={() => this.toggleExpanded()}>
                      <Text2 style={[styles.postText, {color: COLORS.gray}]} numberOfLines={collapsed ? 3 : null}>{item.text}</Text2>
                   </TouchableOpacity>
                    {item.images.length > 0 && (
                        <View style={styles.postImages}>
                            {item.images.length === 1 && (
                                <TouchableWithoutFeedback onPress={() => navigation.navigate('Images', {images: item.images, index: 0, _id: item?._id, type})}>
                                    <Image
                                        source={{uri: item.images[0]}}
                                        style={{width: width - 20, height: height / 2, borderRadius: 10}}
                                    />
                                </TouchableWithoutFeedback>
                            )}
                            {item.images.length === 2 && (
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <TouchableWithoutFeedback onPress={() => navigation.navigate('Images', {images: item.images, index: 0, _id: item?._id, type})}>
                                        <Image
                                            source={{uri: item.images[0]}}
                                            style={{width: width / 2 - 15, height: height / 2, borderRadius: 10}}
                                        />
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={() => navigation.navigate('Images', {images: item.images, index: 1, _id: item?._id, type})}>
                                        <Image
                                            source={{uri: item.images[1]}}
                                            style={{width: width / 2 - 15, height: height / 2, borderRadius: 10}}
                                        />
                                    </TouchableWithoutFeedback>
                                </View>
                            )}
                            {item.images.length === 3 && (
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <TouchableWithoutFeedback onPress={() => navigation.navigate('Images', {images: item.images, index: 0, _id: item?._id, type})}>
                                        <Image
                                            source={{uri: item.images[0]}}
                                            style={{width: width / 2 - 15, height: height / 2, borderRadius: 10}}
                                        />
                                    </TouchableWithoutFeedback>
                                    <View style={{flexDirection: 'column', justifyContent: 'space-between'}}>
                                        <TouchableWithoutFeedback onPress={() => navigation.navigate('Images', {images: item.images, index: 1, _id: item?._id, type})}>
                                            <Image
                                                source={{uri: item.images[1]}}
                                                style={{width: width / 2 - 15, height: height / 4 - 10, borderRadius: 10}}
                                            />
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={() => navigation.navigate('Images', {images: item.images, index: 2, _id: item?._id, type})}>
                                            <Image
                                                source={{uri: item.images[2]}}
                                                style={{width: width / 2 - 15, height: height / 4 - 10, borderRadius: 10}}
                                            />
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                            )}
                            {item.images.length >= 4 && (
                                <View style={{flexDirection: 'column', justifyContent: 'space-between'}}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <TouchableWithoutFeedback onPress={() => navigation.navigate('Images', {images: item.images, index: 0, _id: item?._id, type})}>
                                            <Image
                                                source={{uri: item.images[0]}}
                                                style={{width: width / 2 - 15, height: height / 4 - 10, borderRadius: 10}}
                                            />
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={() => navigation.navigate('Images', {images: item.images, index: 1, _id: item?._id, type})}>
                                            <Image
                                                source={{uri: item.images[1]}}
                                                style={{width: width / 2 - 15, height: height / 4 - 10, borderRadius: 10}}
                                            />
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <TouchableWithoutFeedback onPress={() => navigation.navigate('Images', {images: item.images, index: 2, _id: item?._id, type})}>
                                            <Image
                                                source={{uri: item.images[2]}}
                                                style={{width: width / 2 - 15, height: height / 4 - 10, borderRadius: 10}}
                                            />
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={() => navigation.navigate('Images', {images: item.images, index: 3, _id: item?._id, type})}>
                                            <Image
                                                source={{uri: item.images[3]}}
                                                style={{width: width / 2 - 15, height: height / 4 - 10, borderRadius: 10}}
                                            />
                                            <Text style={{color: COLORS.white, position: 'absolute', bottom: 10, right: 10, fontSize: 16}}>+{item.images.length - 4}</Text>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}
                    {item.tags.length > 0 && (
                        <View style={styles.postTags}>
                            {item.tags.map((tag, index) => (
                                <TouchableOpacity key={index} onPress={() => navigation.navigate('Search', {tag})}>
                                    <Text2 style={styles.postTag}>#{tag}</Text2>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
                <View style={styles.eventToggle}>
                   <View style={styles.eventToggleLeft}>
                       {this.state.eventCollapsed ? (
                           <TouchableOpacity onPress={() => this.handleEventCollapse()}>    
                                <Text style={{color: COLORS.primary}}>Show Event</Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity onPress={() => this.handleEventCollapse()}>
                                <Text style={{color: COLORS.primary}}>Hide Event</Text>
                            </TouchableOpacity>
                          )}
                     </View>
                    <View style={styles.eventToggleRight}>
                        {this.state.eventCollapsed ? (
                            <TouchableOpacity onPress={() => this.handleEventCollapse()}>
                                    <ICONS.Ionicons name="chevron-down" size={24} color={COLORS.primary} />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={() => this.handleEventCollapse()}>
                                    <ICONS.Ionicons name="chevron-up" size={24} color={COLORS.primary} />
                                </TouchableOpacity>
                            )}
                    </View>
                </View>

                {!this.state.eventCollapsed && (
                    <View style={styles.eventDetails}>
                        <View style={styles.eventLocation}>
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: item?.event?.location?.coordinates[1],
                                longitude: item?.event?.location?.coordinates[0],
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                            initialCamera={{
                                center: {
                                    latitude: item?.event?.location?.coordinates[1],
                                    longitude: item?.event?.location?.coordinates[0],
                                },
                                pitch: 0,
                                heading: 0,
                                altitude: 1000,
                                zoom: 10,
                            }}
                        >
                            <Marker
                                coordinate={{
                                    latitude: item?.event?.location?.coordinates[1],
                                    longitude: item?.event?.location?.coordinates[0],
                                }}
                                title={item?.title}
                                description={item?.description}
                                zoomControlEnabled={true}
                                zoomTapEnabled={true}
                                draggable={true}
                                flat={true}
                                onPress={() => console.log('Marker Pressed')}
                                onDragEnd={(e) => console.log('Marker Dragged', e.nativeEvent.coordinate)}
                            />
                        </MapView>
                            <Text style={styles.eventStatus}>{item?.event?.status}</Text>
                        </View>
                        <View style={styles.eventFooter}>
                            <View style={styles.eventFooterLeft}>
                                {item?.event?.images?.length > 0 && (
                                    <TouchableOpacity onPress={() => navigation.navigate('Images', {images: item?.event?.images, index: 0, _id: item?._id, type})}>
                                        <Image
                                            source={{uri: item?.event?.images[0]}}
                                            style={styles.eventImage}
                                        />
                                    </TouchableOpacity>
                                )}
                                <View style={styles.eventFooterLeftText}>
                                    <Text2 style={[styles.eventTitle, { color: COLORS.primary}]}>{item?.event?.title}</Text2>
                                    <Text style={styles.eventDate}>{moment(item?.event?.createdAt).format('DD MMM YYYY')}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('Events', { _id: item?.event?._id })
                            }}>
                                <ICONS.AntDesign name="arrowright" size={24} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                

                <View style={styles.postFooter}>
                    <View style={styles.postFooterLeft}>
                        <TouchableOpacity onPress={this.handleUpVote}>
                           <View style={{flexDirection: 'row', alignItems: 'center'}}>
                              <ICONS.AntDesign name="like2" size={24} color={item?.upvotes?.includes(user?._id) ? COLORS.primary : COLORS.secondary} />
                              <Text style={{color: COLORS.gray, marginLeft: 5}}>{item?.upvotes?.length}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.handleDownVote}>
                           <View style={{flexDirection: 'row', alignItems: 'center'}}>
                              <ICONS.AntDesign name="dislike2" size={24} color={item?.downvotes?.includes(user?._id) ? COLORS.primary : COLORS.secondary} />
                              <Text style={{color: COLORS.gray, marginLeft: 5}}>{item?.downvotes?.length}</Text>
                           </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.handleToggleComments}>
                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                             <ICONS.MaterialCommunityIcons name='comment-text-multiple-outline' size={24} color={COLORS.primary} />
                             <Text style={{color: COLORS.gray, marginLeft: 5}}>{item?.comments?.length}</Text>
                           </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.postFooterRight}>
                        <TouchableOpacity onPress={this.handleToggleFavorite}>
                            <ICONS.AntDesign name="star" size={24} color={item?.favourites?.includes(user?._id) ? COLORS.primary : COLORS.secondary} />
                        </TouchableOpacity>
                    </View>
                </View>


                    
                {isVisible && (
                    <View style={styles.comments}>
                        <Comments item={item} isVisible={this.state.isVisible} handleToggleComments={this.handleToggleComments} type={'post'} callBack={this.props.callBack} />
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 10,
        padding: 10,
        marginVertical: 10
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    postHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10
    },
    postHeaderLeftText: {
        flexDirection: 'column'
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    date: {
        fontSize: 12,
        color: COLORS.gray
    },
    postHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    postBody: {
        marginBottom: 10
    },
    postText: {
        fontSize: 16,
        marginBottom: 10
    },
    postImages: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    postTags: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    postTag: {
        fontSize: 16,
        color: COLORS.primary
    },
    postFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10
    },
    postFooterLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '50%',
        paddingLeft: 10

    },
    postFooterRight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '50%',
        paddingRight: 10
        
    },
    comments: {
        marginTop: 10
    },
    eventDetails: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray,
        paddingTop: 10,
        marginBottom: 10
    },
    eventLocation: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    map: {
        width: '100%',
        height: 100,
        borderRadius: 10,
    },
    eventStatus: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: 'bold',
        marginTop: 10
    },
    eventFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 10
    },
    eventFooterLeft: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '80%'
    },
    eventImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 10
    },
    eventFooterLeftText: {
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    eventDate: {
        fontSize: 12,
        color: COLORS.gray
    },
    eventToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray,
        paddingTop: 10,
        marginBottom: 10
    },
    eventToggleLeft: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '80%'
    },
    eventToggleRight: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '20%'
    }


});

const mapStateToProps = (state) => {
    return {
        user: state?.data?.currentUser
    }
}

export default connect(mapStateToProps)(PostItem);
