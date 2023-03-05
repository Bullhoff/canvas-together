import { ref, computed, reactive, watch, nextTick } from 'vue';
import { defineStore } from 'pinia';
import * as utils from './../utils.js'
import c from './../constants.js'
import { configStore, store, refs } from './store';
//import { arrayBuffer } from 'stream/consumers';


function setUrl({picture=true,canvas=true,owner=true}={}){
	const searchURL = new URL(window.location);
	if(picture) searchURL.searchParams.set('canvas_id', canvasStore().current.canvas_id);
	if(canvas) searchURL.searchParams.set('layer_id', canvasStore().current.layer_id);
	window.history.pushState({}, '', searchURL);
}

export const canvasStore = defineStore('canvas', {
	state:() => {
		const canvasOrder = reactive([])
		//const canvasOrder = computed(() =>[])
		const canvasState =  reactive({})
		return {
			canvasOrder,canvasState,
			canvasOrderComputed: computed(() => {
				let list = []
				for (let i = 0; i < canvasOrder.length; i++) {
					list.push(canvasOrder[i])
					//this.canvasState[this.canvasOrder[i]].style.zIndex = i+1
				}
				return list
			}),
			canvasOrder22: computed(() => {
				var list = Object.keys(canvasState).sort((a,b)=>{
					return canvasState[a].style.zIndex-canvasState[b].style.zIndex
				})
				console.log('canvasOrder22. list', list)
				return list
			}),
			

			canvasOrder3: [
				'a','b','c','d','eeee'
			],
			state: reactive({
				currentFocus: null,
				sizeCanvas: {w:window.innerWidth, h: window.innerHeight},
				click: {x0: 0, y0:0, x: 0, y:0},
				holding: false, 
				currentlyDragging: false,
				currentlyDrawing: false, 
				currentlyZooming: false,  
				//holdingLogin:false,
				//holdingUnicode:false,
				//holdingCreateNew:false,
			}) ,
			test: 123,
			current: reactive({
				/* parent: null,
				id: null, 
				parent_id:null, */

				canvas_id:null,	// Parent
				layer_id:null,	// Canvas
			}), 
			currentPicture: new Image(), //ref(null), 
			canvasHistory: reactive({/* default:[], */}), 
			historyTemp: reactive([]), 
			canvasList: reactive({}), 
			//canvasList: reactive([]), 
			parentList: reactive([]), 
			parentListComputed: computed(()=>canvasStore().parentList?.reduce((a, v) => ({ ...a, [v.canvas_id]: v}), {})),
			parentListComputed2: computed(()=>{
				//store().msg({parentListComputed: canvasStore().parentListComputed})
				if(!canvasStore().parentListComputed) return
				const arr = Object.values(canvasStore().parentListComputed).map((x)=>{
					//store().msg({x: x})
					return{id:x.canvas_id, name:x.canvas_name, ...x}
				})
				//store().msg({parentListComputed2: canvasStore().parentListComputed2})
				return arr
			}),
			queue: reactive([]), 

			canvasRefs2: reactive({}), 
			ctx2: reactive({}), 
			canvasRefs: reactive({}), 
			ctx: reactive({}), 
			canvasOffScreen: reactive({}),
			ctxOffScreen: reactive({}),
		}
	}, 
	getters: {
		properties ({canvas_id=this.current.canvas_id, layer_id=this.current.layer_id} = {}) {
			console.log('store PROPERTIES', this.current.layer_id, this.canvasList[layer_id])
			return this.canvasList[layer_id]
		}, 
		firstLayerId(){return Object.keys(this.canvasList)[0]},
	},	
	actions: {
		moveCanvasPrio({layer_id='', direction='up'}={}){
			let change = (direction=='up') ? -1 : +1
			//let index = this.canvasOrder.indexOf(canvas_id)
			var index = this.canvasOrder.findIndex(item => item.layer_id == layer_id);
			if(index+change < 0 || index+change > this.canvasOrder.length) return
			const clone = this.canvasOrder[index]
			this.canvasOrder.splice(index, 1);
			this.canvasOrder.splice(index+change, 0, clone);
			//this.canvasOrder.splice(index+change, 0, layer_id);
			for (let i = 0; i < this.canvasOrder.length; i++) {
				console.log('*', i,layer_id, this.canvasOrder, this.canvasState)
				this.canvasState[this.canvasOrder[i].layer_id].style.zIndex = i+1
			}
		},
		addPointToHistory({ layer_id=this.current.layer_id, canvas_id=this.current.canvas_id, strokeIndex=null, point={type:null} } = {}) {
			let _layer_id = layer_id
			let _canvas_id = canvas_id
			
			if(point.type == 'cursor'){
				
			}
			
			if(_canvas_id != this.current.canvas_id) return
			if(!this.canvasHistory[_layer_id]) this.canvasHistory[_layer_id] = []
			if(!this.canvasHistory[_layer_id][strokeIndex]) this.canvasHistory[_layer_id][strokeIndex] = {}
			this.canvasHistory[_layer_id][strokeIndex] = point
		}, 
		addStrokeToHistory({ canvas_id=this.current.canvas_id, layer_id=this.current.layer_id, strokeIndex=null, arr=[] } = {}) {
			let _layer_id = layer_id
			let _canvas_id = canvas_id
			//console.log('this.canvasHistory', this.canvasHistory, canvasStore().canvasHistory, this.current.canvas_id, _canvas_id, _layer_id)
			if(_canvas_id != this.current.canvas_id) return
			else if(!this.canvasHistory[_layer_id]) this.canvasHistory[_layer_id] = []
			if(!strokeIndex) this.canvasHistory[_layer_id].push(arr)
			else this.canvasHistory[_layer_id][strokeIndex] = arr
		}, 
		removeStrokeFromHistory(obj) {
			let { canvas_id, layer_id, strokeIndex } = obj;
			if(canvas_id == canvasStore().current.canvas_id){
				if(!strokeIndex) strokeIndex = canvasStore().canvasHistory[layer_id].length-1
				canvasStore().canvasHistory[layer_id].splice(strokeIndex, 1)
				//delete canvasStore().canvasHistory[layer_id][strokeIndex]
				canvasStore().queue.push({ event: 'redraw', layer_id:layer_id })
			}
		}, 
		
		addCanvas(argObj){
			let obj = {
				...{
					id:this.current.layer_id,
					canvas_id:this.current.canvas_id, 
					layer_id:this.current.layer_id, 
					arr:[], 
					properties:{},
				},
				...argObj
			}
			let {layer_id, properties, arr} = obj
			//if(parent != this.current.canvas_id) return
			this.canvasHistory[layer_id] = arr
			this.canvasList[layer_id] = properties
			this.canvasRefs[layer_id] = null
			//this.canvasOrder.push(_layer_id)
			//this.canvasOrder.push({layer_id:layer_id, layer_name})
			this.canvasOrder.push(properties)
			this.setCanvasState(layer_id)
			this.queue.push({
				event: 'newCanvas',
				layer_id: layer_id
			})
		}, 
		async removeParent({ canvas_id=this.current.canvas_id, layer_id=this.current.layer_id } = {}) {
			if(canvas_id == canvasStore().current.canvas_id){
				canvasStore().current.canvas_id = null//'Start'
				canvasStore().current.layer_id = null//''
			  }
			var index = await canvasStore().parentList.findIndex(item => item.canvas_id == canvas_id);
			console.log('removeParent', index, ' ----- ', canvasStore().current)
			if(index != -1) canvasStore().parentList.splice(index,1)//delete canvasStore().parentList[index]
			canvasStore().changeParent()
		},
		removeCanvas({ canvas_id=this.current.canvas_id, layer_id=this.current.layer_id } = {}) {
			//let _layer_id = canvas_id ? canvas_id : layerId
			//let _canvas_id = parent_id ? parent_id : parent
			//console.log('0-store.removeCanvas', parent, layerId, this.canvasRefs)
			if(canvas_id != this.current.canvas_id) return
			else if(!this.canvasHistory[layer_id]) return
			delete this.canvasHistory[layer_id];	// Delete Canvas
			delete this.canvasList[layer_id];
			delete this.canvasRefs[layer_id]
			delete this.canvasState[layer_id]
			var index = this.canvasOrder.findIndex(item => item.layer_id == layer_id);
			//if(index != -1) delete this.canvasOrder[index]
			if(index != -1) this.canvasOrder.splice(index,1)
			if(layer_id == this.current.layer_id) {
				canvasStore().historyTemp = []
				this.current.layer_id = utils.getStartPoint({obj:this.canvasList})
				setUrl({picture:false,owner:false})
				//this.current.layer_id
			}
		}, 
		setCanvasState(layer_id, zIndex=Object.keys(this.canvasState).length){
			// configStore().general.hideLayersNotOwnedBySelf
			let va = configStore().general
			console.log('setCanvasState', va.hideLayersLongerThan)
			let hidden = (
				(va.hideStartPageLayersByDefault && this.current.canvas_id == 'Canvas' && (layer_id != 'Layer' || layer_id != 'users')) || 
				(va.hideLayersByDefault) ||
				(va.hideLayersNotOwnedBySelf && canvasStore().canvasList[layer_id].owner != configStore().user.username) || 
				(va.hideLayersLongerThan && canvasStore().canvasHistory[layer_id].length > va.hideLayersLongerThan)
				) ? true : false

			this.canvasState[layer_id] = reactive({
				style: { zIndex: zIndex, },	
				listStyle: {},
				grayed: false,
				hidden: hidden,
			})
		},
		async changeCanvas({layer_id}){
			console.log('changeCanvas', layer_id)
			if(layer_id) canvasStore().current.layer_id = layer_id
			//Object.assign(canvasStore().historyTemp, []);
			canvasStore().historyTemp = []
			setUrl({picture:false,owner:false})
		},
		async clearOld(obj){
			//console.log('obj1', obj, Array.isArray(obj))
			if(Array.isArray(obj)){
				for (let i = 0; i < obj.length; i++) {
					for (const [key, value] of Object.entries(obj[i])) {
						if(Array.isArray(obj[i])) obj[i].splice(0,1)
						else await delete obj[i][key]
					}
				}
				//console.log('obj2', obj)
				return
			}
			for (const [key, value] of Object.entries(obj)) {
				await delete obj[key]
			}
		},
		async initCanvasPage(){
			let res = await utils.axiosGet({ url: 'getParents', obj:{username: configStore().user.username}, whoSentYou: `initCanvasPage` })
			await this.clearOld([canvasStore().parentList])
			store().msg({initCanvasPage_clearOld: {parentList: canvasStore().parentList}})
			Object.assign(canvasStore().parentList, res.data)
			//canvasStore().parentList = res.data

			let queryString = window.location.search;
			let urlParams = new URLSearchParams(queryString);	
			let canvas_id = (urlParams.get('canvas_id')) ? urlParams.get('canvas_id') : 'Canvas'
			let layer_id = (urlParams.get('layer_id')) ? urlParams.get('layer_id') : 'Layer'

			if(!canvas_id) canvas_id = 'Canvas'
			if(!layer_id) layer_id = 'Layer'
			canvasStore().changeParent({canvas_id, layer_id})
		},
		async changeParent({canvas_id=canvasStore().current.canvas_id, layer_id=canvasStore().current.layer_id} = {}) {
			//utils.printBrowser({text: `changeParent.... canvas_id: ${canvas_id},          layer_id:${layer_id}`})
			store().msg({changeParentStart: {canvas_id, layer_id}})
			canvasStore().current.canvas_id=canvas_id

			await this.clearOld([canvasStore().canvasList, canvasStore().ctx, canvasStore().canvasRefs, canvasStore().canvasHistory, canvasStore().canvasState, canvasStore().canvasOrder])
			store().msg({clearOld: {
				canvasList:canvasStore().canvasList, ctx: canvasStore().ctx, canvasRefs: canvasStore().canvasRefs, canvasHistory: canvasStore().canvasHistory, canvasState:canvasStore().canvasState, canvasOrder: canvasStore().canvasOrder
			}})
			
			let res = await utils.axiosGet({ url: 'getChildren', obj: { canvas_id: canvas_id, username: configStore().user.username }, whoSentYou: '\x1b[31m watch(canvasses.current.canvas_id)1/3 \x1b[0m' })
			Object.assign(canvasStore().canvasList, res.data)
			//canvasStore().canvasList = res.data

			store().msg({username: configStore().user.username})
			store().msg({current: {canvas_id:canvasStore().current.canvas_id, layer_id:canvasStore().current.layer_id}})
			store().msg({parentList: canvasStore().parentList})
			
			
			canvasStore().canvasList['users'] = {layer_id: 'users', layer_name: 'users', type: 'users', owner: 'God'}
			canvasStore().canvasHistory['users'] = [[{type:'cursor', user:configStore().user.username}]]

			canvasStore().historyTemp = []

			await nextTick()
			//utils.printBrowser({text:`Object.entries(canvasStore().canvasList) ${JSON.stringify(canvasStore().canvasList)}`})
			let i = 0
			for (const [key, value] of Object.entries(canvasStore().canvasList)) {
				//utils.printBrowser({text:`${key}, ${value}`})
				canvasStore().canvasOrder.push({layer_id:value.layer_id, layer_name:value.layer_name, ...value})
				canvasStore().canvasRefs[key] = ref(null)
				canvasStore().canvasOffScreen[key] = new OffscreenCanvas(window.innerWidth, window.innerHeight);
				canvasStore().canvasRefs2[key] = document.createElement('canvas')
				//this.setCanvasState(key)
				//console.log('hm', i,  key, this.canvasOrder)
				await nextTick()
				canvasStore().queue.push({event:'setContext', layer_id:key})	// canvasStore().ctx[value.layer_id] = canvasStore().canvasRefs[value.layer_id].getContext('2d')
				i += 1
			}

			store().msg({canvasList: canvasStore().canvasList})
			store().msg({canvasOrder: canvasStore().canvasOrder})

			canvasStore().current.layer_id = await utils.getStartPoint({obj:canvasStore().canvasList})
			if(canvasStore().canvasList[layer_id]) canvasStore().current.layer_id = layer_id
			
			res = await utils.axiosGet({ 
				url: 'getHistories', 
				obj: { layerList: Object.keys(canvasStore().canvasList), canvas_id: canvasStore().current.canvas_id }, 
				whoSentYou: '\x1b[31m watch(canvasses.current.canvas_id)2/3 \x1b[0m' 
			})
			Object.assign(canvasStore().canvasHistory, res.data)
			//canvasStore().canvasHistory = res.data
			store().msg({canvasHistory: canvasStore().canvasHistory})

			for (const key of Object.keys(canvasStore().canvasList)) {
				this.setCanvasState(key)
			}

			canvasStore().state.sizeCanvas.w = window.innerWidth
			canvasStore().state.sizeCanvas.h = window.innerHeight

			
			if (canvasStore().parentListComputed[canvasStore().current.canvas_id]?.background_type == 'picture_file')
				canvasStore().currentPicture.src = await utils.fetchPicture({ pictureFile: canvasStore().parentListComputed[canvasStore().current.canvas_id].file_path })
			else
				await refs().TheZoom?.resetZoom()
			

			setUrl()
			store().setTitle()
			store().msg({canvasRefs: canvasStore().canvasRefs})
			store().msg({changeParentEnd: {canvas_id:canvasStore().current.canvas_id, layer_id:canvasStore().current.layer_id}})
		}, 	
	}
	
	//let getParentList = () => Object.keys(canvasList)
	//let getChildList = () => Object.keys(canvasList[current.canvas_id])

	
});