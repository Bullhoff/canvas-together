
<template>
	<div>
		<!-- style="z-index:9999" -->
		<SettingsMenu @resetZoom="resetZoom" @testEmit="testEmit" />
		<div :style="[style.canvasContainer]"
			@dblclick.prevent="mouseEvent"
			@mousedown.passive="mouseEvent"
			@mouseup.passive="mouseEvent"
			@mousemove.passive="mouseEvent"
			@mouseenter.passive="mouseEvent"
			@mouseleave.passive="mouseEvent"
			@wheel.passive="mouseEvent"
			@keyup.esc="mouseEvent"
			@keydown="mouseEvent"
			tabindex="0"
			:class="{ 'cursor-grab': conf.toolActive == 'nav', 'cursor-grabbing': conf.canvasState.currentlyDragging }">

			
			<slot 
				:data="data"
			/>

		</div>
		<!-- <div style="position:absolute; left: 0; top: 0; background-color: aqua;">test</div> -->

	</div>
</template>


<script setup>
/* 
	*Scale
	*ofs
	*SIZE - SLOT CONTENT
*/


import SocketioService from '../socketio.service.js';
import { canvasStore, styleStore, configStore } from "@/stores/store.js";


import * as utils from '../utils.js'
//import c from './../constants.js';

/* https://stackoverflow.com/questions/3008635/html5-canvas-element-multiple-layers */
/* Virtual script not found, may missing <script lang="ts"> / "allowJs": true / jsconfig.json.volar */
import { defineComponent, watch, toRefs, toRef, watchEffect, onMounted, onBeforeMount, onBeforeUnmount, onUpdated, nextTick, ref, reactive } from 'vue'
//import socketioService from '../socketio.service.js';

const emit = defineEmits(['input', 'toggleHidden', 'remove', 'setActiveIndex'])

const props = defineProps({
	colorList: {
		type: Array,
		required: false,
		default: ['#9c1c1c', '#9c1c9c'],
	},
})

const style = styleStore();
const canvasses = reactive(canvasStore());	// canvasStore().currentCanvas	// store.currentCanvas	// canvasName	// canvasHistory
const conf = reactive(configStore());


var holding = false //ref(false)
var x = { from: 0, to: 0 }
var y = { from: 0, to: 0 }

var orgnx = ref(0);
var orgny = ref(0);
var coord = reactive({ x1: 0, x2: 0, y1: 0, y2: 0 })

var sizeCanvas = reactive({
	w: window.innerWidth,	//(currentPicture.width*scaleFactor.value), 
	h: window.innerHeight	//(currentPicture.height*scaleFactor.value)
})

configStore().navState.scale = conf.defaultScale({width:1, height:1,fit:'image'})


canvasses.currentPicture.onload = () => {
	console.log('canvasses.currentPicture Loaded')
	sizeCanvas.w = window.innerWidth
	sizeCanvas.h = window.innerHeight
	resetZoom()
}

onBeforeMount(async () => {})

onMounted(async () => {})

onBeforeUnmount(() => {})


function mouseEvent(e) {
	if (canvasses.current.id == null) return //console.log('No Canvas Selected.')
	var newCoords = ({ purpose = 'draw' } = {}) => {
		const rect = canvasRefs[canvasses.current.id].getBoundingClientRect()
		coord.x1 = coord.x2
		coord.y1 = coord.y2
		coord.x2 = (e.clientX - rect.left) / configStore().navState.scale
		coord.y2 = (e.clientY - rect.top) / configStore().navState.scale
		if (purpose == 'draw') {
			coord.x2 += orgnx.value
			coord.y2 += orgny.value
		}
	}
	if (e.type == 'dblclick') {
		zoomHandler(e, conf.doubleClickZoomIntensity)
	}
	else if (e.type == 'mousedown') {		// MOUSEDOWN
		holding = true
		if (e.buttons == 1 && conf.toolActive != 'nav') {		// 		mousedown. Left mouse.			
			conf.canvasState.currentlyDrawing = true;
			newCoords({ purpose: 'draw' })
			draw({ x, y, type: 'dot' })
		}
		else if (e.buttons == 4 || (e.buttons == 1 && conf.toolActive == 'nav')) {	// 	mousedown. Middle mouse.	
			conf.canvasState.currentlyDragging = true;
			newCoords({ purpose: 'translate' })
		}
		else if (e.buttons == 2) {	// 	mousedown. Right mouse.		
			if (holding) {
				canvasses.historyTemp = []
				console.log('!!!!!!!!!!!!!!!!!!!!!!!!! e.button 2 - redraw')
				redraw()
			}
			console.log('Rightclick')
		}
	}
	else if (e.type == 'mouseup') {	// MOUSEUP
		conf.canvasState.currentlyDrawing = false;
		conf.canvasState.currentlyDragging = false;
		holding = false
		if (canvasses.historyTemp != [] || !canvasses.historyTemp || canvasses.historyTemp != null || canvasses.historyTemp != undefined) {
			if (canvasses.current.id && true) {
				socketioService.socket.emit('stroke:add', {
					parent: canvasses.current.parent,
					canvasId: canvasses.current.id,
					arr: canvasses.historyTemp,
					strokeIndex: canvasses.canvasHistory[canvasses.current.id].length
				})
				canvasses.historyTemp = []
			}
			else
				console.log('No ID', canvasses.historyTemp)
		}
	}
	else if (e.type == 'mousemove') {	// MOUSEMOVE
		if (holding && e.buttons == 1 && conf.toolActive != 'nav') {
			conf.canvasState.currentlyDrawing = true
			newCoords({ purpose: 'draw' })
			draw({ x, y })

		}
		else if (holding && (e.buttons == 4 || (e.buttons == 1 && conf.toolActive == 'nav'))) {
			conf.canvasState.currentlyDragging = true;
			newCoords({ purpose: 'translate' })
			orgnx.value -= coord.x2 - coord.x1
			orgny.value -= coord.y2 - coord.y1
			configStore().navState.ofs.x -= coord.x2 - coord.x1
			configStore().navState.ofs.y -= coord.y2 - coord.y1

			for (const id of Object.keys(canvasRefs)) {
				const ctx2 = canvasRefs[id].getContext('2d')
				ctx2.translate(coord.x2 - coord.x1, coord.y2 - coord.y1);
			}
			redraw()
		}
		else if (holding && e.buttons == 8) { // redo
			console.log('Redo', e)
		}

	}
	else if (e.type == 'mouseenter') {	// MOUSEENTER
		//insideCanvas = true
	}
	else if (e.type == 'mouseleave') {	// MOUSELEAVE
		//insideCanvas = false
	}
	else if (e.type == 'wheel' && !holding) {	// WHEEL
		var zoom = Math.exp(configStore().scrollZoomIntensity * (e.deltaY < 0 ? 1 : -2));
		zoomHandler(e, zoom)
	}
	else if (e.type == 'keydown') {		// KEYDOWN
		let move = {}
		if (e.code == 'Escape') { }
		else if (e.code == 'Backspace' || e.code == 'Delete') {
			let index = canvasses.canvasHistory[canvasses.current.id].length - 1
			while (index > 0) {
				console.log('index', index, canvasses.canvasHistory[canvasses.current.id][index])
				if (canvasses.canvasHistory[canvasses.current.id][index] != undefined) {
					break
				}
				index -= 1
			}
			socketioService.socket.emit('stroke:remove', {
				parent: canvasses.current.parent,
				canvasId: canvasses.current.id,
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


			orgnx.value += move.x * conf.keyTranslateIntensity
			orgny.value += move.y * conf.keyTranslateIntensity
			configStore().navState.ofs.x += move.x * conf.keyTranslateIntensity
			configStore().navState.ofs.y += move.y * conf.keyTranslateIntensity
			for (const id of Object.keys(canvasRefs)) {
				const ctx2 = canvasRefs[id].getContext('2d')
				ctx2.translate(-move.x * conf.keyTranslateIntensity, -move.y * conf.keyTranslateIntensity);
			}
			redraw()

		}
	}

}

function zoomHandler(e, zoom) {
	let ref = canvasRefs[Object.keys(canvasses.canvasList)[0]]
	var x = e.clientX - ref.offsetLeft;
	var y = e.clientY - ref.offsetTop;

	for (const id of Object.keys(canvasRefs)) {
		const ctx = canvasRefs[id].getContext('2d')
		ctx.translate(orgnx.value, orgny.value);
	}
	orgnx.value -= x / (configStore().navState.scale * zoom) - x / configStore().navState.scale;
	orgny.value -= y / (configStore().navState.scale * zoom) - y / configStore().navState.scale;
	configStore().navState.ofs.x -= x / (configStore().navState.scale * zoom) - x / configStore().navState.scale;
	configStore().navState.ofs.y -= y / (configStore().navState.scale * zoom) - y / configStore().navState.scale;

	for (const id of Object.keys(canvasRefs)) {
		//const ctx = canvasRefs[canvasses.id].getContext('2d')
		const ctx = canvasRefs[id].getContext('2d')
		ctx.scale(zoom, zoom);
		ctx.translate(-orgnx.value, -orgny.value);
	}
	configStore().navState.scale *= zoom;
	redraw()
}

function resetZoom(to = conf.defaultZoom) {
	for (const id of Object.keys(canvasRefs)) {
		const ctx = canvasRefs[id].getContext('2d')
		//console.log('getTransform()',ctx.getTransform())
		orgnx.value = 0;
		orgny.value = 0;
		configStore().navState.ofs.x = 0
		configStore().navState.ofs.y = 1

		if (to != '1')
			configStore().navState.scale = defaultScales()[to]
		//configStore().navState.scale = conf.defaultScale({fit:'image', width: canvasses.currentPicture.width, height: canvasses.currentPicture.height}) //defaultScales()[to]
		else
			configStore().navState.scale = 1//conf.defaultScale({ fit: 'map' })//1
		ctx.setTransform(configStore().navState.scale, 0, 0, configStore().navState.scale, 0, 0);
		redraw({ id: id })
	}
}
function setToCurrentTransform(id) {
	if (canvasRefs[id] == null || canvasRefs['img'] == null) return //console.log('setToCurrentTransform Null')
	let def = canvasRefs['img'].getContext('2d').getTransform()
	const ctx = canvasRefs[id].getContext('2d')
	ctx.setTransform(def.a, def.b, def.c, def.d, def.e, def.f);
}

function draw({ x, y, type = 'line' }) {
	if (canvasses.current.id == null || canvasses.current.id == 'img') return //console.log('No Canvas Selected.')
	const ctx = canvasRefs[canvasses.current.id].getContext('2d')
	ctx.lineCap = 'round';
	var size = conf.toolState.size * conf.toolState[conf.toolActive].sizeMultiplier
	if (conf.scaleDrawSize) size /= configStore().navState.scale
	var addToHistory = {}
	var emit = ''
	let color = (conf.colors[conf.activeColor] != 'random') ? conf.colors[conf.activeColor] : utils.getRandomColor({ format: 'hex' })

	if (conf.toolActive == 'unicode') {
		emit = 'point:add'
		//console.log('symbol')
		let symb = String.fromCodePoint(`0x${conf.toolState.unicode.code}`)	// 0x1F354 `🍔`
		ctx.fillStyle = color;
		let font = `${size}px serif`
		ctx.font = font;
		ctx.textAlign = 'center'
		ctx.textBaseline = 'middle'
		ctx.fillText(symb, coord.x2, coord.y2);
		addToHistory = {
			//type: 'fillText',
			type: 'unicode',
			//text: symb,
			unicode: conf.toolState.unicode.code,
			font: font,
			color: color,
			size: size,
			x: coord.x2, y: coord.y2
		}

	}
	else if (conf.toolActive == 'eraser' /* && type == 'erase' */) {
		emit = 'point:add'
		//size *= conf.toolState.eraserSizeMultiplier
		ctx.clearRect(coord.x2 - size / 2, coord.y2 - size / 2, size, size);
		addToHistory = {
			type: 'clearRect',
			//color: color,
			size: size,
			x: coord.x2 - size / 2, y: coord.y2 - size / 2, w: size, h: size
		}
	}
	else if (conf.toolActive == 'pencil') {
		emit = 'point:add'
		//let color = (conf.colors[conf.activeColor] != 'random') ? conf.colors[conf.activeColor] : utils.getRandomColor({ format: 'hex' })
		ctx.fillStyle = color;
		if (type == 'dot') {
			ctx.fillRect(coord.x2 - size / 2, coord.y2 - size / 2, size, size);
			addToHistory = {
				type: 'fillRect',
				color: color,
				size: size,
				x: coord.x2 - size / 2, y: coord.y2 - size / 2, w: size, h: size
			}
		}
		else if (type == 'line') {
			ctx.beginPath();
			ctx.moveTo(coord.x1, coord.y1);
			ctx.lineTo(coord.x2, coord.y2);
			ctx.closePath();
			ctx.strokeStyle = color;
			ctx.lineWidth = size
			ctx.stroke();

			addToHistory = {
				type: 'lineTo',
				color: color,
				size: size,
				x1: coord.x1, y1: coord.y1, x2: coord.x2, y2: coord.y2
			}
		}
	} else {
		return
	}

	canvasses.historyTemp.push(addToHistory)
	socketioService.socket.emit('point:add', {
		parent: canvasses.current.parent,
		id: canvasses.current.id,
		strokeIndex: canvasses.canvasHistory[canvasses.current.id].length,
		point: addToHistory
	})

}

function redraw({ id = null } = {}) {
	var canvasRedrawList
	if (id == null)
		canvasRedrawList = Object.entries(canvasses.canvasHistory)
	else
		canvasRedrawList = Object.entries({ [id]: canvasses.canvasHistory[id] })

	for (const [id, history] of canvasRedrawList) {
		if (canvasRefs[id] == null || history == null) continue
		var ctx = canvasRefs[id].getContext('2d')
		ctx.lineCap = 'round';
		
		let curr = ctx.getTransform()
		//console.log('currentTransformation', curr, configStore().navState.scale, orgnx.value, orgny.value)
		ctx.clearRect(
			-(curr.e/curr.a), -(curr.f/curr.a), 
			(sizeCanvas.w/curr.a)*1, (sizeCanvas.h/curr.a)*1
		);
		
		
		for (let i = 0; i < history.length; i++) {
			if (!history[i]) continue
			for (let y = 0; y < history[i].length; y++) {
				let h = history[i][y]
				if (h.type == 'fillRect') {
					ctx.fillStyle = h.color;
					ctx.fillRect(h.x, h.y, h.size, h.size);
					ctx.stroke();
				}
				else if (h.type == 'lineTo') {
					ctx.beginPath();
					ctx.moveTo(h.x1, h.y1);
					ctx.lineTo(h.x2, h.y2);
					ctx.strokeStyle = h.color;
					ctx.lineWidth = h.size
					ctx.stroke();
					ctx.closePath();
				}
				else if (h.type == 'drawImage') {
					ctx.drawImage(canvasses.currentPicture, h.x, h.y)
				}
				else if (h.type == 'unicode') {
					let symb = String.fromCodePoint(`0x${h.unicode}`)	// 0x1F354 `🍔`
					ctx.fillStyle = h.color;
					//let font = `${size}px serif`
					ctx.font = h.font;
					ctx.textAlign = 'center'
					ctx.textBaseline = 'middle'
					ctx.fillText(symb, h.x, h.y);
				}
				else if (h.type == 'clearRect') {
					ctx.clearRect(h.x, h.y, h.size, h.size);
				}

			}
		}
	}
}
function drawfull() {
	var canvasRedrawList
	if (id == null)
		canvasRedrawList = Object.entries(canvasses.canvasHistory)
	else
		canvasRedrawList = Object.entries({ [id]: canvasses.canvasHistory[id] })
	for (const [id, history] of canvasRedrawList) {
		var ctx = canvasRefs[id].getContext('2d')
		//console.log(`${id} - ${ctx.getTransform()}`, ctx.getTransform())
		ctx.clearRect(-window.innerWidth / configStore().navState.scale * 100, -window.innerWidth / configStore().navState.scale * 100, window.innerWidth / configStore().navState.scale * 2000, window.innerHeight / configStore().navState.scale * 2000);
		drawHistory(ctx, history)
	}
}
function drawHistory(ctx, history) {
	for (let i = 0; i < history.length; i++) {
		drawStroke(ctx, history[y])
	}
}
function drawStroke(ctx, stroke) {
	for (let y = 0; y < stroke.length; y++) {
		drawPoint(ctx, stroke[y])
	}

}
function drawPoint({ ctx, point, id }) {
	if (point.type == 'fillRect') {
		ctx.fillStyle = point.color;
		ctx.fillRect(point.x, point.y, point.size, point.size);
		ctx.stroke();
	}
	else if (point.type == 'lineTo') {
		ctx.beginPath();
		ctx.moveTo(point.x1, point.y1);
		ctx.lineTo(point.x2, point.y2);
		ctx.strokeStyle = point.color;
		ctx.lineWidth = point.size
		ctx.stroke();
		ctx.closePath();
	}
	else if (point.type == 'drawImage') {
		ctx.drawImage(canvasses.currentPicture, point.x, point.y)
	}
	else if (point.type == 'unicode') {
		let symb = String.fromCodePoint(`0x${point.unicode}`)	// 0x1F354 `🍔`
		ctx.fillStyle = point.color;
		//let font = `${size}px serif`
		ctx.font = point.font;
		ctx.textAlign = 'center'
		ctx.textBaseline = 'middle'
		ctx.fillText(symb, point.x, point.y);
	}
	else if (point.type == 'clearRect') {
		ctx.clearRect(point.x, point.y, point.size, point.size);
	}
}


</script>


<style scoped>
@import "https://unpkg.com/leaflet@1.9.3/dist/leaflet.css";

.hidden {
	visibility: hidden;
}
</style>


