import { API_URL } from "../constants"
import axios from "axios"


//Actions 
const USER_STATE_CHANGE = 'USER_STATE_CHANGE'
const POSTS_STATE_CHANGE = 'POSTS_STATE_CHANGE'
const EVENTS_STATE_CHANGE = 'EVENTS_STATE_CHANGE'
const ORGANIZATIONS_STATE_CHANGE = 'ORGANIZATIONS_STATE_CHANGE'
const TREES_STATE_CHANGE = 'TREES_STATE_CHANGE'

const USER_DATA_STATE_CHANGE = 'USER_DATA_STATE_CHANGE'
const POSTS_DATA_STATE_CHANGE = 'POSTS_DATA_STATE_CHANGE'
const EVENTS_DATA_STATE_CHANGE = 'EVENTS_DATA_STATE_CHANGE'
const ORGANIZATIONS_DATA_STATE_CHANGE = 'ORGANIZATIONS_DATA_STATE_CHANGE'
const TREES_DATA_STATE_CHANGE = 'TREES_DATA_STATE_CHANGE'

const EVENTS_SEARCH_STATE_CHANGE = 'EVENTS_SEARCH_STATE_CHANGE'
const POSTS_SEARCH_STATE_CHANGE = 'POSTS_SEARCH_STATE_CHANGE'
const ORGANIZATIONS_SEARCH_STATE_CHANGE = 'ORGANIZATIONS_SEARCH_STATE_CHANGE'
const TREES_SEARCH_STATE_CHANGE = 'TREES_SEARCH_STATE_CHANGE'
const USERS_SEARCH_STATE_CHANGE = 'USER_SEARCH_STATE_CHANGE'



const CLEAR_DATA = 'CLEAR_DATA'



//Initial State
const INITIAL_STATE = {
    currentUser: null,
    posts: [],
    events: [],
    organizations: [],
    trees: [],
    users: [],
    usersLoaded: 0,
    postsLoaded: 0,
    eventsLoaded: 0,
    organizationsLoaded: 0,
    treesLoaded: 0,
    eventsSearch: [],
    postsSearch: [],
    organizationsSearch: [],
    treesSearch: [],
    usersSearch: []
}


//Reducer

export default  data = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        case POSTS_STATE_CHANGE:
            return {
                ...state,
                posts: action.posts
            }
        case EVENTS_STATE_CHANGE:
            return {
                ...state,
                events: action.events
            }
        case ORGANIZATIONS_STATE_CHANGE:
            return {
                ...state,
                organizations: action.organizations
            }
        case TREES_STATE_CHANGE:
            return {
                ...state,
                trees: action.trees
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
        case EVENTS_DATA_STATE_CHANGE:
            return {
                ...state,
                eventsLoaded: state.eventsLoaded + 1,
                events: [...state.events, ...action.events]
            }
        case ORGANIZATIONS_DATA_STATE_CHANGE:
            return {
                ...state,
                organizationsLoaded: state.organizationsLoaded + 1,
                organizations: [...state.organizations, ...action.organizations]
            }
        case TREES_DATA_STATE_CHANGE:
            return {
                ...state,
                treesLoaded: state.treesLoaded + 1,
                trees: [...state.trees, ...action.trees]
            }
        case EVENTS_SEARCH_STATE_CHANGE:
            return {
                ...state,
                eventsSearch: action.eventsSearch
            }
        case POSTS_SEARCH_STATE_CHANGE:
            return {
                ...state,
                postsSearch: action.postsSearch
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
                treesLoaded: 0,
                eventsSearch: [],
                postsSearch: [],
                organizationsSearch: [],
                treesSearch: [],
                usersSearch: []
            }
        default:
            return state;
    }
}


//Actions
export const clearData = () => {
    return ((dispatch) => {
        dispatch({ type: CLEAR_DATA })
    })
}

export const fetchUser = ( _id) => {
    return (async (dispatch) => {
        await axios.get(`${API_URL}/users/${_id}`)
        .then((res) => {
            console.log(res?.data?.message)
            dispatch({
                type: USER_STATE_CHANGE, currentUser: res.data.user
            })
            dispatch(fetchPosts(res?.data?.user?._id))
            dispatch(fetchUsers(res?.data?.user?._id))
        })
        .catch((err) => {
            console.log(err?.data?.message);
            dispatch({
                type: USER_STATE_CHANGE, currentUser: null
            })
        })
    })
}

export const fetchPosts = ( _id) => {
    return (async (dispatch, getState) => {
        if(getState().data.postsLoaded * 20 !== getState().data.posts.length) return
        await axios.get(`${API_URL}/posts`, {
            params: {
                page: getState().data.postsLoaded + 1,
                user: _id
            }
        })
        .then((res) => {
            console.log(res?.data?.message)
            console.log(res.data)
            dispatch({
                type: POSTS_DATA_STATE_CHANGE, posts: res.data.posts
            })
        })
        .catch((err) => {
            console.log(err?.data?.message)
        })
    })
}
        

export const fetchEvents =  () => {
    return (async (dispatch, getState) => {
       if(getState().data.eventsLoaded * 20 !== getState().data.events.length) return
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
     })
}



        

export const fetchOrganizations =  () => {
    return (async (dispatch, getState) => {
        if(getState().data.organizationsLoaded * 20 !== getState().data.organizations.length)return
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
    })
}


export const fetchTrees =  () => {
    return (async (dispatch, getState) => {
        if(getState().data.treesLoaded * 20 !== getState().data.trees.length) return
        await axios.get(`${API_URL}/plants`, {
            params: {
                page: getState().data.treesLoaded + 1
            }
        })
        .then((res) => {
            console.log(res?.data?.message)
            dispatch({
                type: TREES_DATA_STATE_CHANGE, trees: res.data.trees
            })
        })
        .catch((err) => {
            console.log(err?.data?.message);
        })
    })
}


export const fetchUsers = ( _id) => {
    return (async (dispatch, getState) => {
        if(getState().data.usersLoaded * 20 !== getState().data.users.length) return
        await axios.get(`${API_URL}/users`, {
            params: {
                page: getState().data.usersLoaded + 1,
                user: _id
            }
        })
        .then((res) => {
            console.log(res?.data?.message)
            dispatch({
                type: USER_DATA_STATE_CHANGE, users: res.data.users
            })
        })
        .catch((err) => {
            console.log(err?.data?.message)
        })
    })
}



export const fetchAllDefaultData = () => {
    return (async (dispatch, getState) => {
        await dispatch(fetchEvents())
        await dispatch(fetchOrganizations())
        await dispatch(fetchTrees())
        if(getState().data.currentUser) {
            await dispatch(fetchPosts(getState().data.currentUser._id))
            await dispatch(fetchUsers(getState().data.currentUser._id))
        }
        else {
            await dispatch(fetchPosts(null))
        }
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

export const fetchAllSearchData = (search, limit) => {
    return (async (dispatch, getState) => {
        await dispatch(fetchEventsSearch(search, limit))
        await dispatch(fetchOrganizationsSearch(search, limit))
        await dispatch(fetchTreesSearch(search, limit))
        await dispatch(fetchUsersSearch(search, limit))
        await dispatch(fetchPostsSearch(search, limit))
    })
}