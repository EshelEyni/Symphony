import { userService } from '../services/user.service.js'


export function loadUsers() {
    return async dispatch => {
        try {
            const users = await userService.getUsers()
            dispatch({ type: 'SET_USERS', users })
        } catch (err) {
            console.log('UserActions: err in loadUsers', err)
        } 
    }
}

export function loadUser(userId) {
    return async dispatch => {
        try {
            const user = await userService.getById(userId)
            dispatch({ type: 'SET_USER', user })
        } catch (err) {
            console.log('UserActions: err in user', err)
        } 
    }
}
export function updateUser(userToUpdate) {
    return async (dispatch) => {
        try {
            const user = await userService.update(userToUpdate)
            dispatch({ type: 'UPDATE_USER', user })
        }
        catch (err) {
            console.log('UserActions: Cannot update user', err)
        }
    }
}

export function onLogin(credentials) {
    return async (dispatch) => {
        try {
            const user = await userService.login(credentials)
            dispatch({ type: 'SET_USER', user })
        } catch (err) {
            console.log('UserActions: Cannot login', err)
        }
    }
}

export function onSignup(credentials) {
    return async (dispatch) => {
        try {
            const user = await userService.signup(credentials)
            dispatch({
                type: 'SET_USER',
                user
            })
        } catch (err) {
            console.log('UserActions: Cannot signup', err)
        }
    }
}

export const updateFollowers = (userToUpdate) => {
    return async (dispatch) => {
        try {
            const user = await userService.updateFollowers(userToUpdate)
            dispatch({ type: 'UPDATE_FOLLOWERS', user })
        }
        catch (err) {
            console.log('UserActions: Cannot update followers', err)
        }
    }
}


export function onLogout() {
    console.log('LOGOUT')
    return async (dispatch) => {
        try {
            await userService.logout()
            dispatch({
                type: 'SET_USER',
                user: null
            })
        } catch (err) {
            console.log('UserActions: Cannot logout', err)
        }
    }
}

export const setUserMsg = (msg) => {
    return async (dispatch) => {
        try {
            dispatch({ type: 'SET_USER_MSG', msg })
        } catch (err) {
            console.log('UserActions: Cannot set playist', err)
        }
    }
}