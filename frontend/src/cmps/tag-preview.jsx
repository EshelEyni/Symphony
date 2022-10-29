import { Link } from 'react-router-dom'

export const TagPreview = ({ tag, idx }) => {

    return <section
        className='tag-preview-container'>
        <Link to={'/tag/' + tag.name}>
            <main className='flex column'>
                <h3>{tag.name}</h3>
                <img
                    className='tag-preview-img'
                    src={tag.imgUrl}
                    alt={'tag-preview-img' + idx} />
            </main>
        </Link>
    </section>
}