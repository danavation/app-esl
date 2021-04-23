export const CONFIG = 'CONFIG'

export function action_config(config){
    return {
        type: CONFIG,
        config
    }
}