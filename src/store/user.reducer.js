import { userService } from '../services/user.service.js'

const initialState = {
    user: userService.getLoggedinUser(),
    // user: null,
    users: [],
    watchedUser: null,
    userMsg: { class: "hidden", msg: "" },

}

export function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_USERS':
            return { ...state, users: action.users }
        case 'SET_USER':
            return { ...state, user: action.user }
        case 'REMOVE_USER':
            return {
                ...state,
                users: state.users.filter(user => user._id !== action.userId)
            }
        case 'UPDATE_USER':
            return { ...state, user: action.user }
        case 'UPDATE_FOLLOWERS':
            state.users = state.users.filter(user => user._id !== action.user._id)
            return {
                ...state, users: [...state.users, action.user]
            }
        case 'SET_USER_MSG':
            return { ...state, userMsg: action.msg }
        default:
            return state
    }
}
