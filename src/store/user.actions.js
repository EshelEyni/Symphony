import { userService } from '../services/user.service.js'


export function loadUsers() {
    return async dispatch => {
        try {
            dispatch({ type: 'LOADING_START' })
            const users = await userService.getUsers()
            dispatch({ type: 'SET_USERS', users })
        } catch (err) {
            console.log('UserActions: err in loadUsers', err)
        } finally {
            dispatch({ type: 'LOADING_DONE' })
        }
    }
}

export function onLogin(credentials) {
    return async (dispatch) => {
        try {
            const user = await userService.login(credentials)
            dispatch({ type: 'SET_USER', user })
        } catch (err) {
            console.log('Cannot login', err)
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
            console.log('Cannot update user', err)
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
            console.log('Cannot update followers', err)
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
            console.log('Cannot signup', err)
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
            console.log('Cannot logout', err)
        }
    }
}

export const setUserMsg = (msg) => {
    return async (dispatch) => {
        try {
            dispatch({ type: 'SET_USER_MSG', msg })
        } catch (err) {
            console.log('Cannot set playist', err)
        }
    }
}