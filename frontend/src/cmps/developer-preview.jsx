export const DeveloperPreview = ({
    developer
}) => {
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
                </section>
            </section>
        </article>
    )
}