import { userService } from '../services/user.service.js'

const initialState = {
    user: userService.getLoggedinUser(),
    users: [],
    watchedUser: null,
    userMsg: null,
}

export function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_USERS':
            return { ...state, users: action.users }
        case 'SET_USER':
            return { ...state, user: action.user }
        case 'SET_WATCHED_USER':
            return { ...state, watchedUser: action.user }
        case 'REMOVE_USER':
            return {
                ...state,
                users: state.users.filter(user => user._id !== action.userId)
            }
        case 'UPDATE_USER':
            return { ...state, user: action.updatedUser }
        case 'UPDATE_WATCHED_USER':
            return { ...state, watchedUser: action.updatedUser }
        case 'SET_USER_MSG':
            return { ...state, userMsg: action.msg }
        default:
            return state
    }
}
