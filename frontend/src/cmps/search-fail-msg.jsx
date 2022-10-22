export const SearchFailMsg = ({searchTerm}) => {
    return (
        <section>
            <p>Your search - {searchTerm} - didn't match any of our songs.</p>
            <ul>Suggsetions:
                <li>● Make sure that all words are spelled correctly.</li>
                <li>● Try different keywords.</li>
                <li>● Try more general keywords.</li>
            </ul>
        </section>
    )
}