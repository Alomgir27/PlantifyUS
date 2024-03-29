import React, { useState, useEffect, useCallback, useRef} from "react";
import { TextInput, ScrollView , FlatList, RefreshControl } from "react-native-gesture-handler";
import { images, icons, COLORS, FONTS, SIZES } from '../../constants/index';
import { Keyboard } from 'react-native';
import * as ICONS from "@expo/vector-icons";
import { View,  StyleSheet, TouchableOpacity, Image, SafeAreaView, Button, Alert } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from "../../constants/index";
import axios from "axios";

import {
    fetchEventsSearch,
    fetchOrganizationsSearch,
    fetchTreesSearch,
    fetchUsersSearch,
    fetchPostsSearch,
    fetchAllSearchData,
} from '../../modules/data';
import { Block } from "../../components";

import { Text } from "../../components";
import { useTheme } from "../../hooks";

const SearchScreen = ({ navigation , route}) => {
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState({});
    const [searchType, setSearchType] = useState('All');
    const [searchTypeText, setSearchTypeText] = useState('All');
    const [loading, setLoading] = useState(false);

    
    const dispatch = useDispatch();

    const eventsSearch = useSelector(state => state.data.eventsSearch);
    const organizationsSearch = useSelector(state => state.data.organizationsSearch);
    const treesSearch = useSelector(state => state.data.treesSearch);
    const usersSearch = useSelector(state => state.data.usersSearch);
    const postsSearch = useSelector(state => state.data.postsSearch);

    const { colors, gradients, sizes } = useTheme();


    const inputRef = useRef(null);



    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setSearch('');
            setSearchResults([]);
            setSearchType('All');
            setSearchTypeText('All');
            setLoading(false);
        }
        );
        return unsubscribe;
    }, [navigation]);


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(fetchAllSearchData('', 5));
            setSearchResults([]);
            setSearchType('All');
            setSearchTypeText('All');
            setLoading(false);
        }
        );
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        if(route?.params?.tag) {
            setSearch(route?.params?.tag);
            handleSearch(route?.params?.tag);
        }
    }, [route?.params?.tag])

  


    const _keyboardDidShow = () => {
        inputRef?.current?.focus();
    }
   
    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    }, [])

   
        




    const handleSearch = (text) => {
        setSearch(text);
        if(text.length > 0) {
            if(searchType === 'All') {
               dispatch(fetchAllSearchData(text, 5));
            }
            else if(searchType === 'Events') {
                dispatch(fetchEventsSearch(text));
            }
            else if(searchType === 'Organizations') {
                dispatch(fetchOrganizationsSearch(text));
            }
            else if(searchType === 'Trees') {
                dispatch(fetchTreesSearch(text));
            }
            else if(searchType === 'Users') {
                dispatch(fetchUsersSearch(text));
            }
            else if(searchType === 'Posts') {
                dispatch(fetchPostsSearch(text));
            }
        }
        else {
            setSearchResults([]);
        }
    }

    const handleSearchType = (type) => {
        setSearchType(type);
        if(type === 'All') {
            setSearchTypeText('All');
        }
        else if(type === 'Events') {
            setSearchTypeText('Events');
        }
        else if(type === 'Organizations') {
            setSearchTypeText('Organizations');
        }
        else if(type === 'Trees') {
            setSearchTypeText('Trees');
        }
        else if(type === 'Users') {
            setSearchTypeText('Users');
        }
        else if(type === 'Posts') {
            setSearchTypeText('Posts');
        }
    }

    const handleSearchResult = (type, item) => {
        if(searchType === 'Events' || type === 'Events') {
            navigation.navigate('Events', {  _id: item?._id });  
        }
        else if(searchType === 'Organizations' || type === 'Organizations') {
            navigation.navigate('Organizations', { _id: item?._id });
        }
        else if(searchType === 'Trees' || type === 'Trees') {
            navigation.navigate('Trees', { _id: item?._id });
        }
        else if(searchType === 'Users' || type === 'Users') {
            navigation.navigate('Profile', { userId: item?._id });
        }
        else if(searchType === 'Posts' || type === 'Posts') {
            navigation.navigate('Posts', { _id: item?._id });
        }
       
    }

    useEffect(() => {
        if(searchType === 'All') {
            setSearchResults({
                events: eventsSearch,
                organizations: organizationsSearch,
                trees: treesSearch,
                users: usersSearch,
                posts: postsSearch
            })
        }
        else if(searchType === 'Events') {
            setSearchResults({events: eventsSearch})
        }
        else if(searchType === 'Organizations') {
            setSearchResults({organizations: organizationsSearch})
        }
        else if(searchType === 'Trees') {
            setSearchResults({trees: treesSearch})
        }
        else if(searchType === 'Users') {
            setSearchResults({users: usersSearch})
        }
        else if(searchType === 'Posts') {
            setSearchResults({posts: postsSearch})
        }
    }, [eventsSearch, organizationsSearch, treesSearch, usersSearch, postsSearch, searchType])

    const onRefresh = () => {
        setLoading(true);
        dispatch(fetchAllSearchData('', 5))
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }

    



    const renderSearchResults = useCallback(() => {
        if(searchType === 'All') {
            return (
                <View style={styles.searchResultsContainer}>

                {/* Events section */}
                {searchResults?.events?.length > 0 && (
                    <View style={styles.searchResultsHeader}>
                        <Text style={styles.searchResultsHeaderText}>Events</Text>
                    </View>
                )}
                  {searchResults?.events?.map((item) => (
                        <TouchableOpacity style={styles.searchResult} onPress={() => handleSearchResult('Events', item)} key={item._id.toString()}>
                             <Image source={{uri: item?.images[0]}} style={styles.searchResultImage} />
                             <View style={{flex: 1, flexDirection: 'column'}}>
                                <Text numberOfLines={1} style={styles.searchResultText}>{item?.title}</Text>
                                <Text numberOfLines={2} style={styles.searchResultText}>{item?.description}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                 )}


                {/* Organizations section */}
                {searchResults?.organizations?.length > 0 && (
                    <View style={styles.searchResultsHeader}>
                        <Text style={styles.searchResultsHeaderText}>Organizations</Text>
                    </View>
                )}
        
                    {searchResults?.organizations?.map(( item ) => (
                            <TouchableOpacity style={styles.searchResult} onPress={() => handleSearchResult('Organizations', item)} key={item._id.toString()}>
                                <Image source={{uri: item?.images[0]}} style={styles.searchResultImage} />
                                  <Text style={styles.searchResultText}>{item?.name}</Text>
                            </TouchableOpacity>
                        )
                    )}

                {/* Trees section */}
                {searchResults?.trees?.length > 0 && (
                    <View style={styles.searchResultsHeader}>
                        <Text style={styles.searchResultsHeaderText}>Trees</Text>
                    </View>
                )}
                  
                    {searchResults?.trees?.map(( item ) => (
                        <TouchableOpacity style={styles.searchResult} onPress={() => handleSearchResult('Trees', item)} key={item._id.toString()}>
                            <Image source={{uri: item?.images[0]}} style={styles.searchResultImage} />
                            <Text style={styles.searchResultText}>{item?.name}</Text>
                        </TouchableOpacity>
                      )
                    )}

                {/* Users section */}
                {searchResults?.users?.length > 0 && (
                    <View style={styles.searchResultsHeader}>
                        <Text style={styles.searchResultsHeaderText}>Users</Text>
                    </View>
                )}
                    
                    {searchResults?.users?.map(( item ) => (
                        <TouchableOpacity style={styles.searchResult} onPress={() => handleSearchResult('Users', item)} key={item._id.toString()}>
                            <Image source={{uri: item?.image}} style={styles.searchResultImage} />
                            <View style={{flex: 1, flexDirection: 'column'}}>
                                <Text style={styles.searchResultText}>{item?.name}</Text>
                                <Text style={styles.searchResultText}>{item?.type}</Text>
                            </View>
                        </TouchableOpacity>
                     )
                    )}

                {/* Posts section */}
                {searchResults?.posts?.length > 0 && (
                    <View style={styles.searchResultsHeader}>
                        <Text style={styles.searchResultsHeaderText}>Posts</Text>
                    </View> 
                    )}

                    {searchResults?.posts?.map(( item ) => (
                            <TouchableOpacity style={styles.searchResult} onPress={() => handleSearchResult('Posts', item)} key={item._id.toString()}>
                                <Image source={{uri: item?.images[0]}} style={styles.searchResultImage} />
                              <View style={{flex: 1, flexDirection: 'column'}}>
                                  <Text multiline={true} numberOfLines={2} style={styles.searchResultText}>{item?.text}</Text>
                                  <Text style={styles.searchResultText}>posted by {item?.author?.name}</Text>
                                  {item?.tags?.length > 0 && <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    {item?.tags?.slice(0, 5)?.map((tag) => (
                                        <TouchableOpacity style={{backgroundColor: COLORS.lightGray, borderRadius: 10, padding: 5, marginRight: 5}} key={tag} onPress={() => setSearch(tag)}>
                                            <Text style={{color: COLORS.black, fontSize: 16}}>{tag}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                }
                              </View>
                            </TouchableOpacity>
                        )
                    )}
                </View>
            )
        }
        else if(searchType === 'Events') {
            return (
                <View style={styles.searchResultsContainer}>
                   {searchResults.events?.map((item) => (
                        <TouchableOpacity style={styles.searchResult} onPress={() => handleSearchResult('Events', item)} key={item._id.toString()} >
                             <Image source={{uri: item?.images[0]}} style={styles.searchResultImage} />
                             <View style={{flex: 1, flexDirection: 'column'}}>
                                <Text numberOfLines={1} style={styles.searchResultText}>{item?.title}</Text>
                                <Text multiline={true} numberOfLines={2} style={styles.searchResultText}>{item?.description}</Text>
                             </View>
                        </TouchableOpacity>
                    )
                   )}
                </View>
            )
        }
        else if(searchType === 'Organizations') {
            return (
                <View style={styles.searchResultsContainer}>
                    {searchResults?.organizations?.map(( item ) => (
                            <TouchableOpacity style={styles.searchResult} onPress={() => handleSearchResult('Organizations', item)} key={item._id.toString()} >
                                <Image source={{uri: item?.images[0]}} style={styles.searchResultImage} />
                                <Text style={styles.searchResultText}>{item?.name}</Text>
                            </TouchableOpacity>
                        )
                    )}
                </View>
            )
        }
        else if(searchType === 'Trees') {
            return (
                <View style={styles.searchResultsContainer}>
                     {searchResults?.trees?.map(( item ) => (
                        <TouchableOpacity style={styles.searchResult} onPress={() => handleSearchResult('Trees', item)} key={item._id.toString()} >
                            <Image source={{uri: item?.images[0]}} style={styles.searchResultImage} />
                            <Text style={styles.searchResultText}>{item?.name}</Text>
                        </TouchableOpacity>
                      )
                    )}
                </View>
            )
        }
        else if(searchType === 'Users') {
            return (
                <View style={styles.searchResultsContainer}>
                     {searchResults?.users?.map(( item ) => (
                            <TouchableOpacity style={styles.searchResult} onPress={() => handleSearchResult('Users', item)} key={item._id.toString()} >
                                <Image source={{uri: item?.image}} style={styles.searchResultImage} />
                                <View style={{flex: 1, flexDirection: 'column'}}>
                                    <Text style={styles.searchResultText}>{item?.name}</Text>
                                    <Text style={styles.searchResultText}>{item?.type}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    )}
                </View>
            )
        }
        else if(searchType === 'Posts') {
            return (
                <View style={styles.searchResultsContainer}>
                    {searchResults?.posts?.map(( item ) => (
                            <TouchableOpacity style={styles.searchResult} onPress={() => handleSearchResult('Posts', item)} key={item._id.toString()} >
                                <Image source={{uri: item?.images[0]}} style={styles.searchResultImage} />
                                <View style={{flex: 1, flexDirection: 'column'}}>
                                    <Text multiline={true} numberOfLines={2} style={styles.searchResultText}>{item?.text}</Text>
                                    <Text style={styles.searchResultText}>posted by {item?.author?.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    )}
                </View>
            )
        }
    }, [searchResults, searchType])





    return (
        <ScrollView 
          style={styles.container}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
         }
        >
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <ICONS.Ionicons name="search" size={20} color={COLORS.gray} />
                     <TextInput
                        ref={inputRef}
                        style={[styles.searchInput, { color: colors.text }] }
                        placeholder="Search"
                        placeholderTextColor={colors.input}
                        onChangeText={handleSearch}
                        value={search}
                    />
                </View>
                <View style={styles.searchType}>
                    <TouchableOpacity style={[styles.searchTypeButton, { backgroundColor: colors.secondary }]} onPress={() => handleSearchType('All')}>
                        <Text style={styles.searchTypeButtonText}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.searchTypeButton, { backgroundColor: colors.secondary}]} onPress={() => handleSearchType('Events')}>
                        <Text style={styles.searchTypeButtonText}>Events</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.searchTypeButton, { backgroundColor: colors.secondary}]} onPress={() => handleSearchType('Organizations')}>
                        <Text style={styles.searchTypeButtonText}>Organizations</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.searchTypeButton, { backgroundColor: colors.secondary}]} onPress={() => handleSearchType('Trees')}>
                        <Text style={styles.searchTypeButtonText}>Trees</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.searchTypeButton, { backgroundColor: colors.secondary}]} onPress={() => handleSearchType('Users')}>
                        <Text style={styles.searchTypeButtonText}>Users</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.searchTypeButton, { backgroundColor: colors.secondary}]} onPress={() => handleSearchType('Posts')}>
                        <Text style={styles.searchTypeButtonText}>Posts</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.searchResultsContainer}>
                <Text style={styles.searchResultsText}>Search Results for {searchTypeText}</Text>
                {renderSearchResults()}
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        // backgroundColor: COLORS.white,
        borderBottomColor: COLORS.lightGray,
        borderBottomWidth: 1,
        padding: 10,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: COLORS.lightGray,
        borderRadius: 10,
        padding: 5,
    },
    searchInput: {
        flex: 1,
        color: COLORS.black,
        fontSize: 16,
        marginLeft: 5,
    },
    searchType: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    searchTypeButton: {
        backgroundColor: COLORS.lightGray,
        borderRadius: 10,
        padding: 5,
    },
    searchTypeButtonText: {
        color: COLORS.black,
        fontSize: 16,
    },
    searchResultsContainer: {
        flex: 1,
        // backgroundColor: COLORS.white,
        padding: 10,
    },
    searchResultsText: {
        color: COLORS.black,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    searchResult: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    searchResultImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    searchResultText: {
        color: COLORS.black,
        fontSize: 16,
    },
    searchResultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    searchResultsHeaderText: {
        color: COLORS.black,
        fontSize: 16,
        fontWeight: 'bold',
    },
    searchResultsHeaderButton: {
        // backgroundColor: COLORS.lightGray,
        borderRadius: 10,
        padding: 5,
    },
    searchResultsHeaderSeeAll: {
        color: COLORS.black,
        fontSize: 16,
    },

})

export default SearchScreen
               


    