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
    setRecentlyPlayed,
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

async function update(user) {
    user = await httpService.put(`user/${user._id}`, user)
    // Handle case in which admin updates other user's details
    if (getLoggedinUser()._id === user._id) saveLocalUser(user)
    return user
}

function updateUserStation(user, station) {
    const stationId = station._id
    const currIdx = user.createdStations.findIndex(station => station._id === stationId)
    user.createdStations[currIdx] = station
}

async function updateFollowers(user) {
    user = await httpService.put(`user/followers/${user._id}`, user)
    // Handle case in which admin updates other user's details
    // if (getLoggedinUser()._id === user._id) saveLocalUser(user)
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

async function setRecentlyPlayed(clip) {

    const loggedInUser = getLoggedinUser()
    // Prevent at save guest mode
    if (!loggedInUser) return
    const newRecentPlayedClips = {
        userId: loggedInUser._id, clips: []
    }
    let recentlyPlayed = _loadFromStorage('recentlyPlayed') || newRecentPlayedClips

    // If a diffrent user as connected to the same broswer
    if (loggedInUser._id !== recentlyPlayed.userId) recentlyPlayed = newRecentPlayedClips

    
    // Prevents inserting the same clip
    let clipsIds = recentlyPlayed.clips.map(clip => clip._id)
    if (clipsIds.includes(clip._id)) return
    
    // Inserts violable clip
    recentlyPlayed.clips.unshift(clip)
   
    // Prevents entering a defected clip 
    recentlyPlayed.clips = recentlyPlayed.clips.filter(clip => clip !== null)

    // Deletes the 11th added clip
    if (recentlyPlayed.clips.length > 10) {
        recentlyPlayed.clips.splice(10, 1)
    }

    _saveToStorage('recentlyPlayed', recentlyPlayed)
}

export const msg = (itemName, txt) => {
    return { class: 'shown', msg: itemName + txt }
}

export const clearMsg = { class: 'hidden', msg: '' }

function _saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function _loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}