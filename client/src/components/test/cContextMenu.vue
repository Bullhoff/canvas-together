<template >
	
	<div class="container prevent-select"  tabindex="0"   style="min-width:10ch;" 
		:ref="(el)=>containerRef=el" 
		@focusout="onBlur" @blur="onBlur" @mousedown.stop.prevent="">
			<div v-for="(value, key, index) in p.items" :key="p.path+'__'+key" 
				style=" padding:0ch 0.0ch 0ch 0.0ch; width:100%;"
				class="row"	
				>
				<template v-if="(typeof value == 'object' && value.type )">
					<div v-if="value.type == 'checkbox'" class="clickable" style="white-space: nowrap;">
						<label :for="key"  @click.prevent="value.onClick(value.value=!value.value);contextMenuStore().open=!contextMenuStore().open;" >{{ key }}&#xa0;</label>
						<input :ref="key" :id="key" type="checkbox" v-model="value.value" @mousedown.stop.prevent="" @change="value.onClick($event.target.checked)" /> 
					</div>
					<div v-else-if="value.type == 'enlarged'" class="clickable">
						<p  :style="{fontSize:'6ch', textAlign: 'center', ...value.style}">
							{{ value.value }}
						</p>
					</div>
					<div v-else-if="value.type == 'slider'" >
						<div  :style="{textAlign: 'center', ...value.style}">
							<!-- class="clickable" -->
							<!-- <input type="range" min="1" max="300"  @mouseup="value.onChange($event.target.value)"> -->
							<div :title="value.value" 
								:ref="(el)=>refs.sliderContainer=el" 
								style="background-color: black; width:100%; height:3ch; margin:0; padding:0;" 
								:style="{}" 
								@click="($event)=>value.value=sliderClick($event, value.value, value)">
								<div   style="background-color: gray; width:50px; height:3ch; text-align: center;" :style="{width:getSize(value.value, value)}" :ref="(el)=>refs.slider=el"></div>
								<p  style="display:inline; position:absolute; left:0; top:0; width:100%; text-align: center; color:white;">{{ (value.text) ? value.text : '' }}</p>
							</div>
						</div>
					</div>


					

				</template>

				<template v-else-if="(Array.isArray(value))" style="" >
					<div style="display:inline-block; display:flex; flex-direction:row; justify-self: right;" :ref="(el)=>treeObj[key]['$rowRef']=el">
						<p class="clickable" style="width:100%;" @click="{value[0]();contextMenuStore().open =! contextMenuStore().open;}" :title="'ARRAY\n'+JSON.stringify(p.items[key],null,2)">{{ key }}</p>
						<p class="clickable" style="justify-self:flex-end;" @click.prevent="openSubMenu($event, key, value)" >🡲</p>
						
					</div>
					<div v-if="treeObj[key]['$subListOpen']" style="position:absolute; background-color:blueviolet;" :style="treeObj[key]['$subList']"  :ref="(el)=>treeObj[key]['$subListRef']=el">
							<ContextMenu 
								:items="value[1]" 
								@click.prevent=""
								:path="p.path+'__'+key"
								@opening-sub="openingSub($event)"
								:containerRect="containerRef.getBoundingClientRect()"
								:init="{}"
								/>
						</div>
				</template>
				

				<template v-else-if="(typeof value == 'string')" style="" >
					<p class="clickable" title="string" style="width:100%;" :title="'STRING\n'+JSON.stringify(p.items[key],null,2)">
						{{ key }}
					</p>
				</template>

				<template v-else-if="(typeof value == 'function')" style="width:100%;">
					<p class="clickable" @click.prevent="{value();contextMenuStore().open =! contextMenuStore().open}" style="width:100%;" :title="'FUNCTION\n'+JSON.stringify(p.items[key],null,2)">
						{{ key }} 
					</p>
				</template>

				<template v-else-if="(typeof value == 'object')" >
					
					<p class="clickable" @click.prevent="openSubMenu($event, key, value)" :ref="(el)=>treeObj[key]['$rowRef']=el"  :title="'OBJECT\n'+JSON.stringify(p.items[key],null,2)" 
						style="display:flex; flex-direction:row; justify-self: right;">
						<!-- {{  key  }}&#xa0;🡲	 -->		<!--   &#xa0; &nbsp; {{'\xa0'}} -->
						<span style="width:100%;">{{  key  }}</span>
						<span style="justify-self:flex-end;">&#xa0;🡲</span>
					</p>

					<div style="position:absolute; " :style="treeObj[key]['$subList']" :ref="(el)=>treeObj[key]['$subListRef']=el" >
						<div v-if="treeObj[key]['$subListOpen']" >
							<ContextMenu 
								:items="p.items[key]" 
								@opening-sub="openingSub($event)"
								@click.prevent=""
								:path="p.path+'__'+key"
								:init="{}"
								:containerRect="containerRef.getBoundingClientRect()"
								/>
						</div>

					</div>
					
				</template>

				
			
			</div>
	</div>
</template>


<script setup>
import _ from 'lodash';
import * as utils from './../utils.js'

import {
	ref, reactive, toRefs, watch, watchEffect, onMounted, onBeforeMount, onUpdated, nextTick,
	onDeactivated, onRenderTriggered, computed
} from 'vue'
//import { utils } from '../../../server2/src/utils';
import ContextMenu from '@/components/cContextMenu.vue'
import { Button, } from '@/components/cSvg.vue'
import { canvasStore, styleStore, configStore, windowStore, contextMenuStore, store } from "@/stores/store.js";

const emit = defineEmits(['opening-sub'])
const props = defineProps(reactive({
	init: {
		type: Object,
		default: {'$containerRef':null},
	},
	containerRect:{
		type: Object,
		default: {},
	},
	path: {
		type: String,
		default: '', 
	},
	items: {
		type: Object,
		default: contextMenuStore().items,
	}, 
	sideObject: {
		type: Object,
		default: {'$containerRef':null},
	},
	itemsSettings: {
		type: Object,
		default: {},
	},
	styles: {
		type: Object,
		default: {},
	}, 
	divRef: {
		default: null//contextMenuStore().divRef
	}
}))
const slider = reactive({
	
})
const refs = reactive({
	slider: null, 
	sliderContainer: null
})
const containerRef = ref(null)
const treeObj = reactive({})
const p = reactive({})
Object.assign(p, props)

function getLim(p){
	var min = (p.min) ? p.min : 0
	var max = (p.max) ? p.max : p.value*10
	var scale = max / refs['sliderContainer'].clientWidth
	console.log('getLim', p.min, p.max, '\t', min, max)
	return {min, max, scale}
}

 function sliderClick(e, value, p){
	const rect = refs['sliderContainer'].getBoundingClientRect()
	var lim =  getLim(p)
	let ratio = ((e.clientX-rect.left)/rect.width)
	refs['slider'].style.width = `${ratio*100}%`
	//console.log(`value:${value}, ratio:${ratio}, lim.scale:${lim.scale} \t ${lim.max*ratio}`)
	value = lim.max*ratio
	p.onChange(lim.max*ratio) 
	return value
}

async function getSize(value, p){
	await nextTick()
	var lim = await getLim(p)
	//console.log('lim', lim, refs['sliderContainer'].clientWidth)
	refs['slider'].style.width = `${value/lim.scale}px`
	return ``
}

/* var win = window,
        doc = document,
        docElem = doc.documentElement,
        body = doc.getElementsByTagName('body')[0],
        x = win.innerWidth || docElem.clientWidth || body.clientWidth,
        y = win.innerHeight|| docElem.clientHeight|| body.clientHeight; */

function openingSub(e){
	for (const [key, value] of Object.entries(treeObj)) {
		if(treeObj && treeObj?.[key]?.['$subListOpen'] && treeObj?.[key]?.['$subListOpen']){
			if(e != props.path+'__'+key) treeObj[key]['$subListOpen'] = false
		}
		let newE = e.split('__')
		newE.pop()
		newE = newE.join('__')
		emit('opening-sub', newE)
	}
}
const rgba = {
	latest: 'rgba(75, 75, 75, 1)', 
	notLatest: 'rgba(75, 75, 75, 0.95)', 
}
async function openSubMenu(e, key, value){
	containerRef.value.style.backgroundColor = rgba.latest;

	treeObj[key]['$subListOpen'] =! treeObj[key]['$subListOpen']
	if(!treeObj[key]['$subListOpen']) return
	await nextTick()
	containerRef.value.style.backgroundColor = rgba.notLatest;
	
	treeObj[key]['$subListRef'].style.left = `${containerRef.value.offsetWidth-3}px`
	treeObj[key]['$subListRef'].style.top = `${0}px`
	
}

onBeforeMount(async() => {
	treeObj['$containerRef'] = null
	for (const [key, value] of Object.entries(p.items)) {
		//console.log(`${key}: ${'value'}`);
		p.styles[key] = {}
		p.styles[key]['$row'] = {}
		if(typeof value =='object') p.styles[key]['$subListOpen'] = false

		treeObj[key] = {}
		treeObj[key]['$row'] = {}
		//treeObj[key]['$containerRef'] = null
		treeObj[key]['$rowRef'] = null
		if(typeof value =='object'){
			treeObj[key]['$subListOpen'] = false
			treeObj[key]['$subListRef'] = null
		} 
		
		
	}
})

onMounted(async () => {
	
	if(props.init.x && props.init.y){
		//await nextTick()
		console.log('containerRef.value', containerRef.value, containerRef)
		containerRef.value.style.left = props.init.x
		containerRef.value.style.top = props.init.y
		containerRef.value.focus()
	}
	emit('opening-sub', props.path)
	
	await nextTick()
	containerRef.value.style.backgroundColor = rgba.latest;
	
	const containerRect = containerRef.value.getBoundingClientRect()
	if(containerRect.right > window.innerWidth-30){
		if(!props.containerRect.width){
			containerRef.value.style.left = `${(window.innerWidth-containerRect.width*1)}px`
		}else{
			containerRef.value.style.left = `-${(props.containerRect.width+containerRect.width)}px`
		}
		
	}
	
	if(containerRect.bottom > window.innerHeight-30){
		if(!props.containerRect.height){
			containerRef.value.style.top = `${(window.innerHeight-containerRect.height-30)}px`
		} else{
			let diff = containerRect.bottom - window.innerHeight 
			containerRef.value.style.top = `-${(diff+30)}px`
		}
	}

})
function testFunction(){
	const containerRect = containerRef.value.getBoundingClientRect()
	store().msg({ [p.path]: {
		'props.containerRect': {
			width: props.containerRect.width,
			right: props.containerRect.right,
		},
		'containerRect': {
			width: containerRect.width, 
			right: containerRect.right, 
		}, 
		'offsetWidth':containerRef.value.offsetWidth,
		'offsetHeight':containerRef.value.offsetHeight,
		window: {
			w: window.innerWidth, 
			h: window.innerHeight
		},
	}})
}
onUpdated(async ()=>{})


function onBlur(){
	contextMenuStore().open = false
}




</script>



<style scoped>

.container{
	display:box;
	position:absolute; 
	z-index: 9999;
	/* background-color: gray; */
	background-color: rgba(55, 53, 52, 1.0);
	cursor: pointer;
	border: 3px solid rgb(0, 0, 0);
	border-radius: 10px;
	margin: 0px;
	padding: 0px;
	white-space: nowrap;
	/* min-width:fit-content; */
}
.row{
	border: 1px solid rgb(2, 2, 2);
	margin: 0px;
	padding: 0px;
	white-space: nowrap;
	/* min-width:fit-content; */
}
.clickable{
	padding:0ch 0.5ch 0ch 0.5ch;
	color: white;
}
.clickable:hover{
	background-color: blue;
	/* border: 1px solid rgb(0, 0, 0); */
	border-radius: 3px;
}

div{
	margin: 0px;
	padding: 0px;
	/* background-color: gray; */
}

/* border: 1px solid rgb(0, 0, 0); */
/* p:hover{
	background-color: blue;
	border-radius: 3px;
}
p{
	margin: 0px;
	padding: 0px;
	background-color: gray;
	color: white;
} */
template{
	margin: 0px;
	padding: 0px;
}

</style>