import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { StationHeader } from '../cmps/station-header'
import { ClipList } from '../cmps/clip-list'
import { Loader } from '../cmps/loader'
import { setHeaderBgcolor } from '../store/app-header.actions.js'
import { defaultHeaderBgcolor, likedSongsBgcolor } from '../services/bg-color.service.js'
import LikedSongsLogo from '../assets/img/likedsongs.png'

export const LikedSongs = () => {
    const { loggedinUser } = useSelector(state => state.userModule)
    const [likedSongs, setLikedSongs] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {

        if (!loggedinUser) {
            navigate('/')
            return
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        dispatch(setHeaderBgcolor(likedSongsBgcolor))
        setLikedSongs([...loggedinUser.likedSongs.clips])

        return () => {
            dispatch(setHeaderBgcolor(defaultHeaderBgcolor))
        }
    }, [])


    if (!likedSongs) {
        <Loader
            size={'large-loader'}
            loaderType={'page-loader'} />
    }

    if (likedSongs) {
        return (
            <main className='station-details'
                style={{ backgroundColor: likedSongsBgcolor }}>
                <header className='station-header'>
                    <StationHeader
                        user={loggedinUser.username}
                        LikedSongsLogo={LikedSongsLogo}
                        isUserStation={true}
                        isLikedSongs={true}
                        currStation={loggedinUser.likedSongs}
                        clips={likedSongs}
                        bgColor={likedSongsBgcolor}
                    />
                </header>

                <section className='clips-list'>
                    <ClipList
                        currStation={loggedinUser.likedSongs}
                        currClips={likedSongs}
                        setCurrClips={setLikedSongs}
                        clipKey={'liked-clip'}
                        isLike={true}
                        bgColor={likedSongsBgcolor}
                    />
                </section>
            </main >
        )
    }
}