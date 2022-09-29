import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setClip, setPlaylist } from '../store/media-player.actions.js'
import { SearchBar } from '../cmps/search-bar'
import { SearchList } from '../cmps/search-list'
import { setHeaderBgcolor } from '../store/app-header.actions.js'
import { defaultHeaderBgcolor } from '../services/bg-color.service'
import { useSelector } from 'react-redux'
import { userService } from '../services/user.service.js'
import { loadUsers, updateUser } from '../store/user.actions.js'
import { ProfilesList } from '../cmps/profile-list.jsx'
import { StationList } from '../cmps/station-list.jsx'
import { TagsList } from '../cmps/tag-list.jsx'
import { loadStations } from '../store/station.actions.js'
import { searchService } from '../services/search.service.js'

export const Search = () => {
    const loggedInUser = useSelector(state => state.userModule.user)
    let stations = useSelector(state => state.stationModule.stations)

    let [filterBy, setFilterBy] = useState([])
    let [clips, setClips] = useState([])
    let [recentSearches, setRecentSearches] = useState([])
    const [isSearch, setIsSearch] = useState(false)
    const [searchTerm, setSearchTerm] = useState()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setHeaderBgcolor(defaultHeaderBgcolor))
        dispatch(loadStations())
        const searchStations = stations.filter(station => {
            return (station?.isSearch === true && station.createdBy._id === loggedInUser._id)
        }).reverse()
        setRecentSearches(searchStations)
    }, [stations])

    useEffect(() => {
    }, [filterBy])

    const onPlayClip = (clip) => {
        dispatch(setClip(clip))
        dispatch(setPlaylist(clips))
        dispatch(updateUser(loggedInUser))
    }


    return (
        <div className='search-main-container'>
            <div className="search-filter-btns flex">
                <button className='search-filter-btn' onClick={() => {
                    setFilterBy([])
                }}>All</button>

                <button className='search-filter-btn' onClick={() => {
                    setFilterBy([...searchService.toggleFilterBy(filterBy, 'songs')])
                }}>Songs</button>

                <button className='search-filter-btn' onClick={() => {
                    setFilterBy([...searchService.toggleFilterBy(filterBy, 'playlists')])
                }}>Playlists</button>

                <button className='search-filter-btn' onClick={() => {
                    setFilterBy([...searchService.toggleFilterBy(filterBy, 'artists')])
                }}>Artists</button>

                <button className='search-filter-btn' onClick={() => {
                    setFilterBy([...searchService.toggleFilterBy(filterBy, 'profiles')])
                }}>Profiles</button>

                <button className='search-filter-btn' onClick={() => {
                    setFilterBy([...searchService.toggleFilterBy(filterBy, 'searches')])
                }}>Recent Searches</button>
            </div>
            <SearchBar
                setSearchTerm={setSearchTerm}
                setIsSearch={setIsSearch}
                setClips={setClips} />

            {/***************************************** Before a search is made *****************************************/}

            {!isSearch &&
                <div className="search-default-display">
                    {loggedInUser && <div className="recently-search-container">
                        <h1>Recent Searches</h1>
                        <StationList stations={recentSearches} />
                    </div>}
                    {recentSearches.length === 0 &&
                        <div className="no-search-msg">
                            You haven't search anything yet...
                        </div>
                    }
                    <div className="tag-list-container">
                        <h1 className='browse-all'>Browse all</h1>
                        <TagsList stations={stations} />
                    </div>
                </div>
            }


            {/***************************************** After a search is made *****************************************/}


            {/* ADD LOADER */}

            {(isSearch && clips.length > 0) &&
                <div className="search-res-main-container">


                    {(filterBy.length === 0 || filterBy.includes('songs')) &&
                        <div className="search-songs-container">
                            <h1>Songs</h1>
                            <SearchList
                                type={'search-res'}
                                clips={clips}
                                onPlayClip={onPlayClip}
                            />
                        </div>
                    }



                    {(filterBy.length === 0 || filterBy.includes('playlists')) &&
                        <div className="search-playlist-container">
                            <h1>Playlists</h1>
                            <StationList
                                searchTerm={searchTerm}
                                stations={searchService
                                    .getStationsBySearchTerm(stations, searchTerm)} />
                        </div>
                    }

                    {(filterBy.length === 0 || filterBy.includes('artists')) &&
                        <div className="search-artist-container">
                            <h1>Artists</h1>
                            <StationList
                                isArtistList={true}
                                stations={searchService
                                    .getStationsBySearchTerm(stations, searchTerm, 'isArtist')} />
                        </div>
                    }

                    {((filterBy.length === 0 || filterBy.includes('profiles')) && searchTerm) &&
                        <div className="search-profiles-container">
                            <h1>Profiles</h1>
                            <ProfilesList
                                filterBy={'searchTerm'}
                                searchTerm={searchTerm} />
                        </div>
                    }


                    {((filterBy.length === 0 || filterBy.includes('searches'))) &&
                        <div className="search-artist-container">
                            <h1>Recent Searches</h1>
                            <StationList
                                stations={recentSearches} />
                        </div>}
                        
                </div>
            }
        </div >
    )
}