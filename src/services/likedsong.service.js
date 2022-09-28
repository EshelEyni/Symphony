
import { httpService } from './http.service.js'

// const STORAGE_KEY = 'station'
const BASE_URL = 'song/'
// const defaultStations = predefinedStations

export const loadingImg = 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1663540882/ezgif.com-gif-maker_znhvuh.gif'
export const defaultImg = 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1663788155/pngwing.com_7_smg1dj.png'


export const query = async () => {
    let songs = await httpService.get(BASE_URL)
    return songs
}


export const getById = async (songId) => {
    // return storageService.get(STORAGE_KEY, stationId)
    const currSong = await httpService.get(BASE_URL + songId)
    return currSong
}

export const remove = async (songId) => {
    return httpService.delete(BASE_URL + songId)
}

export const save = async (song) => {
    var savedSong
    if (song._id) {
        savedSong = await httpService.put(BASE_URL + song._id, song)
    } else {
        savedSong = await httpService.post(BASE_URL, song)
    }
    return savedSong
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

// export const getSongsByTag = (songs, currTag) => {
//     const taggedSongs = songs.filter(song => {
//         return songs.tags?.includes(currTag)
//     })
//     return taggedSongs
// }

// export const getArtistSongs = (songs) => {
//     let artistsStations = songs
//         .filter(station => station.isArtist)
//     // if (searchTerm) {
//     //     searchTerm = searchTerm.toLowerCase()
//     //     artistsStations = artistsStations
//     //         .filter(station => station.name.toLowerCase().includes(searchTerm))
//     // }
//     return artistsStations
// }