export const setAdminMode = (station) => {
    station.createdBy.fullname = 'Symphony'
    station.createdBy.username = 'Symphony Admin'
    station.createdBy._id = 'A101'

    return station

}

export const setArtistStation = (station) => {
    const clip = station.clips[0]
    station.name = clip.artist
    station.imgUrl = clip.img.url
    station.isArtist = true
    return station
}

// export const getArtistStations = (stations) => {
//     return stations.filter(station => station.isArtist)
// }

export const addTag = (station) => {
    station.tags.push(prompt('Enter tag...'))
    return station
}


export const addDesc = (station) => {
    station.desc = (prompt('Enter desc...'))
    return station
}