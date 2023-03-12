
<template   >
	<!-- 
		position:absolute;
		position:relative;
		width:100%; height;:100%" 
		width:1000px; height:1000px;
		background-color:blue;
		@mouseleave="onMouseLeave($event, 'svg')" @mousemove="onMouseMove($event, 'svg')"
		z-index: 2;
	-->
	<div style="position:absolute;  width:100%; height:100%; " >
		<span style="position:absolute;display:flex;flex-direction: column;" >
			<p>
				{{ configStore().navState.scale }}
			</p>
			<p>
				x: {{ configStore().navState.ofs.x }}
			</p>
			<p>
				y: {{ configStore().navState.ofs.y }}
			</p>
			
			<button @click="testButton(1)" style="z-index: 99;">
				testButton
			</button>
			<button @click="()=>{
				elmt['tt'].parentNode.removeChild(elmt['tt']);
				divRefs[Object.keys(divRefs)[0]].parentNode.removeChild(divRefs[Object.keys(divRefs)[0]]);
			}" style="z-index: 99;">
				testButton2
			</button>
			
			<svg style="position:absolute; pointer-events: none; height: 100%; width:100%; "	>
				<circle  :r="20" :cx="20" :cy="20"  :style="{fill:'red'}" 	:ref="(el)=>elmt['tt']=el" />
			</svg>

			<textarea v-if="false" style="z-index:99;">{{ JSON.stringify({divRefs},null,2) }}
			{{ JSON.stringify({draw:Object.keys(draw)},null,2) }}</textarea>
		</span>

		<!-- style="position:absolute;" z-index: 999999;--> 
		<template v-for="(item, key) in draw.circle" :key="JSON.stringify(item)" style="">
			<svg style="position:absolute; pointer-events: none; height: 100%; width:100%; "	v-if="item?.color">
				<circle class="circle"  
					:r="item.size/2" 
					:cx="item.x+item.size/2" 
					:cy="item.y+item.size/2"  
					:style="{fill:item.color}" 	
					:transform="item.transform" 	
					:ref="(el)=>divRefs[item.layer_id+item.strokeIndex]=el" 
					style="pointer-events:all; "
					tabindex="0"/>
			</svg>

		</template>
		<template v-for="(item, key) in draw.path" :key="JSON.stringify(item)" style="">
			<!-- {{ (item?.color) ? item.color : key }} -->
			<svg style="position:absolute; pointer-events: none; height: 100%; width:100%; " v-if="item?.color"	>
				<path class="path" 
					fill="transparent" 
					:stroke="item.color" 
					:stroke-width="item.size" 
					:d="item.d" 		
					:transform="item.transform"	
					:ref="(el)=>divRefs[item.layer_id+item.strokeIndex]=el" 
					style="pointer-events:all; " />
			</svg>
		</template>
		<template v-for="(item, key) in draw.text" :key="JSON.stringify(item)" style="">
			<svg style="position:absolute; pointer-events: none; height: 100%; width:100%; " v-if="item?.color"	>
				<text class="text"  
					:x="item.x" 
					:y="item.y" 
					:font-size="item.size+'px'" 
					text-anchor="middle"
					dominant-baseline="central"
					:transform="item.transform"	
					:ref="(el)=>divRefs[item.layer_id+item.strokeIndex]=el" 
					style="pointer-events:all; "
					>{{ String.fromCodePoint(`0x${item.unicode}`) }}</text>
			</svg>
		</template>
		<template v-for="(item, key) in draw.image" :key="JSON.stringify(item)" style="">
			<svg style="position:absolute; pointer-events: none; height: 100%; width:100%; "	v-if="item?.color">
				<image class="image" 
					:href="configStore().picturesPath+configStore().lists.pictureList[item.picture].file" 
					:x="item.x" :y="item.y" 
					:height="item.size" 
					:width="item.size" 
					:transform="item.transform"	
					:ref="(el)=>divRefs[item.layer_id+item.strokeIndex]=el"
					style="pointer-events:all; " />
			</svg>
		</template>
		<!-- circle, path, text, image -->

		<!-- <template v-for="(item, key) in draw" :key="JSON.stringify(item)" style="">
			<svg style="position:absolute; pointer-events: none; height: 100%; width:100%; "	>
				<template v-if="(item) && item.type == 'fillRect'" >		
					<circle class="circle"  
					:r="item.size/2" 
					:cx="item.x+item.size/2" 
					:cy="item.y+item.size/2"  
					:style="{fill:item.color}" 	
					:transform="item.transform" 	
					:ref="(el)=>divRefs[item.layer_id+item.strokeIndex]=el" 
					style="pointer-events:all; "
					tabindex="0"/>
				</template>

				<template v-if="(item) && item.type == 'lineTo'" style="position:absolute;height: 100%; width:100%;">	
					<path class="path" 
					fill="transparent" 
					:stroke="item.color" 
					:stroke-width="item.size" 
					:d="item.d" 		
					:transform="item.transform"	
					:ref="(el)=>divRefs[item.layer_id+item.strokeIndex]=el" 
					style="pointer-events:all; " />
				</template>

				<template v-if="(item) && item.type == 'unicode'" style="position:absolute;height: 100%; width:100%;">	
					
					<text class="text"  
					:x="item.x" 
					:y="item.y" 
					:font-size="item.size+'px'" 
					:transform="item.transform"	
					:ref="(el)=>divRefs[item.layer_id+item.strokeIndex]=el" 
					style="pointer-events:all; "
					>{{ String.fromCodePoint(`0x${item.unicode}`) }}</text>
				</template>

				<template v-if="(item) && item.type == 'picture'" style="position:absolute;height: 100%; width:100%;">	
					<image class="image" 
					:href="configStore().picturesPath+configStore().lists.pictureList[item.picture].file" 
					:x="item.x" :y="item.y" 
					:height="item.size" 
					:width="item.size" 
					:transform="item.transform"	
					:ref="(el)=>divRefs[item.layer_id+item.strokeIndex]=el"
					style="pointer-events:all; " />
				</template>
			</svg>
		</template> -->
		<!-- <svg style="position:absolute; pointer-events: none; height: 100%; width:100%; "	>
			<template v-for="(item, key) in draw" :key="JSON.stringify(item)" style="">

				<template v-if="(item) && item.type == 'fillRect'" style="position:absolute;height: 100%; width:100%; ">		
					<circle class="circle"  
					:r="item.size/2" 
					:cx="item.x+item.size/2" 
					:cy="item.y+item.size/2"  
					:style="{fill:item.color}" 	
					:transform="item.transform" 	
					:ref="(el)=>divRefs[item.layer_id+item.strokeIndex]=el" 
					style="pointer-events:all; "
					tabindex="0"/>
				</template>

				<template v-if="(item) && item.type == 'lineTo'" style="position:absolute;height: 100%; width:100%;">	
					<path class="path" 
					fill="transparent" 
					:stroke="item.color" 
					:stroke-width="item.size" 
					:d="item.d" 		
					:transform="item.transform"	
					:ref="(el)=>divRefs[item.layer_id+item.strokeIndex]=el" 
					style="pointer-events:all; " />
				</template>

				<template v-if="(item) && item.type == 'unicode'" style="position:absolute;height: 100%; width:100%;">	
					
					<text class="text"  
					:x="item.x" 
					:y="item.y" 
					:font-size="item.size+'px'" 
					:transform="item.transform"	
					:ref="(el)=>divRefs[item.layer_id+item.strokeIndex]=el" 
					style="pointer-events:all; "
					>{{ String.fromCodePoint(`0x${item.unicode}`) }}</text>
				</template>

				<template v-if="(item) && item.type == 'picture'" style="position:absolute;height: 100%; width:100%;">	
					<image class="image" 
					:href="configStore().picturesPath+configStore().lists.pictureList[item.picture].file" 
					:x="item.x" :y="item.y" 
					:height="item.size" 
					:width="item.size" 
					:transform="item.transform"	
					:ref="(el)=>divRefs[item.layer_id+item.strokeIndex]=el"
					style="pointer-events:all; " />
				</template>

				
			</template>
		</svg> -->

		<!-- <text v-for="(item2, key2) in item.text" :x="item.x+item.size/2" :y="item.y+item.size+20*(key2+1)" :transform="item.transform">{{item2}}</text> -->
		<!-- <text  x="50%" y="50%" :transform="item.transform"	:ref="(el)=>divRefs[item.layer_id+item.strokeIndex]=el" >{{ String.fromCodePoint(`0x${item.unicode}`) }}</text> -->
		<!-- <template v-for="(item, key) in draw" :key="item" style="position:absolute;">
			<template v-if="(item) && item.type == 'fillRect'" style="position:absolute;height: 100%; width:100%;">		
				
			</template>
			
			<template v-if="(item) && item.type == 'lineTo'">		
				<svg style="position:absolute; pointer-events: none; height: 100%; width:100%;">
					<path fill="transparent" :stroke="item.color" :stroke-width="item.size" :d="item.d" 		:transform="item.transform"	/>
				</svg>
			</template>

		</template> -->
		<!-- item.color -->
		<!-- <template v-for="(item, key) in draw" :key="item" style="position:absolute;">
			<template v-if="(item) && item.type == 'fillRect'" style="position:absolute;height: 100%; width:100%;">	
				<svg style="position:absolute; pointer-events: none; height: 100%; width:100%; "	>
					<circle  :r="item.size/2" :cx="item.x+item.size/2" :cy="item.y+item.size/2"  :style="{fill:'red'}" 	:transform="item.transform" 	/>
					<text v-for="(item2, key2) in item.text"
						:x="item.x+item.size/2" 
						:y="item.y+item.size+20*(key2+1)" 
						:transform="item.transform">{{item2}}</text>
				</svg>
			</template>
			
			<template v-if="(item) && item.type == 'lineTo'">		
				<svg style="position:absolute; pointer-events: none; height: 100%; width:100%;">
					<path fill="transparent" :stroke="item.color" :stroke-width="item.size" :d="item.d" 		:transform="item.transform"	/>
				</svg>
			</template>

		</template> -->
		<!-- <circle r="20" cx="50" cy="50" style="fill:yellow;" /> -->
		<!-- <svg 
			:ref="(el)=>refs.svg=el"
			@mousedown="onMouseDown($event, 'svg')"
			@mouseup="onMouseUp($event, 'svg')"
			style="position:absolute; pointer-events: none; z-index: 2;"
			:style="style.svg"
			>
			<circle  r="5" cx="5" cy="5" style="fill:yellow;pointer-events:all;" />
		</svg> -->

		<!-- @mouseleave="onMouseLeave($event, 'svgLine')" -->
		<!-- @mousemove="onMouseMove($event, 'svgLine')" -->
		<!-- <svg 
			:ref="(el)=>refs.svgLine=el"
			
			@mousedown="onMouseDown($event, 'svgLine')"
			@mouseup="onMouseUp($event, 'svgLine')"
			
			style="position:absolute; pointer-events: none; z-index: 1; height: 100%; width:100%;;"
			:style="style.svgLine"
			>
			
			<path style="pointer-events:visibleFill;" fill="transparent" fillOpacity="0" fill-rule="evenodd" stroke="red" stroke-width="5" :d="svgLine.d"
				/>
		</svg> -->
	</div>
</template>


<script setup>
// https://medium.com/@ronnow/dropdowns-in-vue-the-right-way-8ff9e8f36d4a
//import SocketioService from './../socketio.service.js';
//import { CanvasManager } from '@/CanvasManager8.js'
import { canvasStore, styleStore, configStore } from "@/stores/store.js";
import { h, onMounted, onBeforeMount, watch, onUpdated, nextTick, ref, reactive, computed } from 'vue'
import FormData from 'form-data'	//npm install --save form-data
import * as utils from '@/utils.js'
defineExpose({ drawSvg });	// , draw

const draw = reactive({circle:[], path:[], text:[], image:[]})
const elmt = reactive({})


function drawDot({outlineColor, color, size, x,y,w,h, layer_id, type}){
	let p = {outlineColor, color, size, x,y,w,h, layer_id, type}
	//console.log('drawDot', p)
	draw.push(p)
}

const divRefs = reactive({

})
const nav = computed(()=>configStore().navState)
//ctx.setTransform(configStore().navState.scale, 0, 0, configStore().navState.scale, 0, 0);
//ctx.translate(-configStore().navState.ofs.x, -configStore().navState.ofs.y)
// ctx.drawImage(configStore().lists.pictureList[picture]?.image, x, y, size, size)
// let symb = String.fromCodePoint(`0x${unicode}`)	// 0x1F354 `🍔`
//const map1 = new Map();
function drawSvg(obj){
	//return
	//if(obj.type == 'unicode') return 
	//if(obj.type == 'picture') return 
	//if(obj.type == 'lineTo') return 
	// {unicode, color, size, x, y, layer_id, type,  strokeIndex}
	// {picture, size, x, y, layer_id, type,  strokeIndex}
	if(!obj.type || obj.type == 'cursor'|| obj.type == 'Cursor') return
	//console.log('obj', obj.type, obj.unicode, obj.picture, obj.strokeIndex)
	//if(obj.type == 'lineTo') return

	/* let translate = `	rotate(0 0 0)
						translate(${nav.ofs.x} ${nav.ofs.y})
						skewX(0)
						scale(${nav.scale} ${nav.scale})	` */
	//let transform = `translate(${-nav.ofs.x} ${-nav.ofs.y})	scale(${nav.scale} ${nav.scale}) skewX(0)`
	//let transform = `translate(${-nav.ofs.x/1*nav.scale} ${-nav.ofs.y/1*nav.scale})`

	/* obj['x'] = Math.round(obj['x'])
	obj['y'] = Math.round(obj['y'])
	obj['size'] = Math.round(obj['size']) */

	let transform = `translate(${-nav.value.ofs.x*nav.value.scale} ${-nav.value.ofs.y*nav.value.scale}) scale(${nav.value.scale} ${nav.value.scale})`
	obj['transform'] = transform
	//obj['text'] = [`ofs.x: ${nav.value.ofs.x}`, `ofs.y: ${nav.value.ofs.y}`, `scale: ${nav.value.scale}`, `transform: ${transform}`]

	const add = (arr, drawObj) => {
		if(!arr[drawObj.strokeIndex] )
			arr[drawObj.strokeIndex] = drawObj
			//arr[drawObj.strokeIndex] = drawObj
		else if(drawObj.transform != arr[drawObj.strokeIndex].transform)
			arr[drawObj.strokeIndex].transform = drawObj.transform
		return arr[drawObj.strokeIndex]
	}
	
	if(obj.type == 'fillRect'){		// fillRect 	circle
		draw['circle'][obj.strokeIndex] = add(draw['circle'], obj)
	}
	if(obj.type == 'lineTo'){	// lineTo 	path
		if(obj.arr){
			let d =  obj.arr.map((x)=>`${x.x1},${x.y1} ${x.x2},${x.y2}`).join(' ')
			obj.d = `M ` + d
		} else {
			obj.d = `M ${obj.x1},${obj.y1} ${obj.x2},${obj.y2}`
		}
		draw['path'][obj.strokeIndex] = add(draw['path'], obj)
		//console.log('*',obj.strokeIndex, draw['path'][obj.strokeIndex])
	}
	if(obj.type == 'unicode'){		// fillRect 	circle
		draw['text'][obj.strokeIndex] = add(draw['text'], obj)
	}
	if(obj.type == 'picture'){		// fillRect 	circle
		draw['image'][obj.strokeIndex] = add(draw['image'], obj)
	}

	//circle, path, text, image
	return
	if(!draw[obj.strokeIndex] )
		draw[obj.strokeIndex] = obj
	else if(obj.transform != draw[obj.strokeIndex].transform){
		draw[obj.strokeIndex].transform = obj.transform
	}

	return
	//translate
	if((nav.value.ofs.x*nav.value.scale - nav.value.ofs.x  > 0) && (nav.value.ofs.y*nav.value.scale - nav.value.ofs.y > 0)
		&& JSON.stringify(draw[obj.strokeIndex]) != JSON.stringify(obj))
		return draw[obj.strokeIndex] = obj
	/* else if(JSON.stringify(draw[obj.strokeIndex]) == JSON.stringify(obj)){	} */
	else if(draw[obj.strokeIndex]) {
		draw.splice(obj.strokeIndex,1) 
		divRefs[obj.strokeIndex]?.parentNode.removeChild(divRefs[obj.strokeIndex])
	}
	// divRefs[Object.keys(divRefs)[0]].parentNode.removeChild(divRefs[Object.keys(divRefs)[0]])
	//delete draw[obj.strokeIndex]
	//console.log('')
	//configStore().navState.scale
}

function testButton(opt){
	/* console.log('testButton1', opt, draw)
	if(opt == 1)
		('Hans_default--998db625-8420-40e7-9239-ec7b0f554baa0').remove() */
		//delete draw[0]
	//item.layer_id+item.strokeIndex
	//console.log('testButton3', divRefs['Hans_default--998db625-8420-40e7-9239-ec7b0f554baa0'].parentNode)
	console.log('testButton1', divRefs)
	console.log('testButton2', divRefs['Hans_default--08e091a3-2197-4181-abb0-a977c188b08b1'])
	console.log('testButton2', divRefs['Hans_default--08e091a3-2197-4181-abb0-a977c188b08b1'].parentNode)
	
	//divRefs['Hans_default--08e091a3-2197-4181-abb0-a977c188b08b1'].remove()
	var parent    = divRefs['Hans_default--08e091a3-2197-4181-abb0-a977c188b08b1'].parentNode;
	parent.removeChild(divRefs['Hans_default--08e091a3-2197-4181-abb0-a977c188b08b1']);
	draw.splice(0,1)
	delete divRefs['Hans_default--08e091a3-2197-4181-abb0-a977c188b08b1']

	console.log('testButton3', divRefs['Hans_default--08e091a3-2197-4181-abb0-a977c188b08b1'].parentNode)
	console.log('testButton4', divRefs['Hans_default--08e091a3-2197-4181-abb0-a977c188b08b1'])
	
	console.log('_testButton2', opt, draw)
	//draw.splice(0,1)
	console.log('_testButton3', opt, draw)
}


/* function drawSvg(obj){
	const nav = reactive(configStore().navState)
	if(obj.size) obj.size = obj.size*nav.scale
	if(obj.type == 'fillRect'){		// fillRect 	circle
		obj.x -= nav.ofs.x
		obj.y -= nav.ofs.y
		draw.push(p)
		map1.set('a', 1);
		//drawDot(obj)
	}
		
	if(obj.type == 'lineTo'){	// lineTo 	path
		
		if(obj.arr){
			let d =  obj.arr.map((x)=>`${x.x1-= nav.ofs.x},${x.y1-= nav.ofs.y} ${x.x2-= nav.ofs.x},${x.y2-= nav.ofs.y}`).join(' ')
			//let d =  obj.arr.map((x)=>`${x.x2},${x.y2}`).join(' ')
			obj.d = `M ` + d
			//console.log('d', d)
		} else {
			obj.d = `M ${obj.x1-= nav.ofs.x},${obj.y1-= nav.ofs.y} ${obj.x2-= nav.ofs.x},${obj.y2-= nav.ofs.y}`
			//obj.d = `M ${obj.x2},${obj.y2}`
		}
		//console.log('lineTo.obj', obj)
		draw.push(obj)
	}
	//console.log('')
	//configStore().navState.scale
} */


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

/* svg {
  -webkit-filter: invert(100%); 
          filter: invert(100%);
} */
/* :focus :hover
fill:rgb(253, 0, 152);*/
/* .circle{
	filter: invert(100%);
}
.circle:hover {
	filter: invert(100%);
}
.path:hover {
  filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%);
}
.text:hover {
  filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%);
}
.image:hover{
	filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%);
} */



</style>


