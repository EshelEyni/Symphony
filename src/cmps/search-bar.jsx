import { searchService } from '../services/search.service'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { updateUser } from '../store/user.actions'
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
    isStationDetails,
    searchParams,
    setSearchParams }) => {


    let stations = useSelector(state => state.stationModule.stations)
    const loggedInUser = useSelector(state => state.userModule.user)
    const dispatch = useDispatch()
    // let [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        dispatch(loadStations())
    }, [isSearch])


    const handleSearchChange = async ({ target }) => {
        if (!target.value) {
            setIsSearch(false)
            return
        }
        if (setSearchTerm) await setSearchTerm(target.value)
        console.log('target.value', target.value)
        let search;

        if (target.value) {
            search = {
                keyword: target.value
            }
        } else {
            search = undefined;
        }
        setSearchParams(search, { replace: true })

        // const queryStringParams = '#/search?q=' + target.value
        // const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
        // window.history.pushState({ path: newUrl }, '', newUrl)
    }

    // const searchHandler = (event) => {
    //     let search;
    //     if (event.target.value) {
    //         search = {
    //             keyword: event.target.value
    //         }
    //     } else {
    //         search = undefined;
    //     }

    //     setSearchParams(search, { replace: true });


    const onHandleSubmit = async (e) => {
        e.preventDefault()

        if (setIsSearch) setIsSearch(true)
        let searchResults = await searchService.getClips(searchTerm)
        searchResults = searchResults.splice(0, 12)
        console.log('searchTerm', searchTerm)
        if (loggedInUser) {
            let searchAlreadySaved = loggedInUser.recentSearches
                .find(recentSearch => recentSearch.title === searchTerm)
            if (!searchAlreadySaved) {
                const updatedUser = await searchService.updateUserRecentSearches(searchResults, loggedInUser, searchTerm)
                dispatch(updateUser(updatedUser))
            }
        }
        getSearchStations(searchService
            .getStationsBySearchTerm(stations, searchTerm))
        getSearchArtists(searchService
            .getStationsBySearchTerm(stations, searchTerm, 'isArtist'))
        setSearchClips(searchResults)
        dispatch(loadStations())
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
                className='search-bar'
                autoFocus />
        </form>
    )
}