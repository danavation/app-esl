import { AUTH } from './action_auth.js'
import { v0 }   from 'protocol'

const init = {
	email: '',
	password: '',
	token: ''
}

export default function auth(state = init, action){
    switch(action.type){
        case AUTH: return {...action.auth}
        default: return state
    }
}