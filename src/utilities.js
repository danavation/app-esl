import AsyncStorage from '@react-native-community/async-storage'

const AUTH_EMAIL = 'AUTH_EMAIL'
const AUTH_PASSWORD = 'AUTH_PASSWORD'
const CONFIG_ENDPOINT = 'CONFIG_ENDPOINT'
const CONFIG_ENDPOINT_DEFAULT = 'https://saas.danavation.com/v0/http'

const kv_set = async (k, v) => {
	try {
		await AsyncStorage.setItem(k, v)
	} catch (e) {
		console.log('utilities.js kv_get', e)
	}
}

const kv_get = async (k) => {
	return new Promise((res, rej)=>{
		try {
			let v = AsyncStorage.getItem(k)
			res(v)
	  	} catch (e) {
	    	rej(e)
	  	}	
	})
}

module.exports = {
	AUTH_EMAIL,
	AUTH_PASSWORD,
	CONFIG_ENDPOINT,
	CONFIG_ENDPOINT_DEFAULT,
	kv_set,
	kv_get
}