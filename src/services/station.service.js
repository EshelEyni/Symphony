import predefinedStations from '../data/predefined-station.js'
import { httpService } from './http.service.js'

const STORAGE_KEY = 'station'
const defaultStations = predefinedStations
const BASE_URL = 'station/'
export const loadingImg = 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1663540882/ezgif.com-gif-maker_znhvuh.gif'
export const defaultImg = 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1663788155/pngwing.com_7_smg1dj.png'

export const stationService = {
    query,
    getById,
    remove,
    save,
    getUserStations,
    getStationByTag,
    getArtistStations,
    getTotalSongDur,
}

async function query() {
    let stations = await httpService.get(BASE_URL)
    return stations
}

async function getById(stationId) {
    // return storageService.get(STORAGE_KEY, stationId)
    const currStation = await httpService.get(BASE_URL + stationId)
    return currStation
}

async function remove(stationId) {
    return await httpService.delete(BASE_URL + stationId)
}

async function save(stationToSave) {
    var savedStation
    if (stationToSave._id) {
        savedStation = await httpService.put(BASE_URL + stationToSave._id, stationToSave)
    } else {
        savedStation = await httpService.post(BASE_URL, stationToSave)
    }
    return savedStation
}

function getUserStations(stations, userId, isSearch) {
    if (!stations) return []
    let userStations = stations
    // return stations
    //     .filter(station => (station?.createdBy?._id === userId && !station.isSearch))
    //     .reverse()


    userStations = isSearch ?
        userStations
            .filter(station => (station.createdBy._id === userId && station.isSearch))
            .reverse()
        : userStations
            .filter(station => (station.createdBy._id === userId && !station.isSearch))
            .reverse()

    return userStations
}

function getStationByTag(stations, currTag) {
    const taggedStations = stations.filter(station => {
        return station.tags?.includes(currTag)
    })
    return taggedStations
}


function getArtistStations(stations) {
    let artistsStations = stations
        .filter(station => station.isArtist)
    // if (searchTerm) {
    //     searchTerm = searchTerm.toLowerCase()
    //     artistsStations = artistsStations
    //         .filter(station => station.name.toLowerCase().includes(searchTerm))
    // }
    return artistsStations
}

function getTotalSongDur(songs) {
    let secCollector = 0
    songs.forEach(song => {
        secCollector += song.duration.hours * 3600
        secCollector += song.duration.min * 60
        secCollector += song.duration.sec
    })
    let hours = Math.floor(secCollector / 3600)
    let minutes = Math.floor((secCollector - (hours * 3600)) / 60)
    let seconds = secCollector - (hours * 3600) - (minutes * 60)
    if (hours < 10) { hours = "0" + hours }
    if (minutes < 10) { minutes = "0" + minutes }
    if (seconds < 10) { seconds = "0" + seconds }
    const totalTime = hours <= 0 ? `${minutes}:${seconds}` : `${hours}: ${minutes}: ${seconds}`

    return totalTime
}
