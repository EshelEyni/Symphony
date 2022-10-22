export const UserSearchResult = ({ clip, onAddClip }) => {

    return (
        <li
            className='search-res flex'>
            <section className='search-res-content-container flex'>
                <img className='clip-img' src={clip.img.url} alt='clip-img' />
                <span className='clip-title'>
                    {clip.title}
                </span>
            </section>
            <span className='artist-name'>{clip.artist}</span>

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