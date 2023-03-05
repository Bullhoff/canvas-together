import { ref, computed, reactive, watch, unref, toRaw, markRaw, isRef, isProxy, isReadonly } from 'vue';
import { defineStore } from 'pinia';
import * as utils from './../utils.js'
import c from './../constants.js'
import _ from 'lodash';

import Settings from '@/components/cSettings.vue'
import TheFormCreate from '@/components/cTheFormCreate.vue'
import TheFormModify from '@/components/cTheFormModify.vue'
import TheUnicodeMenu from '@/components/cTheUnicodeMenu.vue'
import TheRegisterUser from '@/components/cTheRegisterUser.vue'
import TheDebug from '@/components/cTheDebug.vue'
import ActualPopup from '@/components/cActualPopup.vue'
import {ThePictureMenu, TheWindowHandler, ListComponent} from '@/components/Components.vue'


//import unicode from "./../assets/unicode.json"

import { canvasStore, configStore, store } from './store.js';


export const windowStore = defineStore('window', () => {
	const defaultWindow = ({name, component, id}) => ({
		id: id, 
		component: component,
		title: component, 
		style:{zIndex: windows.length+1},
		//active: false,
		pos: {x:'0',y:'0'},
		holding: false,
		//closed: false,	////
		minimized: false,
		maximized: false,
	})
	const current = reactive({
		//test: 'abc',
		activeWindow: null,
		holding: false, 
		windowOrder: [], 
		x1: 0,
		x2: 0,
		y1: 0,
		y2: 0,
	})
	const windows = reactive({})
	const refs = reactive({})

	

	/* const componentTypes = {
		'List':{
			head: ['List'],
			bodyComponent: [markRaw(ListComponent)],
			propStyle: {container:{minWidth:'fit-content'}},
		},
		'debug':{
			head: ['Debug'],
			bodyComponent: [markRaw(TheDebug)],
		},
		'picture': {
			hide: false, 
			head: ['PICS'],
			headComputed: [],
			//body: [],
			bodyComponent: [markRaw(ThePictureMenu)],
			propStyle: {},
		}, 
		'unicode': {
			head: [],
			headComputed: [computed(() => String.fromCodePoint(`0x${configStore().tools.unicode.code}`) + configStore().tools.unicode.name.charAt(0).toUpperCase() + configStore().tools.unicode.name.slice(1).toLowerCase() + String.fromCodePoint(`0x${configStore().tools.unicode.code}`))],
			bodyComponent: [markRaw(TheUnicodeMenu)],
			//propStyle: {container:{minWidth:'70vw', width:'20vw'}},	
		}, 
		'login': {
			head: [],
			headComputed: [computed(() => configStore().user.username)],
			bodyComponent: [markRaw(TheRegisterUser)],	
			propStyle: {},
		},
		'Settings': {
			head:['Settings'],
			bodyComponent: [markRaw(Settings)],
			propStyle: {},
		}, 
		'TheFormModify':{
			head: ['Modify'], 
			body: [], 
			bodyComponent: [markRaw(TheFormModify)],
			propStyle: {},
		}, 
		'TheFormCreate':{
			head: ['Create'], 
			//headComponent: markRaw(null), 
			body: [],
			bodyComponent: [markRaw(TheFormCreate)],
			propStyle: {},
		}, 
		'TheWindowHandler':{
			head: ['TheWindowHandler'], 
			bodyComponent: [markRaw(TheWindowHandler)],
			propStyle: {container:{minWidth:'fit-content'}},
		}, 
		'ActualPopup':{
			head: ['ActualPopup'], 
			bodyComponent: [markRaw(ActualPopup)],
			propStyle: {container:{minWidth:'fit-content'}},
		}
	} */
	/* const componentTypes = {
		'List':{
			head: ['List'],
			bodyComponent: [markRaw(ListComponent)],
			propStyle: {container:{minWidth:'fit-content'}},
		},
		'debug':{
			head: ['Debug'],
				bodyComponent: [markRaw(TheDebug)],
				propStyle: {container:{minWidth:'fit-content'}},
		},
		'picture': {
			hide: false, 
			head: ['PICS'],
			headComputed: [],
			bodyComponent: [markRaw(ThePictureMenu)],
		}, 
		'unicode': {
			head: [],
			headComputed: [computed(() => String.fromCodePoint(`0x${configStore().tools.unicode.code}`) + configStore().tools.unicode.name.charAt(0).toUpperCase() + configStore().tools.unicode.name.slice(1).toLowerCase() + String.fromCodePoint(`0x${configStore().tools.unicode.code}`))],
			bodyComponent: [markRaw(TheUnicodeMenu)],
		}, 
		'login': {
			headComputed: [computed(() => configStore().user.username)],
			bodyComponent: [markRaw(TheRegisterUser)],	
		},
		'Settings': {
			head:['Settings'],
			bodyComponent: [markRaw(Settings)],
			propStyle: {container:{width:'50%'}},
		}, 
		'TheFormModify':{
			head: ['TheFormModify'], 
			bodyComponent: [markRaw(TheFormModify)],
			propStyle: {container:{width:'fit-content'}},
		}, 
		'TheFormCreate':{
			head: ['TheFormCreate'], 
			bodyComponent: [markRaw(TheFormCreate)],
			propStyle: {container:{width:'fit-content'}},
		}, 
		'TheWindowHandler':{
			head: ['TheWindowHandler'], 
			bodyComponent: [markRaw(TheWindowHandler)],
			propStyle: {container:{minWidth:'fit-content'}},
		}, 
		'ActualPopup':{
			head: ['Popup'],
			bodyComponent: [markRaw(ActualPopup)],
			propStyle: {container:{width:'30%', maxWidth:'fit-content'}},
		}
	} */
	const componentTypes = {
		'List':{
			head: ['List'],
			bodyComponent: [markRaw(ListComponent)],
			propStyle: {container:{minWidth:'fit-content'}},
		},
		'debug':{
			head: ['Debug'],
				bodyComponent: [markRaw(TheDebug)],
				propStyle: {container:{minWidth:'fit-content'}},
		},
		'picture': {
			hide: false, 
			head: ['PICS'],
			headComputed: [],
			bodyComponent: [markRaw(ThePictureMenu)],
		}, 
		'unicode': {
			head: [],
			headComputed: [computed(() => String.fromCodePoint(`0x${configStore().tools.unicode.code}`) + configStore().tools.unicode.name.charAt(0).toUpperCase() + configStore().tools.unicode.name.slice(1).toLowerCase() + String.fromCodePoint(`0x${configStore().tools.unicode.code}`))],
			bodyComponent: [markRaw(TheUnicodeMenu)],
		}, 
		'login': {
			headComputed: [computed(() => configStore().user.username)],
			bodyComponent: [markRaw(TheRegisterUser)],	
		},
		'Settings': {
			head:['Settings'],
			bodyComponent: [markRaw(Settings)],
			propStyle: {container:{width:'50%'}},
		}, 
		'TheFormModify':{
			head: ['TheFormModify'], 
			bodyComponent: [markRaw(TheFormModify)],
			propStyle: {container:{width:'fit-content'}},
		}, 
		'TheFormCreate':{
			head: ['TheFormCreate'], 
			bodyComponent: [markRaw(TheFormCreate)],
			propStyle: {container:{width:'fit-content'}},
		}, 
		'TheWindowHandler':{
			head: ['TheWindowHandler'], 
			bodyComponent: [markRaw(TheWindowHandler)],
			propStyle: {container:{minWidth:'fit-content'}},
		}, 
		'ActualPopup':{
			head: ['Popup'],
			bodyComponent: [markRaw(ActualPopup)],
			propStyle: {container:{width:'30%', maxWidth:'fit-content'}},
		}
	}
	const componentTypes3 = ({component, head, headComputed, headComponent, body, bodyComputed, bodyComponent, propStyle, hide} = {}) => {
		return {
			//component: (!component)?'': componentTypes[component].component,
			head: (componentTypes[component].head) ? componentTypes[component].head : [],
			headComponent: (componentTypes[component].headComponent)?  componentTypes[component].headComponent  : null,
			headComputed: (componentTypes[component].headComputed)? componentTypes[component].headComputed  : null,
			body: (componentTypes[component].body)? componentTypes[component].body  : [],
			bodyComponent: (componentTypes[component].bodyComponent)? componentTypes[component].bodyComponent  : null,
			bodyComputed: (componentTypes[component].bodyComputed)? componentTypes[component].bodyComputed  : null,
			propStyle: (componentTypes[component].propStyle) ? componentTypes[component].propStyle  : {},
		} 
		/* {
			//component: (!component)?'': componentTypes[component].component,
			head: (componentTypes[component].head) ? componentTypes[component].head : [],
			headComponent: (componentTypes[component].headComponent)?  [markRaw(componentTypes[component].headComponent)]  : null,
			headComputed: (componentTypes[component].headComputed)? [computed(() => componentTypes[component].headComputed)]  : null,
			body: (componentTypes[component].body)? componentTypes[component].body  : [],
			bodyComponent: (componentTypes[component].bodyComponent)? [markRaw(componentTypes[component].bodyComponent)]  : null,
			bodyComputed: (componentTypes[component].bodyComputed)? [computed(() => componentTypes[component].bodyComputed)]  : null,
			propStyle: (componentTypes[component].propStyle) ? componentTypes[component].propStyle  : {},
		}  */
		/* {
			component: (!component)?'': component,
			head: (!head)?[]: head,
			headComponent: (!headComponent)?'':  [markRaw(headComponent)],
			headComputed: (!headComputed)?'': [computed(() => headComputed)],
			body: (!body)?[]: body,
			bodyComponent: (!bodyComponent)?'': [markRaw(bodyComponent)],
			bodyComputed: (!bodyComputed)?'': [computed(() => bodyComputed)],
			propStyle: (!propStyle) ?{}: propStyle,
		}  */
	}

	const componentList = ['ActualPopup', 'List', 'debug', 'picture', 'unicode', 'login', 'Settings', 'TheFormModify', 'TheFormCreate', 'TheWindowHandler']
	const componentTypes2 = (component, obj) => {
		//let {head, headComputed, headComponent, body, bodyComputed, bodyComponent, propStyle, hide} = obj
		// 'component': {
		//	head: ['Title'],
		//	headComputed: [computed(() => current.activeWindow)],
		//	headComponent: [markRaw(null)], 
		//	body: ['some text'], 
		//	bodyComponent: [markRaw(Settings)],
		//},  
		//configStore().tools.unicode.name.charAt(0).toUpperCase() + configStore().tools.unicode.name.slice(1).toLowerCase()
		return (
			(component == 'ActualPopup') ? {
				head: ['Popup'],
				bodyComponent: [markRaw(ActualPopup)],
				propStyle: {container:{width:'30%', maxWidth:'fit-content'}},
				/* propStyle: {container:{minWidth:'fit-content'}}, */
			} :
			(component == 'List') ? {
				head: ['List'],
				bodyComponent: [markRaw(ListComponent)],
				propStyle: {container:{minWidth:'fit-content'}},
			} : 
			(component == 'debug') ? {
				head: ['Debug'],
				bodyComponent: [markRaw(TheDebug)],
				propStyle: {container:{minWidth:'fit-content'}},
			} : 
			(component == 'picture') ? {
				hide: false, 
				head: ['PICS'],
				headComputed: [],
				//body: [],
				bodyComponent: [markRaw(ThePictureMenu)],
			} : 
			(component == 'unicode') ? {
				head: [],
				headComputed: [computed(() => String.fromCodePoint(`0x${configStore().tools.unicode.code}`) + configStore().tools.unicode.name.charAt(0).toUpperCase() + configStore().tools.unicode.name.slice(1).toLowerCase() + String.fromCodePoint(`0x${configStore().tools.unicode.code}`))],
				bodyComponent: [markRaw(TheUnicodeMenu)],
			} : 
			(component == 'login') ? {
				headComputed: [computed(() => configStore().user.username)],
				bodyComponent: [markRaw(TheRegisterUser)],	
			} : 
			(component == 'Settings') ? {
				head:['Settings'],
				bodyComponent: [markRaw(Settings)],
				propStyle: {container:{width:'50%'}},
			} : 
			(component == 'TheFormModify') ? {
				head: ['TheFormModify'], 
				bodyComponent: [markRaw(TheFormModify)],
				propStyle: {container:{width:'fit-content'}},
			} : 
			(component == 'TheFormCreate') ? {
				head: ['TheFormCreate'], 
				bodyComponent: [markRaw(TheFormCreate)],
				propStyle: {container:{width:'fit-content'}},
				/* propStyle: {container:{width:'50%'}}, */
				/* propStyle: {container:{minWidth:'fit-content'}}, */
			} : 
			(component == 'TheWindowHandler') ? {
				head: ['TheWindowHandler'], 
				bodyComponent: [markRaw(TheWindowHandler)],
				propStyle: {container:{minWidth:'fit-content'}},
			} : 			
			/* (component == '') ? {
				
			} : 
			(component == '') ? {
				
			} :  */
			{
				head: (!head)?[]: head,
				headComponent: (!headComponent)?'':  [markRaw(headComponent)],
				headComputed: (!headComputed)?'': [computed(() => headComputed)],
				body: (!body)?[]: body,
				bodyComponent: (!bodyComponent)?'': [markRaw(bodyComponent)],
				propStyle: (!propStyle) ?{}: propStyle,
			} 
		)
		
	}
	const draggableContent = {}
	const props = {}

	const windowNames = computed(()=>{
		let entries = Object.entries(componentTypes).filter((el)=>!el[1].hide)
		let keys = Object.keys(Object.fromEntries(entries))
		return keys
	})
	const windowListComponentKey = computed(() => {
		if(!windows || Object.keys(windows) == 0) return {}
		let list = {}
		for (const [key, value] of Object.entries(windows)) {
			if(!list[value.component]) list[value.component] = []
			list[value.component].push(value)
		}
		console.log('windowKeyList', list)
		return list
		//return author.books.length > 0 ? 'Yes' : 'No'
	})
	const windowExists = computed(() => {
		if(!windows || Object.keys(windows) == 0) return []
		let list = Object.values(windows).map((el)=>{
			return el.component
		})
		return list
	})

	function createNewWindow({name, component, style={}, head={}, body={}, prop=null, componentSettings={}}={}){
		if(!componentTypes[component]) return
		const id = Date.now()
		current.windowOrder.push(id)
		refs[id] = null
		windows[id] = reactive(defaultWindow({id, component}))
		
		draggableContent[id] = componentTypes[component]
		//draggableContent[id] = componentTypes3({component})
		//draggableContent[id] = componentTypes2(component)

		//let comp = {...componentTypes[component]}
		//draggableContent[id] = JSON.parse(JSON.stringify(componentTypes[component]))
		// isRef, isProxy, isReadonly
		//console.log('***11', isRef(draggableContent[id]), isProxy(draggableContent[id]), isReadonly(draggableContent[id]), draggableContent[id])
		//console.log('***12', componentSettings, componentTypes[component].head)
		
		//_.merge(componentSettings, (draggableContent[id]))
		//_.merge(readonly(draggableContent[id]), componentSettings)
		_.merge(draggableContent[id], componentSettings)
		//_.merge(componentSettings, draggableContent[id])
		//draggableContent[id] = _.merge(componentTypes[component], componentSettings)
		
		if(!prop) prop = {head: [{}], body: [{}]}
		if(!prop.head) prop['head'] = [{}]
		if(!prop.body) prop['body'] = [{}]
		props[id] = prop
	}
	function createNewOrUnminimize({component, id, forceNew=false, prop=null, componentSettings={} } = {}){
		if(!componentTypes[component]) return
		if(!windowExists.value.includes(component) || forceNew) return createNewWindow({component, prop, componentSettings})
		const minimize = (windowListComponentKey.value[component][0].minimized) ? false : true
		for (let index = 0; index < Object.entries(windowListComponentKey.value[component]).length; index++) {
			let id = windowListComponentKey.value[component][index].id
			focus(id)
			windows[id].minimized = minimize
		}
	}
	function getWindowIndex(id){
		return current.windowOrder.indexOf(id)
	}
	
	function focus(id){
		//if(!refs[id] || !refs[current.activeWindow]) return
		//if(current.activeWindow) refs[current.activeWindow].style.backgroundColor = 'rgb(59, 59, 59)'
		//refs[id].style.backgroundColor = 'rgb(60, 60, 60)'
		current.activeWindow = id
		let index = current.windowOrder.indexOf(id);
		current.windowOrder.splice(index, 1);
		current.windowOrder.push(id)
		for (let i = 0; i < current.windowOrder.length; i++) {
			if(windows[current.windowOrder[i]])
			windows[current.windowOrder[i]].style.zIndex = i+1
			if(refs[current.windowOrder[i]])
			refs[current.windowOrder[i]].style.zIndex = i+1
		}
	}
	function coords(e, id){
		const rect = refs[id].getBoundingClientRect()
		let {clientX, clientY} = e
		
		let nrtwo = () => {
			current.x2 = clientX 
			current.y2 = clientY 
		}
		current.x1 = current.x2 - clientX
		current.y1 = current.y2 - clientY
		nrtwo()

		let x = current.x1
		let y = current.y1
		//console.log(`mouseMove. ${clientX}, ${clientY} \t ${x}, ${y} \t  ${refs[id].offsetLeft}, ${refs[id].offsetTop} \t ${rect.left}, ${rect.top} \t *${clientX-rect.left - (current.x2-current.x1-rect.left)} \t *${clientY-rect.top - (current.y2-current.y1-rect.top)} \t **${clientX - (current.x2-current.x1-rect.left)} \t **${clientY - (current.y2-current.y1-rect.top)}`)
		
		return {x:x, y:y}
	}
	let func = {
		mouseUp(id=current.activeWindow){
			windows[id].holding = false
			current.holding = false
		}, 
		mouseDownTitle(e,id=null){
			windows[id].holding = true
			current.holding = true
			focus(id)
			coords(e, id)
		},
		mouseDownContainer(id=current.activeWindow){
			focus(id)
		},
		mouseDownOutside(id=current.activeWindow){
			windows[id].holding = false
			current.holding = false
		},
		mouseMove(e, id=current.activeWindow){
			if(!current.holding) return false
			if(id != current.activeWindow) return
			let {x,y} = coords(e, id)
			windows[id].pos.x = (refs[id].offsetLeft - x) + "px";
			windows[id].pos.y = (refs[id].offsetTop - y) + "px";
			refs[id].style.left = windows[id].pos.x
			refs[id].style.top = windows[id].pos.y
		}, 
	
		close(id = current.activeWindow){
			let index = current.windowOrder.indexOf(id);
			current.windowOrder.splice(index, 1);
			delete refs[id]
			delete windows[id]
			for (let i = 0; i < current.windowOrder.length; i++) {
				if(windows[current.windowOrder[i]])
					windows[current.windowOrder[i]].style.zIndex = i+1
			}
		},
		minimize(id = current.activeWindow){
			windows[id].minimized =! windows[id].minimized
		},
		maximize(id = current.activeWindow){
			if(!windows[id]) return
			windows[id].maximized =! windows[id].maximized
			if(windows[id].maximized){
				refs[id].style.left = "0px"
				refs[id].style.top = "0px"
				refs[id].style.maxHeight = "none"
				refs[id].style.width = "100%"
				refs[id].style.height = "100vh"
			} else {
				refs[id].style.maxHeight = "85vh"
				refs[id].style.width = "20%"
				refs[id].style.height = "fit-content"
				let {x,y} = windows[id].pos
				refs[id].style.left = `${x}`
				refs[id].style.top = `${y}`

				if(draggableContent[id].propStyle?.container?.width) 
					refs[id].style.width = draggableContent[id].propStyle?.container?.width
			}
		}, 
		onMounted(divRef, id){
			refs[id] = divRef
			focus(id)
			let width = refs[id].offsetWidth
			if(draggableContent[id]?.propStyle?.container?.width) width = refs[id].offsetWidth
			let pos = {
				x:window.event?.clientX,
				y:window.event?.clientY
			}
			if(window.event?.clientX + width  >  window?.innerWidth){
				console.log('width44',id, window.event?.clientX+width > window?.innerWidth, window.innerWidth, window.event?.clientX)
				pos.x = window.innerWidth-width
			}
			
			refs[id].style.left = `${pos.x}px`
			refs[id].style.top = `${pos.y}px`
		},
		
	}
	return {current, refs, windows, createNewWindow, func, draggableContent, windowExists, createNewOrUnminimize, componentTypes, windowListComponentKey, windowNames, props}
	//draggableContent, draggableReactive, reactiveTest
})

