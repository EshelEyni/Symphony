import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { LikedSongsPreview } from "../cmps/liked-songs-preview"
import { StationList } from "../cmps/station-list"
import { defaultHeaderBgcolor } from '../services/bg-color.service'
import { setHeaderBgcolor } from "../store/app-header.actions"
import { addStation } from '../store/station.actions'



export const Library = () => {
    const user = useSelector(state => state.userModule.user)
    let stations = useSelector(state => state.stationModule.stations)
    let [userStations, setUserStations] = useState(null)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // const isUserStations = stations.filter(station => station?.createdBy?._id === user?._id)

    useEffect(() => {
        dispatch(setHeaderBgcolor(defaultHeaderBgcolor))
        userStations = stations.filter(station => (station.createdBy._id === user._id && !station.isSearch))
        setUserStations(userStations)
    }, [])

    const onAddStation = () => {
        let newStation = {
            name: 'My Playlist #' + ((stations?.length + 1) || 1),
            imgUrl: 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1663788155/pngwing.com_7_smg1dj.png',
            desc: '',
            tags: [],
            createdBy: {
                _id: user._id,
                fullname: user.fullname,
                imgUrl: user.imgUrl
            },
            likedByUsers: [],
            clips: [],
            msgs: []
        }
        dispatch(addStation(newStation))
        navigate('/station/' + newStation._id)
    }

    return (
        <div>
            <h1>
                LIBRARY
            </h1>
            {!userStations || userStations.length === 0 && <div className="flex column align-center justify-center call-to-action">
                <div className="icon">
                    <svg
                        width="80"
                        height="81"
                        viewBox="0 0 80 81"
                        xmlns="http://www.w3.org/2000/svg">
                        <title>Playlist Icon</title>
                        <path
                            d="M25.6 11.565v45.38c-2.643-3.27-6.68-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4 14.4-6.46 14.4-14.4v-51.82l48-10.205V47.2c-2.642-3.27-6.678-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4S80 64.17 80 56.23V0L25.6 11.565zm-11.2 65.61c-6.176 0-11.2-5.025-11.2-11.2 0-6.177 5.024-11.2 11.2-11.2 6.176 0 11.2 5.023 11.2 11.2 0 6.174-5.026 11.2-11.2 11.2zm51.2-9.745c-6.176 0-11.2-5.024-11.2-11.2 0-6.174 5.024-11.2 11.2-11.2 6.176 0 11.2 5.026 11.2 11.2 0 6.178-5.026 11.2-11.2 11.2z" fill="currentColor" fillRule="evenodd"></path>
                    </svg>
                </div>

                <div><h1> Create your first playlist </h1></div>
                <div><span>It's easy, we'll help you.</span></div>
                <button className="btn" onClick={() => onAddStation()}>Create playlist</button>
            </div>}

            {userStations && userStations.length !== 0 &&
                <div className='main-stations-container'>
                        <StationList stations={userStations} />
                </div>}

        </div>
    )
}