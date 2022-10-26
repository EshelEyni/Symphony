export const profileService = {
    getUserProfiles,
    getProfilesByArtist,
    getProfilesBySearchTerm
}


function getUserProfiles(users, currUser, filterBy, artists) {
    if (!currUser) return []
    const profilesList = users
    let filteredProfilesList = []

    switch (filterBy) {
        case 'likes':
            const loggedInUserLikedSongsIds = new Set(currUser.likedSongs.clips?.map(likedSong => likedSong?._id))
            filteredProfilesList = profilesList
                .filter(user => user._id !== currUser._id)
                .map(user => {
                    let matchedLikes = 0
                    for (let y = 0; y < user.likedSongs.clips?.length; y++) {
                        if (loggedInUserLikedSongsIds.has(user.likedSongs.clips[y]._id)) {
                            matchedLikes++
                        }
                    }
                    return { ...user, matchedLikes }
                })
                .filter(user => user.matchedLikes > 0 && !user.followers.includes(currUser._id))
                .sort((a, b) => b.matchedLikes - a.matchedLikes)

            return filteredProfilesList

        case 'following':
            currUser.following.forEach(followedProfileId => {
                const usersArtistsList = [...users, ...artists]
                const currFollowedUser = usersArtistsList.find(user => user._id === followedProfileId)
                if (!currFollowedUser) return
                filteredProfilesList.push(currFollowedUser)
            })
            return filteredProfilesList

        case 'followers':
            currUser.followers.forEach(followerProfileId => {
                const currFollowerUser = profilesList.find(user => user._id === followerProfileId)
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

function getProfilesBySearchTerm(stations, users, SearchTerm){
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