import { useState } from 'react'
import { DropdownProfile } from './dropdown-profile'
import { DropdownStation } from './dropdown-station'
import { DropdownClip } from './dropdown-clip'

export const Dropdown = ({
    isDropdown,
    setIsDropdown,
    isEdit,
    setIsEdit,

    isProfileDropDown,
    isFollowedProfile,
    setIsFollowedProfile,
    onToggleFollowProfile,

    isAdminMode,
    currStation,
    isUserStation,
    onSaveSearchStation,
    onTogglePublicStation,
    onRemoveStation,

    isUserClip,
    artists,
    isClipDropdown,
    currClip,
    onRemoveClip,
    onAddClip

}) => {

    const [isDeleteClicked, setIsDeleteClicked] = useState(false)

    const getShareTxt = () => {
        if (isProfileDropDown) return 'Copy link to profile'
        else return 'Copy link to playlist'
    }

    return (
        <ul className='dropdown'>
            {isDropdown &&
                <div className='shadow-screen'
                    onClick={() => {
                        setIsDropdown(false)
                    }}
                ></div>}

            {isProfileDropDown && <DropdownProfile
                isFollowedProfile={isFollowedProfile}
                setIsFollowedProfile={setIsFollowedProfile}
                onToggleFollowProfile={onToggleFollowProfile}
                isDeleteClicked={isDeleteClicked}
                setIsDeleteClicked={setIsDeleteClicked}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                isDropdown={isDropdown}
                setIsDropdown={setIsDropdown}
                isProfileDropDown={isProfileDropDown}

            />}

            {(isUserStation || isAdminMode) &&
                <DropdownStation
                    isDropdown={isDropdown}
                    setIsDropdown={setIsDropdown}
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    isDeleteClicked={isDeleteClicked}
                    setIsDeleteClicked={setIsDeleteClicked}
                    currStation={currStation}
                    isUserStation={isUserStation} // check if needed
                    onSaveSearchStation={onSaveSearchStation}
                    onTogglePublicStation={onTogglePublicStation}
                    onRemoveStation={onRemoveStation}
                />}

            {!isClipDropdown && <li
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    setIsDropdown(!isDropdown)
                }}>{getShareTxt()}</li>}


            {isClipDropdown &&
                <DropdownClip
                    isAdminMode={isAdminMode}
                    setIsDropdown={setIsDropdown}
                    isUserClip={isUserClip}
                    artists={artists}
                    currClip={currClip}
                    onRemoveClip={onRemoveClip}
                    onAddClip={onAddClip}
                />}
        </ul>
    )
}


