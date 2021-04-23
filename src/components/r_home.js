import React, { useEffect, useState, useRef } from 'react'
import { connect, useDispatch } from 'react-redux'
import { StyleSheet, ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native'
import { WhiteSpace, WingBlank, List, Button, InputItem, SwipeAction, Accordion, Flex, Toast, Card } from '@ant-design/react-native'
import { IconFill } from '@ant-design/icons-react-native'
import { Picker } from '@react-native-picker/picker'
import base64 from 'base-64' 

const SEARCH_KEYWORD = 'SEARCH_KEYWORD'
const SEARCH_GTIN12 = 'SEARCH_GTIN12'
const SEARCH_GTIN13 = 'SEARCH_GTIN13'
const SEARCH_LABEL = 'SEARCH_LABEL'

import styles from '../styles.js'

let flag = false, input = '', interval

const Home = ({
    auth,
    config,
    groups,
    navigation,
}) => {

    const ref_search = useRef(null)

    const [ keyword, set_keyword ] = useState('')
    const [ group_id, set_group_id ] = useState(groups.length > 0 ? groups[0]._id : '')
    
    const [ items, set_items ] = useState([])
    
    const [ item_id, set_item_id ] = useState('')
    const [ label, set_label ] = useState({_id: '', item_id: ''})

    const [ queue, set_queue ] = useState([])
    const [ token_check_active, set_token_check_active ] = useState(false)

    const headers = { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json', 
        'Authorization': 'Basic ' + base64.encode(auth.email + ':' + auth.token)
    }

    const verify_search = (str_search) => {
        let type = SEARCH_KEYWORD
        if(/^[0-9]{12}?$/.test(str_search)){
            type = SEARCH_GTIN12
        } else if(/^[0-9]{13}?$/.test(str_search)) {
            type = SEARCH_GTIN13
        } else if (
            /^[0-9a-fA-F]{8}?$/.test(str_search) || 
            /^[0-9a-fA-F]{6}?$/.test(str_search)
        ) {
            type = SEARCH_LABEL
        }
        return type
    } 

    const search = (str_keyword) => {
        fetch(`${config.endpoint}/group/${group_id}/search/${str_keyword}/0/10`, {method: 'GET', headers})
        .then(resp => resp.json())
        .then(json => {
            if(json && json[0]){
                console.log('json[0]', json[0])
                // console.log('esl_items.length', json[0].esl_items.length, 'esl_labels.length', json[0].esl_labels.length)
                set_items(json[0].esl_items)
                if(json[0].esl_items.length > 0)
                    set_item_id(json[0].esl_items[0]._id) 
                // if(json[0].esl_labels.length > 0)
                //     set_label(json[0].esl_labels[0])
            }
        })
        .catch(err=>console.log(`fetch err - ${err}`))
        .done()   
    }

    useEffect(()=>{

        // if(interval)
        //     clearInterval(interval)
        // interval = setInterval(_=>{
        //     console.log('queue', queue)
        //     if(queue.length > 0){
        //         let task = queue[0]
        //         fetch(`${config.endpoint}/log/label/${task.label_id}/token/${task.token}`, {method: 'GET', headers})
        //         .then(resp=>{if(resp.status === 200) return resp.json(); else throw resp })
        //         .then(json=>{
        //             if(json.length > 0 && json[0].extra.status){ 
        //                 queue.splice(0, 1)
        //                 set_queue(queue)
        //             }
        //         })
        //         .catch(res=>{if(res.status === 401) navigation.navigate('auth'); else console.log(res)})
        //         .done()
        //     }
        // }, 10000) 

    })

    return (
        <ScrollView>
            <InputItem ref={ref_search} style={{borderWidth:0}} value={keyword} placeholder="Search" editable={true} clear autoCorrect={false} autoCapitalize="none"
                onChange={e=>{
                    switch(verify_search(e)){
                        case v0.SEARCH_GTIN13:
                        case v0.SEARCH_GTIN12:
                            search(e)
                            set_keyword('')
                            ref_search.current.focus()
                        break
                        case v0.SEARCH_LABEL:
                            search(e)
                            set_label({_id: e})
                            set_keyword('')
                            ref_search.current.focus()
                        break
                        case v0.SEARCH_KEYWORD:
                            set_keyword(e)
                        break
                    }
                }}
            />
            <Flex>
                <Flex.Item>
                    <Picker selectedValue={group_id} onValueChange={e=>set_group_id(e)}>   
                        { groups.map((v, k)=><Picker.Item key={k} label={'Store: ' + v.name} value={v._id} />) }
                    </Picker>
                </Flex.Item>
                <Flex.Item>
                {
                    keyword != '' ? 
                    <Button type="primary" danger style={styles_home.button} onPress={_=>search()}>Search</Button> :
                    <Button type="primary" danger style={styles_home.button} disabled>Search</Button>
                }
                </Flex.Item>
            </Flex>
            <Flex justify="around">
                <Flex.Item onPress={_=>{
                    set_item_id('')
                    set_items([])
                }}> 
                    <Text style={styles_home.label}>Item</Text>
                    <Text style={styles_home.value}>{item_id}</Text>
                </Flex.Item>
                <Flex.Item onPress={_=>set_label({_id:''})}>
                    <Text style={styles_home.label}>Label</Text>
                    <Text style={styles_home.value}>{label._id}</Text>
                </Flex.Item>     
            </Flex>
            <Flex justify="around">
                <Flex.Item>
                    {
                        item_id !== '' && label._id !== '' ?
                        <Button type="warning" style={styles_home.button} onPress={_=>{
                            fetch(`${config.endpoint}/group/${group_id}/label`, {method: 'POST', headers, body: JSON.stringify({label_id: label._id, item_id})})
                            .then(resp=>{if(resp.status === 200) return resp.json(); else throw resp })
                            .then(array_elements=>{
                                if(array_elements.length > 0){
                                    queue.push(array_elements[0])
                                    set_queue(queue)
                                }
                                set_keyword('')
                                set_item_id('')
                                set_label({_id: '', item_id: ''})
                                set_items([])
                                ref_search.current.focus()
                            })
                            .catch(res=>{if(res.status === 401) navigation.navigate('auth'); else console.log(res)})
                            .done()
                        }}>Bind</Button> 
                        :
                        <Button type="warning" style={styles_home.button} disabled>Bind</Button>
                    }
                </Flex.Item>
                {/*
                <Flex.Item>
                    {
                        label._id !== '' && label.item_id !== '' ?
                        <Button type="warning" style={styles_home.button} onPress={_=>{
                            fetch(`${config.endpoint}/group/${group_id}/label`, {method: 'POST', headers, body: JSON.stringify({label_id: label._id, item_id})})
                            .then(resp=>{if(resp.status === 200) return resp.json(); else throw resp })
                            .then(array_elements=>{
                                if(array_elements.length > 0){
                                    queue.push(array_elements[0])
                                    set_queue(queue)
                                }
                                set_keyword('')
                                set_item_id('')
                                set_label({_id:'', item_id: ''})
                                set_items([])
                                ref_search.current.focus()
                            })
                            .catch(res=>{if(res.status === 401) navigation.navigate('auth'); else console.log(res)})
                            .done()
                        }}>Unbind</Button> 
                        :
                        <Button type="warning" style={styles_home.button} disabled>Unbind</Button>
                    }
                </Flex.Item>*/}
            </Flex>
            {
                items.map((item, k)=>
                    <Card key={k} style={styles_home.item}>
                        <Card.Header
                            title={item._id}
                            extra={
                                item._id !== item_id ? 
                                <Button type="primary" onPress={_=>{
                                    set_item_id(item._id)
                                    set_items([])
                                }}>ADD</Button> : <></>
                            }
                        />
                        <Card.Body>
                            {
                                Object.entries(item).map((entry, kk)=>
                                    entry[0] !== '_logic' && entry[1] !== '_id' ?
                                    <Text key={kk}>{entry[0]}: {entry[1]}</Text> : null
                                )
                            }
                        </Card.Body>
                    </Card>
                )
            }
        </ScrollView>
    )
}

const styles_home = StyleSheet.create({
    item: {padding: 10, marginTop: 10},
    label: {color: '#000', textAlign: 'center', lineHeight: 30, height: 30, fontSize: 12},
    value: {color: '#000', textAlign: 'center', lineHeight: 50, height: 50, fontSize: 25},
    button: {borderRadius: 0, borderWidth: 0},
})

export default connect((props)=>{
    return {
        auth: props.auth,
        config: props.config,
        groups: props.groups,
    }
})(Home)