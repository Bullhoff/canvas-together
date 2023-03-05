
<template>
	<div style="position:absolute; width:auto; height:auto;  " @mouseup="onMouseUp" @mousemove="onMouseMove" @mouseleave="onMouseLeave" @click="()=>store().setStatusMessage({text: 'You have to close the arrow windows to draw. ', popups: []})">
		
		<div style="position:absolute;" :style="svg.divContainer" >
			
			<svg  
				:viewBox="svg.container.viewBox"
				:transform="svg.container.transform" 
				:preserveAspectRatio="svg.container.preserveAspectRatio"
				:style="svg.container.style"
				style="" 
			>
			<filter id='shadow' color-interpolation-filters="sRGB">
				<feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.5"/>
			</filter>

				<defs>
					<marker 
						:id="'arrow_'+props.componentName"
						:viewBox="svg.arrow.viewBox"
						:preserveAspectRatio="svg.arrow.preserveAspectRatio"
						:fill="svg.arrow.fill"
						:stroke="svg.arrow.stroke"
						:stroke-width="svg.arrow.strokeWidth"
						:refX="svg.arrow.refX"
						:refY="svg.arrow.refY"
						:markerWidth="svg.arrow.markerWidth"
						:markerHeight="svg.arrow.markerHeight"
						:orient="svg.arrow.orient"
						stroke-linecap="round"
						>
						<path :d="svg.arrow.path.d" />
						<!-- <path d="M 0 0 L 10 5 L 0 10 z" /> -->
					</marker>
				</defs>

				
				<line class="line" 
					:viewBox="svg.line.viewBox"
					:x1="svg.line.x1"
					:y1="svg.line.y1"
					:x2="svg.line.x2"
					:y2="svg.line.y2"
					:stroke="svg.line.stroke"
					:stroke-width="svg.line.strokeWidth"
					stroke-linecap="round"
					:marker-end="'url(#arrow_'+props.componentName+')'" />
					<!-- 'arrow_'+props.componentName -->
					<!-- marker-end="url(#arrow)" -->
			</svg>
		</div>

		<div :ref="(el)=>(someStore().activePopups[props.componentName]) ? someStore().activePopups[props.componentName].ref=el : ''" class="container prevent-select" @mousedown="onMouseDown" 
			style="z-index: 1;"
			@contextmenu.prevent="onContextMenu"
			 @mouseleave="onMouse('leave')"
			 @mouseenter="onMouseEnter('enter')"
			>	
			
			<div style="position: absolute;  background-color:chocolate; right:1px;top:1px;  width:3ch;height:3ch;  font-size:0.5ch;text-align:center; border-radius: 5px;" @click="onClose()">
				X
			</div>
			<p style="width:fit-content; white-space: nowrap;" >
				{{ someStore().activePopups[props.componentName].text }}
			</p>
			
		</div>
	</div>
</template>


<script setup>
//import SocketioService from './../socketio.service.js';
import { canvasStore, styleStore, configStore, windowStore, store, refs, someStore, contextMenuStore } from "@/stores/store.js";
import { defineComponent, onMounted, onBeforeMount, onUpdated, nextTick, ref, reactive, computed } from 'vue'

import Spinner from '@/components/cSpinner.vue'
import * as Svg from './../components/cSvg.vue'
import * as utils from './../utils.js'

//const emit = defineEmits(['resetZoom'])

const svg = reactive({
	divContainer: {width: '100px', height: '100px', },
	container: {
		//viewBox: "0 0 100 100",
		transform:"", 
		//preserveAspectRatio:"slice", 
		//preserveAspectRatio:"none", 
		//style: {width:'130px', height:'30px',}
		style: {width:'100%', height:'100%',}
		
	},
	arrow: {
		viewBox: "0 0 10 10",
		preserveAspectRatio:"none", 
		fill: "blue",
		stroke: "blue",
		strokeWidth: "0.3",
		refX:"2",
		refY:"5",
		markerWidth:"16",
		markerHeight:"16",
		orient:"auto-start-reverse",
		path: {
			d: "M 0 0 L 10 5 L 0 10 z"
		},
	}, 
	line: {
		/* viewBox: "0 0 100 100", */
		x1:"50",
		y1:"50",
		x2:"0",
		y2:"0",
		fill: "blue",
		stroke:"blue",
		strokeWidth: "2",
	},
})


const divRev = ref(null)
const props = defineProps({
	componentName: {
		type: String,
		default: '',
	}, 
	text: {
		type: String,
		default: '',
	}
})

const state = {
	mouseDown: false, 
	x1: null, 
	y1: null, 
	x2: null, 
	y2: null, 
}
function onContextMenu(e){
	let items = {
		'Close all': () => {
			for (const [key, value] of Object.entries(someStore().activePopups)) {
				delete someStore().activePopups[key]
			}
		},
		'Disable these': () => configStore().general.guidePopupsEnabled = false,
	}
	contextMenuStore().onContextMenu(e, items)
}
function onClose(){
	return delete someStore().activePopups[props.componentName]
}
function onMouseDown(e){
	//console.log('onMouseDown')
	state.mouseDown = true
	state.x2 = e.clientX;
    state.y2 = e.clientY;
}
function onMouseEnter(){
	svg.arrow.fill = 'red'
	svg.arrow.stroke = 'red'
	svg.line.stroke = 'red'
	someStore().activePopups[props.componentName].ref.style.backgroundColor = 'red'
}
function onMouseLeave(){
	state.mouseDown = false
	svg.arrow.fill = 'blue'
	svg.arrow.stroke = 'blue'
	svg.line.stroke = 'blue'
	someStore().activePopups[props.componentName].ref.style.backgroundColor = 'blue'
}
function onMouseUp(e){
	state.mouseDown = false
}
function onMouseMove(e){
	if(!state.mouseDown) return
	state.x1 = state.x2 - e.clientX;
    state.y1 = state.y2 - e.clientY;
	state.x2 = e.clientX;
    state.y2 = e.clientY;
	
	someStore().activePopups[props.componentName].ref.style.left = (someStore().activePopups[props.componentName].ref.offsetLeft - state.x1) + "px";
	someStore().activePopups[props.componentName].ref.style.top = (someStore().activePopups[props.componentName].ref.offsetTop - state.y1) + "px";
    
	//console.log(`offsetLeft: ${someStore().activePopups[props.componentName].offsetLeft} \t offsetTop: ${someStore().activePopups[props.componentName].offsetTop} \t left: ${someStore().activePopups[props.componentName].style.left} \t top: ${someStore().activePopups[props.componentName].style.top} \t clientX: ${e.clientX}\t clientY: ${e.clientY}`)
	positionArrow()
	checkBoundaries()
}


async function positionArrow(){
	//let el = await getStuff({ref: someStore().list[props.componentName].ref})
	const divRect = someStore().activePopups[props.componentName].ref.getBoundingClientRect()
	const divRect2 = someStore().list[props.componentName].ref.getBoundingClientRect()
	svg.line.x1 = parseInt(someStore().activePopups[props.componentName].ref.style.left) + parseInt(someStore().activePopups[props.componentName].ref.offsetWidth)/2
	svg.line.y1 = parseInt(someStore().activePopups[props.componentName].ref.style.top)  + parseInt(someStore().activePopups[props.componentName].ref.offsetHeight)/2
	svg.line.x2 = divRect2.x + divRect2.width/2 
	svg.line.y2 = divRect2.y + divRect2.height 
	//someStore().activePopups[props.componentName].text = JSON.stringify(someStore().activePopups[props.componentName].ref.getBoundingClientRect())
	someStore().activePopups[props.componentName].rect = someStore().activePopups[props.componentName].ref.getBoundingClientRect()
}
async function checkBoundaries({count=0} = {}){
	//dimensions = {}
	count+=1
	if(count >10) return
	let selfRef = someStore().activePopups[props.componentName]
	const selfRect = selfRef.ref.getBoundingClientRect()
	let divs = someStore().activePopups
	for (const [key, value] of Object.entries(divs)) {
		const rect = value.ref.getBoundingClientRect()
		if(key == props.componentName) {continue}
		if(await isOverlapping(selfRect, rect)){
			//console.log(`${count} !!!!!! ${key}: ${value}  \t  ${rect.left}, ${rect.top}, ${rect.right}, ${rect.bottom}`);
			let t = {
				left: selfRect.right - rect.left, 
				right: rect.right - selfRect.left, 
				top: selfRect.bottom - rect.top, 
				bottom: rect.bottom - selfRect.top, 
			}
			let sorted = Object.entries(t).sort(([key, value], [key2, value2])=>{
				return value - value2
			})
			await bestDirection({selfRef, arr: sorted})
			return await checkBoundaries({count})
		} else someStore().activePopups[props.componentName].overlap = false
	}
}
function bestDirection({i=-1, arr, selfRef} = {}){
	i += 1
	let leftOrTop = null
	let moveVal = null
	//console.log('bestDirection 1', i, arr)
	if(arr[i][0] == 'top'){
		if(parseInt(selfRef.ref.style.top) - arr[i][1] < 0) {return bestDirection({i, arr, selfRef})}
		leftOrTop = 'top'
		moveVal = -arr[i][1]
		//someStore().activePopups[props.componentName].ref.style.top = `${parseInt(selfRef.ref.style.top) - arr[i][1]*1}px`
	}
	if(arr[i][0] == 'bottom'){
		leftOrTop = 'top'
		moveVal = +arr[i][1]
		//someStore().activePopups[props.componentName].ref.style.top = `${parseInt(selfRef.ref.style.top) + arr[i][1]}px`
	}
	
	if(arr[i][0] == 'left'){
		if(parseInt(selfRef.ref.style.left) - arr[i][1] < 0) {return bestDirection({i, arr, selfRef})}
		leftOrTop = 'left'
		moveVal = -arr[i][1]
		//someStore().activePopups[props.componentName].ref.style.left = `${parseInt(selfRef.ref.style.left) - arr[i][1]}px`
	}
	if(arr[i][0] == 'right'){
		leftOrTop = 'left'
		moveVal = +arr[i][1]
		//someStore().activePopups[props.componentName].ref.style.left = `${parseInt(selfRef.ref.style.left) + arr[i][1]}px`
	}
	//console.log('bestDirection END', i, leftOrTop, moveVal)
	if(leftOrTop && moveVal){
		someStore().activePopups[props.componentName].ref.style[leftOrTop] = `${parseInt(selfRef.ref.style[leftOrTop]) + moveVal}px`
		positionArrow()
	}
	//if(parseInt(selfRef.ref.style.top) - arr[i][1] < 0)
}
function isOverlapping(rect1, rect2){
	if(
		((rect1.left 	>= rect2.left	&&
		rect1.left 		<= rect2.right)  ||
		(rect1.right 	>= rect2.left	&&
		rect1.right 	<= rect2.right) || 
		(rect1.right 	>= rect2.right	&&
		rect1.left 		<= rect2.left)) 
		&& 
		((rect1.top 	>= rect2.top	&&
		rect1.top 		<= rect2.bottom)  ||
		(rect1.bottom 	>= rect2.top	&&
		rect1.bottom 	<= rect2.bottom) || 
		(rect1.top 		>= rect2.top	&&
		rect1.bottom 	<= rect2.bottom)) 
	)
		return true
	 else return false
}
onMounted(async ()=>{
	//someStore().list[props.componentName]
	console.log('onMounted', props.componentName, )

	//let nr = Object.keys(someStore().activePopups[props.componentName]).length
	let isEven = (Object.keys(someStore().activePopups).length % 2==0) ? 1 : 0
	//let el = await getStuff({ref: someStore().list[props.componentName].ref})
	await nextTick()
	const rect = someStore().list[props.componentName]?.ref.getBoundingClientRect()
	
	someStore().activePopups[props.componentName].ref.style.left = `${(rect?.x + rect?.width/2)+0}px`
	someStore().activePopups[props.componentName].ref.style.top = `${(rect?.y + rect?.height)+100 + 100*isEven + Math.floor(Math.random() * 150)}px`
	
	svg.divContainer.width = window.innerWidth + 'px'
	svg.divContainer.height = window.innerHeight + 'px'
	await nextTick()
	checkBoundaries()
	positionArrow()
	return
})
function onMouse(val){
	if(val == 'enter'){
		someStore().list[props.componentName].ref.classList.add("element-highlight");
	}
	if(val == 'leave'){
		someStore().list[props.componentName].ref.classList.remove("element-highlight");
	}
}
function degToRadians(deg){
	return (deg * Math.PI) / 180;
}

function getStuff({e, ref, window} = {}){
	let returnObj = {}
	// const containerRect = containerRef.value.getBoundingClientRect()
	if(e) returnObj['e'] = {
		x: e.clientX, y: e.clientY
	}
	if(ref) returnObj['refOuter'] = {
		x: ref.offsetLeft, y: ref.offsetTop, w: ref.offsetWidth, h: ref.offsetHeight, 
	}
	if(ref) returnObj['refInner'] = {
		x: ref.clientLeft, y: ref.clientTop, w: ref.clientWidth, h: ref.clientHeight, 
	}
	if(ref) returnObj['refScroll'] = {
		w: ref.scrollWidth, h: ref.scrollHeight, 
	}
	if(window) returnObj['window'] = {
		w: window.innerWidth, h: window.innerHeight
	}


	return returnObj
}

</script>


<style scoped>

.container{
	position:absolute;
	width:fit-content;
	color:#00fc43;
	font-weight: bold;
	font-size: 2.5ch;
	background-color: rgb(34, 0, 255);
	border: 2px outset rgb(0, 0, 0);
	border-radius: 1ch;
	padding: 0.0ch 0.5ch 0.0ch 0.5ch;
	text-shadow: 0 0 3px #FF0000;
	box-shadow: 0px 0px 8px #00fb3a;
	/* text-shadow: 2px 2px 5px yellow; */
	/* box-shadow: 5px 5px blue, 10px 10px red, 15px 15px green; */

}


button{
	background-color: gray;
}
textarea{
	background-color: gray;
	caret-color: red;
	cursor:cell;
}

.row-container{
	display:flex;
	flex-direction: row;
}
.svg:hover{
	border: 1px solid blue;
}

svg {
	/* filter: url(#shadow); */
	filter: drop-shadow(3px 3px 3px rgba(1, 255, 140, 0.4));
}

</style>


