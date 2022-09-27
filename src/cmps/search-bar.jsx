import { utilService } from '../services/util.service'
import { searchService } from '../services/search.service'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { updateUser } from '../store/user.actions'
import { addStation, loadStations } from '../store/station.actions'
import { useEffect } from 'react'

export const SearchBar = ({ setClips, isSearch, setIsSearch, setSearchTerm }) => {
    const user = useSelector(state => state.userModule.user)
    const stations = useSelector(state => state.stationModule.stations)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(loadStations(user?._id))
    }, [isSearch])

    const handleSearchChange = async ({ target }) => {
        if (!target.value) return
        if (setIsSearch) setIsSearch(true)
        if (setSearchTerm) await setSearchTerm(target.value)
        let searchResults = await searchService.getClips(target.value)
        searchResults = searchResults.splice(0, 15)
        let searchAlreadySaved = stations.find(searchRes => searchRes.isSearch === true && searchRes.name === target.value)
        if (!searchAlreadySaved) {

            const clip = searchResults[0]
            let newSearch = {
                name: target.value,
                imgUrl: clip.img.url,
                createdBy: {
                    _id: user._id,
                    fullname: user.fullname,
                    imgUrl: user.imgUrl
                },
                isSearch: true,
                clips: searchResults || [],
            }
            user.recentlySearched.push(newSearch)
            dispatch(updateUser(user))
            dispatch(addStation(newSearch))
        }

        setClips(searchResults)
    }

    return (
        <form
            action=''
            className='search-form'>
                <button className="fas fa-search search-btn"></button>
            <input
                onSubmit={false}
                type='text'
                name='search-bar'
                placeholder= 'What do you want do listen to?'
                onChange={utilService.debounce(handleSearchChange, 2000)}
                className='search-bar'
                autoFocus />
        </form>
    )
}