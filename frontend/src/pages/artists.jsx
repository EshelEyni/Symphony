import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Loader } from "../cmps/loader"
import { ProfileList } from "../cmps/profile-list"
import { loadArtists } from "../store/artist.actions"

export const Artists = () => {
    const { artists } = useSelector(state => state.artistModule)
    const dispatch = useDispatch()

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        if (!artists.length) dispatch(loadArtists())
    }, [artists])

    if (!artists.length)
        return (
            <Loader
                size={'large-loader'}
                loaderType={'page-loader'} />
        )

    else return (
        <section className="artists-page">
            <ProfileList
                title={'Artists'}
                profiles={artists}
                profileKey={'artists-page-'}
            />
        </section>
    )
}