export const setArtistStation = (station) => {
    const clip = station.clips[0]
    station.name = clip.artist
    station.isArtist = true
    return station
}

export const addTag = (station) => {
    const tag = prompt('Enter tag...')
    if (!tag) return alert('Can not enter an empty tag...')
    station.tags.push(tag)
    return station
}

export const addDesc = (station) => {
    const desc = prompt('Enter desc...')
    if (!desc) return alert('Can not enter an empty description...')
    station.desc = (desc)
    return station
}   