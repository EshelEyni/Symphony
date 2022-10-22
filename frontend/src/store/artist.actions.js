import { artistService } from '../services/artist.service.js'

export function loadArtists() {
    return async (dispatch) => {
        try {
            const artists = await artistService.query()
            dispatch({
                type: 'SET_ARTISTS',
                artists
            })
        }
        catch (err) {
            console.log('ArtistActions: Cannot load artists', err)
        }
    }
}

export function removeArtist(artistId) {
    return async (dispatch) => {
        try {
            await artistService.remove(artistId)
            dispatch({
                type: 'REMOVE_ARTIST',
                artistId
            })
            console.log('Deleted Succesfully!')
        } catch (err) {
            console.log('ArtistActions: Cannot remove artist', err)
        }
    }
}

export function addArtist(artist) {
    return (dispatch) => {
        try {
            dispatch({
                type: 'ADD_ARTIST',
                artist
            })
            console.log('Added Artist', artist)
            return artist
        } catch (err) {
            console.log('ArtistActions: Cannot add artist', err)
        }
    }
}

export function updateArtist(artistToUpdate) {
    return async (dispatch) => {
        try {
            const updatedArtist = await artistService.save(artistToUpdate)
            console.log('updatedArtist', updatedArtist)
            dispatch({
                type: 'UPDATE_ARTIST',
                updatedArtist
            })
        }
        catch (err) {
            console.log('ArtistActions: Cannot save artist', err)
        }
    }
}