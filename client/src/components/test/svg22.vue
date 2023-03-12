
<template   >
	<!-- 
		position:absolute;
		position:relative;
		width:100%; height;:100%" 
		width:1000px; height:1000px;
		background-color:blue;
	-->
	<div style="position:relative;  width:100%; height:100%;" @mouseleave="onMouseLeave($event, 'svg')" @mousemove="onMouseMove($event, 'svg')" >
		<!-- <input type="range" min="1" max="300"  > -->
		<!-- {{ style.svg.width }} -->
		<!-- height="100" z-index: 2;-->
		<svg 
			:ref="(el)=>refs.svg=el"
			@contextmenu.prevent="onContextMenu"
			@mousedown="onMouseDown($event, 'svg')"
			@mouseup="onMouseUp($event, 'svg')"
			
			style="position:absolute; pointer-events: none; z-index:99;"
			:style="style.svg"
			>

			<!-- <circle r="20" cx="50" cy="50" style="fill:yellow;" /> -->
			<!-- <circle  r="50" cx="50" cy="50" style="fill:yellow;pointer-events:all;" /> -->
			<!-- configStore().picturesPath+configStore().lists.pictureList[configStore().tools.picture.name].file -->
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

			<!-- <circle class="mouth"  :r="svg.mouth.r" :cx="svg.mouth.cx" :cy="svg.mouth.cy"  :style="svg.mouth.style" style="pointer-events:all;" 
				@mouseover="onMouseOver($event, 'mouth')"
				@mousedown="onMouseDown($event, 'mouth')"
				@mouseup="onMouseUp($event, 'mouth')"
			/> -->

			<svg width="100%" height="100%" viewBox="0 0 50 50" preserveAspectRatio="none"> 
				<path :d="svg.mouth.d" :style="svg.mouth.style" />
			</svg>
				<!-- d="M10,25 a10,10 0 0,0 30,0" -->
			<!-- <svg width="135" height="135">
				<path d="M10,80 a60,60 0 0,0 115,0" fill="#D78500" />
			</svg> -->
			<!-- <image class="image"  r="5" cx="35" cy="15"
					:href="configStore().picturesPath+configStore().lists.pictureList[configStore().tools.picture.name].file" 
					:x="item.x" :y="item.y" 
					:height="50" 
					:width="50" 
					:transform="item.transform"	
					:ref="(el)=>divRefs[item.layer_id+item.strokeIndex]=el"
					style="pointer-events:all; " /> -->
			

		</svg>

		<!-- @mouseleave="onMouseLeave($event, 'svgLine')" -->
		<!-- @mousemove="onMouseMove($event, 'svgLine')" -->
		
	</div>
</template>


<script setup>
// https://medium.com/@ronnow/dropdowns-in-vue-the-right-way-8ff9e8f36d4a
//import SocketioService from './../socketio.service.js';
//import { CanvasManager } from '@/CanvasManager8.js'
import { canvasStore, styleStore, configStore, contextMenuStore } from "@/stores/store.js";
import { h, onMounted, onBeforeMount, watch, onUpdated, nextTick, ref, reactive, computed } from 'vue'
import FormData from 'form-data'	//npm install --save form-data
import * as utils from '@/utils.js'
import ContextMenu from '@/components/cContextMenu.vue'
import _ from 'lodash';

const props = defineProps({
	/* divRef: {
		required: false,
		default: null,
	}, */
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
	// :r="svg.leftEye.r" :cx="svg.leftEye.cx" :cy="svg.leftEye.cy" :fill="svg.leftEye.fill"
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
		//d:"M10,25 a10,10 0 0,0 30,0", 
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

}
function onMouseDown(e){
	//console.log('onMouseDown', e, refs.svg.offsetLeft, refs.svg)
	state.mouseDown = true
	state.x2 = e.clientX;
    state.y2 = e.clientY;
}
function onMouseEnter(){
}
function onMouseLeave(){
	state.mouseDown = false
	//someStore().activePopups[props.componentName].ref.style.backgroundColor = 'blue'
}
function onMouseUp(e, name){
	console.log('onMouseUp', e)
	state.mouseDown = false
}
function onMouseMove(e, name = 'svg'){
	
	if(!state.mouseDown) return
	state.x1 = state.x2 - e.clientX;
    state.y1 = state.y2 - e.clientY;
	state.x2 = e.clientX;
    state.y2 = e.clientY;
	
	style[name].left = style[name].left - state.x1
	style[name].top = style[name].top - state.y1
	/* refs.svg.style.left = (refs.svg.offsetLeft - state.x1) + "px";
	refs.svg.style.top = (refs.svg.offsetTop - state.y1) + "px"; */
    
	//console.log(`offsetLeft: ${someStore().activePopups[props.componentName].offsetLeft} \t offsetTop: ${someStore().activePopups[props.componentName].offsetTop} \t left: ${someStore().activePopups[props.componentName].style.left} \t top: ${someStore().activePopups[props.componentName].style.top} \t clientX: ${e.clientX}\t clientY: ${e.clientY}`)
	
	// m 0,0 z
	/* let arr = svgLine.d.split(' ')
	//arr.splice(-1, 0, `m ${style[name].left},${style[name].top}`)
	//arr.splice(-1, 0, `m ${state.x1},${state.y1}`)
	//arr.splice(-1, 0, `${e.clientX},${e.clientY}`)
	//arr.push(`${e.clientX},${e.clientY}`)
	arr.push(`${style[name].left},${style[name].top}`)

	//if(svgLine.d == '') arr.splice(0, 1, `M ${state.x1},${state.y1}`)
	if(svgLine.d == '') arr.splice(0, 1, `M`)
	svgLine.d = arr.join(' ')
	if(arr.length%100 == 0) console.log('arr', arr.length, arr) */
}


function onContextMenu(e){
	console.log('onContextMenu')
	//if(configStore().general.normalContextMenu) return
	//e.preventDefault()
	let items = {
		'Close': () => configStore().pizzaCompanion.open = false,
		/* 'aa':{ 
			type: 'enlarged', 
			value: 'text', 
			style: {fontSize:'5ch'},
		}, */
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

function button1() {
}
function button2() {
}
function button3() {
}



</script>


<style scoped>
/* svg:hover image   {
	filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%);
} */
circle  {
	fill:black;
	/* filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%); */
}
/* .pizza:hover .eye-ball{
	filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%);
} */

</style>


