// Default Bgcolors
export const defaultHeaderBgcolor = '#1A1A1A'
// export const stationHeaderDefaultBgcolor = '#03435C'
export const likedSongsBgcolor = '#4723B3'
export const defaultGreenColor = '#1db954'
export const defaultLightGreenColor = '#3dd773bd'
export const defaultBlueColor = '#3f7ef4'
export const defaultBgcolor = '#121212'
export const defaultProfileBgcolor = '#646462'

export const setBackgroundColor = async (objectToUpdate, cb) => {
    try {
        objectToUpdate.bgColor = await computeColor(objectToUpdate.imgUrl)
        if (cb) cb(objectToUpdate.bgColor)
    }
    catch (err) {
        console.log('failed to compute color for img: ', err)
    }
}


const computeColor = (url) => {
    return new Promise((resolve, reject) => {
        var img = new Image()
        img.crossOrigin = 'Anonymous'
        img.onerror = (e) => { reject(e) }
        img.onload = () => {
            var canvas = new OffscreenCanvas(img.width, img.height)

            var context = canvas.getContext('2d')
            context.drawImage(img, 0, 0)
            var imageData = context.getImageData(0, 0, canvas.width, canvas.height)
            // Convert the image data to RGB values so its much simpler
            const rgbArray = buildRgb(imageData.data)
            /**
             * Color quantization
             * A process that reduces the number of colors used in an image
             * while trying to visually maintin the original image as much as possible
             */
            const quantColors = quantization(rgbArray, 0)
            // Create the HTML structure to show the color palette
            var color = pickPrimaryColor(quantColors)
            resolve(color)
        }
        try {
            img.src = url
        } catch (error) {
            reject(error)
        }
    })
}

const pickPrimaryColor = (colorsList) => {
    var colorCount = {}
    var colorToRgb = {}
    colorToRgb[rgbToHex(colorsList[0])] = colorsList[0]
    colorCount[rgbToHex(colorsList[0])] = 1
    for (let index = 1; index < colorsList.length; index++) {
        const element = rgbToHex(colorsList[index])
        colorToRgb[element] = colorsList[index]
        var key = Object.keys(colorCount).find(cur => {
            const difference = calculateColorDifference(
                colorToRgb[cur],
                colorsList[index]
            )
            return difference < 120
        })
        if (!key) {
            colorCount[element] = 1
        }
        else {
            colorCount[key]++
            colorToRgb[element] = colorsList[index]
        }
    }

    //*****************************************************YOU CAN DELETE COLORS HERE*******************************************//
    delete colorCount['#000000']
    delete colorCount['#FFFFFF']
    delete colorCount['#F4F4F4']
    delete colorCount['#00080B']
    delete colorCount['#FAFAFA']
    delete colorCount['#EAEBE6']
    delete colorCount['#FAF8F7']
    delete colorCount['#FCFEF6']
    delete colorCount['#E3E3DE']


    //**************************************************************************************************************************//

    var primary = Object.keys(colorCount).reduce((prev, cur) => {
        if (colorCount[cur] > prev.count)
            return { color: cur, count: colorCount[cur] }
        return prev
    }, { color: '', count: 0 })

    return primary.color
}

//  Convert each pixel value ( number ) to hexadecimal ( string ) with base 16
const rgbToHex = (pixel) => {
    const componentToHex = (c) => {
        const hex = c.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }

    return (
        '#' +
        componentToHex(pixel.r) +
        componentToHex(pixel.g) +
        componentToHex(pixel.b)
    ).toUpperCase()
}


const buildRgb = (imageData) => {
    const rgbValues = []
    // note that we are loopin every 4!
    // for every Red, Green, Blue and Alpha
    for (let i = 0; i < imageData.length; i += 4) {
        const rgb = {
            r: imageData[i],
            g: imageData[i + 1],
            b: imageData[i + 2],
        }

        rgbValues.push(rgb)
    }

    return rgbValues
}

/**
 * Calculate the color distance or difference between 2 colors
 *
 * further explanation of this topic
 * can be found here -> https://en.wikipedia.org/wiki/Euclidean_distance
 * note: this method is not accuarate for better results use Delta-E distance metric.
 */
const calculateColorDifference = (color1, color2) => {
    const rDifference = Math.pow(color2.r - color1.r, 2)
    const gDifference = Math.pow(color2.g - color1.g, 2)
    const bDifference = Math.pow(color2.b - color1.b, 2)

    return rDifference + gDifference + bDifference
}

// returns what color channel has the biggest difference
const findBiggestColorRange = (rgbValues) => {
    /**
     * Min is initialized to the maximum value posible
     * from there we procced to find the minimum value for that color channel
     *
     * Max is initialized to the minimum value posible
     * from there we procced to fin the maximum value for that color channel
     */
    let rMin = Number.MAX_VALUE
    let gMin = Number.MAX_VALUE
    let bMin = Number.MAX_VALUE

    let rMax = Number.MIN_VALUE
    let gMax = Number.MIN_VALUE
    let bMax = Number.MIN_VALUE

    rgbValues.forEach((pixel) => {
        rMin = Math.min(rMin, pixel.r)
        gMin = Math.min(gMin, pixel.g)
        bMin = Math.min(bMin, pixel.b)

        rMax = Math.max(rMax, pixel.r)
        gMax = Math.max(gMax, pixel.g)
        bMax = Math.max(bMax, pixel.b)
    })

    const rRange = rMax - rMin
    const gRange = gMax - gMin
    const bRange = bMax - bMin

    // determine which color has the biggest difference
    const biggestRange = Math.max(rRange, gRange, bRange)
    if (biggestRange === rRange) {
        return 'r'
    } else if (biggestRange === gRange) {
        return 'g'
    } else {
        return 'b'
    }
}

/**
 * Median cut implementation
 * can be found here -> https://en.wikipedia.org/wiki/Median_cut
 */
const quantization = (rgbValues, depth) => {
    const MAX_DEPTH = 4

    // Base case
    if (depth === MAX_DEPTH || rgbValues.length === 0) {
        const color = rgbValues.reduce(
            (prev, curr) => {
                prev.r += curr.r
                prev.g += curr.g
                prev.b += curr.b

                return prev
            },
            {
                r: 0,
                g: 0,
                b: 0,
            }
        )

        color.r = Math.round(color.r / rgbValues.length)
        color.g = Math.round(color.g / rgbValues.length)
        color.b = Math.round(color.b / rgbValues.length)

        return [color]
    }

    /**
     *  Recursively do the following:
     *  1. Find the pixel channel (red,green or blue) with biggest difference/range
     *  2. Order by this channel
     *  3. Divide in half the rgb colors list
     *  4. Repeat process again, until desired depth or base case
     */
    const componentToSortBy = findBiggestColorRange(rgbValues)
    rgbValues.sort((p1, p2) => {
        return p1[componentToSortBy] - p2[componentToSortBy]
    })

    const mid = rgbValues.length / 2
    return [
        ...quantization(rgbValues.slice(0, mid), depth + 1),
        ...quantization(rgbValues.slice(mid + 1), depth + 1),
    ]
}
