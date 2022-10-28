import { Link } from 'react-router-dom'
import { StationPreview } from './station-preview'
import { LikedSongsPreview } from './liked-songs-preview'
import { useSelector } from 'react-redux'

export const StationList = ({
    stations,
    isSearch,
    isLiked,
    tag,
    isArtist,
    watchedUserId,
    isLimitedDisplay,
    stationKey
}) => {

    const { watchedArtist } = useSelector(state => state.artistModule)
    const isSeeAllLink = stations.length > 8 ? true : false
    const stationsForDisplay = (stations.length > 8 && isLimitedDisplay) ? stations.slice(0, 8) : stations

    const links = [
        { condition: tag, path: '/tag/' + tag },
        { condition: watchedUserId, path: '/public-playlists/' + watchedUserId },
        { condition: isArtist, path:'/artist-playlists/'+ watchedArtist?._id }
    ]
    if (stationsForDisplay)
        return <section className='station-list-container'>

            {links.map(link => (
                    (link.condition && isSeeAllLink) && <Link key={link.path} to={link.path}>See all</Link>
                ))}

            <main className='station-list-main-container grid'>
                {isLiked && <LikedSongsPreview />}
                {stationsForDisplay.map(station => <article
                    key={stationKey + station._id}>
                    <StationPreview
                        currStation={station}
                        isSearch={isSearch} />
                </article>)}
            </main>
        </section>
}