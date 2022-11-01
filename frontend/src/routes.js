import { SymphonyApp } from './pages/symphony-app.jsx'
import { About } from './pages/about.jsx'
import { Login } from './pages/login.jsx'
import { Signup } from './pages/signup.jsx'
import { ProfileDetails } from './pages/profile-details'
import { StationDetails } from './pages/station-details.jsx'
import { Search } from './pages/search.jsx'
import { Library } from './pages/library.jsx'
import { LikedSongs } from './pages/liked-songs.jsx'
import { Queue } from './pages/queue.jsx'
import { Tags } from './pages/tag.jsx'
import { Followers } from './pages/followers.jsx'
import { Following } from './pages/following.jsx'
import { ArtistDetails } from './pages/artist-details.jsx'
import { PublicStations } from './pages/public-stations.jsx'
import { ArtistByLike } from './pages/artist-by-like-details.jsx'
import { ArtistStations } from './pages/artist-station.jsx'
import { ArtistProfiles } from './pages/artist-profiles.jsx'
import { Artists } from './pages/artists.jsx'

const routes = [
    { path: '/', component: <SymphonyApp />, },
    { path: 'about', component: <About />, },
    { path: 'login', component: <Login />, },
    { path: 'signup', component: <Signup />, },
    { path: 'profile/:_id', component: <ProfileDetails />, },
    { path: 'public-playlists/:_id', component: <PublicStations />, },
    { path: 'artists', component: <Artists />, },
    { path: 'artist/:_id', component: <ArtistDetails />, },
    { path: 'artist-by-likes/:_id', component: <ArtistByLike />, },
    { path: 'artist-playlists/:_id', component: <ArtistStations />, },
    { path: 'artist-profiles/:_id', component: <ArtistProfiles />, },
    { path: 'followers/:_id', component: <Followers />, },
    { path: 'following/:_id', component: <Following />, },
    { path: 'search/', component: <Search />, },
    { path: 'tag/:title', component: <Tags /> },
    { path: 'station/:_id', component: <StationDetails /> },
    { path: 'liked', component: <LikedSongs />, },
    { path: 'library', component: <Library /> },
    { path: 'queue', component: <Queue /> }
]

export default routes