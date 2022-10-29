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
        <article className='profile-preview' >
            <section className='profile-preview-main-container'>
                <section className='profile-img-container'>
                    <img
                        className='profile-img'
                        src={developer?.imgUrl}
                        alt='user-profile-img' />
                </section>
                <section className='desc-container'>
                    <div>
                        <h4>{developer?.name}</h4>
                    </div>
                    <div>
                        <p className='fs12'>Developer</p>
                    </div>
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