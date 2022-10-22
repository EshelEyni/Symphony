import { defaultHeaderBgcolor } from '../services/bg-color.service'

const initialState = {
    headerBgcolor: defaultHeaderBgcolor
}

export function appHeaderReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_BGCOLOR':
            return { ...state, headerBgcolor: action.color }
        default:
            return state
    }
}
