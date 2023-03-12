<template >
	
	<div class="dropdown" :style="[p.propStyle.container]" @blur="onBlur($event, '@blur')"  :title="p.titleContainer+': '+p.selected"  @contextmenu.prevent="toggleOpen" tabindex="0" :ref="($event)=>refs.container = $event">
		
		<!-- 
			justify-self:center;	background-color: gray;
			height:100% ;
			padding:0%;margin:0%;
			width:100%;
			width:fit-content;
		 -->
		 
		<div style="display: flex; flex-flow: row ; justify-content: flex-end; gap:0.2ch;height:3ch; align-items: center;" :style="[p.propStyle.selectedContainer]">

			<p :ref="($event)=>refs.selected = $event" :contenteditable="p.settings.editable"  @click.prevent=""  @input="selectedInputChange($event, 'p @input')" @focusout="selectedInputFocusOut"
					@click.stop.prevent.left="onClickSelect"
					style=""
					:style="[p.propStyle.selected]" >
					<template v-if="(typeof p.selected != 'object')">
						<!-- ab	{{ typeof p.selected }} -->
						{{ (p.selected)? p.selected : '\xa0' }}
					</template>
					<template v-else>
						<!-- cd	{{ typeof p.selected }} -->
						{{ (p.selected?.name)? p.selected?.name : '\xa0' }}
					</template>
					<!-- {{ ()=>p.selected }} -->  <!-- {{ p.state.open }} -->
			</p>
			
			 <!-- emit('increase') emit('decrease') arrowUp arrowDown-->
			<div style="position:relative ;height: inherit; line-height: 50%; width:1.0ch; " v-if="p.parts.selectedSpinner">

				<div style="height:50%; width:inherit; margin: 0; padding: 0;" :title="p.titleArrowUp" 
					 
					@mousedown.left="arrowMouseEvent($event,'mousedown', 'up')"
					@mouseup.left="arrowMouseEvent($event,'mouseup', 'up')"
					@mouseleave="arrowMouseEvent($event,'mouseleave', 'up')"
					>
					<svg preserveAspectRatio="none" width='100%' height='100%' viewBox="0 0 2 2" style=" box-sizing: content-box;object-fit: contain;margin: 0; padding: 0;justify-self: start;">
						<polygon points="0,2 1,0 2,2" style="box-sizing: content-box;" class="arrow"/>
					</svg>
				</div>
				<div style="height:50%; width:inherit; margin: 0; padding: 0;" :title="p.titleArrowDown" 
					
					@mousedown.left="arrowMouseEvent($event,'mousedown', 'down')"
					@mouseup.left="arrowMouseEvent($event,'mouseup', 'down')"
					@mouseleave="arrowMouseEvent($event,'mouseleave', 'down')"
					>
					<svg preserveAspectRatio="none" width='100%' height='100%' viewBox="0 0 2 2"  style="transform: rotate(180deg);">
						<polygon points="0,2 1,0 2,2" style="" class="arrow"/>
					</svg> 
				</div>

			</div>

			<div style="" @click="toggleOpen" v-if="p.parts.dropdownArrow">
				<svg preserveAspectRatio="none" width='1.2ch' height='40%' viewBox="0 0 2 2" style="transform: rotate(180deg); padding: 0.0ch;box-sizing: content-box; " >
					<rect  width="2" height="2" style="fill:unset;"/>
					<polygon points="0,2 1,0 2,2" style="" class="arrow"/>
				</svg>
			</div>
		</div>

		<div class="items" v-if="p.state.open" :style="[p.propStyle.list]" style="" :ref="($event)=>refs.list = $event">
			<div v-for="(item, i) of listComputed" :key="item" 
				:style="[p.propStyle.itemRow, pState[(item?.id)?item.id:item]?.listStyle]" 
				:class="{ grayed: pState[(item?.id)?item.id:item]?.hidden }"
				style="display: flex; flex-flow: row ; justify-content: flex-end; gap:0.2ch; align-items: center;" class="row" 
			>
				<p 	@click="selected($event, item)" 
					@click.middle="middleClick($event, item)"
					:title="
						((item?.name)?item.name+' -- '+item.id : (item)) + 
						((item?.id && canvasStore().canvasHistory[item?.id]) ? ' -- ' + canvasStore().canvasHistory[item?.id].length : '')
					" 
					style="margin-right: auto;"
					:class="[item.owner && configStore().user.username != item.owner ? 'redded':'']"
				>
				<!-- redded grayed -->
				<!-- :class="[configStore().user.username != canvasStore().canvasList[canvasStore().current.layer_id].owner ? 'grayed':'']" -->
					<!-- <template v-if="()=>{return typeof item != 'object'}">  -->
					<template v-if="(typeof item != 'object')" :title="item"> 
						{{ item }} <!-- {{ typeof item }} -->
					</template>
					<template v-else :title="item.name+' -- '+item.id">
						{{ item.name }} <!-- ..{{ typeof item }} -->
					</template>
					<!-- {{ item }}  -->
				</p>

				<div v-if="item && p.parts.moveItemSpinner">
					<Spinner @increase="emit('move-up', (item.id)?item.id:item)" @decrease="emit('move-down', (item.id)?item.id:item)" @click.prevent.stop=""/>
				</div>

				<p v-if="item && p.parts.hide" class="toggleShow"
					@click="emit('hide', (item.id)?item.id:item)"
					:style="[p.propStyle.itemHide]">
						&#128065;
				</p>
				
				<p v-if="item && p.parts.remove && item?.type != 'background' && item?.owner == configStore().user.username" 
						class="remove" 
						@click="emit('remove', (item.id)?item.id:item)" 
						:style="[p.propStyle.itemCancel]" >
					X
				</p>
				<p v-else-if="p.parts.remove" :style="[p.propStyle.itemCancel]" class="remove" style="opacity:0;">	
					X	
				</p>
				<!-- <p v-else-if="item == 'img'" :style="[p.propStyle.itemCancel]" class="remove" style="opacity:0;">	
					X	
				</p> -->
				<!-- {{ listObject[item] }} -->
				<div v-if="listObject != null && listObject[(item.id)?item.id:item]">
					<p>
						→
					</p>
					<!-- {{ JSON.stringify(listBranchComputed) }} -->
				</div>
			</div>
		</div>
	</div>
</template>


<script setup>

//import * as loadash from 'loadash';
import _ from 'lodash';
import * as utils from './../utils.js'

//import { defineComponent, onMounted, onBeforeMount, onUpdated, nextTick, ref, reactive, defineEmits } from 'vue'
//import { channel } from 'diagnostics_channel';
import {
	ref, reactive, toRefs, watch, watchEffect, onMounted, onBeforeMount, onUpdated, nextTick,
	onDeactivated, onRenderTriggered, computed
} from 'vue'
import { canvasStore, styleStore, configStore, contextMenuStore } from "@/stores/store.js";
//import { utils } from '../../../server2/src/utils';
import Spinner from '@/components/cSpinner.vue'
import { Button, } from '@/components/cSvg.vue'
// const props = defineProps({
// const props = defineProps(toRefs({
// const props = defineProps(reactive({
//const props = defineProps(['list', 'selected', 'state', 'propStyle', 'settings'])
//const props = defineProps({list:[], selected:'aa', state:null, propStyle:null, settings:null})
const props = defineProps({
	propName: {
		type: String,
		default: 'Name',
	},
	list: {
		type: Array,
		default: ['iiii'],
	}, 
	listObject: {
		type: Object,
		default: null,
	}, 
	selected: {
		default: ''
		/* type: String || Number,
		default: 7, */
		/* default: ['iiii'], */
	},
	state: {
		type: Object,
		default: {},
	},
	propStyle: {
		type: Object,
		default: {},
	},
	valueType: {
		type: String,
		default: 'float',
		validator(value) {
			return ['string', 'integer', 'float'].includes(value)
		}

	},
	settings: {
		type: Object, 
		default:{}
	},
	parts:{
		type: Object,
	},
	increment: {
		type: Number,
		default: 1,
	}, 
	limits: {
		type: Object,
		default: {min:null, max:null},
	},
	titleContainer:{},titleArrowUp:{},titleArrowDown:{}
})

/* watch(props.selected, () => {
  console.log('WATCH props.selected Changed', props.selected)
}) */
/* watch(() => props.selected, (count, prevCount) => {
    console.log('WATCH props.selected Changed', props.selected)
}) */


/* 
width:'20ch',
*/
const defaultProps = {
	list: ['item1', 'item2', 'item3'],
	selected: 'selected',
	state: {
		open: false, 
		//editable: true,
	}, 
	propStyle: {
		container: {
			position:'relative',
			display: 'inline-block',
			maxWidth: '20ch',
			minWidth: '4ch',
			width: '6.1ch',
			backgroundColor: '#0a0a0a',
			borderRadius: '6px',
			border: '1px solid #666666',
			color: '#fff',
			paddingLeft: '1ch',
			paddingRight: '0.4ch',
			cursor: 'pointer',
			userSelect: 'none',
			whiteSpace: 'nowrap',
			textAlign: 'left',
		}, 
		selectedContainer:{
			width:'auto',
			overflow: 'hidden',
			//width:'100%',
			paddingRight: '0.0ch',
		},
		selected:{
			marginRight: 'auto',
			//verticalAlign: 'baseline',
			/* verticalAlign: 'middle', */
			minWidth:'1ch',
			textAlign: 'left',
			whiteSpace: 'nowrap',
			width:'100%',
			/*blockSize: 'fit-content', */
			objectFit: 'contain',
			maxWidth:'100%',
		},
		list:{
			paddingLeft: '1ch',
			paddingRight: '0.5ch',
			marginLeft: '-1ch',
			backgroundColor:'black',
			borderRadius: '6px',
			border: '1px solid #666666',
			width:'fit-content',
			//minWidth: '4ch',
			//border: '1px solid red',
			overflow: 'hidden',
			zIndex: 999,
		},
		itemRow: {
			// display: flex; flex-flow: row ; justify-content: flex-end; gap:0.2ch;
			//backgroundColor:'purple',
			display: 'grid',
			gridTemplateColumns: '10fr auto auto auto auto auto auto auto auto',
			gap: '1ch',
			minWidth: '10ch',
			/* width:'fit-content', */
			height:'3ch',
			//border: '1px dashed red',
			borderBottom: '1px dashed red',
			//backgrounColor:'black',
		}, 
		itemHide:{}, 
		itemCancel:{},
	},
	parts: {
		dropdownArrow: false,
		selectedSpinner: true, 
		moveItemSpinner: false, 
		hide: false, 
		remove: false, 
	},
	settings: {
		arrowHoldSpeed: 100, 
		arrowHoldDelay: 300,
		titleContainer:'', titleArrowUp:'', titleArrowUp:'',
		closeAfterSelect:true, 
		changeSelectedTextOnSelect: true,
		editable: true,
		containerWidthMode: '',
		/* parts: {}, */
		/* valueType: 'float', */
		/* limits: {min:'0', max:10} */
	},
	limits: {min:'0', max:10},
	valueType: 'float',
}
var pState = computed(() => _.merge(defaultProps.state, props.state))
//var listComputed = computed(() => props.list)
var listComputed = computed(() => {
	//if(typeof props.list == 'object')
	return props.list
})
var listObjectComputed = computed(() => props.listObject)

var propsComputed = computed(() => props)
//var p = reactive(_.merge(defaultProps, propsComputed.value))
var p = reactive(_.merge(defaultProps, props))
p.propStyle.list.minWidth = p.propStyle.container.width
//var p = computed(() => _.merge(defaultProps, props))
//var pComputed = computed(() => p)

//computed(() => {})
//var p = computed(() => _.merge(defaultProps, props))


function isOverflown(element) {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}
function adjustContainerWidth(theRef){
	if(!p.selected) return
	if(typeof p.selected == 'object') return
	let length = (typeof p.selected == 'number') ? p.selected.toString().length : p.selected.length
	p.propStyle.container.width = `${length + 4.5}ch`
	refs.container.style.width = p.propStyle.container.width
}
function adjustSelectedFontSize(){
	//p.selected = props.selected
	if(Math.round(p.selected).toString().length >= 2)
		p.propStyle.selected.fontSize = '1.5ch'
	else if(Math.round(p.selected).toString().length >= 3)
		p.propStyle.selected.fontSize = '1.0ch'
	else p.propStyle.selected.fontSize = '2ch'
}
const emit = defineEmits(['input', 'toggleHidden', 'remove', 'new', 'hide', 'move-up', 'move-down', 'click-middle', 'decrease', 'increase', 'selected', 'selected-id'])


const refs = reactive({
	selected: null, 
	container: null, 
	list: null
})

function onMouseDown(){
	console.log('onMouseDown')
}

const holding = ref(false)
var intervalId, timeoutId, val

watch(holding,(value)=>{
	if(value) {
		increment(val)
		timeoutId = setTimeout(() => {
			if(value)
				intervalId = setInterval(()=> increment(val), p.settings.arrowHoldSpeed);
		}, p.settings.arrowHoldDelay);
		
	} else {
		clearTimeout(timeoutId);
		clearInterval(intervalId);
	}
})

function onBlur(e){
	p.state.open = false
}

async function arrowMouseEvent(e, msg, upOrDown){
	val = (upOrDown == 'up') ? +p.increment : -p.increment
	if(msg == 'mousedown') holding.value = true
	if(msg == 'mouseleave') holding.value = false
	if(msg == 'mouseup') holding.value = false

}


async function increment(val){
	//console.log('increment', val, intervall)
	refs.selected.textContent = await setWithinLimit(await getValue() + val)
	emit('selected', refs.selected.textContent)
}
async function middleClick(e, val){
	emit('click-middle', (typeof val == 'object') ? val.id : value)
}
async function selected(e, val){
	console.log('!!!!!!!!!selected', val.id, val, e.target.textContent)
	let value
	value = await setWithinLimit(val)
	if(p.settings.changeSelectedTextOnSelect)
		refs.selected.textContent = e.target.textContent

	emit('selected', (typeof val == 'object') ? val.id : value)
	emit('selected-id', val.id)

	if(p.settings.closeAfterSelect) p.state.open = false
}

function toggleOpen(e){
	p.state.open =! p.state.open
	refs.selected.blur()
}

onBeforeMount(async() => {})
onMounted(() => {
	//refs.selected
	//adjustContainerWidth()
})
watch(()=>props.selected, ()=>{
	console.log('(**********ö*ö*********)', props.selected)
	p.selected = props.selected
	refs.selected.textContent = (p.selected) ? p.selected : '\xa0'
	if(p.settings.containerWidthMode == 'adjustFontSize')
		adjustSelectedFontSize()
})

function onClickSelect(e){
	if(p.settings.editable)
		document.getSelection().selectAllChildren(refs.selected);
	else 
		toggleOpen()
}

 function setWithinLimit(val){
	if(!p.limits) return val
	else if(!p.limits.max && !p.limits.min)  return val
	else if(val <= p.limits.min) return p.limits.min //.toString()
	else if(val >= p.limits.max) return p.limits.max
	else return val
	//console.log('!!!!!!!!!!!!!!!!!!', val)
}
async function getValue(){
	if(p.valueType == 'float') return parseFloat(refs.selected.textContent)
	if(p.valueType == 'integer') return parseInt(refs.selected.textContent)
	return refs.selected.textContent
}
function selectedInputFocusOut(e){
	if(!refs.selected.textContent) refs.selected.textContent = props.selected
	document.getSelection().empty();
}

async function selectedInputChange(e){
	var range = document.createRange()
    var sel = window.getSelection()
    var pos = window.getSelection().anchorOffset

	if(p.settings.valueType=='float' && !Number(refs.selected.textContent)){
		//refs.selected.textContent = refs.selected.textContent.replace(/\D/g,'');
		refs.selected.textContent = refs.selected.textContent.replace(/,/g, '.');
		let removed = 0
		refs.selected.textContent = refs.selected.textContent.replace(/[^\d.-]/g, function(x){removed+=1;return ''});
		pos -= removed
	}
	else if (p.settings.valueType=='integer'){
		//refs.selected.textContent = parseInt(refs.selected.textContent)
		let removed = 0
		refs.selected.textContent = refs.selected.textContent.replace(/\D/g,function(x){removed+=1;return ''});
		pos -= removed
	}
	if(refs.selected.textContent){
		range.setStart(refs.selected.childNodes[0], pos)
		range.collapse(true)
		sel.removeAllRanges()
		sel.addRange(range)
	}
	emit('selected', await setWithinLimit(await getValue()))
	
}



</script>



<style scoped>

.grayed {
	opacity: 0.3
}
.redded {
	color:red;
}
.demos {
  white-space: nowrap;
  overflow: hidden;
  /* width: 120px; */
  border: 3px solid black;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}

.row p:hover {
	background-color: #03f4a0;
}
/* * {
    margin: 0;
    padding: 0;
} */

.arrow{
	stroke:rgb(243, 10, 2);
	stroke-width:0.2;
	fill: #1f00ec;
    opacity: 0.5;
}
.arrow:hover{
	fill: #ec008c;
    opacity: 1.0;
}

.grayed {
	opacity: 0.3
}

.test {
	/* display:inline; */
	/* display:block; */
	display: inline-block;
	position: relative;
}

.test-fade {
	color: 'gray'
}

.test-fade-not {
	color: 'red'
}

.dropdown {
	/* display: inline-block;  */
	/* display: inline-block;
	z-index: 9999;
	position: relative; */
	/* width: fit-content; */
	/* width: 20ch; */
	/* width: 100%; */
	/* position: 'relative'; */
	/* text-align: left; */
	/* outline: none; */
	/* height: 3ch; */
	/* line-height: 3ch; */
	/* background-color: #ad8225; */
	/* height: 47px; */
	/* line-height: 47px; */
}

.dro-pdown .selected {
	/* position: relative; */
	/* position: absolute; */
	background-color: #0a0a0a;
	border-radius: 6px;
	border: 1px solid #666666;
	color: #fff;
	padding-left: 1em;
	cursor: pointer;
	user-select: none;

	height: 100%;
	/* height: 4ch; */
	/* min-height: 3ch; */
	/* background-color: #7c46f0; */
}

.dro-pdown .selected.open {
	border: 1px solid #ad8225;
	border-radius: 6px 6px 0px 0px;
}

.dro-pdown .selected:after {
	position: absolute;
	content: "";
	/* top: 22px; */
	top: 1.3ch;
	right: 0.5em;
	width: 0;
	height: 0;
	border: 5px solid transparent;
	border-color: #fff transparent transparent transparent;
}

.it-ems {
	background-color: #503c3c;
}
.dro-pdown .items {
	color: #fff;
	border-radius: 0px 0px 6px 6px;
	overflow: hidden;
	border-right: 1px solid #ad8225;
	border-left: 1px solid #ad8225;
	border-bottom: 1px solid #ad8225;
	position: absolute;
	background-color: #503c3c;
	/* left: 0;
  right: 0; */
	z-index: 1;
	/* width: 50ch; */



	/* width: 50vw; */
	/* position: relative; */
	/* left: calc(-50vw + 50%); */
	/* left: 50%;
  right: 50%; */
	/* margin-left: -50vw;
  margin-right: -50vw; */


}

/* .dropdown .items div{ */
/* display: grid;
	grid-template-columns: 10fr 1fr 1fr;
 */
/* } */
/* .name{
	display: inline;
}
.remove{
	display: inline;
	align-self: right;
	align-items: right;
} */
/* <p class="name">{{ option }}</p>
			<p class="remove">X</p> */

.dro-pdown .items div {
	color: #fff;
	padding-left: 1em;
	/* cursor: pointer; */
	user-select: none;
}

.dro-pdown .items div p:hover {
	background-color: #ad8225;
}
.dro-pdown .items div div div:hover {
	background-color: #03f4a0;
}

/* .dropdown .items div:hover {
  background-color: #ad8225;
} */

.selectHide {
	display: none;
}
</style>