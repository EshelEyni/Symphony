import userEvent from "@testing-library/user-event"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { getTotalSongDur } from "../services/likedsong.service"

export const HeaderDetails = ({ creator, clips }) => {
  creator = creator ? creator : 'Symphony'
  const user = useSelector(state => state.userModule.user)
  const params = window.location.href
  const path = creator === 'Symphony' ? '/' : `/user-profile/${user._id}`

  return <div><p className="creator-and-playlist-data">
    <Link
      to={path}
      className='my-sd-user-name'>{creator.charAt(0).toUpperCase() + creator.substring(1)} ● </Link>
    Total of {clips?.length} {clips?.length === 1 ? 'song' : 'songs'} {clips && ' ,Total duration: ' + getTotalSongDur(clips)}
  </p>
  </div>
}