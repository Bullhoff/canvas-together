
<template   >
	<!-- 
		position:absolute;
		position:relative;
		width:100%; height;:100%" 
		width:1000px; height:1000px;
		background-color:blue;
	-->
	<div style="position:absolute;  width:100%; height:100%;" @contextmenu.prevent="onContextMenu">
		
	</div>
</template>


<script setup>
// https://medium.com/@ronnow/dropdowns-in-vue-the-right-way-8ff9e8f36d4a
//import SocketioService from './../socketio.service.js';
//import { CanvasManager } from '@/CanvasManager8.js'
import { canvasStore, styleStore, configStore, contextMenuStore } from "@/stores/store.js";
import { h, onMounted, onBeforeMount, watch, onUpdated, nextTick, ref, reactive } from 'vue'
import FormData from 'form-data'	//npm install --save form-data
import * as utils from '@/utils.js'
import ContextMenu from '@/components/cContextMenu.vue'

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



onMounted(() => {})
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
		'enlargedTest':{ 
			type: 'enlarged', 
			value: String.fromCodePoint('0x1F9D9'), 
			//style: {fontSize:'10ch'},
		},
		'checkboxTest':{ 
			type: 'checkbox', 
			name: 'Prevent Select', 
			value: state.preventSelect, 
			onClick: (e)=>{console.log('click', e);state.preventSelect=e;},
			//onClick: (e)=>{console.log('click', e);state.preventSelect=e.target.checked;},
		},
		
		Copy: [
			() => navigator.clipboard.writeText(window.getSelection().toString()),	// await navigator.clipboard.readText()	
			{
				'Copy\xa0selection': ()=> navigator.clipboard.writeText(window.getSelection().toString()), 
				'Copy\xa0symbol': () => navigator.clipboard.writeText(String.fromCodePoint('0x1F9D9')),
				//'Copy\xa0unicode': () => navigator.clipboard.writeText(value),
				'Copy\xa0unicode': [
					() => navigator.clipboard.writeText(String.fromCodePoint('0x1F9D9')),	
					{
						'Copy\xa0unicode in \"fromCodePoint\" format': () => navigator.clipboard.writeText(`String.fromCodePoint('0x${'0x1F9D9'}')`),
					}
				],
				'Copy\xa0name': () => navigator.clipboard.writeText(`${'key'}: ${'value'}`),
				Paste: async() => {console.log(await navigator.clipboard.readText())},
				
			}
			
		], 
	}

	items['Close'] = () => configStore().pizzaCompanion.open = false,
	items['sliderTest'] = { 
			type: 'slider', 
			text: 'Pizza size',
			value: style.svg.width, 
			min: 0, 
			max: 300,
			onChange: (val)=> {
				console.log('onChange', val)
				style.svg.width = val
				style.svg.height = val
			}
	}
	
	items['Test'] = {
			Nothing: () =>console.log('Nothing'),
			SubMenu1: () => {console.log('SubMenu1')},
			SubMenu2: () => {console.log('SubMenu2')},
			SubMenu3: {
				SubMenu1a: () => {console.log('SubMenu1')},
				SubMenu2b: () => {console.log('SubMenu2')},
				SubMenu33c: {
					SubMenu111: () => {console.log('SubMenu1')},
					SubMenu222: {
						SubMenu22: {
							SubMenu222: {
								SubMenu2222: {
									SubMenu2: {
										SubMenu2: {
											SubMenu2: {
												SubMenu1: () => {console.log('SubMenu1')},
											},
										},
										'aa':{ 
											type: 'enlarged', 
											value: String.fromCodePoint('0x1F9D9'), 
											style: {fontSize:'50ch'},
										}
									},
								},
							},
						},
					},
				},
				SubMenu4d: () => {console.log('SubMenu4')},
			},
			SubMenu4: 'hejhej',
			SubMenu5_longname: () => {console.log('SubMenu3')},
			SubMenu6: {
				SubMenu19: () => {console.log('SubMenu1')},
				SubMenu29: () => {console.log('SubMenu2')},
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


