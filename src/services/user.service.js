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
    return httpService.get(`user`)
}

async function getById(userId) {
    const user = await httpService.get(`user/${userId}`)
    return user
}

function remove(userId) {
    return httpService.delete(`user/${userId}`)
}

async function update(userToUpdate) {
    const updatedUser = await httpService.put(`user/${userToUpdate._id}`, userToUpdate)
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
    if (user) {
        return saveLocalUser(user)
    }
}

async function signup(currUser) {
    const user = await httpService.post('auth/signup', currUser)
    return saveLocalUser(user)
}

async function logout() {
    return await httpService.post('auth/logout')
}

function saveLocalUser(user) {
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

async function updateUserRecentlyPlayedClips(loggedInUserId, currClip) {
    if (!loggedInUserId) return // Prevents guest mode save
    const loggedInUser = await getById(loggedInUserId)
    const userToUpdate = { ...loggedInUser }
    let { recentlyPlayedClips } = userToUpdate

    const existingClipEntry = recentlyPlayedClips.find(clip => clip._id === currClip._id)
    if (existingClipEntry) return

    recentlyPlayedClips.unshift(currClip)// Inserts violable clip
    recentlyPlayedClips = recentlyPlayedClips.filter(clip => clip !== null)// Prevents entering a defected clip 

    console.log('recentlyPlayedClips', recentlyPlayedClips)
    // Deletes the 11th added clip
    if (recentlyPlayedClips.length > 10) {
        console.log('INSIDE_IF');
        console.log('recentlyPlayedClips', recentlyPlayedClips)
        recentlyPlayedClips.splice(10, 1)
    }
    await update(userToUpdate)
    return userToUpdate
}

export const msg = (itemName, txt) => {
    return { class: 'shown', msg: itemName + txt }
}

export const clearMsg = { class: 'hidden', msg: '' }
