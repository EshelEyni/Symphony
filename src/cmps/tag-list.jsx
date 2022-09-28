import { useEffect, useState } from "react"
import { TagsPreview } from "./tag-preview"

export const TagsList = ({ stations }) => {
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

    const arrayOfTagsImg=[
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370807/spotify/soothing_nwhnxy.jpg',
''
    ]

    return <section className='tags-list grid'>
        {tagListToDisplay.map((tag, idx) => <TagsPreview
            key={'tag' + idx}
            tag={tag} 
            idx={idx}/>)}
    </section>
}