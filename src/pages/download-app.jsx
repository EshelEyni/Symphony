import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { defaultHeaderBgcolor } from '../services/bg-color.service'
import { setHeaderBgcolor } from "../store/app-header.actions"

export const DownloadApp = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setHeaderBgcolor(defaultHeaderBgcolor))
    }, [])

    return (
        <div>
            <h1>
                Download App
            </h1>
            <div>
                DOWNLOAD LINK
            </div>
        </div>
    )
}