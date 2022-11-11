import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

export const DropdownBtn = ({
    dropdownBtnRef,
    name,
    setIsDropdown,
    isDropdown
}) => {
    return (
        <div
            className='dropdown-btn-container flex'
            ref={dropdownBtnRef}
            title={'More options for ' + name}
            onClick={() => setIsDropdown(!isDropdown)}>
            <FiberManualRecordIcon />
            <FiberManualRecordIcon />
            <FiberManualRecordIcon />
        </div>
    )
}