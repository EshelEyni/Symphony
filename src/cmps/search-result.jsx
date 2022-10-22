import React from 'react'
import { useSelector } from 'react-redux'
import { ClipPreview } from './clip-preview'
import { UserSearchResult } from './user-search-result'

export function SearchResult({currStation, clip, idx, type, onAddClip, onPlayClip }) {
    const user = useSelector(state => state.userModule.user)

    if (type === 'search-res') {
        return (
            <div
                className='search-result-container'>
                <ClipPreview
                    type={type}
                    clip={clip}
                    idx={idx}
                    onPlayClip={onPlayClip}
                />
            </div>
        )
    }
    if (type === 'user-search-res') {
        return (
            <UserSearchResult
                clip={clip}
                currStation={currStation}
                onAddClip={onAddClip}
            />
        )
    }
}