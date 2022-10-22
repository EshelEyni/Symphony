import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setClip, setPlaylist } from '../store/media-player.actions.js'
import { SearchBar } from '../cmps/search-bar'
import { SearchList } from '../cmps/search-list'
import { setHeaderBgcolor } from '../store/app-header.actions.js'
import { defaultHeaderBgcolor } from '../services/bg-color.service'
import { useSelector } from 'react-redux'
import { updateUser } from '../store/user.actions.js'
import { ProfileList } from '../cmps/profile-list.jsx'
import { StationList } from '../cmps/station-list.jsx'
import { TagList } from '../cmps/tag-list.jsx'
import { loadStations } from '../store/station.actions.js'
import { searchService, searchLoader } from '../services/search.service.js'
import { defaultImg, stationService } from '../services/station.service.js'
import { useParams, useSearchParams } from 'react-router-dom'
import { equalizer } from '../services/clip.service.js'


export const Search = () => {
    const loggedInUser = useSelector(state => state.userModule.user)
    let stations = useSelector(state => state.stationModule.stations)

    let [filterBy, setFilterBy] = useState(null)
    let [searchClips, getSearchClips] = useState([])
    let [searchStations, getSearchStations] = useState([])
    let [searchArtist, getSearchArtists] = useState([])
    let [searchProfiles, getSearchProfiles] = useState([])
    let [currRecentSearches, setCurrRecentSearches] = useState([])
    let [isLoading, setIsLoading] = useState(true)

    const [isSearch, setIsSearch] = useState(false)
    let [searchParams, setSearchParams] = useSearchParams()
    const [searchTerm, setSearchTerm] = useState(searchParams.get('keyword'))

    const dispatch = useDispatch()
    const params = useParams()

    useEffect(() => {
        dispatch(setHeaderBgcolor(defaultHeaderBgcolor))
        if (!stations.length) dispatch(loadStations())
        if (!loggedInUser) return
        setCurrRecentSearches(stationService.getUserStations(stations, loggedInUser._id, true))
    }, [stations, isSearch, params])

    const onPlayClip = (clip) => {
        dispatch(setClip(clip))
        dispatch(setPlaylist(searchClips))
        dispatch(updateUser(loggedInUser))
    }

    const noDataArrive = () => {
        setTimeout(() => {
            setIsLoading(false)
        }, 10000);
    }

    return (
        <div className='search-main-container'>
            {isSearch &&
                <div className="search-filter-btns flex">
                    <button className={'search-filter-btn' + (filterBy === null ? ' active' : '')} onClick={() => {
                        setFilterBy(null)
                    }}>All</button>

                    <button className={'search-filter-btn' + (filterBy === 'songs' ? ' active' : '')} onClick={() => {
                        setFilterBy('songs')
                    }}>Songs</button>

                    <button className={'search-filter-btn' + (filterBy === 'playlists' ? ' active' : '')} onClick={() => {
                        setFilterBy('playlists')
                    }}>Playlists</button>

                    <button className={'search-filter-btn' + (filterBy === 'artists' ? ' active' : '')} onClick={() => {
                        setFilterBy('artists')
                    }}>Artists</button>

                    <button className={'search-filter-btn' + (filterBy === 'profiles' ? ' active' : '')} onClick={() => {
                        setFilterBy('profiles')
                    }}>Profiles</button>

                    <button className={'search-filter-btn' + (filterBy === 'searches' ? ' active' : '')} onClick={() => {
                        setFilterBy('searches')
                    }}>Recent Searches</button>
                </div>}
            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setIsSearch={setIsSearch}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                getSearchArtists={getSearchArtists}
                getSearchStations={getSearchStations}
                getSearchProfiles={getSearchProfiles}
                setSearchClips={getSearchClips} />

            {/***************************************** Before a search is made *****************************************/}

            {!isSearch &&
                <div className="search-default-display">
                    {(loggedInUser && currRecentSearches.length > 0) && <div className="recently-search-container">
                        <h1>Recent Searches</h1>
                        <StationList
                            isSearch={true} // This is a diffrenet boolean than the one above inside the hook
                            stations={currRecentSearches} />
                    </div>}

                    <div className="tag-list-container">
                        <h1 className='browse-all'>Browse all</h1>
                        <TagList stations={stations} />
                    </div>
                </div>
            }

            {/***************************************** After a search is made *****************************************/}
            {(isSearch && searchClips.length > 0) &&
                <div className="search-res-main-container">


                    {((filterBy === null || filterBy === 'songs') && searchTerm) &&
                        <div className="search-songs-container">
                            <h1>Songs</h1>
                            <SearchList
                                type={'search-res'}
                                searchClips={searchClips}
                                onPlayClip={onPlayClip}
                            />
                        </div>
                    }



                    {((filterBy === null || filterBy === 'playlists') && searchTerm) &&
                        <div className="search-playlist-container">
                            <h1>Playlists</h1>
                            <StationList
                                searchTerm={searchTerm}
                                stations={searchStations}
                            />
                        </div>
                    }

                    {((filterBy === null || filterBy === 'artists') && searchTerm) &&
                        <div className="search-artist-container">
                            <h1>Artists</h1>
                            <StationList
                                isArtistList={true}
                                stations={searchArtist}
                            />
                        </div>
                    }

                    {((filterBy === null || filterBy === 'profiles') && searchTerm) &&
                        <div className="search-profiles-container">
                            <h1>Profiles</h1>
                            <ProfileList
                                currProfiles={searchProfiles}
                            // filterBy={'searchTerm'}
                            // searchTerm={searchTerm} 
                            />
                        </div>
                    }


                    {((filterBy === null || filterBy === 'searches') && searchTerm && loggedInUser) &&
                        <div className="search-artist-container">
                            <h1>Recent Searches</h1>
                            <StationList
                                isSearch={true}
                                stations={currRecentSearches} />
                        </div>}


                </div>}
            {(isSearch && !searchClips.length) &&
                <div className='no-results-user-msg'>
                    {isLoading &&
                        <div className='search-loader-container'>
                            <img
                            className='station-img rotate'
                            src={defaultImg}
                            alt='playist-img' />
                        </div>
                        // <div>
                        //     <p>Your search - {searchTerm} - didn't match any of our songs.</p>
                        //     <ul>Suggsetions:
                        //         <li>● Make sure that all words are spelled correctly.</li>
                        //         <li>● Try different keywords.</li>
                        //         <li>● Try more general keywords.</li>
                        //     </ul>
                        // </div>

                    }
                </div>
            }
        </div >
    )
}