import axios from 'axios'
import * as duration from 'duration-fns'
import { storageService } from './async-storage.service'
import { remove, save } from './station.service'
import { utilService } from './util.service'


export const searchService = {
    getClips,
    toggleFilterBy,
    setNewSearchList,
    getStationsBySearchTerm,
    getProfilesBySearchTerm
}

const YT_API_Key = 'AIzaSyDY1FSaJrD0PrUG8bPx8Q1lC4g3j9RT9P0'
const ALEX_API_KEY = 'AIzaSyCufURb4q5k_aJP0We6SJ9dN6T67VtublU'

const KEY = 'clipsDB'

async function getClips(term) {
    const termClipsMap = _loadFromStorage(KEY) || {}

    if (termClipsMap[term]) {
        console.log('Getting from Cache')
        // console.log('termClipsMap[term]', termClipsMap[term])
        return Promise.resolve(termClipsMap[term])
    }

    console.log('Getting from Network')
    const apiStr = 'https://www.googleapis.com'
        + '/youtube/v3/search?part=snippet&videoCategoryId=10'
        + '&videoEmbeddable=true'
        + '&type=video'
        + '&maxResults=100'
        + `&key=${ALEX_API_KEY}&q=${term}`

    let clips = await axios.get(apiStr)


    const cleaner = /\([^\)]*\)|\[[^\]]*\]/g
    const emojiCleaner = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g

    clips = clips.data.items
    clips = clips.map(clip => ({
        _id: clip.id.videoId,
        title: clip.snippet.title.replaceAll(cleaner, '').trim().replaceAll(emojiCleaner, '').trim(),
        img: {
            url: clip.snippet.thumbnails.default.url,
            width: clip.snippet.thumbnails.default.width,
            height: clip.snippet.thumbnails.default.height,
        },
        artist: clip.snippet.channelTitle,
        likedByUsers: []
    }))

    let str = ''
    str = clips.map(clip => str + `${clip._id}%2C`).join('')
    str = str.slice(0, -3)
    const durationStr = `https://www.googleapis.com/youtube/v3/videos?id=${str}&part=contentDetails&key=${ALEX_API_KEY}`
    let durations = await axios.get(durationStr)
    for (var i = 0; i < clips.length; i++) {
        clips[i].duration = {
            hours: duration.parse(durations.data.items[i].contentDetails.duration).hours,
            min: duration.parse(durations.data.items[i].contentDetails.duration).minutes,
            sec: duration.parse(durations.data.items[i].contentDetails.duration).seconds,
        }
    }
    clips = clips.filter(clip =>
        clip.duration.min < 10 && clip.duration.min > 0
    )

    termClipsMap[term] = clips
    _saveToStorage(KEY, termClipsMap)
    return clips
}

function getTitle(str) {
    const regex = new RegExp(/\B-/)
    const title = regex.exec(str) ? str.substring(0, regex.exec(str).index - 1) : str
    return title
}

async function setNewSearchList(searchResults, user, listName) {
    const clip = searchResults[0]
    let recentSearchedIds = _loadFromStorage('recentSearchedIds') || []
    let newSearchList = {
        name: listName,
        imgUrl: clip.img.url,
        createdBy: {
            _id: user._id,
            fullname: user.fullname,
            imgUrl: user.imgUrl
        },
        isSearch: true,
        clips: searchResults || [],
    }
    newSearchList = await save(newSearchList)
    recentSearchedIds.unshift(newSearchList._id)

    if (recentSearchedIds.length > 8) {
        const stationToRemove = recentSearchedIds.splice(8, 1)
        console.log('stationToRemove', stationToRemove)
        await remove(stationToRemove[0])
    }
    _saveToStorage('recentSearchedIds', recentSearchedIds)
    return newSearchList
}

function getStationsBySearchTerm(stations, searchTerm, isArtist) {
    if (isArtist) stations = stations.filter(station => station.isArtist === true)
    if (searchTerm) {
        searchTerm = searchTerm.toLowerCase()
        return stations.map(station => {
            station.matchedTerms = 0
            for (let x = 0; x < station.clips?.length; x++) {
                if (station.clips[x].title.toLowerCase().includes(searchTerm)) station.matchedTerms++
            }
            return station
        }).filter(station => {
            return (station?.matchedTerms !== 0 && station?.isSearch !== true)
        }).sort((a, b) => b?.matchedTerms - a?.matchedTerms)
    }
}

function getProfilesBySearchTerm(stations, users, searchTerm) {
    searchTerm = searchTerm.toLowerCase()
    return users.map(user => {

        // Filters out user without saved playlists
        if (user.createdStationsIds.length === 0) return

        // Gets stations created by users
        let userCreatedStationsIds = new Set(user.createdStationsIds)
        let userCreatedStations = []
        for (let y = 0; y < stations.length; y++) {
            if (userCreatedStationsIds.has(stations[y]._id)) {
                userCreatedStations.push(stations[y])
            }
        }

        let matchedTerms = 0
        userCreatedStations.forEach(station => {
            for (let x = 0; x < station.clips.length; x++) {
                if (station.clips[x].title.toLowerCase().includes(searchTerm)) matchedTerms++
            }
        })
        if (!matchedTerms) return
        return { ...user, matchedTerms }
    })
        .filter(user => user !== undefined)
        .sort((a, b) => b.matchedTerms - a.matchedTerms)
}


function toggleFilterBy(filterBy, currCategory) {
    if (filterBy.includes(currCategory)) {
        filterBy = filterBy
            .filter(category => category !== currCategory)
    }
    else {
        filterBy.push(currCategory)
    }

    return filterBy
}

function _saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function _loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}