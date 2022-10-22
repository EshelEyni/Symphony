export function setHeaderBgcolor(color) {
    return async (dispatch) => {
        try {
            dispatch({ type: 'SET_BGCOLOR', color })
        } catch (err) {
            console.log('Cannot set background', err)
        }
    }
}
