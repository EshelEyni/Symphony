
const bgcs = ['pink', 'orange', 'green', 'blue']
let prevIdx

function makeId(length = 5) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var txt = ''
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}


function getBgc() {
    let currIdx = _getRandomIntInclusive(0, 3)
    if (currIdx === prevIdx) currIdx++
    prevIdx = currIdx
    let bgc = bgcs[currIdx]
    return bgc
}

module.exports = {
    makeId,
    getBgc
}