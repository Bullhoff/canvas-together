import axios from 'axios';
import c from './constants.js';
import FormData from 'form-data';
import * as store2 from "@/stores/store.js";

import { defineComponent, onMounted, onBeforeMount, watch, onUpdated, nextTick, ref, reactive, computed } from 'vue'
import { canvasStore, styleStore, configStore, store } from "@/stores/store.js";



export function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export function print({ obj = {}, whoSentYou = null, color = '', print = true } = {}) {
	if (print == true) console.log(`${whoSentYou}`, obj);
}

export function rgb({r = 0, g = 0, b = 0, where = 'fg'} = {}){
	let code
	if(where == 'bg') code = 48
	else if(where == 'fg') code = 38
    return `\x1B[${code};2;${r};${g};${b}m`
}
export function reset(){
	return `\x1b[0m`
}

export function round(value, decimals) {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
  

printBrowser({text:'aaaaaaaaa'})
export function printBrowser({text='text', fg='red', bg='yellow', size='12', whoSentYou='anon'}={}){
	return console.log(`%c${whoSentYou} %c${text}`, `color:white;background:red;`,`color:${fg};background:${bg};font-size:${size}px;`)
}

//fetchJson({obj, path:'/api/new-canvas'})
export async function fetchJson({obj={}, path='/users/token', }={}){
	var data = new FormData();
	for (const [key, value] of Object.entries(obj)) {
		data.append(key, value);
	}
	//data.append("token", user.tokens.refreshToken);
	let res = await fetch(`${c.SERVERIP}${path}`, {
		method: 'POST',
		body: data, 
		headers: {
			'authorization': `Bearer ${configStore().user.accounts[configStore().user.username]?.accessToken}`
		},
	})
	let responseJson = (res.ok) ? await res.json() : res.ok
	if(!responseJson) return
	return responseJson
}


const config = { headers: { 'Content-Type': 'multipart/form-data' } };
// export function axiosPost({host='http://localhost:3000/', url='postImage', obj=null}){
export function axiosPost({ host = c.SERVERIP, url = 'postImage', obj = {}, config = {}, dataForm = null }) {
	//if(obj.dataForm) config = { headers: { 'Content-Type': 'multipart/form-data' } }
	if (dataForm) {
		obj = dataForm;
		config = { headers: { 'Content-Type': 'multipart/form-data' } };
	}
	console.log(`axiosPost: ${host}/api/${url}`, obj, 'config', config);
	return axios
		.post(`${host}/api/${url}`, obj, config)
		.then(function (res) {
			console.log(res.data);
			return res.data;
		})
		.catch(function (err) {
			console.log(err);
		})
		.finally((res) => {
			console.log('finally', res);
		});
}
// export function axiosGet({host='http://localhost:3000/', url='getImage', obj=null}){
export async function axiosGet({ host = c.SERVERIP, url = 'getImage', whoSentYou, obj = {} }) {
	console.log(`\x1b[34m axiosGet:\x1b[0m ${host}/api/${url} - ${whoSentYou}`, obj);
	return await axios
		.get(`${host}/api/${url}`, { params: obj })
		.then(function (res) {
			return res;
		})
		.catch(function (err) {
			console.log(err);
		})
		.finally(() => console.log('finally'));
}

export function valueToHex(val) {
	let hex = val.toString(16);
	return hex.length > 1 ? hex : '0' + hex;
}
export function getRandomColor({ format = 'rbg' }) {
	if (format == 'rgb') return `rgb(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)})`;
	else if (format == 'hex') return `#${valueToHex(getRandomInt(0, 255))}${valueToHex(getRandomInt(0, 255))}${valueToHex(getRandomInt(0, 255))}`;
}

export function normalizeLength(text, paddingLength = 2, padding = '.') {
	if (text.toString().length == Math.abs(paddingLength)) return text;
	else if (paddingLength < 0) return this.normalizeLength((padding + text).substr(paddingLength), paddingLength, padding);
	else if (paddingLength > 0) return this.normalizeLength((text + padding).substr(0, paddingLength), paddingLength, padding);
}

export async function fetchPicture({ pictureFile = null } = {}) {
	canvasStore().state.loading = 'Fetching image from server'
	var data = new FormData();
	data.append('pictureFile', pictureFile);
	let datatemp = [];
	let pic = await fetch(`${c.SERVERIP}/api/getImage2`, {	// 'http://localhost:3000'
		method: 'POST',
		body: data,
		//params: data,
	})
		.then((response) => {
			const reader = response.body.getReader();
			return new ReadableStream({
				start(controller) {
					return pump();
					function pump() {
						return reader.read().then(({ done, value }) => {
							datatemp.push(value);
							if (done) {
								controller.close();
								return;
							}
							controller.enqueue(value);
							return pump();
						});
					}
				},
			});
		})
		// Create a new response out of the stream
		.then((stream) => new Response(stream))
		// Create an object URL for the response
		.then(async (response) => {
			//store().msg({text: {'fetchImage.response.blob()': await response.blob()}})
			return await response.blob();
		})
		.then((blob) => {
			//canvasses.currentPicture.src = blob
			return URL.createObjectURL(blob);
		})
		.then((url) => {
			return url
			//canvasses.currentPicture.src = url;
		})
		.catch((err) => console.error(err));

		store().msg({'fetchImage.pic': pic})
		console.log('pic', pic)
		canvasStore().state.loading = false
		return pic
}
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function saveSessionStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
};
export function getSessionStorage(key, item) {
	if( localStorage.getItem(key) && item) 
    	return JSON.parse(localStorage.getItem(key))[item]
    else if(localStorage.getItem(key)) 
    	return localStorage.getItem(key)
    
}
export function saveLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
};
export function getLocalStorage(key, item) {
    if( localStorage.getItem(key) && item) 
    	return JSON.parse(localStorage.getItem(key))[item]
    else if(localStorage.getItem(key)) 
    	return localStorage.getItem(key)
    
};



export function getStartPoint({obj, desiredStarts = ['default'], avoid= ['img', 'background']} = {}){
	let keys = Object.keys(obj)
	for (let i = 0; i < keys.length; i++) {
		if(!avoid.includes(keys[i])) 
			return keys[i]
	}
	if(keys[0]) 
		return keys[0]
	return null
}






//////
export function storageRemoveItem(sessionOrLocal, key) {
	if(sessionOrLocal.includes('session')) sessionStorage.removeItem(key);
	else localStorage.removeItem(key);
}
export function storageClear(sessionOrLocal) {
	if(sessionOrLocal.includes('session')) sessionStorage.clear();
	else localStorage.clear();
}
export function storageSetItem(sessionOrLocal, key, data) {
	if(sessionOrLocal.includes('session')) sessionStorage.setItem(key, JSON.stringify(data));
	else localStorage.setItem(key, JSON.stringify(data));
}
export function storageGet(sessionOrLocal, key, item) {
	if(sessionOrLocal.includes('session')) {
		if( sessionStorage.getItem(key) && item) 
			return JSON.parse(sessionStorage.getItem(key))[item]
		else if(sessionStorage.getItem(key)) 
			return sessionStorage.getItem(key)
	}
	else {
		if( localStorage.getItem(key) && item) 
			return JSON.parse(localStorage.getItem(key))[item]
		else if(localStorage.getItem(key)) 
			return localStorage.getItem(key)
	}
}

//////
export function saveStorage(key, data) {
	if(typeof data == 'object') data = JSON.stringify(data)
	//console.log('saveStorage:', key, data)
    localStorage.setItem(key, data);
};
export function getStorage(key, item) {
	//console.log('getStorage', key, item)
    if( localStorage.getItem(key) && item) {
        const data = JSON.parse(localStorage.getItem(key))
        return data[item]
    }
    else if(localStorage.getItem(key)) {
       return localStorage.getItem(key)
    }
};