
<template   >
	<!-- 
		position:absolute;
		position:relative;
		width:100%; height;:100%" 
		width:1000px; height:1000px;
		background-color:blue;
	-->
	<div style="position:relative;  width:100%; height:100%;" @mouseleave="onMouseLeave($event, 'svg')" @mousemove="onMouseMove($event, 'svg')">
		<!-- height="100" -->
		<svg 
			:ref="(el)=>refs.svg=el"
			
			@mousedown="onMouseDown($event, 'svg')"
			@mouseup="onMouseUp($event, 'svg')"
			
			style="position:absolute; pointer-events: none; z-index: 2;"
			:style="style.svg"
			>

			<!-- <circle r="20" cx="50" cy="50" style="fill:yellow;" /> -->
			<circle  r="5" cx="5" cy="5" style="fill:yellow;pointer-events:all;" />
			<!-- <path d="
				M 10 10 
				H 90 
				V 90 
				H 10 
				L 10 10"/>
			<path d="
				M 10 10 
				H 90 
				V 90 
				H 10 Z" fill="transparent" stroke="black"/>
			<path d="
				M 10 10 
				h 80 
				v 80 
				h -80 Z" fill="transparent" stroke="black"/> -->

			<!-- <path d="M 10 10 C 20 20, 40 20, 50 10" stroke="black" fill="transparent"/> -->

			<!-- h = x		v = y -->
			

		</svg>

		<!-- @mouseleave="onMouseLeave($event, 'svgLine')" -->
		<!-- @mousemove="onMouseMove($event, 'svgLine')" -->
		<svg 
			:ref="(el)=>refs.svgLine=el"
			
			@mousedown="onMouseDown($event, 'svgLine')"
			@mouseup="onMouseUp($event, 'svgLine')"
			
			style="position:absolute; pointer-events: none; z-index: 1; height: 100%; width:100%;;"
			:style="style.svgLine"
			>
			<!-- fill="transparent" -->
			<path style="pointer-events:visibleFill;" fill="transparent" fillOpacity="0" fill-rule="evenodd" stroke="red" stroke-width="5" :d="svgLine.d"
				/>
		</svg>
	</div>
</template>


<script setup>
//import SocketioService from './../socketio.service.js';
//import { CanvasManager } from '@/CanvasManager8.js'
import { canvasStore, styleStore, configStore } from "@/stores/store.js";
import { h, onMounted, onBeforeMount, watch, onUpdated, nextTick, ref, reactive } from 'vue'
import FormData from 'form-data'	//npm install --save form-data
import * as utils from '@/utils.js'

const state = {
	mouseDown: false, 
	x1: null, 
	y1: null, 
	x2: null, 
	y2: null, 
}
const style = reactive({
	svg: {
		left: 10, 
		top: 10
	}, 
	svgLine: {
		left: 10, 
		top: 10
	},
})
const refs = reactive({
	svg: null, 
	part1: null
})

// h = x		v = y
const svgLine = {
	d2: `
		M 10 10 
		h 80 
		v 80 
		h -80 
		
		v 180 
		h 80 
	`, 
	d3: `
	m 0,0 100,0 0,100 -100,0  z
	`, 
	d4: `
	m 0,0 100,0 0,100 100,50 -100,0  z
	`, 
	d5: `M 0,0 Z`, 
	d: ``, 
}

onMounted(() => {})
onUpdated(() => {})

function onMouseDown(e){
	console.log('onMouseDown', e, refs.svg.offsetLeft, refs.svg)
	state.mouseDown = true
	state.x2 = e.clientX;
    state.y2 = e.clientY;
}
function onMouseEnter(){
	//svg.arrow.fill = 'red'
	//svg.arrow.stroke = 'red'
	//svg.line.stroke = 'red'
	//someStore().activePopups[props.componentName].ref.style.backgroundColor = 'red'
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
	let arr = svgLine.d.split(' ')
	//arr.splice(-1, 0, `m ${style[name].left},${style[name].top}`)
	//arr.splice(-1, 0, `m ${state.x1},${state.y1}`)
	//arr.splice(-1, 0, `${e.clientX},${e.clientY}`)
	//arr.push(`${e.clientX},${e.clientY}`)
	arr.push(`${style[name].left},${style[name].top}`)

	//if(svgLine.d == '') arr.splice(0, 1, `M ${state.x1},${state.y1}`)
	if(svgLine.d == '') arr.splice(0, 1, `M`)
	svgLine.d = arr.join(' ')
	if(arr.length%100 == 0) console.log('arr', arr.length, arr)
}

function button1() {
}
function button2() {
}
function button3() {
}



</script>


<style scoped>


</style>


