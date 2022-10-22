import { defaultHeaderBgcolor } from "../services/bg-color.service"

const initialState = {
    color: defaultHeaderBgcolor
}

export function appHeaderReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_BGCOLOR':
            return { ...state, color: action.color }
        default:
            return state
    }
}
