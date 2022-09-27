import { storageService } from './async-storage.service.js'
import predefinedStations from '../data/predefined-station.js'
import { store } from '../store/store'
import { getActionUpdateStation } from '../store/station.actions.js'
import { httpService } from './http.service.js'

const STORAGE_KEY = 'station'
const BASE_URL = 'station/'
const defaultStations = predefinedStations

export const loadingImg = 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1663540882/ezgif.com-gif-maker_znhvuh.gif'
export const defaultImg = 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1663788155/pngwing.com_7_smg1dj.png'


export const query = async () => {
    let stations = await httpService.get(BASE_URL)
    return stations
}


export const getById = async (stationId) => {
    // return storageService.get(STORAGE_KEY, stationId)
    const currStation = await httpService.get(BASE_URL + stationId)
    return currStation
}

export const remove = async (stationId) => {
    return httpService.delete(BASE_URL + stationId)
}

export const save = async (station) => {
    var savedStation
    if (station._id) {
        savedStation = await httpService.put(BASE_URL + station._id, station)
    } else {
        savedStation = await httpService.post(BASE_URL, station)
    }
    return savedStation
}

export const getTotalSongDur = (songs) => {
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

export const checkImg = (imgSrc) => {
    return imgSrc === defaultImg ? 'rotate' : ''
}

export const getStationByTag = (stations, currTag) => {
    const taggedStations = stations.filter(station => {
        return station.tags?.includes(currTag)
    })
    return taggedStations
}


export const getArtistStations = (stations) => {
    let artistsStations = stations
        .filter(station => station.isArtist)
    // if (searchTerm) {
    //     searchTerm = searchTerm.toLowerCase()
    //     artistsStations = artistsStations
    //         .filter(station => station.name.toLowerCase().includes(searchTerm))
    // }
    return artistsStations
}