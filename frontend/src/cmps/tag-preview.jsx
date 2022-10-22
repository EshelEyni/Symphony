import { Link } from 'react-router-dom'
import { tagImgs } from '../services/search.service'

export const TagPreview = ({ tag, idx }) => {

    return <section
        className='tag-preview-container'>
        <Link to={'/tag/' + tag}>
            <main className='tag-preview-main-container flex column'>
                <h3>{tag}</h3>
                <img
                    className='tag-preview-img'
                    src={tagImgs[idx]}
                    alt={'tag-preview-img' + idx} />
            </main>
        </Link>
    </section>
}