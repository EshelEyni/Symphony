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
            <section className='developer-preview-main-container'>
                <section className='developer-img-container'>
                    <img
                        className='developer-img'
                        src={developer?.imgUrl}
                        alt='developer-img' />
                </section>
                <section className='desc-container'>
                    <h4>{developer?.name}</h4>
                    <p className='fs12'>Developer</p>
                    <section className='dev-link-container flex'>
                        {links.map(link => {
                            return (
                                <a key={link.alt} href={link.href} target='_blank' rel='noreferrer'>
                                    <img src={link.src} alt={link.alt} />
                                </a>
                            )
                        })}
                    </section>
                </section>
            </section>
        </article>
    )
}