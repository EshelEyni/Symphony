import { SymphonyApp } from './pages/symphony-app.jsx'
import { About } from './pages/about.jsx'
import { DownloadApp } from './pages/download-app.jsx'
import { Login } from './pages/login.jsx'
import { Signup } from './pages/signup.jsx'
import { UserProfile } from './pages/profile-details'
import { StationDetails } from './pages/station-details.jsx'
import { Search } from './pages/search.jsx'
import { Library } from './pages/library.jsx'
import { LikedSongs } from './pages/liked-songs.jsx'
import { ClipsQueue } from './pages/clips-queue.jsx'
import { TagsDetails } from './pages/tag-details.jsx'
// import '../node_modules/font-awesome/css/font-awesome.min.css'
// Routes accesible from the main navigation (in AppHeader)
const routes = [
    {
        path: '/',
        component: <SymphonyApp />,
    },
    {
        path: '/about',
        component: <About />,
    },
    {
        path: '/download',
        component: <DownloadApp />,
    },
    {
        path: '/login',
        component: <Login />,
    },
    {
        path: '/signup',
        component: <Signup />,
    },
    {
        path: '/user-profile/:id',
        component: <UserProfile />,
    },
    {
        path: '/station/:id',
        component: <StationDetails />
    },
    {
        path: '/liked',
        component: <LikedSongs />,
    },
    {
        path: '/search/',
        component: <Search />,
    },
    {
        path: '/tag/:title',
        component: <TagsDetails />
    },
    {
        path: '/library',
        component: <Library />
    },
    {
        path: '/clips-queue',
        component: <ClipsQueue />
    }

]

export default routes