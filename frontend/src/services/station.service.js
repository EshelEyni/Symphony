import { getActionUpdateStation } from '../store/station.actions.js'
import { store } from '../store/store.js'
import { httpService } from './http.service.js'
import { socketService, SOCKET_EVENT_STATION_UPDATED } from './socket.service.js'

const BASE_URL = 'station/'

    ; (() => {
        socketService.on(SOCKET_EVENT_STATION_UPDATED, (updatedStation) => {
            console.log('GOT from socket', updatedStation)
            store.dispatch(getActionUpdateStation(updatedStation))
        })
    })()

export const stationService = {
    query,
    getById,
    remove,
    save,
    getUserStations,
    getFilteredStations,
    getTags,
    getStationByTag,
    setDetails,
    getTotalSongDur,
}

async function query() {
    let stations = await httpService.get(BASE_URL)
    return stations
}

async function getById(stationId) {
    const currStation = await httpService.get(BASE_URL + stationId)
    return currStation
}

async function remove(stationId) {
    return await httpService.delete(BASE_URL + stationId)
}

async function save(stationToSave) {
    let savedStation
    if (stationToSave._id) {
        savedStation = await httpService.put(BASE_URL + stationToSave._id, stationToSave)
    } else {
        savedStation = await httpService.post(BASE_URL, stationToSave)
    }
    return savedStation
}

function getUserStations(stations, user, filterBy) {
    if (!stations.length || !user) return []
    switch (filterBy) {
        case 'search-stations':
            return user.recentSearches.map(searchStation => stations.find(station => station._id === searchStation._id))
                .filter(station => station !== undefined)
        case 'user-stations':
            return user.createdStations
                .map(id => stations.find(station => station._id === id))
                .filter(station => station !== undefined && !station.isSearch)
        case 'public-stations':
            return user.publicStations.map(id => stations.find(station => station._id === id))
                .filter(station => station !== undefined)
        default:
    }
}

function getFilteredStations(stations, filterBy) {
    let { term, type } = filterBy
    term = term.toLowerCase()
    return stations.map(station => {
        station.matchedTerms = 0
        station.clips.forEach(clip => {
            if (type === 'search-term' && clip?.title.toLowerCase().includes(term)) station.matchedTerms++
            if (type === 'artist-name' && clip?.artist.toLowerCase() === term) station.matchedTerms++
        })
        return station
    }).filter(station => {
        return (station?.matchedTerms > 0 && !station?.isSearch)
    }).sort((a, b) => b.matchedTerms - a.matchedTerms)
}


function getStationByTag(stations) {
    let statsionByTag = stations.sort((a, b) => a.name.localeCompare(b.name)).reduce((acc, station) => {
        station.tags.forEach(tag => {
            var sbt = acc[tag] || []
            sbt.push(station)
            acc[tag] = sbt
        })
        return acc
    }, {})

    return {
        getByTag: function (tag) {
            return statsionByTag[tag] || []
        }
    }
}

function getTags() {
    return [
        { name: 'hip hop', imgUrl: 'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370807/spotify/hiphop_xf6lee.jpg' },
        { name: 'rock', imgUrl: 'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370808/spotify/rock_wr6zfq.jpg' },
        { name: 'pop', imgUrl: 'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370807/spotify/pop_hjlfb3.jpg' },
        { name: 'israeli', imgUrl: 'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664380057/spotify/israeli_ljbhro.jpg' },
        { name: 'funk', imgUrl: 'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370806/spotify/funk_nwpzz5.jpg' },
        { name: 'dance', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1666725807/dance_ktq2o1.jpg' },
        { name: '90s', imgUrl: 'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370805/spotify/90s_xtfhyo.jpg' },
        { name: 'contest', imgUrl: 'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664376199/spotify/contest_rvrvwm.jpg' },
        { name: 'metal', imgUrl: 'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370807/spotify/metal_iqji5n.jpg' },
        { name: 'disney', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1666725930/disney_lw0g5e.jpg' },
        { name: 'electronic', imgUrl: 'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370806/spotify/electronic_ex1zjg.jpg' },
        { name: 'happy', imgUrl: 'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664380523/spotify/happy_grrw9u.jpg' },
        { name: 'love', imgUrl: 'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370807/spotify/love_wxy5j8.jpg' },
        { name: 'middle-east', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1666720815/middle-east_fitmth.jpg' },
        { name: 'soothing', imgUrl: 'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370807/spotify/soothing_nwhnxy.jpg' },
        { name: 'europe', imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1666721075/europe-music_v5gaie.webp' },
    ]
}

function setDetails(station) {
    const { clips } = station
    const durationStr = clips.length > 0 ?
        ` ●  Total of ${clips.length}  ${clips.length === 1 ? ' song ' : ' songs '} ,Total duration: ${getTotalSongDur(clips)}`
        : ''

    return durationStr
}

function getTotalSongDur(clips) {
    let secCollector = 0
    clips.forEach(song => {
        secCollector += song.duration.hours * 3600
        secCollector += song.duration.min * 60
        secCollector += song.duration.sec
    })
    let hours = Math.floor(secCollector / 3600)
    let minutes = Math.floor((secCollector - (hours * 3600)) / 60)
    let seconds = secCollector - (hours * 3600) - (minutes * 60)
    if (hours < 10) { hours = '0' + hours }
    if (minutes < 10) { minutes = '0' + minutes }
    if (seconds < 10) { seconds = '0' + seconds }
    const totalTime = hours <= 0 ? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`

    return totalTime
}