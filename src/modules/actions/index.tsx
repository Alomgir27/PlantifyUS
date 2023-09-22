//@ts-ignore
//@ts-nocheck

import { API_URL } from "./../../constants/index"
import axios from "axios"
import { fetchTrees, handleResetTreesData } from "../trees"

import {
    USER_STATE_CHANGE,
    POSTS_STATE_CHANGE,
    EVENTS_STATE_CHANGE,
    ORGANIZATIONS_STATE_CHANGE,
    USER_DATA_STATE_CHANGE,
    POSTS_DATA_STATE_CHANGE,
    EVENTS_DATA_STATE_CHANGE,
    ORGANIZATIONS_DATA_STATE_CHANGE,
    EVENTS_SEARCH_STATE_CHANGE,
    POSTS_SEARCH_STATE_CHANGE,
    ORGANIZATIONS_SEARCH_STATE_CHANGE,
    TREES_SEARCH_STATE_CHANGE,
    USERS_SEARCH_STATE_CHANGE,
    HANDLE_EVENT_EDITED,
    HANDLE_POST_EDITED,
    HANDLE_COMMENT_SHOW,
    HANDLE_COMMENT_HIDE,
    HANDLE_COMMENT_DATA_STATE_CHANGE,
    HANDLE_NEW_COMMENT_DATA_STATE_CHANGE,
    HANDLE_COMMENT_REMOVED,
    HANDLE_COMMENT_EDITED,
    HANDLE_COMMENT_DATA_RESET,
    HANDLE_POST_REMOVE,
    HANDLE_EVENT_REMOVE,
    HANDLE_POST_ADD,
    HANDLE_EVENT_ADD,
    CLEAR_DATA,
    CLEAR_USER,
    HANDLE_EVENTS_DATA_RESET,
    HANDLE_POSTS_DATA_RESET,
    HANDLE_ORGANIZATIONS_DATA_RESET,
    LOGOUT,
    LOADING_STATE_CHANGE
} from "../constants"



//Actions data reset
export const clearData = () => {
    return ((dispatch) => {
        dispatch({ type: CLEAR_DATA })
        dispatch(handleResetTreesData())
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
export const fetchUser = (_id, callback) => {
    return (async (dispatch, getState) => {
        console.log(_id, 'USER STATE CHANGE')
        if(!_id) {
            callback(true)
            return
        }
        dispatch(handleLoading(true))
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
            if(callback) callback(true);
            dispatch(handleLoading(false))
        })
        
    })
}

export const fetchPosts = ( _id) => {
    return (async (dispatch, getState) => {        
        await axios.get(`${API_URL}/posts/initial`, {
            params: {
                user: _id
            }
        })
        .then((res) => {
            console.log(res?.data?.message)
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
        await axios.get(`${API_URL}/events/initial`)
        .then((res) => {
            dispatch({
                type: EVENTS_DATA_STATE_CHANGE, events: res.data.events
            })
        })
        .catch((err) => {
            console.log(err?.data?.message);
        })
        .finally(() => {
            
        })
     })
}



        

export const fetchOrganizations =  () => {
    return (async (dispatch, getState) => {        
        await axios.post(`${API_URL}/organizations/getAll`, {
            ids: getState().data.organizations.map((organization) => organization._id),
        })
        .then((res) => {
            console.log(res?.data?.message)
            dispatch({
                type: ORGANIZATIONS_DATA_STATE_CHANGE, organizations: res.data.organizations
            })
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            
        }
        )
    })
}



export const fetchUsers = ( _id) => {
    return (async (dispatch, getState) => {        
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
            console.log(err)
        })
        .finally(() => {
            
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
            console.log(res)
            dispatch({
                type: EVENTS_SEARCH_STATE_CHANGE, eventsSearch: res.data.events
            })
        })
        .catch((err) => {
            console.log(err)
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
            console.log(res)
            dispatch({
                type: USERS_SEARCH_STATE_CHANGE, usersSearch: res.data.users
            })
        })
        .catch((err) => {
            console.log(err)
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
            console.log(res)
            dispatch({
                type: ORGANIZATIONS_SEARCH_STATE_CHANGE, organizationsSearch: res.data.organizations
            })
        })
        .catch((err) => {
            console.log(err)
        })
    })
}

export const fetchTreesSearch = (search, limit) => {
    return (async (dispatch, getState) => {
        await axios.get(`${API_URL}/plants/search`, {
            params: {
                search: search,
            }
        })
        .then((res) => {
            console.log(res)
            dispatch({
                type: TREES_SEARCH_STATE_CHANGE, treesSearch: res.data.trees
            })
        })
        .catch((err) => {
            console.log(err)
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
            console.log(res)
            dispatch({
                type: POSTS_SEARCH_STATE_CHANGE, postsSearch: res.data.posts
            })
        })
        .catch((err) => {
            console.log(err)
        })
    })
}




export const handleEventUpvote = (event, callback) => {
    return (async (dispatch, getState) => {        
        await axios.put(`${API_URL}/events/upvote`, {
            eventId: event,
            userId: getState().data.currentUser._id
        })
        .then((res) => {
            console.log(res?.data?.message)
            if(callback) callback(res.data.event)
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            
        }
        )
    })
}

export const handleEventDownvote = (event, callback) => {
    return (async (dispatch, getState) => {        
        await axios.put(`${API_URL}/events/downvote`, {
            eventId: event,
            userId: getState().data.currentUser._id
        })
        .then((res) => {
            console.log(res)
            if(callback) callback(res.data.event)
        })
        .catch((err) => {
            console.log(err)
        })
    })
}


// Handle Posts
export const handlePostUpvote = (post, callback) => {
    return (async (dispatch, getState) => {        
        await axios.put(`${API_URL}/posts/upvote`, {
            postId: post,
            userId: getState().data.currentUser._id
        })
        .then((res) => {
            console.log(res)
            if(callback) callback(res.data.post)
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            
        }
        )
    })
}

export const handlePostDownvote = (post, callback) => {
    return (async (dispatch, getState) => {        
        await axios.put(`${API_URL}/posts/downvote`, {
            postId: post,
            userId: getState().data.currentUser._id
        })
        .then((res) => {
            console.log(res)
           if(callback) callback(res.data.post)
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            
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
        await axios.get(`${API_URL}/comments`, {
            params: {
                comments: comments,
                page: getState().data.commentsLoaded + 1
            }
        })
        .then((res) => {
            console.log(res)
            dispatch({
                type: HANDLE_COMMENT_DATA_STATE_CHANGE, comments: res.data.comments
            })
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            
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
        await axios.put(`${API_URL}/comments/upvote`, {
            commentId: comment,
            userId: getState().data.currentUser._id
        })
        .then((res) => {
            console.log(res)
            dispatch({
                type: HANDLE_COMMENT_EDITED, comments: res.data.comment
            })
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            
        }
        )
    })
}

export const handleCommentDownvote = (comment) => {
    return (async (dispatch, getState) => {        
        await axios.put(`${API_URL}/comments/downvote`, {
            commentId: comment,
            userId: getState().data.currentUser._id
        })
        .then((res) => {
            console.log(res)
            dispatch({
                type: HANDLE_COMMENT_EDITED, comments: res.data.comment
            })
        })
        .catch((err) => {
            console.log(err)
        })
    })
}

export const handleCommentSubmit = (type, id, comment, callback) => {
    return (async (dispatch, getState) => {        
        await axios.post(`${API_URL}/comments`, {
            type: type,
            id: id,
            comment: comment,
            user: getState().data.currentUser._id
        })
        .then((res) => {
            console.log(res)
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
            console.log(err)
        })
    })
}

export const handleCommentDelete = (type, id, commentId, callback) =>  {
    return (async (dispatch, getState) => {        
        await axios.delete(`${API_URL}/comments`, {
            params: {
                type: type,
                id: id,
                commentId: commentId,
                user: getState().data.currentUser._id
            }
        })
        .then((res) => {
            console.log(res)
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
            console.log(err)
        })
        .finally(() => {
            
        }
        )
    })
}

export const handleCommentEdit = (type, id, newComment) => {
    return (async (dispatch, getState) => {        
        await axios.put(`${API_URL}/comments`, {
            type: type,
            id: id,
            newComment: newComment,
            user: getState().data.currentUser._id
        })
        .then((res) => {
            console.log(res)
            dispatch({
                type: HANDLE_COMMENT_EDITED, comments: res.data.comment
            })
        })
        .catch((err) => {
            console.log(err)
        })
    })
}

export const handleAddToFavorite = (type, id, callback) => {
    return (async (dispatch, getState) => {
        
        await axios.post(`${API_URL}/favourites/add`, {
            type: type,
            id: id,
            user: getState().data.currentUser._id
        })
        .then((res) => {
            console.log(res)
            if(type === 'event') {
               if(callback) callback(res.data.event)
            }
            else if(type === 'post') {
                if(callback) callback(res?.data?.post)
            }
        })
        .catch((err) => {
            console.log(err)
        })
    })
}

export const handleRemoveFromFavorite = (type, id, callback) => {
    return (async (dispatch, getState) => {
        await axios.post(`${API_URL}/favourites/remove`, {
            type: type,
            id: id,
            user: getState().data.currentUser._id
        })
        .then((res) => {
            console.log(res)
            if(type === 'event') {
                if(callback) callback(res.data.event)
            } else if(type === 'post') {
                if(callback) callback(res?.data?.post)
            }
        }
        )
        .catch((err) => {
            console.log(err)
        }
        )
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

export const fetchAllDefaultData = (callback: any) => {
    return (async (dispatch, getState) => {
        dispatch(handleLoading(true))
        await dispatch(fetchTrees())
        await dispatch(fetchOrganizations())
        await dispatch(fetchEvents())
        if(getState().data.currentUser) {
            await dispatch(fetchPosts(getState().data.currentUser._id))
            await dispatch(fetchUsers(getState().data.currentUser._id));
        }
        else {
            await dispatch(fetchPosts(null))
        }
        dispatch(handleLoading(false))
        if(callback) callback(false)
    })
}

//
