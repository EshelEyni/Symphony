import { searchService } from '../services/search.service'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { loadUsers, updateUser } from '../store/user.actions'
import { useEffect } from 'react'
import { loadStations } from '../store/station.actions'
import { stationService } from '../services/station.service'
import { profileService } from '../services/profile-service'
import { artistService } from '../services/artist.service'
import { userService } from '../services/user.service'
import { loadArtists } from '../store/artist.actions'

export const SearchBar = ({
    isSearchPage,
    setIsPostSearch,
    setIsSearchLoading,
    searchTerm,
    setSearchTerm,
    inputValue,
    setSearchClips,
    searchParams,
    setSearchParams,
    getSearchStations,
    getSearchArtists,
    getSearchProfiles,
    isStationDetails,
}) => {

    const { users, loggedinUser } = useSelector(state => state.userModule)
    const { stations } = useSelector(state => state.stationModule)
    const { artists } = useSelector(state => state.artistModule)

    const dispatch = useDispatch()

    useEffect(() => {
        if (isSearchPage && searchParams.get('q'))
            handleSearch(searchParams.get('q'))

        if (isSearchPage) {
            dispatch(loadUsers())
            dispatch(loadStations())
            dispatch(loadArtists())
        }
    }, [])

    const handleSearchChange = ({ target }) => {
        if (!target.value && isSearchPage) {
            searchParams.delete('q')
            setSearchParams(searchParams)
            setSearchTerm('')
            setIsPostSearch(false)
            return
        }

        setSearchTerm(target.value)
        if (isSearchPage) setSearchParams({ q: target.value }, { replace: true })
    }

    const onHandleSubmit = (ev) => {
        ev.preventDefault()
        if (!searchTerm) return
        handleSearch(searchTerm)
    }

    const handleSearch = async (searchTerm) => {
        setIsSearchLoading(true)
        const searchResults = await searchService.getClips(searchTerm)
        setSearchClips(searchResults)

        if (loggedinUser && !loggedinUser.recentSearches.map(rs => rs.title).includes(searchTerm)) {
            const updatedUser = await searchService.updateUserRecentSearches(searchResults, loggedinUser, searchTerm)
            if (updatedUser) dispatch(updateUser(updatedUser))
            dispatch(loadStations())
        }

        if (isSearchPage) {
            const stationsForSearch = stations.length ? stations : await stationService.query()
            const artistsForSearch = artists.length ? artists : await artistService.query()
            const usersForSearch = users.length ? users : await userService.getUsers()
            getSearchStations(stationService.getFilteredStations(stationsForSearch, { term: searchTerm, type: 'search-term' }))
            getSearchArtists(artistService.getArtistBySearchTerm(searchResults, artistsForSearch) || [])
            getSearchProfiles(profileService.getProfilesBySearchTerm(stationsForSearch, usersForSearch, searchTerm) || [])
        }

        setIsSearchLoading(false)
        setIsPostSearch(true)
    }

    return (
        <form
            onSubmit={onHandleSubmit}
            style={{ left: window.outerWidth * 0.35 }}
            className='search-form'>
            <button className='fas fa-search search-btn'/>
            <input
                className='search-bar-input'
                type='text'
                name='search-bar'
                placeholder='What do you want do listen to?'
                onChange={handleSearchChange}
                defaultValue={searchParams?.get('q')}
                ref={inputValue}
            />
        </form>
    )
}