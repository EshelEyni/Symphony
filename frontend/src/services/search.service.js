import axios from 'axios'
import * as duration from 'duration-fns'
import { storageService } from './storage.service'
import { stationService } from './station.service'

export const searchService = {
    getClips,
    updateUserRecentSearches,
}

const YT_API_Key = 'AIzaSyDY1FSaJrD0PrUG8bPx8Q1lC4g3j9RT9P0'

const cleaner = /\([^\)]*\)|\[[^\]]*\]|HD|/g
const emojiCleaner = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g
const symbolsCleaner = /[`~!@#$%^*()_|+=?;:",.<>\{\}\[\]\\\/]/gi
const apostrophe = /&#39|&39|&quot/g
const ampersand = /&amp;/gi
const artistNameCleaner = /vevo|music|-topic| - topic|official/gi

async function getClips(term) {
    const termClipsMap = storageService.loadFromStorage('searchDB') || {}

    if (termClipsMap[term]) {
        console.log('Getting from Cache')
        return Promise.resolve(termClipsMap[term])
    }

    console.log('Getting from Network')
    const apiStr = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoCategoryId=10&videoEmbeddable=true&type=video&maxResults=100&key=${YT_API_Key}&q=${term}`
    const res = await axios.get(apiStr)
    const str = res.data.items.map(item => '' + `${item.id.videoId}%2C`).join('').slice(0, -3)
    const durationStr = `https://www.googleapis.com/youtube/v3/videos?id=${str}&part=contentDetails&key=${YT_API_Key}`
    const durations = await axios.get(durationStr)

    const clips = res.data.items.map((item, idx) => {
        const { snippet, id } = item
        const { title, thumbnails, channelTitle } = snippet
        const { contentDetails } = durations.data.items[idx]
        return {
            _id: id.videoId,
            title: title.replaceAll(cleaner, '').replaceAll(emojiCleaner, '').replaceAll(symbolsCleaner, '').replaceAll(apostrophe, '\'').replaceAll(ampersand, '&').trim(),
            img: {
                url: thumbnails.high.url || thumbnails.medium.url || thumbnails.default.url
            },
            artist: channelTitle.replaceAll(artistNameCleaner, '').trim(),
            duration: {
                hours: duration.parse(contentDetails.duration).hours,
                min: duration.parse(contentDetails.duration).minutes,
                sec: duration.parse(contentDetails.duration).seconds,
            },
            likedByUsers: [],
        }
    })
        .filter(clip => clip.duration.min < 10 && clip.duration.min > 0 && !clip.imgUrl).splice(0, 15)

    termClipsMap[term] = clips
    storageService.saveToStorage('searchDB', termClipsMap)
    return clips
}

async function updateUserRecentSearches(searchResults, loggedinUser, currSearchTerm) {

    if (!loggedinUser) return
    const clip = searchResults[0] || {}
    if (!clip.img?.url) return // No valid results from YT_API
    let newSearchList = {
        name: currSearchTerm,
        imgUrl: clip.img.url,
        createdBy: {
            _id: loggedinUser._id,
            username: loggedinUser.username,
            imgUrl: loggedinUser.imgUrl
        },
        isSearch: true,
        clips: searchResults || [],
    }

    const savedStation = await stationService.save(newSearchList)
    const userToUpdate = { ...loggedinUser }
    userToUpdate.recentSearches = [{ _id: savedStation._id, title: savedStation.name }, ...userToUpdate.recentSearches]

    if (userToUpdate.recentSearches.length > 10) {
        const stationToRemove = userToUpdate.recentSearches.splice(10, 1)[0]
        await stationService.remove(stationToRemove._id)
    }
    return userToUpdate
}

export const searchFilterBtns = [
    { title: 'All', value: null },
    { title: 'Songs', value: 'songs' },
    { title: 'Playlists', value: 'playlists' },
    { title: 'Artists', value: 'artists' },
    { title: 'Profiles', value: 'profiles' },
    { title: 'Recent Searches', value: 'searches' }
]