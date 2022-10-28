import { useNavigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

export const PaginationBtns = () => {
    const navigate = useNavigate()

    const theme = createTheme({
        palette: {
            primary: {
                main: '#92D3C3'
            }
        }
    })

    return (
        <div className='pagination-btn-container flex'>
            <ThemeProvider theme={theme}>
                <button
                    onClick={() => navigate(-1)}
                    className='arrow'><ArrowBackIosNewIcon sx={{
                        fontSize: '24px',
                    }} /></button>
            </ThemeProvider>
            <ThemeProvider theme={theme}>
                <button
                    onClick={() => navigate(1)}
                    className='arrow'><ArrowForwardIosIcon sx={{
                        fontSize: '24px',
                    }} /></button>
            </ThemeProvider>
        </div>

    )
}