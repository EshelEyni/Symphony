import { utilService } from "../services/util.service"
import { Link } from 'react-router-dom'

export const TagPreview = ({ tag, idx }) => {
    const albumImgUrl = 'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664247346/pngwing.com_7_ine1ah.png'
    const arrayOfTagsImg = [
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370807/spotify/soothing_nwhnxy.jpg',
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370807/spotify/quiet_a0pcc9.jpg',
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370808/spotify/rock_wr6zfq.jpg',
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664377614/spotify/loud-music_yz2ucp.jpg',
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370807/spotify/pop_hjlfb3.jpg',
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664380523/spotify/happy_grrw9u.jpg',
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370806/spotify/beatles_f9josj.jpg',
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370805/spotify/60s_xveydc.jpg',
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370806/spotify/funk_nwpzz5.jpg',
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370807/spotify/rhytm_l87rkp.jpg',
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370807/spotify/hiphop_xf6lee.jpg',
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370805/spotify/90s_xtfhyo.jpg',
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370805/spotify/aggressive_mda8b1.jpg',
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370806/spotify/distortion_xipbyw.jpg',
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370807/spotify/metal_iqji5n.jpg',
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370807/spotify/love_wxy5j8.jpg',
        'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664247346/pngwing.com_7_ine1ah.png',
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370806/spotify/dance_sju1w9.jpg',
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370806/spotify/electronic_ex1zjg.jpg',
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664380057/spotify/israeli_ljbhro.jpg',
        'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664247346/pngwing.com_7_ine1ah.png',
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370808/spotify/top_uyvero.jpg',
        'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664247346/pngwing.com_7_ine1ah.png',
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370806/spotify/billabord_amriev.jpg',
        'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664247346/pngwing.com_7_ine1ah.png',
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664376199/spotify/contest_rvrvwm.jpg',
        'https://res.cloudinary.com/dmjfqerbm/image/upload/v1664370806/spotify/eurovision_rsrbb8.jpg',
        'https://res.cloudinary.com/dng9sfzqt/image/upload/v1664247346/pngwing.com_7_ine1ah.png'
    ]

    return <div
        className='tag-preview-container flex column'>
        <Link to={'/tag/' + tag}>
            <h3>{tag}</h3>
            <img
                className="tag-preview-img"
                src={arrayOfTagsImg[idx]}
                alt={"tag-preview-img" + idx} />
        </Link>
    </div>
}