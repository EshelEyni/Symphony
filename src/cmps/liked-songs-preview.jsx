import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getTotalSongDur } from "../services/station.service"

export const LikedSongsPreview = ({ user }) => {
    const navigate = useNavigate()
    const songsLength = user.likedSongs.length

    const getSongs = () => {
        let songsStr = user.likedSongs.map(song => song.title).join('"●"')
        songsStr = songsStr.length > 150 ? songsStr.slice(0, 150) + "..." : songsStr
        return songsStr
    }

    const goToLikedSongs = () => {
        navigate('/liked')
    }

    return <div className="liked-songs" onClick={() => goToLikedSongs()}>
        <div className="inner-liked-container flex column space-around">
            <div className="songs-list-preview"><p>{getSongs()}</p></div>
            <div>
                <div className="title-preview"> Liked Songs</div>
                <div className="summery">Liked songs: {songsLength} | Total Duration: {getTotalSongDur(user.likedSongs)}</div>
            </div>
        </div>
    </div>
}