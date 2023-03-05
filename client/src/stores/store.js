

import { ref, computed, reactive, watch, onMounted, nextTick } from 'vue';
import { defineStore } from 'pinia';
import * as utils from './../utils.js'
import c from './../constants.js'
import _ from 'lodash';

import { canvasStore } from './canvasStore.js';
import { configStore } from './configStore.js';
import { styleStore } from './styleStore.js';
import { windowStore } from './windowStore.js';
export {
	canvasStore, configStore, styleStore, windowStore
}


export const contextMenuStore = defineStore('contextMenu', () => {
	function clearItems(obj = items){
		console.log('clearItems', obj)
		for (const [key, value] of Object.entries(obj)) {
			delete obj[key]
		}
	}
	async function onContextMenu(e, newItems){
		clearItems()
		Object.assign(items, newItems)
		//console.log('onContextMenu', e.clientX, e.clientY, e)
		prop['x'] = e.clientX + 'px'
		prop['y'] = e.clientY + 'px'
		contextMenuStore().open =! contextMenuStore().open
	}
	const items = reactive({initItem1: () => console.log('waa')})
	const divRef = ref(null)
	const prop = reactive({})
	return {
		onContextMenu,
		open:false, 
		divRef, 
		//list: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], 
		items, 
		prop, 
		//items: reactive({item1: () => console.log('waa')}),
	}
})


export const store = defineStore('store', () => {
	const settingSettings = reactive({})
	const watchers = {}
	const factoryDefault = reactive(JSON.parse(JSON.stringify({...getSettings()})))
	const defaults = reactive({})

	async function init(){
		loadPictures()
		await configFunctions.loadStorageSettings()
		await configFunctions.setDefaults({defaultObj: defaults, obj:getSettings()})
		await configFunctions.load()
		configFunctions.setWatchers()

		if(configStore().general.startWindowNameWithIcon) document.title = `${c.WINDOWTITLE}`
		document.title = `${c.WINDOWTITLE}`

		if(!configStore().$state.debugSettings.enableConsole){
			console.log('Console is disabled. ')
			console.log = function() {}
		}
		if(!localStorage.getItem('popup_notes_read')){
			windowStore().createNewOrUnminimize({component:'ActualPopup'})
		} else {
			this.popup_notes_read = localStorage.getItem('popup_notes_read')
		}
		
	}
	function loadPictures(){
		for (const [key, value] of Object.entries(configStore().lists.pictureList)) {
			configStore().lists.pictureList[key].image = new Image();
			configStore().lists.pictureList[key].image.onload = () => {/* ctx.drawImage(img, x, y, size, size) */	}
			configStore().lists.pictureList[key].image.src = configStore().picturesPath+value.file
		}
	}
	function setTitle({Login=false, Register=false}={}){
		//const title = canvasStore().canvasList[canvasStore().current.layer_id].canvas_name
		const title = canvasStore().current.canvas_id.split('--')[0]
		if(Register) document.title = `Draw Register`
		else if(Login) document.title = `Draw Login`
		else if(configStore().general?.startWindowNameWithIcon) document.title = `🎨 ${title}`
		else document.title = `${title}`
	}


	const includesAnyOf = (value, array) => {
		if(!array || (array && array.length == 0)) return false
		for (let i = 0; i < array.length; i++) {
			if(array[i] == value) return true
		}
		return false
	}

	function saveValueToLocalStorage({key, value, includeInSaveAll, autoSave} = {}){
		if(!configStore().general.saveConfigToBrowser || !includeInSaveAll) return
		console.log('saveValueToLocalStorage', key, value, `    saveConfigToBrowser: ${configStore().general.saveConfigToBrowser},  includeInSaveAll: ${includeInSaveAll},  autoSave: ${autoSave}`)
		localStorage.setItem(key, value)
	}
	function getSettingsAll(){
		return {
			...{lists:configStore().lists}, 
			...getSettings()
		}
	}
	function getSettings(){
		return {
			general: configStore().$state.general, 
			$debugSettings: {
				//hide: (configStore().$state.general.debug) ? false : true, 
				//hide: computed(()=>!configStore().$state.general.debug), 
				hideIf:()=>!configStore().$state.general.debug, 
				//hideIf2(){return !configStore().$state.general.debug},
			},
			debugSettings: configStore().$state.debugSettings, 
			cursor: configStore().$state.cursor,
			toolState: configStore().$state.toolState, 
			tools: configStore().$state.tools,
			navigation: configStore().$state.navigation, 
			//navState: configStore().$state.navState, 
			//style: styleStore().$state,
			style: {
				app: styleStore().$state.app, 
				canvasContainer: {
					width: styleStore().$state.canvasContainer.width, 
					height: styleStore().$state.canvasContainer.height,
				}
			},
		}
	}	

	
	async function setSettingSettings({obj=getSettings(), newObj = {}, autoSaveValue=false, cat={autoSaveValue:false, keys:null}} = {}){
		for (const [key, value] of Object.entries(obj)) {
			if(!newObj[key]) newObj[key] = {}
			if(await includesAnyOf(key, cat.keys)){
				newObj[key]['$autoSave'] = cat.autoSaveValue
				newObj[key]['$includeInSaveAll'] = cat.autoSaveValue
				if(typeof value == 'object')
					await setSettingSettings({obj:obj[key], newObj:newObj[key], autoSaveValue: cat.autoSaveValue, cat})
			} else {
				newObj[key]['$autoSave'] = autoSaveValue
				newObj[key]['$includeInSaveAll'] = autoSaveValue
				if(typeof value == 'object')
					await setSettingSettings({obj:obj[key], newObj:newObj[key], autoSaveValue, cat})
			}
			
		}
		return newObj
	}
	

	const configFunctions = {
		setDefaults({defaultObj=defaults, obj=getSettings()}={}){
			_.merge(defaultObj, JSON.parse(JSON.stringify({...obj})))
		},
		mergeObjects({target=defaults, obj=getSettings()}={}){
			_.merge(target, JSON.parse(JSON.stringify({...obj})))
		},
		//fullKey: ({path, key}) => (path?path:'') + (path?'__':'') + key,
		fullKey({path, key}) {return (path?path:'') + (path?'__':'') + key},
		clearStorage({all = true} = {}){
			//console.log('configFunctions - clearStorage', all)
			this.mergeObjects({target: getSettings(), obj:factoryDefault})
			this.mergeObjects({target: defaults, obj:factoryDefault})
			if(all) return localStorage.clear()
			for (let [key, value] of Object.entries(localStorage)) {
				//console.log('configFunctions - clearStorage - Object.entries --- ', key, value)
				if(!key.includes('username') && !key.includes('refreshToken') && !key.includes('accessToken'))
					localStorage.removeItem(key)
			}
		},
		getToKey({path, obj = getSettings()} = {}){
			if(typeof path != 'object') return {obj, key:path}
			if(path.length <= 1) return {obj, key:path[0]} 
			let nextKey = path.shift()
			return this.getToKey({path, obj:obj[nextKey]})
		},
		async loadStorageSettings(list = localStorage, obj = getSettingsAll()){
			let res
			for (let [key, value] of Object.entries(list)) {
				if(value == 'false') value = false
				else if(value == 'true') value = true
				else if(!isNaN(value)) value = Number(value)
				res = await this.getToKey({path: key.split('__'), value: value, obj})
				if(key.split('__')[0] == 'lists') {
					_.merge(res.obj[res.key], JSON.parse(value))
				}
				else
				res.obj[res.key] = value
			}
		},
		
		async saveAllChanged({obj=getSettings(), sideObj=defaults, path=null} = {}){
			for (const [key, value] of Object.entries(obj)) {
				if(typeof value == 'object')
					this.saveAllChanged({ obj:obj[key], sideObj:sideObj[key], path:await this.fullKey({path, key}) })
				else {
					if(obj[key] != sideObj[key]){
						localStorage.setItem(await this.fullKey({path, key}), value)
						sideObj[key] = obj[key]
					} 
				}
			}
		},
		async saveValue({path, key, value, }={}){
			let nPath = [...path, key].join('__')
			localStorage.setItem(nPath, value)
			let res = await configFunctions.getToKey({path: nPath.split('__'), obj: defaults})
			res.obj[res.key] = value
		},
		setWatchers(obj = getSettings(), settingsObj = settingSettings, path = null){
			for (const [key, value] of Object.entries(obj)) {
				if(!settingsObj[key] || key[0]=='$') continue
				let nPath = (path?path:'') + (path?'__':'') + key
				if(typeof value == 'object')
					this.setWatchers(obj[key], settingsObj[key], nPath)
				else {
					if(!watchers[key] && settingsObj[key].$autoSave && configStore().general.saveConfigToBrowser)  
						watchers[nPath] = watch(()=>obj[key], async (val) => {
							saveValueToLocalStorage({key:nPath, value:val, includeInSaveAll:settingsObj[key].$includeInSaveAll, autoSave: settingsObj[key].$autoSave})
						})
					if(watchers[key] && (!settingsObj[key].$autoSave || !configStore().general.saveConfigToBrowser)){
						//console.log(`Unwatch: ${nPath}`, watchers[nPath])
						watchers[nPath]()
					}
						
				}
				
			}
		}, 
		load: async()=>{
			const ni = await setSettingSettings({obj:await getSettings(), autoSaveValue:false, cat:{autoSaveValue:true, keys:['toolState', 'tools', 'saveConfigToBrowser']}})
			await _.merge(settingSettings, ni)
			console.log('yyyyyyyyyyyyyyyyyyyyyy', settingSettings)
			if(localStorage.getItem('list_autoSave'))
				Object.assign(settingSettings, JSON.parse(localStorage.getItem('list_autoSave')))
		},
		saveList({key, value} = {}){
			// store().configFunctions.saveList({key:'lists__unicodePrimarySymbols', value: configStore().lists.unicodePrimarySymbols})
			// store().configFunctions.saveList({key:'lists__unicodePrimaryCategories', value: configStore().lists.unicodePrimaryCategories})
			// store().configFunctions.saveList({key:'lists__colors', value: configStore().lists.colors})
			if(!configStore().general.saveConfigToBrowser) return
			if(typeof value == 'object') value = JSON.stringify(value)
			localStorage.setItem(key, value)
		}
	}
	const _functions = {
		select: async(obj, checked)=>{
			Object.assign(settingSettings, await setSettingSettings({obj:obj, autoSaveValue:checked}))
		},
		selectNone: async()=>{
			Object.assign(settingSettings, await setSettingSettings({autoSaveValue:false}))
		},
		selectAll: async()=>{
			Object.assign(settingSettings, await setSettingSettings({autoSaveValue:true}))
		},
		save: async()=>{
			if(!configStore().general.saveConfigToBrowser) return console.log('save. saveConfigToBrowser: ', configStore().general.saveConfigToBrowser)
			localStorage.setItem('list_autoSave', JSON.stringify(settingSettings))
		}, 
	}
	Object.assign(configFunctions, _functions)
	configFunctions.load()
	

	
	
	
	
	

	let timeout = []
	return {
		init, getSettings, setTitle, 
		configFunctions, 
		watchers, 
		defaults, factoryDefault,
		settingSettings,
		
		guide: {
			enabled: true, 
			show: false,
			message: '', 

		},

		popup_notes_read: ref(false),

		
		// STATUS 
		statusMessage: reactive({
			queue: [],
			tooltip: '',
			msg: '',
			ref: null,
		}),
		setStatusMessage({text= '', popups=[]} ={}){
			for (let i = 0; i < popups.length; i++) {
				if(!someStore().activePopups[popups[i]])
				console.log('popups', i, popups[i], popups)
				someStore().activePopups[popups[i]]	= {text:someStore().list[popups[i]]?.text, rect: {}, overlap:false}
			}
			if(timeout[0]) clearTimeout(timeout[0]);
			if(timeout[1]) clearTimeout(timeout[1]);
			
			this.statusMessage.msg = text
			this.statusMessage.ref.style.display = 'block'
			timeout[0] = setTimeout(() => {
				this.statusMessage.ref.classList.add("fade-out");
			}, 3000);
			timeout[1] = setTimeout(() => {
				this.statusMessage.msg = ''
				this.statusMessage.ref.style.display = 'none'
				this.statusMessage.ref.classList.remove("fade-out");
			}, 5000);
		},


		// DEBUG MESSAGE
		messageQueue: reactive([{keyy:'Qqq'}]),
		msg: (obj) => {
			if(!configStore().general.debug) return
			if(typeof obj == 'object') obj = JSON.parse(JSON.stringify(obj))
			return store().messageQueue.push(obj)
		},

		// DEBUG
		debugObj: {performance: {}},
		debugMsg: {},
		debug(obj){
			return {
				debugObj: this.debugObj,
				performance: this.debugObj.performance, 
				parentList: canvasStore().parentList.map((x)=> JSON.stringify(x)) ,
				canvasList: Object.entries(canvasStore().canvasList).map(([key, value])=> {return{[key]: JSON.stringify(value)}}),
				watchers: watchers, 
				current: canvasStore().current, 
				navState: configStore().navState, 
				click: canvasStore().state.click, 
				clickScaled: {
					x0: canvasStore().state.click.x0*configStore().navState.scale - configStore().navState.ofs.x*configStore().navState.scale, 
					y0: canvasStore().state.click.y0*configStore().navState.scale - configStore().navState.ofs.y*configStore().navState.scale, 
					x: canvasStore().state.click.x*configStore().navState.scale - configStore().navState.ofs.x*configStore().navState.scale, 
					y: canvasStore().state.click.y*configStore().navState.scale - configStore().navState.ofs.y*configStore().navState.scale, 
				}, 
				sizeCanvas: canvasStore().state.sizeCanvas, 
				currentPicture: {
					width: { raw: canvasStore().currentPicture.width, scaled: canvasStore().currentPicture.width*configStore().navState.scale},
					height: { raw: canvasStore().currentPicture.height, scaled: canvasStore().currentPicture.height*configStore().navState.scale},
					/* width: canvasStore().currentPicture.width,
					height: canvasStore().currentPicture.height, */
				}, 
				
				
				
			}
		},
	}
})

export const someStore = defineStore('refs', {
	state:() => {
		return{ // refs()		someStore().list
			list: {
				newCanvas: {ref: ref(null), text: 'Create new canvas or layer'}, 
				edit: {ref: ref(null), text: 'Edit canvas or layer'}, 
				canvas: {ref: ref(null), text: 'Canvaslist'}, 
				layer: {ref: ref(null), text: 'Layerlist'}, 
				tools: {ref: ref(null), text: 'Tools'}, 
				size: {ref: ref(null), text: 'size'}, 
				colors: {ref: ref(null), text: 'colors'}, 
				settings: {ref: ref(null), text: 'settings'}, 
				login: {ref: ref(null), text: 'login'}, 
			},
			activePopups: reactive({}),
			//divRefs: reactive({}),
			notification: {ref: ref(null), text: 'Ex: This layer aint belong to you. Create new or change topleft '}, 
	}}, 
	getters: {}, actions: {}
})

export const refs = defineStore('refs', {
	state:() => {
		return{
		TheZoom: ref(null), 
		divRefs: reactive({}),
	}}, 
	getters: {}, actions: {
		
	}
})



export const testStore = defineStore('test', () => {
	return {test:'abc'}
})



