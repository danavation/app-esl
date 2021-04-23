import { CONFIG } from './action_config.js'

let init = {
	endpoint: 'http://saas.danavation.com/v0/http'
}

export default function config(state = init, action){
    switch(action.type){
        case CONFIG: return {...action.config}
        default: return state
    }
}