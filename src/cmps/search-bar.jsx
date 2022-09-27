import { utilService } from '../services/util.service'
import { searchService } from '../services/search.service'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { updateUser } from '../store/user.actions'
import { addStation, loadStations } from '../store/station.actions'
import { useEffect } from 'react'
import { disable } from 'workbox-navigation-preload'
import { storageService } from '../services/async-storage.service'

export const SearchBar = ({ setClips, isSearch, setIsSearch, setSearchTerm }) => {
    const user = useSelector(state => state.userModule.user)
    const stations = useSelector(state => state.stationModule.stations)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(loadStations())
    }, [isSearch])

    const handleSearchChange = async ({ target }) => {
        if (!target.value) return
        if (setIsSearch) setIsSearch(true)
        if (setSearchTerm) await setSearchTerm(target.value)
        let searchResults = await searchService.getClips(target.value)
        searchResults = searchResults.splice(0, 12)

        let searchAlreadySaved = stations.find(searchRes => searchRes.isSearch === true && searchRes.name === target.value)

        if (!searchAlreadySaved) {
            let newSearchList = searchService.setNewSearchList(searchResults,user, target.value)
            dispatch(addStation(newSearchList))
        }


        setClips(searchResults)
    }

    return (
        <form
            action=''
            onSubmit={(e) => e.preventDefault()}
            className='search-form'>
            <button className="fas fa-search search-btn"></button>
            <input
                type='text'
                name='search-bar'
                placeholder='What do you want do listen to?'
                onChange={utilService.debounce(handleSearchChange, 2000)}
                className='search-bar'
                autoFocus />
        </form>
    )
}