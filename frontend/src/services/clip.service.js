
export const clipService = {
    getTimeStr,
    getDuration,
    getFormattedTitle
}

function getTimeStr(currTimeStamp, formattedTimeStamp) {
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

    const isIncluded = title.split(' ').join('').toLowerCase().includes(artist.split(' ').join('').toLowerCase())
    if (isIncluded) {
        let newTitle
        const artistIdx = title.split(' ').join('').toLowerCase().indexOf(artist.split(' ').join('').toLowerCase())
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