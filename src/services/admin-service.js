export const setAdminMode = (station) => {
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