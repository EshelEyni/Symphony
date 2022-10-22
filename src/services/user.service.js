import { httpService } from './http.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

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
    updateFollowers,
    updateUserRecentlyPlayedClips,
    updateUserStation
}

function getUsers() {
    return httpService.get('user')
}

async function getById(userId) {
    const user = await httpService.get('user/' + userId)
    return user
}

function remove(userId) {
    return httpService.delete('user/' + userId)
}

async function update(userToUpdate) {
    const updatedUser = await httpService.put('user/' + userToUpdate._id, userToUpdate)
    if (getLoggedinUser()._id === userToUpdate._id) saveLocalUser(updatedUser)

    return updatedUser
}

function updateUserStation(user, station) {
    const stationId = station._id
    const currIdx = user?.createdStations.findIndex(station => station._id === stationId)
    user.createdStations[currIdx] = station
}

async function updateFollowers(user) {
    user = await httpService.put(`user/followers/${user._id}`, user)
    return user
}

async function login(currUser) {
    const user = await httpService.post('auth/login', currUser)
    console.log('user', user)
    if (user) {
        return saveLocalUser(user)
    }
}

async function signup(currUser) {
    const user = await httpService.post('auth/signup', currUser)
    if (user) {
        return saveLocalUser(user)
    }
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

function updateUserRecentlyPlayedClips(userToUpdate, currClip) {
    if (!userToUpdate) return
    let { recentlyPlayedClips } = userToUpdate
    const existingClipEntry = recentlyPlayedClips.find(clip => clip._id === currClip._id)
    if (existingClipEntry) return
    recentlyPlayedClips.unshift(currClip)
    userToUpdate.recentlyPlayedClips = recentlyPlayedClips.filter((clip, idx) => clip !== null && idx < 10)
    return userToUpdate
}

export const msg = (itemName, txt) => {
    return { class: 'shown', msg: itemName + txt }
}

export const clearMsg = { class: 'hidden', msg: '' }
