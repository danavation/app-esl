import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { Text, StyleSheet, View } from 'react-native'
import { WhiteSpace, WingBlank, Button, InputItem, List } from '@ant-design/react-native'
import { AUTH_EMAIL, AUTH_PASSWORD, CONFIG_ENDPOINT, CONFIG_ENDPOINT_DEFAULT, kv_set, kv_get } from '../utilities.js'
import { version } from '../../package.json'

import { action_auth } from '../store/action_auth.js'
import { action_config } from '../store/action_config.js'
import { action_groups } from '../store/action_groups.js'

import styles from '../styles.js'

const AUTH_LOGIN = "AUTH_LOGIN"

const Auth = ({
    auth,
    config,
    groups,
    navigation
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
                onPress={_=>{

                    kv_set(AUTH_EMAIL, auth.email)
                    kv_set(AUTH_PASSWORD, auth.password)  

                    fetch(config.endpoint + '/auth', {
                        method: 'POST',
                        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                        body: JSON.stringify({email: auth.email, password: auth.password})
                    })
                    .then(resp => resp.json())
                    .then(json=>{
                        if(json && json.type === AUTH_LOGIN && json.token && json.groups){
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
            <WhiteSpace size="xl" />
            <Text style={styles.link} onPress={_=>navigation.navigate('config')}>Config</Text>      
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