import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { ProfileList } from "../cmps/profile-list"
import { artistService } from "../services/artist.service"
import { userService } from "../services/user.service"
import { loadArtists } from "../store/artist.actions"

export const ArtistByLikeDetails = () => {
    const { loggedinUser, watchedUser } = useSelector(state => state.userModule)
    const { artists } = useSelector(state => state.artistModule)
    const [artistsByLike, setArtistsByLike] = useState([])
    const dispatch = useDispatch()
    const params = useParams()

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        if (!artists.length) dispatch(loadArtists())
        getArtistsByLike()
    }, [artists])

    const getArtistsByLike = async () => {
        const user = await getUser()
        setArtistsByLike(artistService.getArtistBylikes(artists, user))
    }

    const getUser = async () => {
        switch (params._id) {
            case loggedinUser?._id:
                return loggedinUser
            case watchedUser?._id:
                return watchedUser
            default:
                return await userService.getById(params._id)
        }
    }

    return (
        <section className="artist-by-like-details">
            <h1>Artists you might like</h1>
            <ProfileList
                profiles={artistsByLike}
                profileKey={'artists-by-like-details-'}
            />
        </section>
    )
}