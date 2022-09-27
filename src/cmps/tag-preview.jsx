import { utilService } from "../services/util.service"
import { Link } from 'react-router-dom'

export const TagsPreview = ({ tag }) => {
    const albumImgUrl = 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664247346/pngwing.com_7_ine1ah.png'

    return <div
        style={{ backgroundColor: utilService.getRandomColor() }}
        className='tag-preview-container flex column'>
        <Link to={'/tag/' + tag}>
            <h1>{tag}</h1>
            <img
                className="tag-preview-img"
                src={albumImgUrl}
                alt="tag-preview-img" />
        </Link>
    </div>
}