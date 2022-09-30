import { useEffect, useState } from "react"
import { TagPreview } from "./tag-preview"

export const TagList = ({ stations }) => {
    let [tagListToDisplay, setTagsListToDisplay] = useState([])

    useEffect(() => {
        let tagList = new Set()
        stations?.forEach(station => {
            const { tags } = station
            if (tags !== null && tags?.length > 0) {
                tags.forEach(tag => tagList.add(tag))
            }
        })
        tagList = Array.from(tagList)
        setTagsListToDisplay(tagList)
    }, [stations])

    return <section className='tag-list grid'>
        {tagListToDisplay.map((tag, idx) => <TagPreview
            key={'tag' + idx}
            tag={tag} 
            idx={idx}/>)}
    </section>
}