import { clipService } from "../services/clip.service"

export const InStationSearchResult = ({
    clip,
    onAddClip
}) => {

    return (
        <li
            className='sd-search-res-preview flex space-between'>
            <section className='details-container flex'>
                <img className='clip-img' src={clip.img.url} alt='clip-img' />
                <div className='clip-title-container flex column'>
                    <span className='clip-title'>{clipService.getFormattedTitle(clip)}</span>
                    <span className='cp-artist-name'>{clip.artist}</span>
                </div>
            </section>
            <button
                className='sd-search-res-add-btn'
                onClick={() => onAddClip(clip)}
            >
                Add
            </button>
        </li>
    )
}