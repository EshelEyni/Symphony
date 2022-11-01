import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { SearchBar } from '../cmps/search-bar'
import { ProfileList } from '../cmps/profile-list.jsx'
import { StationList } from '../cmps/station-list.jsx'
import { TagList } from '../cmps/tag-list.jsx'
import { ClipList } from '../cmps/clip-list.jsx'
import { Loader } from '../cmps/loader'
import { setTags } from '../store/station.actions.js'
import { stationService } from '../services/station.service.js'
import { searchFilterBtns } from '../services/search.service'
import { SearchFailMsg } from '../cmps/search-fail-msg'


export const Search = () => {
    const { loggedinUser } = useSelector(state => state.userModule)
    const { stations, tags } = useSelector(state => state.stationModule)

    const [searchParams, setSearchParams] = useSearchParams()
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')

    const [isPostSearch, setIsPostSearch] = useState(searchTerm ? true : false)
    const [isSearchLoading, setIsSearchLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [filterBy, setFilterBy] = useState(null)
    const [searchClips, setSearchClips] = useState([])
    const [searchStations, getSearchStations] = useState([])
    const [searchArtists, getSearchArtists] = useState([])
    const [searchProfiles, getSearchProfiles] = useState([])
    const [recentSearches, setRecentSearches] = useState([])
    const dispatch = useDispatch()
    const inputValue = useRef()

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        if (searchParams.get('q') !== searchTerm) {
            if (inputValue.current?.value) inputValue.current.value = ''
            setSearchTerm(searchParams.get('q'))
            setIsPostSearch(false)
        }
        if (!tags.length) dispatch(setTags(stationService.getTags()))
        setRecentSearches(stationService.getUserStations(stations, loggedinUser, 'search-stations'))
    }, [stations, searchParams])


    useEffect(() => {
        if (tags.length > 0) setIsLoading(false)
    }, [tags])


    const filterCondition = (filterStr, currArr) => {
        return ((!filterBy || filterBy === filterStr) && searchTerm && currArr.length > 0)
    }

    if (isLoading) {
        return (
            <Loader
                size={'large-loader'}
                loaderType={'page-loader'} />
        )
    }

    if (!isLoading) {
        return (
            <section className='search-main-container'>

                <SearchBar
                    inputValue={inputValue}
                    isSearchPage={true}
                    setIsPostSearch={setIsPostSearch}
                    setIsSearchLoading={setIsSearchLoading}
                    setIsLoading={setIsLoading}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    setSearchClips={setSearchClips}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    getSearchArtists={getSearchArtists}
                    getSearchStations={getSearchStations}
                    getSearchProfiles={getSearchProfiles}
                />

                {/***************************************** Before a search is made *****************************************/}

                {(!isPostSearch && !isSearchLoading) &&
                    <section className='search-default-display'>
                        {(loggedinUser && recentSearches.length > 0) && <section className='recently-search-container'>
                            <StationList
                                title={'Recent-Searches'}
                                isSearch={true}
                                stations={recentSearches}
                                stationKey={'pre-search-recent-search-station'} />
                        </section>}

                        <section className='tag-list-container'>
                            <h1 className='browse-all'>Browse all</h1>
                            <TagList
                                stations={stations}
                                tags={tags}
                            />
                        </section>
                    </section>
                }

                {/***************************************** After a search is made *****************************************/}

                {(isPostSearch && !isSearchLoading && searchClips.length > 0) &&
                    <section >
                        {searchFilterBtns.map((btn, idx) => {
                            const renderConditions = [[true], searchClips, searchStations, searchArtists, searchProfiles, recentSearches]
                            const { title, value } = btn
                            return (
                                <section
                                    className='search-filter-btns flex'
                                    key={'search-filter-btn' + btn.title}>
                                    {
                                        renderConditions[idx]?.length > 0 && <button
                                            className={'search-filter-btn' + (filterBy === value ? ' active' : '')}
                                            onClick={() => { setFilterBy(value) }}
                                        >{title}</button>
                                    }
                                </section>
                            )
                        })}
                    </section>}

                {(isPostSearch && searchClips.length > 0) &&
                    <section className='search-res-main-container'>

                        {filterCondition('songs', searchClips) &&
                            <section className='search-songs-container'>
                                <h1>Songs</h1>
                                <ClipList
                                    clipKey={'search-res'}
                                    currClips={searchClips}
                                    setCurrClips={setSearchClips}
                                    searchTerm={searchTerm}
                                    isSearch={true}
                                />
                            </section>}

                        {filterCondition('playlists', searchStations) &&
                            <section className='search-playlist-container'>
                                <StationList
                                    title={'Playlists'}
                                    isLimitedDisplay={filterBy === 'playlists' ? false : true}
                                    stations={searchStations}
                                    stationKey={'search-station-'}
                                />
                            </section>}

                        {filterCondition('artists', searchArtists) &&
                            <section className='search-artist-container'>
                                <ProfileList
                                    title={'Artists'}
                                    isLimitedDisplay={filterBy === 'artists' ? false : true}
                                    profiles={searchArtists}
                                    profileKey={'search-artists-'}
                                />
                            </section>}

                        {filterCondition('profiles', searchProfiles) &&
                            <section className='search-profiles-container'>
                                <ProfileList
                                    title={'Profiles'}
                                    isLimitedDisplay={filterBy === 'profiles' ? false : true}
                                    profiles={searchProfiles}
                                    profileKey={'search-profiles-'}
                                />
                            </section>}

                        {(filterCondition('searches', recentSearches) && loggedinUser) &&
                            <section className='search-artist-container'>
                                <StationList
                                    title={'Recent Searches'}
                                    isSearch={true}
                                    stations={recentSearches}
                                    stationKey={'recent-search-station-'} />
                            </section>}

                    </section>}

                {(!isPostSearch && isSearchLoading) && <Loader
                    size={'large-loader'}
                    loaderType={'page-loader'} />}


                {(!isSearchLoading && isPostSearch && !searchClips.length) &&
                    <SearchFailMsg
                        searchTerm={searchTerm} />}

            </section >
        )
    }
}