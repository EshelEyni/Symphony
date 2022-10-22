export const getTimeFormat = (duration) => {
    let min = Math.floor(duration / 60)
    let sec = Math.ceil(duration % 60)
    if (sec < 10) sec = '0' + sec
    if (sec === 60) {
        sec = '00'
        min++
    }
    return (min + ':' + sec)
}

export const createMiniMediaPlayer = (clip) => {
    return (
        `  
        // Place this pointer at your desired destination
        { MiniMediaPlayerFor${clip.title}}
        
        const MiniMediaPlayerFor${clip.title} = () => {
            let [currTime, setCurrTime] = useState()
            let [isPlaying, setIsPlaying] = useState(false)
            let [playerFunc, setplayerFunc] = useState()
            let [clipLength, setClipLength] = useState()
            let intervalId = useRef()

            const handleChange = ({ target }) => {
                setCurrTime(target.value)
                setIsPlaying(true)
                playerFunc.seekTo(target.value)
            }

            const onReady = async (event) => {
                playerFunc = event.target
                clipLength = playerFunc.getDuration()
                setplayerFunc(playerFunc)
                setClipLength(clipLength)
            }

            const getTime = async () => {
                currTime = await playerFunc.getCurrentTime()
                setCurrTime(currTime)
            }

            const onTogglePlay = () => {
                if (isPlaying) {
                    clearInterval(intervalId.current)
                    playerFunc.pauseVideo()
                }
                if (!isPlaying) {
                    intervalId.current = setInterval(getTime, 750)
                    playerFunc.playVideo()
                    if (currTime) playerFunc.seekTo(currTime)
                }
                setIsPlaying(!isPlaying)
            }

            const getTimeFormat = (duration) => {
                let min = Math.floor(duration / 60)
                let sec = Math.ceil(duration % 60)
                if (sec < 10) sec = '0' + sec
                if (sec === 60) {
                    sec = '00'
                    min++
                }
                return (min + ':' + sec)
            }

            const opts = {
                height: '0',
                width: '0',
                playerVars: {
                    autoplay: isPlaying ? 1 : 0,
                }
            }

            return (
                <div className="mini-media-player-container">
                <img src={'${clip.img.url}'} alt="mini-player-img" />
                    <YouTube
                        videoId={'${clip._id}'}
                        opts={opts}
                        onPlay={() => getTime()}
                        onReady={onReady} />
                    <div className='action-btn stream-line-container'>
                        <label htmlFor='stream-line-input'></label>
                        <input
                            name='stream-line'
                            className='stream-line-input'
                            size='medium'
                            value={currTime || 0}
                            max={+clipLength || 0}
                            onChange={handleChange}
                            type='range' />
                        <span className='track-time'>{getTimeFormat(clipLength || 0)}</span>
                    </div>
                    <button className={'play-btn ' + (isPlaying ? 'fas fa-pause' : 'fas fa-play playing')}
                        onClick={onTogglePlay}></button>
                </div>
            )
        }
        `

    )
}