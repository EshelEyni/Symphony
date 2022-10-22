import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { stationService } from '../services/station.service'

export const LikedSongsPreview = () => {
    const { user } = useSelector(state => state.userModule)

    const getSongs = () => {
        let songsStr = user.likedSongs.clips.map(song => song?.title).join(' ● ')
        songsStr = songsStr.length > 150 ? songsStr.slice(0, 150) + '...' : songsStr
        return songsStr
    }

    return (
        <Link
            className='liked-songs '
            to={'/liked'}>
            <main className='inner-liked-container flex column space-around'>
                <section className='songs-list-preview'><p>{getSongs()}</p></section>
                <div>
                    <div className='title-preview'> Liked Songs</div>
                    <div className='summery'>Liked songs: {user.likedSongs.clips.length} | Total Duration: {stationService.getTotalSongDur(user.likedSongs.clips)}</div>
                </div>
            </main>
        </Link>
    )
}