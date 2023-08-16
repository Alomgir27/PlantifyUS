import axios from "axios";
import { API_URL } from "../constants/index";


export const TREES_DATA_STATE_CHANGE = 'TREES_DATA_STATE_CHANGE';
export const TREES_DATA_ADD = 'TREES_DATA_ADD';
export const TREES_DATA_FETCH_SUCCESS = 'TREES_DATA_FETCH_SUCCESS';
export const TREES_DATA_UPDATE = 'TREES_DATA_UPDATE';
export const TREES_DATA_DELETE = 'TREES_DATA_DELETE';
export const TREES_DATA_RESET = 'TREES_DATA_RESET';
export const LOADING_STATE_CHANGE = 'LOADING_STATE_CHANGE';





const initialState = {
    trees: [],
    treesLoaded: 0,
    loading: false
}

export const treesReducer = (state = initialState, action) => {
    switch(action.type) {
        case TREES_DATA_STATE_CHANGE:
            return {
                ...state,
                trees: [...state.trees, ...action.payload]
            }
        case TREES_DATA_ADD:
            return {
                ...state,
                trees: [...state.trees, action.payload]
            }
        case TREES_DATA_FETCH_SUCCESS:
            return {
                ...state,
                trees: [...state.trees, ...action.payload],
                treesLoaded: state.treesLoaded + 1
            }
        case TREES_DATA_UPDATE:
            return {
                ...state,
                trees: state.trees.map((tree) => {
                    if(tree._id === action.payload._id) {
                        return {
                            ...tree,
                            ...action.payload
                        }
                    }
                    return tree;
                })
            }
        case TREES_DATA_DELETE:
            return {
                ...state,
                trees: state.trees.filter((tree) => tree._id !== action.payload)
            }
        case TREES_DATA_RESET:
            return {
                ...state,
                trees: [],
                treesLoaded: 0
            }
        case LOADING_STATE_CHANGE:
            return {
                ...state,
                loading: action.payload
            }
        
        default:
            return state;
    }
}

export const loadingStateChange = (loading) => {
    return (dispatch) => {
        dispatch({
            type: LOADING_STATE_CHANGE,
            payload: loading
        })
    }
}

export const fetchTrees = () => {
    return (dispatch, getState) => {
        if(getState().trees.loading)return;
        dispatch(loadingStateChange(true));
        axios.get(`${API_URL}/plants/initial`)
        .then((response) => {
            console.log(response.data.message, 'trees.js')
            dispatch({
                type: TREES_DATA_FETCH_SUCCESS,
                payload: response.data.trees
            })
        })
        .catch((error) => {
            console.log(error);
        }
        )
        .finally(() => {
            dispatch(loadingStateChange(false));
        }
        )
    }
}

export const handleResetTreesData = () => {
    return (dispatch) => {
        dispatch({
            type: TREES_DATA_RESET
        })
    }
}

export const handleAddTree = (tree) => {
    return (dispatch) => {
        dispatch({
            type: TREES_DATA_ADD,
            payload: tree
        })
    }
}

export const handleUpdateTree = (tree) => {
    return (dispatch) => {
        dispatch({
            type: TREES_DATA_UPDATE,
            payload: tree
        })
    }
}

export const handleDeleteTree = (treeId) => {
    return (dispatch) => {
        dispatch({
            type: TREES_DATA_DELETE,
            payload: treeId
        })
    }
}



export const handleFetchTree = (treeId) => {
    return (dispatch, getState) => {
        if(getState().trees.loading)return;
        dispatch(loadingStateChange(true));
        axios.get(`${API_URL}/plants/${treeId}`)
        .then((response) => {
            dispatch({
                type: TREES_DATA_ADD,
                payload: response.data.tree
            })
        })
        .catch((error) => {
            console.log(error);
        }
        )
        .finally(() => {
            dispatch(loadingStateChange(false));
        }
        )
    }
}


