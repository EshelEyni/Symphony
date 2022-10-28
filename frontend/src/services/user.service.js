import { store } from '../store/store'
import { getActionUpdateUser } from '../store/user.actions'
import { httpService } from './http.service'
import { socketService, SOCKET_EVENT_USER_UPDATED } from './socket.service'

export const defaultImg = 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1663788155/pngwing.com_7_smg1dj.png'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

    ; (() => {
        socketService.on(SOCKET_EVENT_USER_UPDATED, (updatedUser) => {
            console.log('GOT from socket', updatedUser)
            // store.dispatch(getActionUpdateUser(updatedUser))
        })
    })()

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    saveLocalUser,
    getUsers,
    getById,
    remove,
    update,
    updateUserRecentlyPlayedClips,
}

function getUsers() {
    return httpService.get('user/')
}

async function getById(userId) {
    const user = await httpService.get('user/' + userId)
    return user
}

async function login(currUser) {
    try {
        const user = await httpService.post('auth/login', currUser)
        if (user) return saveLocalUser(user)
    }
    catch (err) {
        console.log('err', err)
        throw (err)
    }
}

async function signup(currUser) {
    try {
        const user = await httpService.post('auth/signup', currUser)
        if (user) return saveLocalUser(user)
    }
    catch (err) {
        console.log('err', err)
        throw (err)
    }
}

function remove(userId) {
    return httpService.delete('user/' + userId)
}

async function update(userToUpdate) {
    const updatedUser = await httpService.put('user/' + userToUpdate._id, userToUpdate)
    if (getLoggedinUser()._id === userToUpdate._id) {
        saveLocalUser(updatedUser)
    }
    return updatedUser
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    return await httpService.post('auth/logout')
}

function saveLocalUser(user) {
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function updateUserRecentlyPlayedClips(user, currClip) {

    let { clips } = user.recentlyPlayed
    const existingClipEntry = clips.find(clip => clip._id === currClip._id)
    if (existingClipEntry) return user
    currClip.playedAt = Date.now()
    clips.unshift(currClip)
    user.clips = clips.filter((clip, idx) => clip !== null && idx < 10)
    return user
}


export const loginFirstMsgs = {
    library: {
        top: '225px',
        title: 'Enjoy Your Library',
        txt: 'Log in to see saved songs, artists, and playlists in Your Library'
    },
    createPlaylist: {
        top: '260px',
        title: 'Create a playlist',
        txt: 'Log in to create and share playlists.'
    },
    likedSongs: {
        top: '305px',
        title: 'Enjoy Your Liked Songs',
        txt: 'Log in to see all the songs you\'ve liked in one easy playlist.'
    }
}