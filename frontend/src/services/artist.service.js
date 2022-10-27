import { httpService } from './http.service.js'
import { userService } from './user.service.js'
import { utilService } from './util.service.js'

const BASE_URL = 'artist/'

export const artistService = {
    query,
    getById,
    remove,
    save,
    getRandomArtists,
    getArtistBySearchTerm,
    getArtistBylikes,

}

async function query() {
    const artists = await httpService.get(BASE_URL)
    return artists
}

async function getById(artistId) {
    const station = await httpService.get(BASE_URL + artistId)
    return station
}

async function remove(artistId) {
    console.log('artistId', artistId)
    return await httpService.delete(BASE_URL + artistId)
}

async function save(artistToSave) {
    let savedArtist
    if (artistToSave._id) {
        savedArtist = await httpService.put(BASE_URL + artistToSave._id, artistToSave)
    } else {
        savedArtist = await httpService.post(BASE_URL, artistToSave)
    }
    return savedArtist
}

function getRandomArtists(artists) {
    const randomNum = utilService.getRandomIntInclusive(0, artists.length - 1)
    let randomArtistsForDisplay = []
    for (let i = 0; i < 8; i++) {
        randomArtistsForDisplay.push(artists[(randomNum + i) % artists.length])
    }
    return randomArtistsForDisplay
}

function getArtistBySearchTerm(searchResults, artists) {
    let searchArtist = new Set(searchResults.map(searchRes => searchRes.artist))
    let artistsBySearchTerm = artists.filter(artist => searchArtist.has(artist.username))
    return artistsBySearchTerm
}

function getArtistBylikes(artists, user) {
    if (!user) return
    const userLikedArtists = new Set(user.likedSongs.clips.map(clip => clip.artist))
    const artistsByLike = artists.filter(artist => {
        return (
            userLikedArtists.has(artist.username)
            && !user.following.includes(artist._id)
        )
    })
    return artistsByLike
}

