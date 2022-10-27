import { SymphonyApp } from './pages/symphony-app.jsx'
import { About } from './pages/about.jsx'
import { DownloadApp } from './pages/download-app.jsx'
import { Login } from './pages/login.jsx'
import { Signup } from './pages/signup.jsx'
import { ProfileDetails } from './pages/profile-details'
import { StationDetails } from './pages/station-details.jsx'
import { Search } from './pages/search.jsx'
import { Library } from './pages/library.jsx'
import { LikedSongs } from './pages/liked-songs.jsx'
import { Queue } from './pages/queue.jsx'
import { TagsDetails } from './pages/tag-details.jsx'
import { FollowersDetails } from './pages/followers-details.jsx'
import { FollowingDetails } from './pages/following-details.jsx'
import { ArtistDetails } from './pages/artist-details.jsx'
import { PublicStationsDetails } from './pages/public-stations-details.jsx'

// Routes accesible from the main navigation (in AppHeader)
const routes = [
    { path: '/', component: <SymphonyApp />, },
    { path: 'tag/:title', component: <TagsDetails /> },
    { path: 'about', component: <About />, },
    { path: 'download', component: <DownloadApp />, },
    { path: 'login', component: <Login />, },
    { path: 'signup', component: <Signup />, },
    { path: 'profile/:_id', component: <ProfileDetails />, },
    { path: 'public-playlists/:_id', component: <PublicStationsDetails />, },
    { path: 'artist/:_id', component: <ArtistDetails />, },
    { path: 'followers/:_id', component: <FollowersDetails />, },
    { path: 'following/:_id', component: <FollowingDetails />, },
    { path: 'search/', component: <Search />, },
    { path: 'station/:_id', component: <StationDetails /> },
    { path: 'liked', component: <LikedSongs />, },
    { path: 'library', component: <Library /> },
    { path: 'queue', component: <Queue /> }
]

export default routes