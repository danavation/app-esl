import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { Text } from 'react-native'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { kv_get } from './src/utilities.js'

import Auth from './src/components/r_auth.js'
import Config from './src/components/r_config.js'
import Home from './src/components/r_home.js'
const Stack = createStackNavigator()

import auth from './src/store/reducer_auth.js'
import config from './src/store/reducer_config.js'
import groups from './src/store/reducer_groups.js'
import logs from './src/store/reducer_logs.js'

const store = createStore(combineReducers({ auth, config, groups, logs }))

const App = () => {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="auth" component={Auth} options={{ headerShown: false }} />
                    <Stack.Screen name="config" component={Config} options={{headerTitle: 'Config'}} />
                    <Stack.Screen name="home" component={Home} 
                        options={({navigation, route})=>({
                            headerLeft: null,
                            headerTitle: 'Workplace',
                            headerRight: props=>(<Text style={{marginRight: 20}} onPress={_=>navigation.navigate('auth')}>Logout</Text>) 
                        })} 
                    /> 
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    )
}

export default App