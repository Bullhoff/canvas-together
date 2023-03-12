


<template>
	<!-- weight:200px;height:200px;background-color: blanchedalmond; -->
	<!-- width:fit-content;height: fit-content; -->
	<div  v-show="!windowState.minimized" style="">
		<div id="draggable-container" class="draggable-container"  @scroll="func.onScroll" 
			style=""
			@mousedown.passive="func.mouseDownContainer(windowState.id)"
			@mouseup.passive="func.mouseUp(windowState.id)"
			@mousemove.passive="func.mouseMove($event, )"
			:style="[style.container, windowState.style]" 
			:ref="(el)=>divRef = el"
			:class="[currentState.activeWindow == windowState.id ? 'window-active'  : '', 'window']"
			>	

			<div id="draggable-header" :style="[style.header]"
				@mousedown.passive="func.mouseDownTitle($event, windowState.id)"
				style="min-width:1ch;"
				:ref="(el)=>refs['header'] = el"
				>
				<header style="" @dblclick="func.maximize()" class="prevent-select">

					<p style="position:absolute; left:0ch;" v-if="configStore().general?.debug">
						{{ props.windowState?.style?.zIndex }}
					</p>
					<slot name="header" style="display:inline-block;"></slot>
					<div style="position:absolute; right:1px; top:1px; display:inline-flex;">
						<button style="background-color: gray;border-radius: 3px;" @click="func.minimize();">-</button>
						<button style="background-color: gray;border-radius: 3px;" @click="func.maximize();">𓂸</button>
						<button style="background-color: gray;border-radius: 3px;" @click="func.close();">X</button>
					</div>
				</header>
			</div>
			
			<div id="draggable-body" :style="style.body" style="position:relative;"	>
				<slot />
			</div>
		</div>

	</div>


</template>


<script setup>
//import SocketioService from './../socketio.service.js';
import { canvasStore, styleStore, configStore } from "@/stores/store.js";
import { defineComponent, onMounted, onBeforeMount, onUpdated, nextTick, ref, reactive, toRef, isRef, computed } from 'vue'
import * as utils from '@/utils.js'
import _ from 'lodash';


const emit = defineEmits(["reset-zoom", "test-emit", 'close', 'onHolding', 'onRelease', 'minimize', 'maximize'])

// :window_id="id"	window_id	props.divRef
const props = defineProps({
	window_id:{
		required: false,
		default: null,
	},
	divRef: {
		required: false,
		default: null,
	},
	propStyle: {
		type: Object,
		required: false,
	}, 
	windowState: {
		type: Object,
		required: false,
	}, 
	currentState: {
		type: Object,
		required: false,
	},
	functions: {
		type: Object,
		required: false,
	},
})
const refs = reactive({})
const divRef = ref(props.divRef)
const defaultWindowState = { divRef:null, style:{},holding:false, posX:0, posY:0, name:'', open:false,minimized:false,maximized:false }
const windowState = reactive(_.merge(defaultWindowState, props.windowState))

const defaultCurrentState = { activeWindow:null, x1:0,x2:0, y1:0, y2:0 }

const currentState = reactive(_.merge(defaultCurrentState, computed(()=>props.currentState).value ))

const defaultStyle = {
	container: {
		maxHeight: '95vh',
		borderRadius: '5px',
		//width: 'fit-content',
		
	}, 
	header: {
		position: 'sticky', 
		//width: '100%',
	},
	body:{
		//width: '100%',
		alignItems:'left', 
		alignContent: 'left'
	}
}
const style = reactive(_.merge(defaultStyle, props.propStyle))



///// Outdated functions. See windowStore.js for what is actually used. 
const defaultFunctions = {
	/* mouseUp(e) {
		console.log('mouseUp',e)
		currentState.holding = false
		windowState.holding = false
	}, 
	mouseDownTitle(e) {
		console.log('mouseDown',e)
		currentState.activeWindow = windowState.name
		currentState.holding = true
		windowState.holding = true
		currentState.x2 = e.clientX;
		currentState.y2 = e.clientY;
	}, 
	mouseDownContainer(e){

	},
	mouseMove: (e)=>{
		console.log('mouseMove',e)
		if (!props.windowState.holding) return 
		currentState.x1 = currentState.x2 - e.clientX;
		currentState.y1 = currentState.y2 - e.clientY;
		currentState.x2 = e.clientX;
		currentState.y2 = e.clientY;
		windowState.posX = (divRef.value.offsetLeft - currentState.x1) + "px";
		windowState.posY = (divRef.value.offsetTop - currentState.y1) + "px";
		divRef.value.style.left = currentState.posX
		divRef.value.style.top = currentState.posY	// DIVREF FIX
	},
	
	close(){
		emit('close')
		windowState.open = false
		//toggleOpen
	}, 
	minimize(){
		emit('minimize')
	}, 
	maximize(){
		emit('maximize')
	}, 
	onMounted(divRef){
		console.log('NewWindowMounted')
		
		let width = window.innerWidth*0.20
		let pos = {
			x:window.event?.clientX,
			y:window.event?.clientY
		}
		if(window.event?.clientX+width > window?.innerWidth)
			pos.x = window.innerWidth-width
	}, */
	onScroll(e){
		if(divRef.value.scrollTop > refs.header.offsetHeight*2){	
			style.header.position = 'fixed'
			style.header.width = 'inherit'
		} else if(divRef.value.scrollTop < refs.header.offsetHeight) {
			style.header.position = 'sticky'
			style.header.width = '100%'
		}
	}, 
}
const func = reactive(_.merge(defaultFunctions, props.functions))






onBeforeMount(() => { })
onMounted(() => { 
	//await nextTick()
	func.onMounted(divRef, windowState?.id)
})
/* onMounted(async () => { 
	await nextTick()
	func.onMounted(divRef, windowState?.id)
}) */


</script>


<style scoped>


.window{
	background-color: #3b3838;
}
.window-active{
	background-color: #595454;
}

.prevent-select {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}

#draggable-container {
	position: absolute;
	z-index: 999999;
	text-align: center;
	border: 1px solid #d3d3d3;
	color: #fff;
	width: 20%;
	overflow: auto;
	resize: both;
	box-shadow: 0px 0px 2px #ffffff;
	/* direction: rtl; */

}

#draggable-header {
	cursor: move;
	z-index: 10;
	background-color: #1f1b7e;
	color: #fff;
}

#displaySelection {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	padding: 0.5ch;
}

#displaySelection div {
	padding: 0.05ch;

}
</style>


