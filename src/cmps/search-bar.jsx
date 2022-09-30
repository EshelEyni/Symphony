import { searchService } from '../services/search.service'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { loadUsers, updateUser } from '../store/user.actions'
import { loadStations } from '../store/station.actions'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

export const SearchBar = ({
    setSearchClips,
    getSearchStations,
    getSearchArtists,
    isSearch,
    setIsSearch,
    searchTerm,
    setSearchTerm,
    searchParams,
    setSearchParams,
    getSearchProfiles,
    isStationDetails,
}) => {

    let stations = useSelector(state => state.stationModule.stations)
    const usersList = useSelector(state => state.userModule.users)

    const loggedInUser = useSelector(state => state.userModule.user)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(loadStations())
        dispatch(loadUsers())
        if (!isStationDetails) {
            const paramsSearchTerm = searchParams.get('keyword')
            if (paramsSearchTerm) handleSearch(paramsSearchTerm)
        }
    }, [isSearch])


    const handleSearchChange = async ({ target }) => {
        if (!target.value) {
            setIsSearch(false)
            return
        }
        console.log('target.value', target.value)
        if (setSearchTerm) await setSearchTerm(target.value)
        if (!isStationDetails) {
            setSearchParams(target.value ? { keyword: target.value } : undefined, { replace: true })
        }
    }

    const onHandleSubmit = async (e) => {
        if (e) e.preventDefault()
        handleSearch(searchTerm)
    }

    const handleSearch = async (currSearchTerm) => {
        if (setIsSearch) setIsSearch(true)
        let searchResults = await searchService.getClips(currSearchTerm)
        searchResults = searchResults.splice(0, 12)
        console.log('currSearchTerm', currSearchTerm)
        if (loggedInUser) {
            let searchAlreadySaved = loggedInUser.recentSearches
                .find(recentSearch => recentSearch.title === currSearchTerm)
            if (!searchAlreadySaved) {
                const updatedUser = await searchService.updateUserRecentSearches(searchResults, loggedInUser, currSearchTerm)
                dispatch(updateUser(updatedUser))
            }
        }

        setSearchClips(searchResults)

        if (!isStationDetails) { // ONLY RENDERED IN THE SEARCH PAGE
            getSearchStations(searchService
                .getStationsBySearchTerm(stations, currSearchTerm))
            getSearchArtists(searchService
                .getStationsBySearchTerm(stations, currSearchTerm, 'isArtist'))
            getSearchProfiles(searchService
                .getProfilesBySearchTerm(stations, usersList, currSearchTerm))
        }
    }

    return (
        <form
            action=''
            onSubmit={onHandleSubmit}
            className='search-form'>
            {!isStationDetails && <button className="fas fa-search search-btn"></button>}
            <input
                type='text'
                name='search-bar'
                placeholder='What do you want do listen to?'
                onChange={handleSearchChange}
                defaultValue={searchParams?.get('keyword') ? searchParams?.get('keyword') : ''}
                className='search-bar'
                autoFocus />
        </form>
    )
}