import { GROUPS } from './action_groups.js'

export default function groups(state = [], action){
    switch(action.type){
        case GROUPS: return action.groups
        default: return state
    }
}