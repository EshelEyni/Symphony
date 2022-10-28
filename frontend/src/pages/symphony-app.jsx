import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Loader } from '../cmps/loader.jsx'
import { ProfileList } from '../cmps/profile-list.jsx'
import { StationList } from '../cmps/station-list.jsx'
import { loadArtists } from '../store/artist.actions.js'
import { setGetStationsByTag, setTags } from '../store/station.actions.js'
import { artistService } from '../services/artist.service.js'
import { stationService } from '../services/station.service.js'
import { userService } from '../services/user.service.js'
import { searchService } from '../services/search.service.js'

export const SymphonyApp = () => {
    const { loggedinUser } = useSelector(state => state.userModule)
    const { stations, tags, getStationByTag } = useSelector(state => state.stationModule)
    const { artists } = useSelector(state => state.artistModule)
    const [randomArtists, setRandomArtists] = useState(null)
    const [artistsByLike, setArtistsByLike] = useState(null)
    const dispatch = useDispatch()

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        if (stations.length) dispatch(setGetStationsByTag(stations))
        if (!tags.length) dispatch(setTags(stationService.getTags()))
        if (!artists.length) dispatch(loadArtists())
        if (artists.length > 0 && !randomArtists && !artistsByLike) {
            setRandomArtists(artistService.getRandomArtists(artists))
            setArtistsByLike(artistService.getArtistBylikes(artists, loggedinUser))
        }
    }, [stations, artists])

    // const getDemoUsers = async () => {
    //     let demoUsers = [
    //         { username: 'user1', fullname: 'user1', password: 'user1' },
    //         { username: 'user2', fullname: 'user2', password: 'user2' },
    //         { username: 'user3', fullname: 'user3', password: 'user3' },
    //         { username: 'user4', fullname: 'user4', password: 'user4' },
    //         { username: 'user5', fullname: 'user5', password: 'user5' },
    //         { username: 'user6', fullname: 'user6', password: 'user6' },
    //         { username: 'user7', fullname: 'user7', password: 'user7' },
    //         { username: 'user8', fullname: 'user8', password: 'user8' },
    //         { username: 'user9', fullname: 'user9', password: 'user9' },
    //         { username: 'user10', fullname: 'user10', password: 'user10' },

    //     ]
    //     const allUsers = await userService.getUsers()
    //     demoUsers = allUsers.filter(user => demoUsers.some(demoUser => demoUser.username === user.username))
    //     console.log('demoUsers', demoUsers)
    //     demoUsers.forEach(async user => {
    //         const newStation = {
    //             name: 'Test Playlist',
    //             createdBy: {
    //                 _id: user._id,
    //                 username: user.username,
    //                 fullname: user.fullname,
    //             }
    //         }
    //         let savedStation = await stationService.save(newStation)
    //         savedStation.clips = await searchService.getClips('eminem')
    //         await stationService.save(savedStation)
    //         user.createdStations.push(savedStation._id)
    //         await userService.update(user)
    //         console.log('savedStation', savedStation)
    //     })


    // }

    if (!getStationByTag?.getByTag || !randomArtists)
        return (
            <Loader
                size={'large-loader'}
                loaderType={'page-loader'} />
        )

    if (getStationByTag?.getByTag && randomArtists)
        return (
            <main>
                {/* <button onClick={getDemoUsers}>signup Demo-users</button> */}
                <section className='artists-main-container'>
                    <h1>Artists</h1>
                    <ProfileList
                        profiles={randomArtists}
                        profileKey={'hp-artists-'} />

                    {artistsByLike?.length > 0 && <section>
                        <h1>Artists you might like</h1>
                        <ProfileList
                            isArtistByLike={true}
                            isLimitedDisplay={true}
                            profiles={artistsByLike}
                            profileKey={'hp-artists-by-like-'} />
                    </section>}
                </section>

                <section>{tags.map(tag => (
                    <section
                        className='station-by-tag-container'
                        key={tag.name}
                    >
                        <header className='tag-header-container'>
                            <h1>{tag.name}</h1>
                        </header>
                        <StationList
                            stations={getStationByTag.getByTag(tag.name)}
                            tag={tag.name}
                            isLimitedDisplay={true}
                            stationKey={'hp-' + tag.name + '-station-'}
                        />
                    </section>
                ))}</section>
            </main >
        )
}