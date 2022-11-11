
export const clipService = {
    getTimeStr,
    getDuration,
    getFormattedTitle
}

function getTimeStr(currTimeStamp) {
    const formattedTimeStamp = +((Date.now() - currTimeStamp) / 1000).toFixed()
    const minute = 60
    const hour = 60 * minute
    const day = 24 * hour
    const week = 7 * day

    let timeStr
    if (formattedTimeStamp < minute) {
        timeStr = formattedTimeStamp + ' seconds ago'
    }
    if (formattedTimeStamp > minute) {
        timeStr = (formattedTimeStamp / minute).toFixed() + ' minutes ago'
    }
    if (formattedTimeStamp > hour) {
        timeStr = (formattedTimeStamp / hour).toFixed() + ' hours ago'
    }
    if (formattedTimeStamp > day) {
        timeStr = (formattedTimeStamp / day).toFixed() + ' days ago'
    }
    if (formattedTimeStamp > week) {
        timeStr = new Date(currTimeStamp).toLocaleDateString('he-IL')
    }

    return timeStr
}

function getDuration({ min, sec }) {
    const str = min + ':' + (sec < 10 ? '0' + sec : sec)
    return str
}

function getFormattedTitle(clip) {
    if (!clip) return ''

    const { title, artist } = clip
    const lowerJoinedTitle = title.split(' ').join('').toLowerCase()
    const lowerJoinedArtist = artist.split(' ').join('').toLowerCase()

    const isIncluded = lowerJoinedTitle.includes(lowerJoinedArtist)
    if (isIncluded) {
        let newTitle
        const artistIdx = lowerJoinedTitle.indexOf(lowerJoinedArtist)
        const isTitleWithDash = title.includes('-')
        if (isTitleWithDash) {
            return newTitle = artistIdx <= 0 ? title.substring(title.indexOf('-') + 1, title.length) :
                title.substring(0, title.indexOf('-'))
        }
        else {
            return newTitle = artistIdx <= 0 ? title.substring(title.indexOf(' ') + 1, title.length) :
                title.substring(0, title.indexOf(' '))
        }
    }
    else {
        return clip.title
    }
}