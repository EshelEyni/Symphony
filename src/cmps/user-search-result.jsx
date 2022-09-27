
export const UserSearchResult = ({ clip, onAddClip }) => {

    return (
        <li
            className='search-res flex'>
            <div className='search-res-content-container flex'>
                <img className='clip-img' src={clip.img.url} />
                <div className='clip-title'>
                    {clip.title}
                </div>
            </div>
            <div className='artist-name'>{clip.artist}</div>

            <div>
                <button
                    className='search-res-add-btn'
                    onClick={() => onAddClip(clip)}
                >
                    Add
                </button>
            </div>
        </li>
    )
}


