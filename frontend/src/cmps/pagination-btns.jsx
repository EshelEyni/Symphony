import { useNavigate } from 'react-router-dom'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'

export const PaginationBtns = () => {
    const navigate = useNavigate()

    return (
        <section className='pagination-btn-container flex'>
            <button
                onClick={() => navigate(-1)}
                className='pagination-btn'>
                <ArrowBackIosNewRoundedIcon />
            </button>
            <button
                onClick={() => navigate(1)}
                className='pagination-btn'>
                <ArrowForwardIosRoundedIcon />
            </button>
        </section>
    )
}