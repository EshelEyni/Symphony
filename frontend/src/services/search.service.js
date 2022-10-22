import axios from 'axios'
import * as duration from 'duration-fns'
import { storageService } from './storage.service'
import { stationService } from './station.service'
import { userService } from './user.service'

export const searchService = {
    getClips,
    updateUserRecentSearches,
}

// const YT_API_Key = 'AIzaSyDY1FSaJrD0PrUG8bPx8Q1lC4g3j9RT9P0'
const ALEX_API_KEY = 'AIzaSyCufURb4q5k_aJP0We6SJ9dN6T67VtublU'

const cleaner = /\([^\)]*\)|\[[^\]]*\]/g 
const emojiCleaner = /(\u00a9|\u00ae|HD|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g
const apostrophe = /&#39|&quot/g
const ampersand = /&amp;/gi
const symbolsCleaner = /[`~!@#$%^*()_|+=?;:",.<>\{\}\[\]\\\/]/gi
const cleanArtistName = /vevo|music|-topic| - topic|official/gi

async function getClips(term) {
    const termClipsMap = storageService.loadFromStorage('searchDB') || {}

    if (termClipsMap[term]) {
        console.log('Getting from Cache')
        return Promise.resolve(termClipsMap[term])
    }

    console.log('Getting from Network')

    const apiStr = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoCategoryId=10&videoEmbeddable=true&type=video&maxResults=100&key=${ALEX_API_KEY}&q=${term}`
    const res = await axios.get(apiStr)
    const str = res.data.items.map(item => '' + `${item.id.videoId}%2C`).join('').slice(0, -3)
    const durationStr = `https://www.googleapis.com/youtube/v3/videos?id=${str}&part=contentDetails&key=${ALEX_API_KEY}`
    const durations = await axios.get(durationStr)

   const clips =  res.data.items.map((item, idx) => {
        const { snippet, id } = item
        const { title, thumbnails, channelTitle } = snippet
        const { contentDetails } = durations.data.items[idx]
        return {
            _id: id.videoId,
            title: title.replaceAll(cleaner, '').trim().replaceAll(emojiCleaner, '').trim().replaceAll(apostrophe, '\'').trim().replaceAll(ampersand, '&').trim().replaceAll(symbolsCleaner, '').trim(),
            img: {
                url: thumbnails.high.url || thumbnails.medium.url || thumbnails.default.url
            },
            artist: channelTitle.replaceAll(cleanArtistName, ''),
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
        await userService.update(userToUpdate)
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

export const tagImgs = [
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370807/spotify/soothing_nwhnxy.jpg',
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370807/spotify/quiet_a0pcc9.jpg',
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370808/spotify/rock_wr6zfq.jpg',
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664377614/spotify/loud-music_yz2ucp.jpg',
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370807/spotify/pop_hjlfb3.jpg',
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664380523/spotify/happy_grrw9u.jpg',
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370806/spotify/beatles_f9josj.jpg',
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370805/spotify/60s_xveydc.jpg',
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370806/spotify/funk_nwpzz5.jpg',
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370807/spotify/rhytm_l87rkp.jpg',
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370807/spotify/hiphop_xf6lee.jpg',
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370805/spotify/90s_xtfhyo.jpg',
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370805/spotify/aggressive_mda8b1.jpg',
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370806/spotify/distortion_xipbyw.jpg',
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370807/spotify/metal_iqji5n.jpg',
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370807/spotify/love_wxy5j8.jpg',
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370806/spotify/dance_sju1w9.jpg',
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370806/spotify/electronic_ex1zjg.jpg',
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664380057/spotify/israeli_ljbhro.jpg',
    'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664247346/pngwing.com_7_ine1ah.png',
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370808/spotify/top_uyvero.jpg',
    'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664247346/pngwing.com_7_ine1ah.png',
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370806/spotify/billabord_amriev.jpg',
    'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664247346/pngwing.com_7_ine1ah.png',
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664376199/spotify/contest_rvrvwm.jpg',
    'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370806/spotify/eurovision_rsrbb8.jpg',
    'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664247346/pngwing.com_7_ine1ah.png'
]