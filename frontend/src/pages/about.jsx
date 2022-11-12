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
            < main className='about'>

                <section className="app-description">
                    <h1>Symphony</h1>
                    <div className="description-container">
                        <p>Symphony is a multilayered music app. With it's search engine and music player Symphony serves the need of the singular music lover.
                            You can like a song,and he will be saved to your personal library under the saved playlist "Liked Songs". You can also create you own playlists, giving you the options to manage your love of music.
                            But that's not all, Symphony also serves as a musical social network. Once you liked a song, Symphony will look for other users who like the same music and showcase them to you, in your home page. You can follow those users and expand your musical horizons. Profiles will also be showcased in the search page, if their playlists includes the search term you were looking for.
                        </p>
                    </div>
                </section>

                <section className='features-list'>
                    <h1>What do we offer?</h1>
                    <button
                        className='back-btn'
                        onClick={() => switchDesc(-1)}>
                        <KeyboardArrowLeftRoundedIcon />
                    </button>
                    <article className='desc-txt-container'>
                        <h1>{currDesc.title}</h1>
                        <p>{currDesc.txt}</p>
                    </article>
                    <button
                        className='next-btn'
                        onClick={() => switchDesc(1)}>
                        <KeyboardArrowRightRoundedIcon />
                    </button>
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