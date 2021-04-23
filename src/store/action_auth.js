export const AUTH = 'AUTH'

export function action_auth(auth){
    return {
        type: AUTH,
        auth
    }
}