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

function getTags(stations) {
    return [
        'contest',
        'europe',
        'eurovision',
        'funk',
        'top songs',
        'worldwide',
        'hip hop',
        'israeli',
        'rock',
        'pop',
        '90s',
        'dance',
        'disney',
        'electronic',
        'happy',
        'love', 'metal',
        'middle-east',
        'soothing',
    ]
    let tagList = new Set()
    stations.forEach(station => {
        const { tags } = station
        if (tags !== null && tags?.length > 0) {
            tags.forEach(tag => tagList.add(tag))
        }
    })
    // console.log('tagList', Array.from(tagList).sort((a, b) => a.localeCompare(b)))
    return Array.from(tagList).sort((a, b) => a.localeCompare(b))
}

function setDetails(station) {
    const { clips, likedByUsers } = station
    const durationStr = clips.length > 0 ?
        ` ●  Total of ${clips.length}  ${clips.length === 1 ? ' song ' : ' songs '} ,Total duration: ${getTotalSongDur(clips)}`
        : ''
    const likeStr = likedByUsers?.length > 0 ? ` ● ${likedByUsers.length} likes` : ''
    return durationStr + likeStr
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