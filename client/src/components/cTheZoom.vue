
<template>
	<div>
		<div :style="[style.canvasContainer]" id="ZOOM"
			@dblclick.prevent="mouseEvent"
			@mousedown.passive="mouseEvent"
			@mouseup.passive="mouseEvent"
			@mousemove.passive.capture="mouseEvent"
			@mouseenter.passive="mouseEvent"
			@mouseleave.passive="mouseEvent"
			@wheel.passive="mouseEvent"
			@keyup.esc="mouseEvent"
			@keydown="mouseEvent"
			tabindex="0"
			:class="{ 'cursor-grab': conf.toolActive == 'nav', 'cursor-grabbing': canvasStore().state.currentlyDragging }"
		>
			<slot />
		</div>
	</div>
</template>


<script setup>
import { canvasStore, styleStore, configStore, windowStore } from "@/stores/store.js";
import * as utils from '../utils.js'
//import c from './../constants.js';
/* Virtual script not found, may missing <script lang="ts"> / "allowJs": true / jsconfig.json.volar */
import { defineComponent, watch, toRefs, toRef, watchEffect, onMounted, onBeforeMount, onBeforeUnmount, onUpdated, nextTick, ref, reactive  } from 'vue'
import SocketioService from '../socketio.service.js';
import { store } from "../stores/store";

//expose({ resetZoom })
defineExpose({ resetZoom });
const emit = defineEmits(['draw', 'zoomHandler'])

const style = styleStore();
const canvasses = reactive(canvasStore());	// canvasStore().currentCanvas	// store.currentCanvas	// canvasName	// canvasHistory
const conf = reactive(configStore());


const props = defineProps({
	state: {
		type: Object,
		required: false,
		default: {},
	},
})

const canvasRefs = reactive(canvasses.canvasRefs)


function setDefaultScale ({scale=null,width=canvasStore().currentPicture.width, height=canvasStore().currentPicture.height, fit='image', set=true}={})  {
	if(scale) return configStore().navState.scale = scale
	let scaleWidth = window.innerWidth / width 
	let scaleHeight = window.innerHeight / height 
	if(fit=='image') return configStore().navState.scale = Math.min(scaleWidth, scaleHeight)
	if(fit=='screen') return configStore().navState.scale = Math.max(scaleWidth, scaleHeight)
	//if(fit=='map') return configStore().navState.scale = 3
	//if(fit=='noScale') return configStore().navState.scale = 1
}


//canvasses.currentPicture.onload = () => {}
//onBeforeMount(async () => {})
//onMounted(async () => {})
//onBeforeUnmount(() => {})
//watchEffect(async () => {})
//watch(() => (canvasses.current.canvas_id), async (parent) => {}) */

var newCoords = ({ e,purpose = 'draw' } = {}) => {
		const rect = canvasRefs[canvasses.current.layer_id]?.getBoundingClientRect()
		let round = configStore().toolState.roundPencilDraw 
		canvasStore().state.click.x0 = canvasStore().state.click.x
		canvasStore().state.click.y0 =  canvasStore().state.click.y
		canvasStore().state.click.x = round ? Math.round((e.clientX-rect?.left)/configStore().navState.scale) : (e.clientX-rect?.left)/configStore().navState.scale
		canvasStore().state.click.y = round ? Math.round((e.clientY - rect?.top) / configStore().navState.scale) : (e.clientY - rect?.top) / configStore().navState.scale

		if (purpose == 'draw') {
			//console.log('hm', purpose)
			canvasStore().state.click.x += round ? Math.round(configStore().navState.ofs.x) : configStore().navState.ofs.x
			canvasStore().state.click.y += round ? Math.round(configStore().navState.ofs.y) : configStore().navState.ofs.y
		}
}
function onMouseDown(e){
	canvasStore().state.holding = true
		if (e.buttons == 1 && configStore().toolState.toolActive != 'nav') {		// 		mousedown. Left mouse.			
			canvasStore().canvasState.currentlyDrawing = true;
			newCoords({ e, purpose: 'draw' })
			canvasStore().queue.push({event:'drawPoint', type: 'dot', emit:true, source:'self' })
		}
		else if (e.buttons == 4 || (e.buttons == 1 && conf.toolState.toolActive == 'nav')) {	// 	mousedown. Middle mouse.	
			canvasStore().state.currentlyDragging = true;
			newCoords({ e, purpose: 'translate' })
		}
		else if (e.buttons == 2) {	// 	mousedown. Right mouse.		
			if (canvasStore().state.holding) {
				canvasses.historyTemp = []
				console.log('!!!!!!!!!!!!!!!!!!!!!!!!! e.button 2 - redraw')
				canvasStore().queue.push({event:'redraw', layer_id:null, source:'self'})
			}
			console.log('Rightclick')
		}
}

function onMouseUp(e){
	windowStore().current.activeWindow = null
		windowStore().current.holding = false
		canvasStore().state.currentlyDrawing = false;
		canvasStore().state.currentlyDragging = false;

		if(canvasses.historyTemp[0]?.type == 'lineTo' || canvasses.historyTemp[1]?.type == 'lineTo' || canvasses.historyTemp[2]?.type == 'lineTo'){
			let tempArray = []
			let tempAttr = null
			let tempSum = 0
			canvasses.historyTemp = canvasses.historyTemp.reduce((accumulator, currentValue, i)=>{
				let {type, x,y,x1,x2,y1,y2,color,size,w,h, layer_id} = currentValue
				//console.log('currentValue', currentValue.type, currentValue, i, canvasses.historyTemp.length, i == canvasses.historyTemp.length-1)
				if(currentValue.type != 'lineTo') return accumulator
				
				if(!tempAttr){
					tempAttr = {type, color, size, } // layer_id	// color,size,x1,x2,y1,y2, layer_id
					tempArray = []
					return accumulator
				}
				if(currentValue.type == 'lineTo' && i == canvasses.historyTemp.length-1) {
					let res = [...accumulator ,  {...tempAttr, ...{arr: [...tempArray]} }]
					tempAttr = null
					return res
				}
				else if(currentValue.type == 'lineTo'){
					let sum = x1 + x2 + y1 + y2
					//if(sum!=tempSum)
					//if(Math.round(sum) != Math.round(tempSum))
						tempArray.push({x1,y1 , x2,y2})
					tempSum = sum
					return accumulator
				}
			}, [])
		}

		canvasStore().state.holding = false
		if (canvasStore().historyTemp != [] || !canvasStore().historyTemp || canvasStore().historyTemp != null || canvasStore().historyTemp != undefined) {
			if (canvasStore().current.layer_id && true ) {
				SocketioService.socket.emit('stroke:add', {
					canvas_id: canvasStore().current.canvas_id,
					layer_id: canvasStore().current.layer_id,
					arr: canvasStore().historyTemp,
					//strokeIndex: canvasses.canvasHistory[canvasses.current.layer_id]?.length, 
					strokeIndex: (canvasStore().canvasHistory[canvasStore().current.layer_id]?.at(-1)?.strokeIndex) ? canvasStore().canvasHistory[canvasStore().current.layer_id]?.at(-1)?.strokeIndex : canvasStore().canvasHistory[canvasStore().current.layer_id]?.length, 
					strokeId:''
				})
				canvasStore().historyTemp = []
			}
		}
}

var lastMove = [Date.now()] //new Date().getSeconds()
function onMouseMove(e){
	//return
	if(windowStore().func.mouseMove(e)) return
		if (!canvasStore().state.holding && (configStore().cursor.display)) {
			newCoords({ e, purpose: 'draw' })
			canvasStore().queue.push({event:'drawPoint', type: 'cursor', emit:true, source:'self' })
		}

		if (canvasStore().state.holding && e.buttons == 1 /* && conf.toolState.toolActive != 'nav' */ && (conf.toolState.toolActive == 'pencil' || conf.toolState.toolActive == 'eraser')) {
			canvasStore().state.currentlyDrawing = true
			newCoords({ e, purpose: 'draw' })
			emit('draw', { x:0, y:0, type: 'line' })

		}
		else if (canvasStore().state.holding && (e.buttons == 4 || (e.buttons == 1 && conf.toolState.toolActive == 'nav'))) {
			lastMove[1] = Date.now()
			if(lastMove[1] > lastMove[0] + configStore().navigation.dragDelay_ms) 
				lastMove[0] = Date.now()
			 else
				return
			
			
			canvasStore().state.currentlyDragging = true;
			newCoords({ e, purpose: 'translate' })

			configStore().navState.ofs.x -= canvasStore().state.click.x - canvasStore().state.click.x0
			configStore().navState.ofs.y -= canvasStore().state.click.y - canvasStore().state.click.y0

			for (const id of Object.keys(canvasRefs)) {
				const ctx2 = canvasRefs[id].getContext('2d')
				ctx2.translate(
					canvasStore().state.click.x - canvasStore().state.click.x0, 
					canvasStore().state.click.y - canvasStore().state.click.y0
				);
				
			}
			canvasStore().queue.push({event:'redraw', layer_id:null, source:'self'})
		}
		else if (canvasStore().state.holding && e.buttons == 8) { // redo
			console.log('Redo', e)
		}
}

function onKeyboard(e){
	let move = {}
		if (e.code == 'Escape') { }
		else if (e.code == 'Backspace' || e.code == 'Delete') {
			if(canvasses.canvasHistory[canvasses.current.layer_id].length < 1) return
			let index = canvasses.canvasHistory[canvasses.current.layer_id].length - 1
			while (index > 0) {
				console.log('index', index, canvasses.canvasHistory[canvasses.current.layer_id][index])
				if (canvasses.canvasHistory[canvasses.current.layer_id][index] != undefined) {
					break
				}
				index -= 1
			}
			SocketioService.socket.emit('stroke:remove', {
				canvas_id: canvasses.current.canvas_id,
				layer_id: canvasses.current.layer_id,
				strokeIndex: index
			})
		}
		else if (
			e.code == 'KeyA' || e.code == 'ArrowLeft' ||
			e.code == 'KeyD' || e.code == 'ArrowRight' ||
			e.code == 'KeyW' || e.code == 'ArrowUp' ||
			e.code == 'KeyS' || e.code == 'ArrowDown') {

			move['x'] = (e.code == 'KeyA') ? -1 : (e.code == 'ArrowLeft') ? -1 :
				(e.code == 'KeyD') ? 1 : (e.code == 'ArrowRight') ? 1 : 0
			move['y'] = (e.code == 'KeyW') ? -1 : (e.code == 'ArrowUp') ? -1 :
				(e.code == 'KeyS') ? 1 : (e.code == 'ArrowDown') ? 1 : 0


			
			configStore().navState.ofs.x += move.x * conf.navigation.keyTranslateIntensity
			configStore().navState.ofs.y += move.y * conf.navigation.keyTranslateIntensity
			for (const id of Object.keys(canvasRefs)) {
				const ctx2 = canvasRefs[id].getContext('2d')
				ctx2.translate(-move.x * conf.navigation.keyTranslateIntensity, -move.y * conf.navigation.keyTranslateIntensity);
			}
			canvasStore().queue.push({event:'redraw', layer_id:null, source:'self'})

		}
}

function mouseEvent(e) {
	//return
	if (canvasses.current.layer_id == null) return //console.log('No Canvas Selected.')
	
	if (e.type == 'dblclick') {
		zoomHandler(e, configStore().navigation.doubleClickZoomIntensity)
	}
	else if (e.type == 'mousedown') {		// MOUSEDOWN
		onMouseDown(e)
	}
	else if (e.type == 'mouseup') {	// MOUSEUP
		onMouseUp(e)
	}
	else if (e.type == 'mousemove') {	// MOUSEMOVE
		onMouseMove(e)
	}
	else if (e.type == 'mouseenter') {	// MOUSEENTER
		//insideCanvas = true
	}
	else if (e.type == 'mouseleave') {	// MOUSELEAVE
		//insideCanvas = false
	}
	else if (e.type == 'wheel' && !canvasStore().state.holding) {	// WHEEL
		var zoom = Math.exp(configStore().navigation.scrollZoomIntensity * (e.deltaY < 0 ? 1 : -2));
		zoomHandler(e, zoom)
	}
	else if (e.type == 'keydown') {		// KEYDOWN
		onKeyboard(e)
	}

}

function zoomHandler(e, zoom) {
	let ref = canvasRefs[Object.keys(canvasses.canvasList)[0]]
	var x = e.clientX - ref.offsetLeft;
	var y = e.clientY - ref.offsetTop;

	
	for (const id of Object.keys(canvasRefs)) {
		const ctx = canvasRefs[id].getContext('2d')
		ctx.translate(configStore().navState.ofs.x, configStore().navState.ofs.y);

	}
	configStore().navState.ofs.x -= x / (configStore().navState.scale * zoom) - x / configStore().navState.scale;
	configStore().navState.ofs.y -= y / (configStore().navState.scale * zoom) - y / configStore().navState.scale;

	for (const id of Object.keys(canvasRefs)) {
		const ctx = canvasRefs[id].getContext('2d')
		ctx.scale(zoom, zoom);
		ctx.translate(-configStore().navState.ofs.x, -configStore().navState.ofs.y);

	}
	configStore().navState.scale *= zoom;
	canvasStore().queue.push({event:'redraw', layer_id:null, source:'self'})
}

function resetZoom({x=0, y=0, mode=null}={}, scale=null) {
	store().msg({text: 'resetZoom'})
	for (const id of Object.keys(canvasStore().canvasRefs)) {
		const ctx = canvasStore().canvasRefs[id].getContext('2d')

		configStore().navState.ofs.x = x
		configStore().navState.ofs.y = y
		configStore().navState.scale = 1

		if(scale){
			configStore().navState.scale = scale
			configStore().navState.ofs.x = x*configStore().navState.scale
			configStore().navState.ofs.y = y*configStore().navState.scale
		}
		else if(!canvasStore().parentListComputed[canvasStore().current.canvas_id]?.background_type?.includes('picture')){

		}
		else if (canvasStore().parentListComputed[canvasStore().current.canvas_id]?.background_type == 'picture_file'){
			if(!mode || mode == 'scaleToFit')
				configStore().navState.scale = setDefaultScale({scale:null, fit:'image'})
			if(mode == 'scaleToFill')
				configStore().navState.scale = setDefaultScale({scale:null, fit:'screen'})
			let scaledSize = {
				x: canvasStore().currentPicture.width*configStore().navState.scale, 
				y: canvasStore().currentPicture.height*configStore().navState.scale
			}
			let center = {
				x: (((scaledSize.x) - canvasStore().state.sizeCanvas.w)/2) / configStore().navState.scale, 
				y: (((scaledSize.y) - canvasStore().state.sizeCanvas.h)/2) / configStore().navState.scale
			} 
			configStore().navState.ofs.x = center.x
			configStore().navState.ofs.y = center.y
			/* configStore().navState.ofs.x = 1
			configStore().navState.ofs.y = 1 */

			//utils.printBrowser({text: canvasStore().currentPicture.width*configStore().navState.scale})
		}
		ctx.setTransform(configStore().navState.scale, 0, 0, configStore().navState.scale, 0, 0);
		ctx.translate(-configStore().navState.ofs.x, -configStore().navState.ofs.y)
		
		canvasStore().queue.push({event:'redraw', layer_id:id, source:'self'})
	}
}
function setToCurrentTransform(id) {
	if (canvasRefs[id] == null || canvasRefs['img'] == null) return 
	let def = canvasRefs['img'].getContext('2d').getTransform()
	const ctx = canvasRefs[id].getContext('2d')
	ctx.setTransform(def.a, def.b, def.c, def.d, def.e, def.f);
}




</script>


<style scoped>

.hidden {
	visibility: hidden;
}
</style>


