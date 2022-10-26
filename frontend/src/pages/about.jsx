import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Loader } from '../cmps/loader'
import { DeveloperPreview } from '../cmps/developer-preview'
import { appDesc, team } from '../services/about.service'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'

export const About = () => {

    const [developers, setDevelopers] = useState(team)
    const [currDesc, setCurrDesc] = useState(appDesc[0])

    function handleOnDragEnd(res) {
        if (!res.destination) return
        const items = Array.from(developers)
        const [reorderedItem] = items.splice(res.source.index, 1)
        items.splice(res.destination.index, 0, reorderedItem)
        setDevelopers(items)
    }

    const switchDesc = (switchNum) => {
        const currDescIdx = appDesc.findIndex(desc => desc.title === currDesc.title)
        let nextIdx = currDescIdx + switchNum
        if (nextIdx > appDesc.length - 1) nextIdx = 0
        if (nextIdx < 0) nextIdx = appDesc.length - 1
        setCurrDesc({ ...appDesc[nextIdx] })
    }


    if (!developers.length) {
        return <Loader
            size={'large-loader'}
            loaderType={'page-loader'} />
    }

    if (developers.length > 0) {
        return (
            < main >

                <section className='flex align-center column'>
                    <h1>Clean Code Follow Up</h1>
                    <ul>
                        <li>AppHeader ✅</li>
                        <li>SideBar ✅</li>
                        <li>UserMsg ✅</li>
                        <li>MediaPlayer ✅</li>
                        <li>SymphonyApp ✅</li>
                        <li>TagsDetails ✅</li>
                        <li>About ✅</li>
                        <li>Login ✅</li>
                        <li>Signup ✅</li>
                        <li>ProfileDetails</li>
                        <li>ArtistDetails</li>
                        <li>FollowersDetails</li>
                        <li>FollowingDetails</li>
                        <li>Search ✅</li>
                        <li>StationDetails ✅</li>
                        <li>LikedSongs ✅</li>
                        <li>Library ✅</li>
                        <li>Queue</li>
                    </ul>
                </section>

                <section className='app-desc flex column align-center'>
                    <h1>What do we offer?</h1>
                    <article className='desc-container flex'>
                        <button onClick={() => switchDesc(-1)}><KeyboardArrowLeftRoundedIcon sx={{ fontSize: '75px' }} /></button>
                        <section>
                            <h1>{currDesc.title}</h1>
                            <p>{currDesc.txt}</p>
                        </section>
                        <button onClick={() => switchDesc(1)}><KeyboardArrowRightRoundedIcon sx={{ fontSize: '75px' }} /></button>
                    </article>
                </section>

                <section className="developers">
                    <h1>Our Team</h1>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId='developers-container' direction='horizontal'>
                            {(provided) => (
                                <section
                                    className='developers-container'
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}>
                                    {developers.map((developer, idx) => {
                                        return (
                                            <Draggable
                                                key={developer._id}
                                                draggableId={developer._id}
                                                index={idx}>
                                                {(provided) => (
                                                    <section
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}>
                                                        <DeveloperPreview
                                                            developer={developer}
                                                        />
                                                    </section>
                                                )}
                                            </Draggable>
                                        )
                                    })}
                                    {provided.placeholder}
                                </section>
                            )}
                        </Droppable>
                    </DragDropContext>
                </section>
            </main >
        )
    }
}