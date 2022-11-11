import { linkImg } from "../services/about.service"

export const DeveloperPreview = ({
    developer
}) => {

    const links = [
        { href: developer.linkedinUrl, src: linkImg.linkedin, alt: 'linkedin-img' },
        { href: developer.githubUrl, src: linkImg.github, alt: 'github-img' },
        { href: developer.facebookUrl, src: linkImg.facebook, alt: 'facebook-img' },
    ]

    return (
        <article className='developer-preview' >
            <div className='developer-img-container'>
                <img
                    src={developer?.imgUrl}
                    alt='developer-img' />
            </div>
            <div className='desc-container'>
                <h4>{developer?.name}</h4>
                <p>Developer</p>
            </div>
            <div className='dev-link-container'>
                {links.map(link => {
                    return (
                        <a key={link.alt} href={link.href} target='_blank' rel='noreferrer'>
                            <img src={link.src} alt={link.alt} />
                        </a>
                    )
                })}
            </div>
        </article>
    )
}