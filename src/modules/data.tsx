import { API_URL } from "../constants/index"
import axios from "axios"
import { fetchTrees } from "./trees"
import  AsyncStorage  from '@react-native-async-storage/async-storage';

//Actions 
const USER_STATE_CHANGE = 'USER_STATE_CHANGE'
const POSTS_STATE_CHANGE = 'POSTS_STATE_CHANGE'
const EVENTS_STATE_CHANGE = 'EVENTS_STATE_CHANGE'
const ORGANIZATIONS_STATE_CHANGE = 'ORGANIZATIONS_STATE_CHANGE'

const USER_DATA_STATE_CHANGE = 'USER_DATA_STATE_CHANGE'
const POSTS_DATA_STATE_CHANGE = 'POSTS_DATA_STATE_CHANGE'
const EVENTS_DATA_STATE_CHANGE = 'EVENTS_DATA_STATE_CHANGE'
const ORGANIZATIONS_DATA_STATE_CHANGE = 'ORGANIZATIONS_DATA_STATE_CHANGE'

const EVENTS_SEARCH_STATE_CHANGE = 'EVENTS_SEARCH_STATE_CHANGE'
const POSTS_SEARCH_STATE_CHANGE = 'POSTS_SEARCH_STATE_CHANGE'
const ORGANIZATIONS_SEARCH_STATE_CHANGE = 'ORGANIZATIONS_SEARCH_STATE_CHANGE'
const TREES_SEARCH_STATE_CHANGE = 'TREES_SEARCH_STATE_CHANGE'
const USERS_SEARCH_STATE_CHANGE = 'USER_SEARCH_STATE_CHANGE'

const HANDLE_EVENT_EDITED = 'HANDLE_EVENT_EDITED'
const HANDLE_POST_EDITED = 'HANDLE_POST_EDITED'

const HANDLE_COMMENT_SHOW = 'HANDLE_COMMENT_SHOW'
const HANDLE_COMMENT_HIDE = 'HANDLE_COMMENT_HIDE'

const HANDLE_COMMENT_DATA_STATE_CHANGE = 'HANDLE_COMMENT_DATA_STATE_CHANGE'
const HANDLE_NEW_COMMENT_DATA_STATE_CHANGE = 'HANDLE_NEW_COMMENT_DATA_STATE_CHANGE'
const HANDLE_COMMENT_REMOVED = 'HANDLE_COMMENT_REMOVED'
const HANDLE_COMMENT_EDITED = 'HANDLE_COMMENT_EDITED'
const HANDLE_COMMENT_DATA_RESET = 'HANDLE_COMMENT_DATA_RESET'

const HANDLE_POST_REMOVE = 'HANDLE_POST_REMOVE'
const HANDLE_EVENT_REMOVE = 'HANDLE_EVENT_REMOVE'

const HANDLE_POST_ADD = 'HANDLE_POST_ADD'
const HANDLE_EVENT_ADD = 'HANDLE_EVENT_ADD'


const CLEAR_DATA = 'CLEAR_DATA'
const CLEAR_USER = 'CLEAR_USER'
const HANDLE_EVENTS_DATA_RESET = 'HANDLE_EVENTS_DATA_RESET'
const HANDLE_POSTS_DATA_RESET = 'HANDLE_POSTS_DATA_RESET'
const HANDLE_ORGANIZATIONS_DATA_RESET = 'HANDLE_ORGANIZATIONS_DATA_RESET'
const LOGOUT = 'LOGOUT'

const LOADING_STATE_CHANGE = 'LOADING_STATE_CHANGE'


//Initial State
const INITIAL_STATE = {
    currentUser: null,
    posts: [],
    events: [],
    organizations: [],
    users: [],
    usersLoaded: 0,
    postsLoaded: 0,
    eventsLoaded: 0,
    organizationsLoaded: 0,
    eventsSearch: [],
    postsSearch: [],
    organizationsSearch: [],
    treesSearch: [],
    usersSearch: [],
    comments: [],
    commentsLoaded: 0,
    commentsShow: false,
    loading: false
}


//Reducer

export default  data = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
       
       
        case ORGANIZATIONS_STATE_CHANGE:
            return {
                ...state,
                organizations: action.organizations
            }
        case USER_DATA_STATE_CHANGE:
            return {
                ...state,
                usersLoaded: state.usersLoaded + 1,
                users: [...state.users, ...action.users]
            }
        case POSTS_DATA_STATE_CHANGE:
            return {
                ...state,
                postsLoaded: state.postsLoaded + 1,
                posts: [...state.posts, ...action.posts]
            }
        
        case ORGANIZATIONS_DATA_STATE_CHANGE:
            return {
                ...state,
                organizationsLoaded: state.organizationsLoaded + 1,
                organizations: [...state.organizations, ...action.organizations]
            }
       
        
        
        case ORGANIZATIONS_SEARCH_STATE_CHANGE:
            return {
                ...state,
                organizationsSearch: action.organizationsSearch
            }
        case TREES_SEARCH_STATE_CHANGE:
            return {
                ...state,
                treesSearch: action.treesSearch
            }
        case USERS_SEARCH_STATE_CHANGE:
            return {
                ...state,
                usersSearch: action.usersSearch
            }


        // Handle Events
        case EVENTS_STATE_CHANGE:
            return {
                ...state,
                events: action.events
            }
        case EVENTS_DATA_STATE_CHANGE:
            return {
                ...state,
                eventsLoaded: state.eventsLoaded + 1,
                events: [...state.events, ...action.events]
            }
        case HANDLE_EVENT_EDITED:
            return {
                ...state,
                events: (state.events.map((event) => {
                    if(event._id === action.events._id) {
                        return action.events
                    }
                    else {
                        return event
                    }
                }))
            }
        case EVENTS_SEARCH_STATE_CHANGE:
            return {
                ...state,
                eventsSearch: action.eventsSearch
            }
        case HANDLE_EVENT_REMOVE:
            return {
                ...state,
                events: (state.events.filter((event) => event._id !== action.events._id))
            }
        case HANDLE_EVENT_ADD:
            return {
                ...state,
                events: [...state.events, action.events]
            }



        // Handle Posts
        case POSTS_STATE_CHANGE:
            return {
                ...state,
                posts: action.posts
            }

        case HANDLE_POST_EDITED:
            return {
                ...state,
                posts: (state.posts.map((post) => {
                    if(post._id === action.posts._id) {
                        return action.posts
                    }
                    else {
                        return post
                    }
                }))
            }
        case POSTS_SEARCH_STATE_CHANGE:
            return {
                ...state,
                postsSearch: action.postsSearch
            }
        case HANDLE_POST_REMOVE:
            return {
                ...state,
                posts: (state.posts.filter((post) => post._id !== action.posts._id))
            }
        case HANDLE_POST_ADD:
            return {
                ...state,
                posts: [...state.posts, action.posts]
            }


        // Handle Comments
        case HANDLE_COMMENT_SHOW:
            return {
                ...state,
                commentsShow: true
            }
        case HANDLE_COMMENT_HIDE:
            return {
                ...state,
                commentsShow: false
            }
        case HANDLE_COMMENT_DATA_STATE_CHANGE:
            return {
                ...state,
                commentsLoaded: state.commentsLoaded + 1,
                comments: [...state.comments, ...action.comments]
            }
        case HANDLE_NEW_COMMENT_DATA_STATE_CHANGE:
            return {
                ...state,
                comments: [...state.comments, action.comments]
            }
        case HANDLE_COMMENT_DATA_RESET:
            return {
                ...state,
                commentsLoaded: 0,
                comments: []
            }
        case HANDLE_COMMENT_REMOVED:
            return {
                ...state,
                comments: (state.comments.filter((comment) => comment._id !== action.comments._id))
            }
        case HANDLE_COMMENT_EDITED:
            return {
                ...state,
                comments: (state.comments.map((comment) => {
                    if(comment._id === action.comments._id) {
                        return action.comments
                    }
                    else {
                        return comment
                    }
                }))
            }

        // Handle Loading
        case LOADING_STATE_CHANGE:
            return {
                ...state,
                loading: action.loading
            }

        // Handle Resets
        case CLEAR_DATA:
            return {
                ...state,
                users: [],
                posts: [],
                events: [],
                organizations: [],
                trees: [],
                usersLoaded: 0,
                postsLoaded: 0,
                eventsLoaded: 0,
                organizationsLoaded: 0,
                eventsSearch: [],
                postsSearch: [],
                organizationsSearch: [],
                treesSearch: [],
                usersSearch: []
            }
        case CLEAR_USER:
            return {
                ...state,
                users: [],
                usersLoaded: 0
            }
        case HANDLE_EVENTS_DATA_RESET:
            return {
                ...state,
                events: [],
                eventsLoaded: 0,
                eventsSearch: []
            }
        case HANDLE_POSTS_DATA_RESET:
            return {
                ...state,
                posts: [],
                postsLoaded: 0,
                postsSearch: []
            }
        case HANDLE_ORGANIZATIONS_DATA_RESET:
            return {
                ...state,
                organizations: [],
                organizationsLoaded: 0,
                organizationsSearch: []
            }
        case LOGOUT:
            return {
                ...state,
                currentUser: null,
                users: [],
        }
        default:
            return state;
    }
}


//Actions data reset
export const clearData = () => {
    return ((dispatch) => {
        dispatch({ type: CLEAR_DATA })
    })
}

export const clearUsers = () => {
    return ((dispatch) => {
        dispatch({ type: CLEAR_USER })
    })
}

export const logout = () => {
    return ((dispatch) => {
        dispatch({ type: LOGOUT })
    })
}

export const handleResetEventsData = () => {
    return ((dispatch) => {
        dispatch({ type: HANDLE_EVENTS_DATA_RESET })
    })
}

export const handleResetPostsData = () => {
    return ((dispatch) => {
        dispatch({ type: HANDLE_POSTS_DATA_RESET })
    })
}

export const handleResetOrganizationsData = () => {
    return ((dispatch) => {
        dispatch({ type: HANDLE_ORGANIZATIONS_DATA_RESET }) 
    })
}



//Actions Loading
export const handleLoading = (loading) => {
    return ((dispatch) => {
        dispatch({ type: LOADING_STATE_CHANGE, loading: loading })
    })
}

//Actions
export const fetchUser = ( _id) => {
    return (async (dispatch, getState) => {
        if(!_id) return
        await axios.get(`${API_URL}/users/get/${_id}`)
        .then((res) => {
            console.log(res?.data?.message, 'USER STATE CHANGE')
            dispatch({
                type: USER_STATE_CHANGE, currentUser: res.data.user
            })
            
        })
        .catch((err) => {
            console.log(err?.data?.message);
            dispatch({
                type: USER_STATE_CHANGE, currentUser: null
            })
        })
        .finally(() => {
            dispatch(handleLoading(false))
            dispatch(fetchAllDefaultData())
        })
    })
}

export const fetchPosts = ( _id) => {
    return (async (dispatch, getState) => {
        if(getState().data.loading) return
        dispatch(handleLoading(true))
        await axios.get(`${API_URL}/posts`, {
            params: {
                page: getState().data.postsLoaded + 1,
                user: _id
            }
        })
        .then((res) => {
            console.log(res?.data?.message)
            dispatch({
                type: POSTS_DATA_STATE_CHANGE, posts: res.data.posts
            })
            dispatch(handleLoading(false))
        })
        .catch((err) => {
            console.log(err?.data?.message)
            dispatch(handleLoading(false))
        })
    })
}
        

export const fetchEvents =  () => {
    return (async (dispatch, getState) => {
       if(getState().data.loading) return
         dispatch(handleLoading(true))
        await axios.get(`${API_URL}/events`, {
            params: {
                page: getState().data.eventsLoaded + 1
            }
        })
        .then((res) => {
            console.log(res?.data?.message)
            dispatch({
                type: EVENTS_DATA_STATE_CHANGE, events: res.data.events
            })
            
        })
        .catch((err) => {
            console.log(err?.data?.message);
        })
        .finally(() => {
            dispatch(handleLoading(false))
        })
     })
}



        

export const fetchOrganizations =  () => {
    return (async (dispatch, getState) => {
        if(getState().data.loading) return
        dispatch(handleLoading(true))
        await axios.get(`${API_URL}/organizations`, {
            params: {
                page: getState().data.organizationsLoaded + 1
            }
        })
        .then((res) => {
            console.log(res?.data?.message)
            dispatch({
                type: ORGANIZATIONS_DATA_STATE_CHANGE, organizations: res.data.organizations
            })
        })
        .catch((err) => {
            console.log(err?.data?.message)
        })
        .finally(() => {
            dispatch(handleLoading(false))
        }
        )
    })
}



export const fetchUsers = ( _id) => {
    return (async (dispatch, getState) => {
        if(getState().data.loading) return
        dispatch(handleLoading(true))
        await axios.get(`${API_URL}/users`, {
            params: {
                page: getState().data.usersLoaded + 1,
                user: _id
            }
        })
        .then((res) => {
            console.log(res?.data?.message, 'USERS')
            dispatch({
                type: USER_DATA_STATE_CHANGE, users: res.data.users
            })
        })
        .catch((err) => {
            console.log(err?.data?.message)
        })
        .finally(() => {
            dispatch(handleLoading(false))
        }
        )
    })
}





export const fetchEventsSearch = (search, limit) => {
    return (async (dispatch, getState) => {
        await axios.get(`${API_URL}/events/search`, {
            params: {
                search: search,
                limit: limit
            }
        })
        .then((res) => {
            console.log(res?.data?.message)
            dispatch({
                type: EVENTS_SEARCH_STATE_CHANGE, eventsSearch: res.data.events
            })
        })
        .catch((err) => {
            console.log(err?.data?.message)
        })
    })
}

export const fetchUsersSearch = (search, limit) => {
    return (async (dispatch, getState) => {
        await axios.get(`${API_URL}/users/search`, {
            params: {
                search: search,
                limit: limit
            }
        })
        .then((res) => {
            console.log(res?.data?.message)
            dispatch({
                type: USERS_SEARCH_STATE_CHANGE, usersSearch: res.data.users
            })
        })
        .catch((err) => {
            console.log(err?.data?.message)
        })
    })
}

export const fetchOrganizationsSearch = (search, limit) => {
    return (async (dispatch, getState) => {
        await axios.get(`${API_URL}/organizations/search`, {
            params: {
                search: search,
                limit: limit
            }
        })
        .then((res) => {
            console.log(res?.data?.message)
            dispatch({
                type: ORGANIZATIONS_SEARCH_STATE_CHANGE, organizationsSearch: res.data.organizations
            })
        })
        .catch((err) => {
            console.log(err?.data?.message)
        })
    })
}

export const fetchTreesSearch = (search, limit) => {
    return (async (dispatch, getState) => {
        await axios.get(`${API_URL}/plants/search`, {
            params: {
                search: search,
                limit: limit
            }
        })
        .then((res) => {
            console.log(res?.data?.message)
            dispatch({
                type: TREES_SEARCH_STATE_CHANGE, treesSearch: res.data.trees
            })
        })
        .catch((err) => {
            console.log(err?.data?.message)
        })
    })
}

export const fetchPostsSearch = (search, limit) => {
    return (async (dispatch, getState) => {
        await axios.get(`${API_URL}/posts/search`, {
            params: {
                search: search,
                limit: limit
            }
        })
        .then((res) => {
            console.log(res?.data?.message)
            dispatch({
                type: POSTS_SEARCH_STATE_CHANGE, postsSearch: res.data.posts
            })
        })
        .catch((err) => {
            console.log(err?.data?.message)
        })
    })
}




export const handleEventUpvote = (event, user) => {
    return (async (dispatch, getState) => {
        if(getState().data.loading) return
        dispatch(handleLoading(true))
        await axios.put(`${API_URL}/events/upvote`, {
            eventId: event,
            userId: user
        })
        .then((res) => {
            console.log(res?.data?.message)
            dispatch({
                type: HANDLE_EVENT_EDITED, events: res.data.event
            })
        })
        .catch((err) => {
            console.log(err?.data?.message)
            console.log(err)
        })
        .finally(() => {
            dispatch(handleLoading(false))
        }
        )
    })
}

export const handleEventDownvote = (event, user) => {
    return (async (dispatch, getState) => {
        if(getState().data.loading) return
        dispatch(handleLoading(true))
        await axios.put(`${API_URL}/events/downvote`, {
            eventId: event,
            userId: user
        })
        .then((res) => {
            console.log(res?.data?.message)
            dispatch({
                type: HANDLE_EVENT_EDITED, events: res.data.event
            })
        })
        .catch((err) => {
            console.log(err?.data)
            console.log(err)
        })
        .finally(() => {
            dispatch(handleLoading(false))
        }
        )
    })
}


// Handle Posts
export const handlePostUpvote = (post) => {
    return (async (dispatch, getState) => {
        if(getState().data.loading) return
        dispatch(handleLoading(true))
        await axios.put(`${API_URL}/posts/upvote`, {
            postId: post,
            userId: getState().data.currentUser._id
        })
        .then((res) => {
            console.log(res?.data?.message)
            dispatch({
                type: HANDLE_POST_EDITED, posts: res.data.post
            })
        })
        .catch((err) => {
            console.log(err?.data?.message)
        })
        .finally(() => {
            dispatch(handleLoading(false))
        }
        )
    })
}

export const handlePostDownvote = (post) => {
    return (async (dispatch, getState) => {
        if(getState().data.loading) return
        dispatch(handleLoading(true))
        await axios.put(`${API_URL}/posts/downvote`, {
            postId: post,
            userId: getState().data.currentUser._id
        })
        .then((res) => {
            console.log(res?.data?.message)
            dispatch({
                type: HANDLE_POST_EDITED, posts: res.data.post
            })
        })
        .catch((err) => {
            console.log(err?.data)
            console.log(err)
        })
        .finally(() => {
            dispatch(handleLoading(false))
        }
        )
    })
}



// Handle Comments

export const handleCommentShow = () => {
    return ((dispatch) => {
        dispatch({ type: HANDLE_COMMENT_SHOW })
    })
}

export const handleCommentHide = () => {
    return ((dispatch) => {
        dispatch({ type: HANDLE_COMMENT_HIDE })
    })
}

export const fetchComments = (comments) => {
    return (async (dispatch, getState) => {
        if(getState().data.loading) return
        dispatch(handleLoading(true))
        await axios.get(`${API_URL}/comments`, {
            params: {
                comments: comments,
                page: getState().data.commentsLoaded + 1
            }
        })
        .then((res) => {
            console.log(res?.data?.message)
            dispatch({
                type: HANDLE_COMMENT_DATA_STATE_CHANGE, comments: res.data.comments
            })
        })
        .catch((err) => {
            console.log(err?.data?.message)
        })
        .finally(() => {
            dispatch(handleLoading(false))
        }
        )
    })
}

export const fetchCommentsReset = () => {
    return ((dispatch) => {
        dispatch({ type: HANDLE_COMMENT_DATA_RESET })
    })
}

export const handleCommentUpvote = (comment) => {
    return (async (dispatch, getState) => {
        if(getState().data.loading) return
        dispatch(handleLoading(true))
        await axios.put(`${API_URL}/comments/upvote`, {
            commentId: comment,
            userId: getState().data.currentUser._id
        })
        .then((res) => {
            console.log(res?.data?.message)
            dispatch({
                type: HANDLE_COMMENT_EDITED, comments: res.data.comment
            })
        })
        .catch((err) => {
            console.log(err?.data)
            console.log(err)
        })
        .finally(() => {
            dispatch(handleLoading(false))
        }
        )
    })
}

export const handleCommentDownvote = (comment) => {
    return (async (dispatch, getState) => {
        if(getState().data.loading) return
        dispatch(handleLoading(true))
        await axios.put(`${API_URL}/comments/downvote`, {
            commentId: comment,
            userId: getState().data.currentUser._id
        })
        .then((res) => {
            console.log(res?.data?.message)
            dispatch({
                type: HANDLE_COMMENT_EDITED, comments: res.data.comment
            })
        })
        .catch((err) => {
            console.log(err?.data)
            console.log(err)
        })
        .finally(() => {
            dispatch(handleLoading(false))
        }
        )
    })
}

export const handleCommentSubmit = (type, id, comment, callback) => {
    return (async (dispatch, getState) => {
        if(getState().data.loading) return
        dispatch(handleLoading(true))
        await axios.post(`${API_URL}/comments`, {
            type: type,
            id: id,
            comment: comment,
            user: getState().data.currentUser._id
        })
        .then((res) => {
            console.log(res?.data?.message)
            let data = res.data.comment
            data.author = getState().data.currentUser
            dispatch({
                type: HANDLE_NEW_COMMENT_DATA_STATE_CHANGE, comments: data
            })
            if(type === 'event') {
                dispatch({
                    type: HANDLE_EVENT_EDITED, events: res.data.event
                })
            }
            else if(type === 'post') {
                dispatch({
                    type: HANDLE_POST_EDITED, posts: res.data.post
                })
            }

            if(callback) callback((prevState) => ({...prevState, replyTo: [...prevState.replyTo, res.data.comment._id]}))
        })
        .catch((err) => {
            console.log(err?.data)
            console.log(err)
        })
        .finally(() => {
            dispatch(handleLoading(false))
        }
        )
    })
}

export const handleCommentDelete = (type, id, commentId, callback) =>  {
    return (async (dispatch, getState) => {
        if(getState().data.loading) return
        dispatch(handleLoading(true))
        await axios.delete(`${API_URL}/comments`, {
            params: {
                type: type,
                id: id,
                commentId: commentId,
                user: getState().data.currentUser._id
            }
        })
        .then((res) => {
            console.log(res?.data?.message)
            dispatch({
                type: HANDLE_COMMENT_REMOVED, comments: res.data.comment
            })
            if(type === 'event') {
                dispatch({
                    type: HANDLE_EVENT_EDITED, events: res.data.event
                })
            }
            else if(type === 'post') {
                dispatch({
                    type: HANDLE_POST_EDITED, posts: res.data.post
                })
            }
            if(callback) callback((prevState) => ({...prevState, replyTo: prevState.replyTo.filter((id) => id !== res?.data?.comment?._id)}))
        })
        .catch((err) => {
            console.log(err?.data)
            console.log(err)
        })
        .finally(() => {
            dispatch(handleLoading(false))
        }
        )
    })
}

export const handleCommentEdit = (type, id, newComment) => {
    return (async (dispatch, getState) => {
        if(getState().data.loading) return
        dispatch(handleLoading(true))
        await axios.put(`${API_URL}/comments`, {
            type: type,
            id: id,
            newComment: newComment,
            user: getState().data.currentUser._id
        })
        .then((res) => {
            console.log(res?.data?.message)
            dispatch({
                type: HANDLE_COMMENT_EDITED, comments: res.data.comment
            })
        })
        .catch((err) => {
            console.log(err?.data)
            console.log(err)
        })
        .finally(() => {
            dispatch(handleLoading(false))
        }
        )
    })
}

export const handleAddToFavorite = (type, id) => {
    return (async (dispatch, getState) => {
        if(getState().data.loading) return
        dispatch(handleLoading(true))
        await axios.post(`${API_URL}/favourites/add`, {
            type: type,
            id: id,
            user: getState().data.currentUser._id
        })
        .then((res) => {
            console.log(res?.data?.message)
            if(type === 'event') {
                dispatch({
                    type: HANDLE_EVENT_EDITED, events: res.data.event
                })
            }
            else if(type === 'post') {
                dispatch({
                    type: HANDLE_POST_EDITED, posts: res.data.post
                })
            }
        })
        .catch((err) => {
            console.log(err?.data)
            console.log(err)
        })
        .finally(() => {
            dispatch(handleLoading(false))
        }
        )
    })
}

export const handleRemoveFromFavorite = (type, id) => {
    return (async (dispatch, getState) => {
        if(getState().data.loading) return
        dispatch(handleLoading(true))
        await axios.post(`${API_URL}/favourites/remove`, {
            type: type,
            id: id,
            user: getState().data.currentUser._id
        })
        .then((res) => {
            console.log(res?.data?.message)
            if(type === 'event') {
                dispatch({
                    type: HANDLE_EVENT_EDITED, events: res.data.event
                })
            } else if(type === 'post') {
                dispatch({
                    type: HANDLE_POST_EDITED, posts: res.data.post
                })
            }
        }
        )
        .catch((err) => {
            console.log(err?.data)
            console.log(err)
        }
        )
        .finally(() => {
            dispatch(handleLoading(false))
        }
        )
    })
}

export const handlePostsMerge = (posts) => {
    return ((dispatch, getState) => {
       posts.forEach((post) => {
              dispatch({
                    type: HANDLE_POST_REMOVE, posts: post
                })
               dispatch({
                    type: HANDLE_POST_ADD, posts: post
                })
        })
    })
}

export const handleEventsMerge = (events) => {
    return ((dispatch, getState) => {
         events.forEach((event) => {
                dispatch({
                    type: HANDLE_EVENT_REMOVE, events: event
                })
                dispatch({
                    type: HANDLE_EVENT_ADD, events: event
                })
        })
    })
}


export const fetchAllSearchData = (search, limit) => {
    return (async (dispatch, getState) => {
        await dispatch(fetchEventsSearch(search, limit))
        await dispatch(fetchOrganizationsSearch(search, limit))
        await dispatch(fetchTreesSearch(search, limit))
        await dispatch(fetchUsersSearch(search, limit))
        await dispatch(fetchPostsSearch(search, limit))
    })
}

export const fetchAllDefaultData = () => {
    return (async (dispatch, getState) => {
        await dispatch(fetchEvents())
        if(getState().data.currentUser) {
            await dispatch(fetchPosts(getState().data.currentUser._id))
            await dispatch(fetchUsers(getState().data.currentUser._id))
        }
        else {
            await dispatch(fetchPosts(null))
        }
        await dispatch(fetchOrganizations())
        await dispatch(fetchTrees())
        
    })
}

