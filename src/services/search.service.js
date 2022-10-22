import axios from 'axios'
import * as duration from 'duration-fns'
import { stationService } from './station.service'
import { userService } from './user.service'
export const searchLoader = 'https://res.cloudinary.com/dk9b84f0u/image/upload/v1664644425/Symphny/search-loader_nvtb1p.gif'


export const searchService = {
    getClips,
    updateUserRecentSearches,
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
    const emojiCleaner = /(\u00a9|\u00ae|HD|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g
    const apostrophe = /&#39|&quot/g
    const ampersand = /&amp;/gi
    const symbolsCleaner = /[`~!@#$%^*()_|+=?;:",.<>\{\}\[\]\\\/]/gi
    const cleanArtistName = /vevo|music|-topic| - topic|official/gi


    clips = clips.data.items
    clips = clips.map(clip => ({
        _id: clip.id.videoId,
        title: clip.snippet.title.replaceAll(cleaner, '').trim().replaceAll(emojiCleaner, '').trim().replaceAll(apostrophe, '\'').trim().replaceAll(ampersand, '&').trim().replaceAll(symbolsCleaner, '').trim(),
        img: {
            url: clip.snippet.thumbnails.default.url,
            width: clip.snippet.thumbnails.default.width,
            height: clip.snippet.thumbnails.default.height,
        },
        artist: clip.snippet.channelTitle.replaceAll(cleanArtistName, ''),
        // likedByUsers: []
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

async function updateUserRecentSearches(searchResults, loggedInUser, listName) {
    if (!loggedInUser) return
    const clip = searchResults[0] || {}
    let newSearchList = {
        name: listName,
        imgUrl: clip.img.url,
        createdBy: {
            _id: loggedInUser._id,
            fullname: loggedInUser.fullname,
            imgUrl: loggedInUser.imgUrl
        },
        isSearch: true,
        clips: searchResults || [],
    }

    const savedStation = await stationService.save(newSearchList)

    const userToUpdate = { ...loggedInUser }
    userToUpdate.recentSearches = [{ _id: savedStation._id, title: savedStation.name }, ...userToUpdate.recentSearches]

    if (userToUpdate.recentSearches.length > 10) {
        const stationToRemoveId = userToUpdate.recentSearches.splice(11, 1)._id
        await stationService.remove(stationToRemoveId)
        await userService.update(userToUpdate)
    }
    return userToUpdate
}

function getStationsBySearchTerm(stations, searchTerm, isArtist) {
    stations = isArtist ? stations.filter(station => station.isArtist) : stations.filter(station => !station.isArtist)

    if (searchTerm) {
        searchTerm = searchTerm.toLowerCase()
        return stations.map(station => {
            station.matchedTerms = 0
            station.clips.forEach(clip => {
                if (clip?.title.toLowerCase().includes(searchTerm)) station.matchedTerms++
            })
            return station
        }).filter(station => {
            return (station?.matchedTerms > 0 && !station?.isSearch)
        }).sort((a, b) => b?.matchedTerms - a?.matchedTerms)
    }
}

function getProfilesBySearchTerm(stations, users, searchTerm) {
    if (!users.length) return
    searchTerm = searchTerm.toLowerCase()
    let matchingStations = new Set(
        stations
            .filter(station => station.clips.find(clip => clip.title.toLowerCase().includes(searchTerm) !== undefined))
            .map(station => station._id)
    )
    if (matchingStations.length === 0) return

    return users.map(user => {
        let matchedTerms = 0
        user.createdStations.forEach(station => {
            if (matchingStations.has(station))
                matchedTerms++;
        })
        if (!matchedTerms) return undefined
        return { ...user, matchedTerms }
    })
        .filter(user => user !== undefined)
        .sort((a, b) => b.matchedTerms - a.matchedTerms)
}


function _saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function _loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}
