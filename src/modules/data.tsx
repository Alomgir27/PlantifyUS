// full path: src/modules/data.tsx
import {
    clearData,
    clearUsers,
    logout,
    handleResetEventsData,
    handleResetPostsData,
    handleResetOrganizationsData,
    handleLoading,
    fetchUser,
    fetchPosts,
    fetchEvents,
    fetchOrganizations,
    fetchUsers,
    fetchEventsSearch,
    fetchUsersSearch,
    fetchOrganizationsSearch,
    fetchTreesSearch,
    fetchPostsSearch,
    handleEventUpvote,
    handleEventDownvote,
    handlePostUpvote,
    handlePostDownvote,
    handleCommentShow,
    handleCommentHide,
    fetchComments,
    fetchCommentsReset,
    handleCommentUpvote,
    handleCommentDownvote,
    handleCommentSubmit,
    handleCommentDelete,
    handleCommentEdit,
    handleAddToFavorite,
    handleRemoveFromFavorite,
    fetchAllSearchData,
    fetchAllDefaultData
} from "./actions"

    


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
} from "./constants"

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
                usersSearch: [],
                loading: false
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


export {
    clearData,
    clearUsers,
    logout,
    handleResetEventsData,
    handleResetPostsData,
    handleResetOrganizationsData,
    handleLoading,
    fetchUser,
    fetchPosts,
    fetchEvents,
    fetchOrganizations,
    fetchUsers,
    fetchEventsSearch,
    fetchUsersSearch,
    fetchOrganizationsSearch,
    fetchTreesSearch,
    fetchPostsSearch,
    handleEventUpvote,
    handleEventDownvote,
    handlePostUpvote,
    handlePostDownvote,
    handleCommentShow,
    handleCommentHide,
    fetchComments,
    fetchCommentsReset,
    handleCommentUpvote,
    handleCommentDownvote,
    handleCommentSubmit,
    handleCommentDelete,
    handleCommentEdit,
    handleAddToFavorite,
    handleRemoveFromFavorite,
    fetchAllSearchData,
    fetchAllDefaultData
}
