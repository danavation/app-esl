import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { StyleSheet, View } from 'react-native'
import { Button, InputItem } from '@ant-design/react-native'

import { kv_set, kv_get, CONFIG_ENDPOINT } from '../utilities.js'

import { action_config } from '../store/action_config.js'

import styles from '../styles.js'

const Config = ({
    config,
    navigation
}) => {
    const dispatch = useDispatch()

    return (
        <View style={styles.container}>
            <InputItem value={config.endpoint} placeholder="Base endpoint" clear autoCorrect={false}  autoCapitalize="none"
                onChange={e=>{
                    config.endpoint = e.trim().toLowerCase() 
                    dispatch(action_config({...config}))
                }}
            />
            <Button type="warning" style={styles.button}
                onPress={()=>{
                    kv_set(CONFIG_ENDPOINT, config.endpoint)
                    navigation.goBack()
                }}
            >Update</Button>
        </View>
    )
}

export default connect((props)=>{
    return {
        config: props.config
    }
})(Config)