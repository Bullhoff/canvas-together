
<template   >
	<div style="position:relative;display:block;  " @mouseleave="onMouseLeave($event, 'svg')" @mousemove="onMouseMove($event, 'svg')" >
		<svg 
			:ref="(el)=>refs.svg=el"
			@contextmenu.prevent="onContextMenu"
			@mousedown="onMouseDown($event, 'svg')"
			@mouseup="onMouseUp($event, 'svg')"
			style="position:relative; pointer-events: none; "
			:style="style.svg"
			>

			<image class="pizza" 
				:href="configStore().picturesPath+configStore().lists.pictureList['Kebabpizza'].file" 
				:height="svg.pizza.height" 
				:width="svg.pizza.width" 
				:style="svg.pizza.style"
				style="pointer-events:all; " 
				@mouseover="onMouseOver($event, 'pizza')"
				@mousedown="onMouseDown($event, 'pizza')"
				@mouseup="onMouseUp($event, 'pizza')"
			/>
					
			<circle class="eye-ball"  :r="svg.leftEye.r" :cx="svg.leftEye.cx" :cy="svg.leftEye.cy"  :style="svg.leftEye.style"	style="pointer-events:all;" 
				@mouseover="onMouseOver($event, 'leftEye')"
				@mousedown="onMouseDown($event, 'leftEye')"
				@mouseup="onMouseUp($event, 'leftEye')"
			/>
			
			<circle class="eye-ball"  :r="svg.rightEye.r" :cx="svg.rightEye.cx" :cy="svg.rightEye.cy"  :style="svg.rightEye.style" style="pointer-events:all;" 
				@mouseover="onMouseOver($event, 'rightEye')"
				@mousedown="onMouseDown($event, 'rightEye')"
				@mouseup="onMouseUp($event, 'rightEye')"
			/>

			<svg width="100%" height="100%" viewBox="0 0 50 50" preserveAspectRatio="none"> 
				<path :d="svg.mouth.d" :style="svg.mouth.style" />
			</svg>
		</svg>
		
	</div>
</template>


<script setup>
//import SocketioService from './../socketio.service.js';
//import { CanvasManager } from '@/CanvasManager8.js'
import { canvasStore, styleStore, configStore, contextMenuStore } from "@/stores/store.js";
import { h, onMounted, onBeforeMount, watch, onUpdated, nextTick, ref, reactive, computed } from 'vue'
import FormData from 'form-data'	//npm install --save form-data
import * as utils from '@/utils.js'
import ContextMenu from '@/components/cContextMenu.vue'
import _ from 'lodash';
import { windowStore } from "../stores/windowStore";

// :window_id="id"
const props = defineProps({
	window_id: {
		required: false,
		default: null,
	},
})



const state = {
	mouseDown: false, 
	x1: null, 
	y1: null, 
	x2: null, 
	y2: null, 
}
const refs = reactive({
	svg: null, 
	part1: null
})



const style = reactive({
	svg: {
		left: 10, 
		top: 10, 
		height: 150, 
		width: 150, 
	}, 
})

const svg = {
	pizza: {
		height: "100%", 
		width: "100%", 
		style: {},
	}, 
	leftEye: {
		r: "10%", cx:"30%", cy:"30%", 
		style: {
			fill: 'blue', 
			stroke: 'white', 
			strokeWidth:"4" ,
		},
	}, 
	rightEye: {
		r: "10%", cx:"70%", cy:"30%", 
		style: {
			fill: 'blue', 
			stroke: 'white', 
			strokeWidth:"4" ,
		},
	}, 
	mouth: {
		d:`M10,25 a10,10 0 0,0 30,0`, 
		r: 5, cx:25, cy:35, 
		style: {
			fill: 'transparent', 
			stroke: 'blue', 
			strokeWidth:"5" ,
		},
	}
}



onMounted(async () => {})
onUpdated(() => {})

function onMouseOver(e){
	return
}
function onMouseDown(e){
	return
	state.mouseDown = true
	state.x2 = e.clientX;
    state.y2 = e.clientY;
}
function onMouseEnter(){
	return
}
function onMouseLeave(){
	return
	state.mouseDown = false
}
function onMouseUp(e, name){
	return
	state.mouseDown = false
}
function onMouseMove(e, name = 'svg'){
	return
	if(!state.mouseDown) return
	state.x1 = state.x2 - e.clientX;
    state.y1 = state.y2 - e.clientY;
	state.x2 = e.clientX;
    state.y2 = e.clientY;
	
	style[name].left = style[name].left - state.x1
	style[name].top = style[name].top - state.y1
}


function onContextMenu(e){
	console.log('onContextMenu')
	//if(configStore().general.normalContextMenu) return
	//e.preventDefault()
	let items = {
		'Close': () => windowStore().func.close(props.window_id),
		'svgWidth':{ 
			type: 'slider', 
			text: 'Pizza size',
			value: style.svg.width, 
			min: 0, 
			max: window.innerWidth,
			onChange: (val)=> {
				console.log('onChange', val)
				style.svg.width = val
				style.svg.height = val
			}
		},
	}

	contextMenuStore().onContextMenu(e, items)
}



</script>


<style scoped>


</style>


