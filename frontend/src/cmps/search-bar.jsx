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

    const { users, user } = useSelector(state => state.userModule)
    const { stations } = useSelector(state => state.stationModule)
    const { artists } = useSelector(state => state.artistModule)

    const dispatch = useDispatch()

    useEffect(() => {
        if (isSearchPage && searchParams.get('q'))
            handleSearch(searchParams.get('q'))
    }, [])

    const handleSearchChange = ({ target }) => {
        if (!target.value) {
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
        // if (ev) 
        ev.preventDefault()
        handleSearch(searchTerm)
    }

    const handleSearch = async (searchTerm) => {
        setIsSearchLoading(true)
        const searchResults = await searchService.getClips(searchTerm)
        setSearchClips(searchResults)

        if (user && !user.recentSearches.map(rs => rs.title).includes(searchTerm)) {
            const updatedUser = await searchService.updateUserRecentSearches(searchResults, user, searchTerm)
            dispatch(updateUser(updatedUser))
            dispatch(loadStations())
        }

        if (isSearchPage) {
            const stations = await stationService.query()
            const artists = await artistService.query()
            const users = await userService.getUsers()

            // await dispatch(loadStations())
            // await dispatch(loadArtists())
            // await dispatch(loadUsers())
            console.log('stations', stations, 'artists', artists, 'users', users)

            getSearchStations(stationService.getFilteredStations(stations, { term: searchTerm, type: 'search-term' }))
            getSearchArtists(artistService.getArtistBySearchTerm(searchResults, artists) || [])
            getSearchProfiles(profileService.getProfilesBySearchTerm(stations, users, searchTerm) || [])
        }
        setIsSearchLoading(false)
        setIsPostSearch(true)
    }

    return (
        <form
            action=''
            onSubmit={onHandleSubmit}
            className={isStationDetails ? 'search-form-station' : 'search-form'} >
            <button className='fas fa-search search-btn'></button>
            <input
                className={isStationDetails ? 'search-bar-station-input' : 'search-bar-input'}
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