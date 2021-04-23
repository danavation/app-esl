export const LOGS = 'LOGS'

export function action_logs(logs){
    return {
        type: LOGS,
        logs
    }
}