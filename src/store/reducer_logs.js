import { LOGS } from './action_logs.js'

export default function logs(state = [], action){
    switch(action.type){
        case LOGS: return action.logs
        default: return state
    }
}