import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Loader } from "../cmps/loader"
import { ProfileList } from "../cmps/profile-list"
import { loadArtist } from "../store/artist.actions"
import { loadStations } from "../store/station.actions"
import { loadUsers } from "../store/user.actions"
import { profileService } from "../services/profile-service"

export const ArtistProfiles = () => {
    const { users } = useSelector(state => state.userModule)
    const { watchedArtist } = useSelector(state => state.artistModule)
    const { stations } = useSelector(state => state.stationModule)
    const dispatch = useDispatch()
    const params = useParams()

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        if (!watchedArtist) dispatch(loadArtist(params._id))
        if (!stations.length) dispatch(loadStations())
        if (!users.length) dispatch(loadUsers())
    }, [watchedArtist])

    if (!watchedArtist)
        return (
            <Loader
                size={'large-loader'}
                loaderType={'page-loader'} />
        )

    return (
        <section className="artist-profiles">
            <ProfileList
                title={'Profiles for ' + watchedArtist.username}
                profiles={profileService.getProfilesByArtist(stations, users, watchedArtist.username)}
                profileKey={'artist-profile-'}
            />
        </section>
    )
}