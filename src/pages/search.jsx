import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { playClip, setPlaylist } from '../store/media-player.actions.js'
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
    const [isSearch, setIsSearch] = useState(false)
    const [searchTerm, setSearchTerm] = useState()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setHeaderBgcolor(defaultHeaderBgcolor))
        dispatch(loadStations())
    }, [])

    useEffect(() => {
        console.log('useEffect');
    }, [filterBy])

    const onPlayClip = (clip) => {
        dispatch(playClip(clip))
        dispatch(setPlaylist(clips))
        userService.setRecentlyPlayed(loggedInUser, clip)
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
                        <StationList stations={stations.filter(station => {
                            return (station?.isSearch === true && station.createdBy._id === loggedInUser._id)
                        }).reverse()} />
                        You haven't search anything yet...
                    </div>}

                    <div className="tag-list-container">
                        <h1>Browse all</h1>
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
                </div>
            }
        </div >
    )
}