
<template>
	<div>
		<SettingsMenu   class="prevent-select"/>
		<TheWindows />
		<ContextMenu v-if="contextMenuStore().open" :init="contextMenuStore().prop"/>
		<!-- <PizzaCompanion v-if="configStore().pizzaCompanion.open" /> -->
		<TheZoom :ref="(el) => refs().TheZoom = el"	@draw="draw($event)" >
			<!-- width:100%; height:100%; position:absolute;	z-index:999; pointer-events: none;-->
			<div class="loader-container" style="" v-if="canvasStore().state.loading && !configStore().general.disableLoader">
				<div class="loader"  style=""></div>
				<div>{{ canvasStore().state.loading }}</div>
			</div>
			<div v-for="(canv, id, index) in canvasStore().canvasRefs" :key="id" style="display:inline; position:absolute;"> 
				<canvas :width="canvasStore().state.sizeCanvas.w" :height="canvasStore().state.sizeCanvas.h"
					@mousedown.ignore=""
					id="canvas"
					:style="[styleStore()?.canvas, canvasStore()?.canvasState[id]?.style]"
					:ref="el => { canvasStore().canvasRefs[id] = el }"
					:class="[(canvasStore()?.canvasState[id]?.hidden || canvasStore()?.canvasState[id]?.hidden == undefined) ? 'hidden' : '']"
					@contextmenu="onContextMenu"
					
					></canvas>

			</div>

			<SvgTest :ref="(el) => refs().svgComponent = el" v-if="configStore().general.test"/>
			
			
		</TheZoom>
	</div>
</template>


<script setup>
import SocketioService from '../socketio.service.js';
import { canvasStore, styleStore, configStore, store, refs, contextMenuStore, someStore } from "@/stores/store.js";
//import * as store from "@/stores/store.js";
//store.refs.TheZoom

import SettingsMenu from '@/components/cMenu.vue'
//import Maps from '@/components/cMaps.vue'
import TheZoom from '@/components/cTheZoom.vue'
import TheWindows from '@/components/cTheWindows.vue'
import ContextMenu from '@/components/cContextMenu.vue'
import * as utils from '../utils.js'
import { defineComponent, watch, toRefs, toRef, watchEffect, onMounted, onBeforeMount, onBeforeUnmount, onUpdated, nextTick, ref, reactive } from 'vue'
import SvgTest from '@/components/test/svg3.vue'
import PizzaCompanion from './../components/test/svg22.vue'

function preventDoubleClick(){
	if(document.selection)
	document.selection.empty()
}

//const canvasStore() = reactive(canvasStore());	// canvasStore().currentCanvas	// store.currentCanvas	// canvasName	// canvasHistory


function onContextMenu(e){
	if(configStore().general.normalContextMenu) return
	e.preventDefault()
	let items = {}
	items['Disable this contextmenu'] = () => configStore().general.normalContextMenu = true,
	items['sliderTest'] = { 
			type: 'slider', 
			text: 'Zoom',
			value: 1, 
			//value: configStore().navState.scale, 
			min: 0, 
			max: 5,
			//max: configStore().navState.scale*10,
			onChange: (val)=> {configStore().zoomHandler(e, val)},
			__onChange: (val)=> {configStore()._zoomHandler({e, zoom:val, scale:val})}, 
	}

	contextMenuStore().onContextMenu(e, items)
}


var coord = reactive({ x1: 0, x2: 0, y1: 0, y2: 0 })

//canvasStore().currentPicture = new Image();
canvasStore().currentPicture.onload = () => {
	console.log('\x1b[31m canvasStore().currentPicture Loaded \x1b[0m', canvasStore().current)
	console.log('canvasStore().currentPicture Loaded')
	canvasStore().state.sizeCanvas.w = window.innerWidth
	canvasStore().state.sizeCanvas.h = window.innerHeight

	store().msg({'canvasStore().currentPicture.onload':{
		sizeCanvas: canvasStore().state.sizeCanvas, 
		currentPicture: canvasStore().currentPicture, 
		currentPicture2: canvasStore().currentPicture, 
		src: canvasStore().currentPicture.src, 
	}})

	for (const [key, value] of Object.entries(canvasStore().canvasOffScreen)) {
		
		//canvasStore().canvasOffScreen[key].width = window.innerWidth
		//canvasStore().canvasOffScreen[key].height = window.innerHeight
		canvasStore().canvasOffScreen[key].width = canvasStore().currentPicture.width
		canvasStore().canvasOffScreen[key].height = canvasStore().currentPicture.height
		console.log(`canvasStore().canvasOffScreen - ${key}: ${value} --- ${window.innerWidth}, ${window.innerHeight}`, canvasStore().canvasOffScreen[key]);
	}
	//canvasStore().ctxOffScreen
	refs().TheZoom.resetZoom()
}

function loadPictures(){
	for (const [key, value] of Object.entries(configStore().lists.pictureList)) {
		configStore().lists.pictureList[key].image = new Image();
		configStore().lists.pictureList[key].image.onload = () => {/* ctx.drawImage(img, x, y, size, size) */	}
		configStore().lists.pictureList[key].image.src = configStore().picturesPath+value.file
	}
}

onBeforeMount(async () => {
	SocketioService.setupSocketConnection();
})

onMounted(async () => {
	//canvasStore().initCanvasPage()
	store().init()
	if(utils.getStorage('accounts')) configStore().user.accounts = JSON.parse(utils.getStorage('accounts'))

	let usr = configStore().user.username
	configStore().user.username = utils.getStorage('username') ? utils.getStorage('username').replaceAll('\"','') : 'Guest'
	if(usr == configStore().user.username) canvasStore().initCanvasPage()

})

onBeforeUnmount(() => {
	SocketioService.disconnect('CT2');
})


watchEffect(async () => {
	//console.log('watch')
	while (canvasStore().queue.length > 0) {
		let trig = canvasStore().queue[0]
		//console.log('trig', trig)
		if (trig.event == 'test') { }
		else if (trig.event == 'newCanvas')
			await setToCurrentTransform(trig.layer_id)
		else if (trig.event == 'setContext')
			await setCtx(trig.layer_id)
		else if (trig.event == 'redraw')
			redraw({ layer_id: trig.layer_id })
		else if (trig.event == 'resetZoom')
			refs().TheZoom.resetZoom()
		else if (trig.event == 'drawPoint' && trig.source == 'self')
			await draw({ type: trig.type, strokeIndex: trig.strokeIndex })
		else if (trig.event == 'drawPoint')
			await drawPoint({ ctx: null, point: canvasStore().queue[0].point, layer_id: canvasStore().queue[0].layer_id ,  strokeIndex: trig.strokeIndex })

		canvasStore().queue.shift()
	}
})

async function setCtx(layer_id){
	await nextTick()
	if(!canvasStore().canvasRefs[layer_id]) return console.log('setCtx UNDEFINED', layer_id, canvasStore().canvasRefs)
	canvasStore().ctx[layer_id] = canvasStore().canvasRefs[layer_id].getContext('2d')
	canvasStore().ctxOffScreen[layer_id] = canvasStore().canvasOffScreen[layer_id].getContext('2d')
}

function setToCurrentTransform(layer_id) {
	//console.log('setToCurrentTransform', layer_id, canvasStore().canvasRefs[layer_id])
	if (canvasStore().canvasRefs[layer_id] == null) return //console.log('setToCurrentTransform Null')
	if(canvasStore().canvasRefs.length == 1) return 
	let def = canvasStore().canvasRefs[Object.keys(canvasStore().canvasRefs)[0]].getContext('2d').getTransform()
	const ctx = canvasStore().canvasRefs[layer_id].getContext('2d')
	if(!canvasStore().ctx[layer_id]) canvasStore().ctx[layer_id]= canvasStore().canvasRefs[layer_id].getContext('2d')
	ctx.setTransform(def.a, def.b, def.c, def.d, def.e, def.f);
	canvasStore().ctx[layer_id].setTransform(def.a, def.b, def.c, def.d, def.e, def.f);
}

Number.round = function(e) {
	//console.log('Number.round', e, (e + 0.5) << 0)
    return (e + 0.5) << 0;
};
function roundSizeToPixel({size}){
	return Number.round(size*configStore().navState.scale)/configStore().navState.scale
}
function roundOfsToPixel(arr){
	for (let i = 0; i < arr.length; i++) {
		arr[i] = Number.round(arr[i] * configStore().navState.scale) / configStore().navState.scale
	}
	return arr
}

function drawPicture({picture, size, x, y, layer_id=canvasStore().current.layer_id, type, strokeIndex}={}){
	if(configStore().general.test)
		refs().svgComponent.drawSvg({picture, size, x, y, layer_id, type,  strokeIndex})

	if(configStore().toolState.roundPencilRender)
		[x,y] = roundOfsToPixel([x,y])
	if(configStore().toolState.roundPencilRender)
		size = roundSizeToPixel({size})
	let ctx = canvasStore().ctx[layer_id]
	ctx.drawImage(configStore().lists.pictureList[picture]?.image, x, y, size, size)
	
}
 function drawUnicode({unicode, _font, color, size, x, y, layer_id=canvasStore().current.layer_id, type, strokeIndex}={}){
	if(configStore().general.test)
		refs().svgComponent.drawSvg({unicode, color, size, x, y, layer_id, type,  strokeIndex})

	if(configStore().toolState.roundPencilRender)
		[x,y] = roundOfsToPixel([x,y])
	if(configStore().toolState.roundPencilRender)
		size =  roundSizeToPixel({size})
	let ctx = canvasStore().ctx[layer_id]
	let symb = String.fromCodePoint(`0x${unicode}`)	// 0x1F354 `🍔`
	ctx.fillStyle = color;
	let font = `${size}px serif`
	ctx.font = font;
	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'
	ctx.fillText(symb, x, y);
}
function erase({x,y,w,h, layer_id=canvasStore().current.layer_id,  strokeIndex}={}){
	//if(configStore().general.test)
	//refs().svgComponent.drawSvg({outlineColor, color, size, x,y,w,h, layer_id, type,  strokeIndex})
	if(configStore().toolState.roundPencilRender)
		[x,y] = roundOfsToPixel([x,y])
	if(configStore().toolState.roundPencilRender)
		size = roundSizeToPixel({size:w})

	let ctx = canvasStore().ctx[layer_id]
	/*var cutCircle = function(x, y, radius){
		ctx.globalCompositeOperation = 'destination-out'
		ctx.arc(x, y, radius, 0, Math.PI*2, true);
		ctx.fill();
	}
	 if(!configStore().toolState.useSquareAsDot){
		cutCircle(x+w/2, y+h/2, Math.abs(w/2))
	}else */
	ctx.clearRect(x, y, w, h);
}


var cursorUpdate = {} //Date.now()
function drawDot(obj){
	let {user, outlineColor, color, size, textSize, x,y,w,h, layer_id=canvasStore().current.layer_id, type,  strokeIndex} = obj

	if(configStore().general.test)
		refs().svgComponent.drawSvg({outlineColor, color, size, x,y,w,h, layer_id, type,  strokeIndex})

	if(configStore().toolState.roundPencilRender)
		[x,y] = roundOfsToPixel([x,y])
	if(configStore().toolState.roundPencilRender)
		size = roundSizeToPixel({size})

	let ctx = canvasStore().ctx[layer_id]
	ctx.fillStyle = color;

	ctx.lineCap = 'round';
	ctx.lineWidth = size/10
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	
	if(type == 'cursor'){
		if(configStore().cursor.outline){
			ctx.lineWidth = size/10
			ctx.strokeStyle = outlineColor;
		} 
		if(configStore().cursor.fill){
			ctx.fillStyle = color;
		}
		
	}

	
	if(!configStore().toolState.useSquareAsDot){
		ctx.beginPath();
		ctx.arc(
			x+size/2, 
			y+size/2, 
			Math.abs(size/2), 
			0, 2 * Math.PI);
		if(type != 'cursor' || !(type == 'cursor' && !configStore().cursor.fill ))  ctx.fill()
		ctx.stroke();
		ctx.closePath();
	}else {
		ctx.beginPath();
		ctx.fillRect(x, y, size, size);
		ctx.stroke();
		ctx.closePath();
	}

	if(type == 'cursor' && configStore().cursor.usernameDisplay){
		

		if(configStore().cursor.usernameColor != 'same') ctx.fillStyle = configStore().cursor.usernameColor;
		let str = ''
		for (const [key, value] of Object.entries(configStore().$state.cursor.usernameStyle)) {
			if(key[0] == '$') continue
			if(key == 'usernameSizeMultiplier') str += `${value*textSize}px `
			//if(key == 'usernameSizeMultiplier') str += `${configStore().toolState.drawSize*size}px `
			else str += `${value} `
		}
		ctx.font = str;
		//ctx.textAlign = "center";
		ctx.fillText(`${user}`, x, y-configStore().$state.cursor.usernameStyle.usernameSizeMultiplier*size/10);
		//ctx.fillText(`${user}`, x+(configStore().$state.cursor.usernameStyle.usernameSizeMultiplier*size/6), y-(configStore().$state.cursor.usernameStyle.usernameSizeMultiplier*size/6));
	}
}

async function drawLine({arr, color,size,x1,x2,y1,y2, layer_id=canvasStore().current.layer_id, type , strokeIndex}={}){
	if(configStore().general.test)
	refs().svgComponent.drawSvg({arr, color,size,x1,x2,y1,y2, layer_id, type,  strokeIndex})
	/* if(configStore().toolState.roundPencilRender)
		[x1,x2,y1,y2] = roundOfsToPixel([x1,x2,y1,y2])
	if(configStore().toolState.roundPencilRender)
		size = roundSizeToPixel({size}) */
	let ctx = canvasStore().ctx[layer_id]

	if(arr) {
		for (let i = 0; i < arr.length; i++) {
			await nextTick()
			ctx.beginPath();
			ctx.moveTo(arr[i].x1, arr[i].y1);
			ctx.lineTo(arr[i].x2, arr[i].y2);
			ctx.fillStyle = color;
			ctx.lineCap = 'round';
			ctx.strokeStyle = color;
			ctx.lineWidth = size;
			ctx.stroke();
			ctx.closePath();
		}
		return
	}

	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.fillStyle = color;
	ctx.lineCap = 'round';
	ctx.strokeStyle = color;
	ctx.lineWidth = size;
	ctx.stroke();
	ctx.closePath();
}


function draw({ x, y, type = 'line' }) {
	if(type == 'cursor' || type == 'Cursor') {}
	else if(!canvasStore().current.canvas_id) return store().setStatusMessage({text: 'No canvas selected. ', popups: ['newCanvas', 'canvas', 'layer']})
	else if(!canvasStore().current.layer_id) return store().setStatusMessage({text: 'No layer selected. ', popups: ['newCanvas', 'canvas', 'layer']})
	else if(!canvasStore().current.layer_id || !canvasStore().current.canvas_id || !canvasStore().canvasList[canvasStore().current.layer_id]) return
	else if((canvasStore().canvasList[canvasStore().current.layer_id].type == 'background' || canvasStore().canvasList[canvasStore().current.layer_id].type == 'users') &&	type != 'cursor') 
		return store().setStatusMessage({text: 'You cant draw on this layer. ', popups: ['newCanvas', 'canvas', 'layer']})
	else if(configStore().user.username != canvasStore().canvasList[canvasStore().current.layer_id].owner) return store().setStatusMessage({text: 'This layer belongs to someone else.  ', popups: ['newCanvas', 'canvas', 'layer']})

	coord.x1 = canvasStore().state.click.x0
	coord.x2 = canvasStore().state.click.x
	coord.y1 = canvasStore().state.click.y0
	coord.y2 = canvasStore().state.click.y
	
	if(!canvasStore().ctx[canvasStore().current.layer_id]) canvasStore().ctx[canvasStore().current.layer_id]= canvasStore().canvasRefs[canvasStore().current.layer_id]?.getContext('2d')

	//var size = configStore().toolState.drawSize * configStore().tools[configStore().toolState.toolActive]?.sizeMultiplier
	var size = configStore().toolState.drawSize
	if(type!='Cursor' && type!='cursor') size *= configStore().tools[configStore().toolState.toolActive]?.sizeMultiplier
	
	if (configStore().toolState.scaleDrawSize) size /= configStore().navState.scale
	//if (configStore().toolState.scaleDrawSize && (type!='Cursor' && type!='cursor')) size /= configStore().navState.scale
	var addToHistory = {}
	let color = (configStore().lists.colors[configStore().toolState.activeColor] != 'random') ? configStore().lists.colors[configStore().toolState.activeColor] : utils.getRandomColor({ format: 'hex' })


	if(type == 'cursor' || type == 'Cursor'){
		let cursorSize = configStore().toolState.drawSize * configStore().tools[configStore().toolState.toolActive]?.sizeMultiplier * configStore().cursor.sizeMultiplier 
		if (configStore().toolState.scaleDrawSize) cursorSize /= configStore().navState.scale

		let fillColor = (configStore().cursor.fillColor != 'same') ? configStore().cursor.fillColor : color 	//color	//'yellow'
		let outlineColor = (configStore().cursor.outlineColor != 'same') ? configStore().cursor.outlineColor : color
		
		addToHistory = {
				type: 'cursor',
				user: configStore().user.username, 
				color: fillColor,
				outlineColor,
				size: cursorSize, 
				textSize: size,
				x: coord.x2-cursorSize/2, y: coord.y2-cursorSize/2, w: cursorSize, h: cursorSize
			}
		if(!configStore().cursor.emitCursor) {
			canvasStore().addStrokeToHistory({ canvas_id:canvasStore().current.canvas_id, layer_id:'users', strokeIndex:'1', arr: [addToHistory] });
          	canvasStore().queue.push({event:'redraw', layer_id:'users'})
			return
		} //else if(){}
		SocketioService.socket.emit('point:add', {
			canvas_id: canvasStore().current.canvas_id,
			
			layer_id: 'users',
			strokeIndex: 0,
			point: addToHistory
		})
	
		return
	}
	else if (configStore().toolState.toolActive == 'picture') {
		addToHistory = {
				type: 'picture',
				picture: configStore().tools.picture.name,
				size: size,
				x: coord.x2-size/2, y: coord.y2-size/2
		}
		drawPicture({...addToHistory, ...{id: canvasStore().current.layer_id}})
	}
	else if (configStore().toolState.toolActive == 'unicode') {
		addToHistory = {
			type: 'unicode',
			unicode: configStore().tools.unicode.code,
			//font: `${size}px serif`,
			color: color,
			size: size,
			x: coord.x2, y: coord.y2
		}
		drawUnicode({...addToHistory, ...{id: canvasStore().current.layer_id}})

	}
	else if (configStore().toolState.toolActive == 'eraser') {
		addToHistory = {
			type: 'clearRect',
			size: size,
			x: coord.x2 - size / 2, y: coord.y2 - size / 2, w: size, h: size
		}
		erase({...addToHistory, ...{id: canvasStore().current.layer_id}})
	}
	else if (configStore().toolState.toolActive == 'pencil') {		
		if (type == 'dot') {
			addToHistory = {
				type: 'fillRect',
				user: configStore().user.username, 
				color: color,
				size: size,
				x: coord.x2 - size / 2, y: coord.y2 - size / 2, w: size, h: size
			}
			drawDot({...addToHistory, ...{id: canvasStore().current.layer_id}})
		}
		else if (type == 'line') {
			addToHistory = {
				type: 'lineTo',
				color: color,
				size: size,
				x1: coord.x1, y1: coord.y1, x2: coord.x2, y2: coord.y2, 
				//arr: canvasStore().historyTemp
			}
			drawLine({...addToHistory, ...{id: canvasStore().current.layer_id}})
		}
	} else {
		return
	}
	//console.log('hmmm', canvasStore().current.layer_id)
	if(!canvasStore().canvasHistory[canvasStore().current.layer_id]) return console.log('null', canvasStore().current.layer_id)
	canvasStore().historyTemp.push(addToHistory)
	SocketioService.socket.emit('point:add', {
		canvas_id: canvasStore().current.canvas_id,
		layer_id: canvasStore().current.layer_id,
		strokeIndex: canvasStore().canvasHistory[canvasStore().current.layer_id].length,
		point: addToHistory
	})

}

function copyCanvas(layer_id){

}


function redrawImage(layer_id){
	var secondCanvas = document.createElement('canvas')
	var secondContext = secondCanvas.getContext('2d');
	secondCanvas.width=canvasStore().canvasRefs[layer_id].width;
	secondCanvas.height=canvasStore().canvasRefs[layer_id].height;
	secondContext.drawImage(canvasStore().canvasRefs[layer_id],0,0);
	console.log('redrawImage', layer_id, secondCanvas)

	canvasStore().ctx[layer_id].drawImage(secondCanvas,0,0);
}

function drawSomething(){
	let layer_id = 'Hans_default_v2'
	canvasStore().ctx[layer_id].drawImage(canvasStore().canvasRefs2[layer_id],0,0);
}

var cursorUpd = [Date.now()]
async function redraw({ layer_id = null } = {}) {
	canvasStore().state.loading = 'Redrawing'
	//console.log('REDRAW', layer_id)
	let time = {}
	time[0] = performance.now()
	var canvasRedrawList
	if (layer_id == null)
		canvasRedrawList = Object.entries(canvasStore().canvasHistory)
	else
		canvasRedrawList = Object.entries({ [layer_id]: canvasStore().canvasHistory[layer_id] })
	
	store().debugObj.COUNT.redraw =+ 1 / canvasRedrawList.length
	for (const [layer_id, history] of canvasRedrawList) {
		//console.log('**', layer_id, canvasStore()?.canvasState[layer_id]?.hidden)
		if (canvasStore()?.canvasState[layer_id]?.hidden) continue
		if (canvasStore().canvasRefs[layer_id] == null /* || history == null */) continue
		//var ctx = canvasStore().canvasRefs[id].getContext('2d')
		if(!canvasStore().ctx[layer_id]) canvasStore().ctx[layer_id]= canvasStore().canvasRefs[layer_id].getContext('2d')
		

		if(history?.[0]?.[0]?.type == 'cursor'){
			cursorUpd[1] = Date.now()
			if(cursorUpd[1] > cursorUpd[0] + configStore().$state.cursor.updateDelay_ms) 
				cursorUpd[0] = Date.now()
			else
				continue //console.log('eöse', cursorUpdate[user][1]-cursorUpdate[user][0], )
		}

		var ctx = canvasStore().ctx[layer_id]
		let curr = ctx.getTransform()

		let constraints = {
			x0: -(curr.e / curr.a), 
			y0: -(curr.f / curr.a), 
			x: (canvasStore().state.sizeCanvas.w / curr.a), 	// FIX !!
			y: (canvasStore().state.sizeCanvas.h / curr.a),		// FIX !!
		}
		ctx.clearRect(
			constraints.x0, constraints.y0,
			constraints.x, constraints.y
		);

		if (history == null) continue
		

		let frame = {
			x0: -(curr.e / curr.a), 
			y0: -(curr.f / curr.a), 
			x: -(curr.e / curr.a)+(canvasStore().state.sizeCanvas.w / curr.a), 
			y: -(curr.f / curr.a)+(canvasStore().state.sizeCanvas.h / curr.a),
		}

		for (let i = 0; i < history.length; i++) {
			if (!history[i]) continue
			for (let y = 0; y < history[i].length; y++) {
				let h = history[i][y]


				// Skip if dot is offscreen
				if((h.x && h.x < (frame.x0-h.size)) || (h.y && h.y < (frame.y0-h.size))) continue
				if((h.x && h.x > (frame.x+h.size)) || (h.y && h.y > (frame.y+h.size))) continue 
				
				// Skip if line is offscreen
				if(
					((h.x1 && h.x1 < (frame.x0-h.size)) && (h.x2 && h.x2 < (frame.x0-h.size))) || 
					((h.y1 && h.y1 < (frame.y0-h.size)) && (h.y2 && h.y2 < (frame.y0-h.size))) 
				) continue
				if(
					((h.x1 && h.x1 > (frame.x+h.size)) && (h.x2 && h.x2 > (frame.x+h.size))) || 
					((h.y1 && h.y1 > (frame.y+h.size)) && (h.y2 && h.y2 > (frame.y+h.size))) 
				) continue


				//console.log('h', h)
				/* if(
					((h.x1 && h.x1 < constraints.x0) && 
					(h.x2 && h.x2 < constraints.x0)) || 
					((h.y1 && h.y1 < constraints.y0) && 
					(h.y2 && h.y2 < constraints.y0)) ||

					((h.x1 && h.x1 > constraints.x) && 
					(h.x2 && h.x2 > constraints.x)) ||
					((h.y1 && h.y1 > constraints.y) && 
					(h.y2 && h.y2 > constraints.y))
				) continue */
				/* if(
					(h.x1 && h.x1 < constraints.x0) && 
					(h.x2 && h.x2 < constraints.x0)
				) continue */
				/* if((h.x1 && h.x1 < constraints.x0) || (h.y1 && h.y1 < constraints.y0)) continue
				if((h.x2 && h.x2 > constraints.x) || (h.y2 && h.y2 > constraints.y)) continue */

				/* if(((h.x1 && h.x2 && h.y1 && h.y2) && 
					(h.x1 < constraints.x0 || h.x2 < constraints.x0 || h.x1 > constraints.x || h.x2 > constraints.x) && 
					(h.y1 < constraints.y0 || h.y2 < constraints.y0 || h.y1 > constraints.y || h.y2 > constraints.y)
				))

				if((h.x && h.x < constraints.x0) || (h.y && h.y < constraints.y0)) continue
				if((h.x && h.x > constraints.x) || (h.y && h.y > constraints.y)) continue */

				/* canvasStore().state.click.x0*configStore().navState.scale - configStore().navState.ofs.x*configStore().navState.scale */
				/* if(h.x) {
					let scaled = canvasStore().state.click.x0*curr.a - configStore().navState.ofs.x*curr.a
					console.log('redraw',scaled, h.x)
				} */
				await drawPoint({ point:h, layer_id, strokeIndex: i,  pointIndex: y })
				/* if (h.type == 'fillRect') {
					drawDot({...h, ...{id: id}})
				}
				else if (h.type == 'lineTo') {
					drawLine({...h, ...{id: id}})
				}
				else if (h.type == 'drawImage') {
					ctx.drawImage(canvasStore().currentPicture, h.x, h.y)
				}
				else if (h.type == 'unicode') {
					drawUnicode({...h, ...{id: id}})
				}
				else if(h.type == 'picture'){
					drawPicture({...h, ...{id: id}})
				}
				else if (h.type == 'clearRect') {
					erase({...h, ...{id: id}})
				} */

			}
		}
		//canvasStore().ctx[id].drawImage(canvasStore().canvasOffScreen[id], 0, 0);
	}
	//}
	//time[1] = performance.now()
	//store().debug.msg[configStore().general.debug] = performance.now()-time[0]
	//store().debugMsg[configStore().general.debug] = performance.now()-time[0]
	store().debugObj.performance[configStore().toolState.roundPencilRender] = performance.now()-time[0]
	canvasStore().state.loading = false
}
function drawfull(layer_id=null) {
	var canvasRedrawList
	if (layer_id == null)
		canvasRedrawList = Object.entries(canvasStore().canvasHistory)
	else
		canvasRedrawList = Object.entries({ [layer_id]: canvasStore().canvasHistory[layer_id] })
	for (const [layer_id, history] of canvasRedrawList) {
		//var ctx = canvasStore().canvasRefs[layer_id].getContext('2d')
		if(!canvasStore().ctx[layer_id]) canvasStore().ctx[layer_id]= canvasStore().canvasRefs[layer_id].getContext('2d')
		var ctx = canvasStore().ctx[layer_id]
		//console.log(`${layer_id} - ${ctx.getTransform()}`, ctx.getTransform())
		ctx.clearRect(-window.innerWidth / configStore().navState.scale * 100, -window.innerWidth / configStore().navState.scale * 100, window.innerWidth / configStore().navState.scale * 2000, window.innerHeight / configStore().navState.scale * 2000);
		drawHistory(layer_id, history)
	}
}
function drawHistory(layer_id, history) {
	for (let i = 0; i < history.length; i++) {
		drawStroke(layer_id, history[y])
	}
}
function drawStroke(layer_id, stroke) {
	for (let y = 0; y < stroke.length; y++) {
		drawPoint({layer_id, point:stroke[y]})
	}
}
function drawPoint({ ctx, point, layer_id, strokeIndex }) {
	//console.log('drawPoint', layer_id, point)
	if (!canvasStore().ctx[layer_id]) canvasStore().ctx[layer_id]= canvasStore().canvasRefs[layer_id].getContext('2d')
	if (!ctx) ctx = canvasStore().canvasRefs[layer_id].getContext('2d')
	
	//if(point.type == 'outline')
	if (point.type == 'cursor' || point.type == 'outline') {
		drawDot({...point, ...{layer_id: layer_id}, strokeIndex})
	}
	if (point.type == 'fillRect') {
		drawDot({...point, ...{layer_id: layer_id}, strokeIndex})
	}
	else if (point.type == 'lineTo') {
		drawLine({...point, ...{layer_id: layer_id}, strokeIndex})
	}
	else if (point.type == 'drawImage') {
		ctx.drawImage(canvasStore().currentPicture, point.x, point.y)
	}
	else if (point.type == 'unicode') {
		drawUnicode({...point, ...{layer_id: layer_id}, strokeIndex})
	}
	else if(point.type == 'picture'){
		drawPicture({...point, ...{layer_id: layer_id}, strokeIndex})
	}
	else if (point.type == 'clearRect') {
		erase({...point, ...{layer_id: layer_id}, strokeIndex})
	}
}


</script>


<style scoped>
.hidden {
	visibility: hidden;
}


.loader-container{
	display:flex;
	flex-direction: row;
	justify-content: center;

	position:absolute;
	width: 100%;
  	height: 100%;
}
.loader-container div{
	position:fixed;
	transform: translate(0, -50%);
	font-size: 10ch;
	pointer-events: none;
	align-self: center;
	z-index:999; 
}
.loader {
	border: 16px solid #f3f3f3;
	border-radius: 50%;
	border-top: 16px solid #3498db;
	width: 60vh;
	height: 60vh;
	-webkit-animation: spin 2s linear infinite; /* Safari */
	animation: spin 2s linear infinite;
	
	
}
/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>


