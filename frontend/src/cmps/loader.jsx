import { defaultImg } from "../services/user.service"

export const Loader = ({ loaderType, size }) => {
    return (
        <section className={loaderType}>
            <img
                className={size + ' loader-img'}
                src={defaultImg}
                alt='loader-img' />
        </section>
    )
}