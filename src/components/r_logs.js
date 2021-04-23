import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Text, StyleSheet, ScrollView } from 'react-native'

import styles from '../styles.js'

const Auth = ({
    logs
}) => {
    const dispatch = useDispatch()

    const [ kv_loaded, set_kv_loaded ] = useState(false) 

    useEffect(()=>{
        if(!kv_loaded) {
            set_kv_loaded(true)
            Promise.all([
                kv_get(AUTH_EMAIL),
                kv_get(AUTH_PASSWORD),
                kv_get(CONFIG_ENDPOINT)
            ]).then(v=>{
                auth.email = v[0] === null ? '' : v[0]
                auth.password = v[1] === null ? '' : v[1]
                dispatch(action_auth(auth)) 
                config.endpoint = v[2] === null ? CONFIG_ENDPOINT_DEFAULT : v[2]
                dispatch(action_config(config))
            }, e=>{
                console.log(e)
            })
        }     
    })

    return (
        <View style={styles.container}>
            <WhiteSpace size="xl" />
            <WhiteSpace size="xl" />
            <Text style={styles_auth.header}>DANAVATION</Text>
            <WhiteSpace size="sm" />    
            <Text style={styles_auth.version}>{version}</Text>
            <WhiteSpace size="xl" />
            <InputItem value={auth.email} placeholder="Email" clear autoCorrect={false} autoCapitalize="none"
                onChange={e=>{
                    auth.email = e.trim().toLowerCase() 
                    dispatch(action_auth(auth))
                }}
            />
            <InputItem value={auth.password} placeholder="Password" type="password" clear autoCorrect={false}  autoCapitalize="none"
                onChange={e=>{
                    auth.password = e.trim()
                    dispatch(action_auth(auth))
                }}
            />   
            <Button type="warning" style={styles.button}
                onPress={()=>{
                    kv_set(AUTH_EMAIL, auth.email)
                    kv_set(AUTH_PASSWORD, auth.password)
                                        
                    let req = {...v0.auth.req}
                    req.email = auth.email
                    req.password = auth.password
                    fetch(config.endpoint + '/auth_associate', {
                        method: 'POST',
                        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                        body: JSON.stringify(req)
                    })
                    .then(resp => resp.json())
                    .then(json=>{
                        if(json && json.type === v0.AUTH_LOGIN && json.token && json.groups){
                            auth.token = json.token
                            dispatch(action_auth(auth))
                            dispatch(action_groups(json.groups))
                            navigation.navigate('home')
                        }
                    })
                    .catch(err=>console.log(`fetch err - ${err}`))
                    .done()
                }}
            >Login</Button>
            <Text style={styles.link}
                onPress={()=>{
                    navigation.navigate('config')
                }}
            >Config</Text>      
        </View>
    )
}

const styles_auth = StyleSheet.create({
    header: {
        color: 'rgb(233, 79, 79)', 
        fontSize: 26, 
        textAlign: 'center'
    },
    version: {
        color: 'rgb(233, 79, 79)',
        textAlign: 'center',
        fontSize: 14    
    },
})

export default connect((props)=>{
    return {
        auth: props.auth,
        config: props.config,
        groups: props.groups,
    }
})(Auth)