import { Link } from 'react-router-dom'
import { StationPreview } from './station-preview'
import { LikedSongsPreview } from './liked-songs-preview'

export const StationList = ({
    stations,
    isSearch,
    isLiked,
    tag,
    stationKey
}) => {

    const isSeeAllLink = stations.length > 8 ? true : false
    const stationsForDisplay = stations.length > 8 ? stations.slice(0, 8) : stations
    
    if (stationsForDisplay)
        return <section className='station-list-container'>
            {(tag && isSeeAllLink) && <Link to={'/tag/' + tag}>SEE ALL</Link>}
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