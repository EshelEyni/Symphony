import { TagPreview } from './tag-preview'

export const TagList = ({ tags }) => {

    return <section className='tag-list grid'>
        {tags.map((tag, idx) => <TagPreview
            key={'tag ' + tag.name}
            tag={tag}
            idx={idx} />)}
    </section>
}