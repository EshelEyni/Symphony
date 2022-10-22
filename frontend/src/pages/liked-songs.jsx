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
    const { user } = useSelector(state => state.userModule)
    const [likedSongs, setLikedSongs] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate('/')
            return
        }
        dispatch(setHeaderBgcolor(likedSongsBgcolor))
        setLikedSongs([...user.likedSongs.clips])

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
            <main className='station-container'>
                <header className='station-header'>
                    <StationHeader
                        LikedSongsLogo={LikedSongsLogo}
                        isLikedSongs={true}
                        bgColor={likedSongsBgcolor}
                        isUserStation={true}
                        clips={likedSongs}
                        currStation={user.likedSongs}
                        user={user.username}
                    />
                </header>

                <section className='station-clips-container'>
                    <ClipList
                        bgColor={likedSongsBgcolor}
                        clipKey={'liked-clip'}
                        currStation={user.likedSongs}
                        // currClips={user.likedSongs.clips}
                        currClips={likedSongs}
                        setCurrClips={setLikedSongs}
                        isLike={true}
                    />
                </section>
            </main >
        )
    }
}