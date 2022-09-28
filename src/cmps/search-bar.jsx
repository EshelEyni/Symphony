import { utilService } from '../services/util.service'
import { searchService } from '../services/search.service'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { updateUser } from '../store/user.actions'
import { addStation, loadStations } from '../store/station.actions'
import { useEffect } from 'react'

export const SearchBar = ({ setClips, isSearch, setIsSearch, setSearchTerm, isStationDetails }) => {
    const loggedInUser = useSelector(state => state.userModule.user)
    const stations = useSelector(state => state.stationModule.stations)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(loadStations())
    }, [isSearch])



    const handleSearchChange = async ({ target }) => {
        if (!target.value) return
        if (setIsSearch) setIsSearch(true)
        if (setSearchTerm) await setSearchTerm(target.value)
        if (!loggedInUser) return
        let searchResults = await searchService.getClips(target.value)
        searchResults = searchResults.splice(0, 12)
        let searchAlreadySaved = stations.find(searchRes => searchRes.isSearch === true && searchRes.name === target.value)
        if (!searchAlreadySaved) {
            let newSearchList = searchService.setNewSearchList(searchResults, loggedInUser, target.value)
            dispatch(addStation(newSearchList))
        }

        // const queryStringParams = `search?q=${target.value}`
        // const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
        // window.history.pushState({ path: newUrl }, '', newUrl)

        setClips(searchResults)
    }

    const onHandleSubmit = (e) => {
        e.preventDefault()
        
    }

    return (
        <form
            action=''
            className='search-form'>
            {!isStationDetails && <button className="fas fa-search search-btn"></button>}
            <input
                onSubmit={onHandleSubmit}
                type='text'
                name='search-bar'
                placeholder='What do you want do listen to?'
                onChange={utilService.debounce(handleSearchChange, 2000)}
                className='search-bar'
                autoFocus />
        </form>
    )
}