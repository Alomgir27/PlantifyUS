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
    treesLoaded: 0
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
                users: [...state.users, action.user]
            }
        case POSTS_DATA_STATE_CHANGE:
            return {
                ...state,
                postsLoaded: state.postsLoaded + 1,
                posts: [...state.posts, action.post]
            }
        case EVENTS_DATA_STATE_CHANGE:
            return {
                ...state,
                eventsLoaded: state.eventsLoaded + 1,
                events: [...state.events, action.event]
            }
        case ORGANIZATIONS_DATA_STATE_CHANGE:
            return {
                ...state,
                organizationsLoaded: state.organizationsLoaded + 1,
                organizations: [...state.organizations, action.organization]
            }
        case TREES_DATA_STATE_CHANGE:
            return {
                ...state,
                treesLoaded: state.treesLoaded + 1,
                trees: [...state.trees, action.tree]
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
                treesLoaded: 0
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
            console.log(res)
            dispatch({
                type: USER_STATE_CHANGE, currentUser: res.data.user
            })
        })
        .catch((err) => {
            console.log(err);
            dispatch({
                type: USER_STATE_CHANGE, currentUser: null
            })
        })
    })
}

export const fetchPosts = ( _id) => {
    return (async (dispatch) => {
        await axios.get(`${API_URL}/posts/${_id}`)
        .then((res) => {
            console.log(res)
            dispatch({
                type: POSTS_DATA_STATE_CHANGE, post: res.data.post
            })
        })
        .catch((err) => {
            console.log(err);
            dispatch({
                type: POSTS_DATA_STATE_CHANGE, post: null
            })
        })
    })
}

export const fetchEvents =  () => {
    return (async (dispatch) => {
        await axios.get(`${API_URL}/events`)
        .then((res) => {
            console.log(res)
            dispatch({
                type: EVENTS_DATA_STATE_CHANGE, event: res.data.event
            })
        })
        .catch((err) => {
            console.log(err);
            dispatch({
                type: EVENTS_DATA_STATE_CHANGE, event: null
            })
        })
    })
}

export const fetchOrganizations =  () => {
    return (async (dispatch) => {
        await axios.get(`${API_URL}/organizations`)
        .then((res) => {
            console.log(res)
            dispatch({
                type: ORGANIZATIONS_DATA_STATE_CHANGE, organization: res.data.organization
            })
        })
        .catch((err) => {
            console.log(err);
            dispatch({
                type: ORGANIZATIONS_DATA_STATE_CHANGE, organization: null
            })
        })
    })
}

export const fetchTrees =  () => {
    return (async (dispatch) => {
        await axios.get(`${API_URL}/trees`)
        .then((res) => {
            console.log(res)
            dispatch({
                type: TREES_DATA_STATE_CHANGE, tree: res.data.tree
            })
        })
        .catch((err) => {
            console.log(err);
            dispatch({
                type: TREES_DATA_STATE_CHANGE, tree: null
            })
        })
    })
}

export const fetchUsersData = ( _id) => {
    return (async (dispatch, getState) => {
        const found = getState().data.users.some(el => el._id === _id);
        if (!found) {
            await axios.get(`${API_URL}/users/${_id}`)
            .then((res) => {
                console.log(res)
                dispatch({
                    type: USER_DATA_STATE_CHANGE, user: res.data.user
                })
            })
            .catch((err) => {
                console.log(err);
                dispatch({
                    type: USER_DATA_STATE_CHANGE, user: null
                })
            })
        }
    })
}
