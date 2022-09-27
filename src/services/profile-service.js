import { searchService } from "./search.service"

export const loadingImg = 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1663540882/ezgif.com-gif-maker_znhvuh.gif'
export const defaultImg = 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1663788155/pngwing.com_7_smg1dj.png'

export const checkLoading = (img) => {
    return img === defaultImg ? 'rotate' : ''
}


export function getFilteredList(usersList, loggedInUser, filterBy, stations, searchTerm) {
    if(!loggedInUser) return
    usersList = usersList.filter(user => user._id !== loggedInUser._id)
    switch (filterBy) {

        case 'likes':
            const loggedInUserLikedSongsIds = new Set(loggedInUser.likedSongs?.map(likedSong => likedSong._id))
            return usersList.map(user => {
                let matchedLikes = 0
                for (let y = 0; y < user.likedSongs.length; y++) {
                    if (loggedInUserLikedSongsIds.has(user.likedSongs[y]._id)) {
                        matchedLikes++
                    }
                }
                return { ...user, matchedLikes }
            })
                .filter(user => user.matchedLikes !== 0)
                .sort((a, b) => b.matchedLikes - a.matchedLikes)

        case 'searchTerm':
            return searchService.getProfilesBySearchTerm(stations, usersList, searchTerm)

        case 'following':
            return loggedInUser.following?.map(followedProfileId => {
                return usersList.find(user => user._id === followedProfileId)
            })

        case 'followers':
            return loggedInUser.followers?.map(followerProfileId => {
                return usersList.find(user => user._id === followerProfileId)
            })

        default:
            return usersList
    }
}