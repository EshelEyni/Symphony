import { useNavigate } from 'react-router-dom'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'

export const PaginationBtns = () => {
    const navigate = useNavigate()

    return (
        <div className='pagination-btn-container flex'>
            <button
                onClick={() => navigate(-1)}
                className='pagination-btn'>
                <div className='flex align-center justify-center'>
                    <ArrowBackIosNewRoundedIcon />
                </div>
            </button>
            <button
                onClick={() => navigate(1)}
                className='pagination-btn'>
                <div className='flex align-center justify-center'>
                    <ArrowForwardIosRoundedIcon />
                </div>
            </button>
        </div>
    )
}