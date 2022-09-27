import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { loadStations } from "../store/station.actions"
import { TagsPreview } from "./tag-preview"

export const TagsList = ({ stations }) => {

    // let stations = useSelector(state => state.stationModule.stations)
    let [tagListToDisplay, setTagsListToDisplay] = useState([])
    const dispatch = useDispatch()


    useEffect(() => {
        // dispatch(loadStations())
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

    return <section className='tags-list grid'>
        {tagListToDisplay.map((tag, idx) => <TagsPreview
            key={'tag' + idx}
            tag={tag} />)}
    </section>
}