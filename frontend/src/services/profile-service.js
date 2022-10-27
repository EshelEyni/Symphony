export const profileService = {
    getUserProfiles,
    getProfilesByArtist,
    getProfilesBySearchTerm
}


function getUserProfiles(users, loggedinUser, filterBy, artists) {
    if (!users || !loggedinUser) return []
    let filteredProfilesList = []

    switch (filterBy) {
        case 'likes':
            const loggedInUserLikedSongsIds = new Set(loggedinUser.likedSongs.clips?.map(likedSong => likedSong?._id))
            filteredProfilesList = users
                .filter(user => user._id !== loggedinUser._id)
                .map(user => {
                    let matchedLikes = 0
                    user.likedSongs.clips.forEach(clip => {
                        if (loggedInUserLikedSongsIds.has(clip._id)) matchedLikes++

                    })
                    return { ...user, matchedLikes }
                })
                .filter(user => user.matchedLikes > 0 && !loggedinUser.followers.includes(loggedinUser._id))
                .sort((a, b) => b.matchedLikes - a.matchedLikes)

            return filteredProfilesList

        case 'following':
            loggedinUser.following.forEach(followedProfileId => {
                const usersArtistsList = [...users, ...artists]
                const currFollowedUser = usersArtistsList.find(user => user._id === followedProfileId)
                if (!currFollowedUser) return
                filteredProfilesList.push(currFollowedUser)
            })
            return filteredProfilesList

        case 'followers':
            loggedinUser.followers.forEach(followerProfileId => {
                const currFollowerUser = users.find(user => user._id === followerProfileId)
                if (!currFollowerUser) return
                filteredProfilesList.push(currFollowerUser)
            })
            return filteredProfilesList

        default:
            return filteredProfilesList
    }
}

function getProfilesByArtist(stations, users, artistName) {
    artistName = artistName.toLowerCase()
    return getProfilesBy(stations, users, clip => clip => clip?.artistName.toLowerCase() == artistName)
}

function getProfilesBySearchTerm(stations, users, SearchTerm) {
    SearchTerm = SearchTerm.toLowerCase()
    return getProfilesBy(stations, users, clip => clip => clip.title.toLowerCase().includes(SearchTerm))
}

function getProfilesBy(stations, users, predicate) {
    if (!users.length) return
    let matches = {}
    let matchingStations = new Set(
        stations
            .filter(station => {
                let matchedClips = station.clips.filter(predicate)
                matches[station._id] = matchedClips.length
                return matchedClips.length > 0
            })
            .map(station => station._id)
    )
    if (matchingStations.length === 0) return

    return users.map(user => {
        let matchedTerms = 0
        user.createdStations.forEach(station => {
            if (matchingStations.has(station))
                matchedTerms += matches[station]
        })
        if (!matchedTerms) return undefined
        return { ...user, matchedTerms }
    })
        .filter(user => user !== undefined)
        .sort((a, b) => b.matchedTerms - a.matchedTerms)
}