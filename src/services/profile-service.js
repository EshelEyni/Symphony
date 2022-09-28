import { searchService } from "./search.service"

export const loadingImg = 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1663540882/ezgif.com-gif-maker_znhvuh.gif'
export const defaultImg = 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1663788155/pngwing.com_7_smg1dj.png'

export const checkLoading = (img) => {
    return img === defaultImg ? 'rotate' : ''
}


export function getFilteredUsersList(users, loggedInUser, filterBy, stations, searchTerm) {
    if (!loggedInUser) return
    const usersList = users.filter(user => user._id !== loggedInUser._id)
    let filterdUsersList = []
    switch (filterBy) {
        case 'likes':
            const loggedInUserLikedSongsIds = new Set(loggedInUser.likedSongs?.map(likedSong => likedSong._id))
            filterdUsersList = usersList.map(user => {
                let matchedLikes = 0
                for (let y = 0; y < user.likedSongs.length; y++) {
                    if (loggedInUserLikedSongsIds.has(user.likedSongs[y]._id)) {
                        matchedLikes++
                    }
                }
                return { ...user, matchedLikes }
            })
                .filter(user => user.matchedLikes > 0)
                .sort((a, b) => b.matchedLikes - a.matchedLikes)

            return filterdUsersList
        case 'searchTerm':
            return searchService.getProfilesBySearchTerm(stations, usersList, searchTerm)

        case 'following':
            loggedInUser.following?.forEach(followedProfileId => {
                const currUser = usersList.find(user => user._id === followedProfileId)
                if (!currUser) return
                filterdUsersList.push(currUser)
            })
            return filterdUsersList
        case 'followers':
            filterdUsersList = loggedInUser.followers?.map(followerProfileId => {
                return usersList.find(user => user._id === followerProfileId)
            })
            return filterdUsersList
        default:
            return filterdUsersList
    }
}