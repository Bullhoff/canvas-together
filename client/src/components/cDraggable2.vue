


<template>
	<div  v-show="!windowState.minimized" >
		<!-- @dblclick="func.maximize()" -->
		<div id="draggable-container" 
			class="draggable-container"  
			@scroll="func.onScroll" 
			style="background-color: rgba(0,0,0,.0); pointer-events: none;"
			@mouseup.passive="func.mouseUp(windowState.id)"
			@mousemove.passive="func.mouseMove($event, )"
			:style="[style.container, windowState.style]" 
			:ref="(el)=>divRef = el"
			:class="[currentState.activeWindow == windowState.id ? 'window-active'  : '', 'window']"
			>	
			
			<div id="draggable-body" 
				:style="style.body" 
				style="position:relative; width:fit-content; height: fit-content; min-width: 10px;min-height: 10px; pointer-events: none;"	
				@mousedown.passive="func.mouseDownContainer(windowState.id);func.mouseDownTitle($event, windowState.id);"
			>
				<slot :window_id="props.id"	/>
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

//:window_id="id"
const props = defineProps({
	window_id: {
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
		width:'fit-content', 
		height:'fit-content', 
	}, 
	body:{
		alignItems:'left', 
		alignContent: 'left', 
		width:'fit-content', 
		height:'fit-content', 
	}
}
const style = reactive(_.merge(defaultStyle, props.propStyle))


const defaultFunctions = {
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


</script>


<style scoped>
#draggable-container {
	position: absolute;
	z-index: 999999;
}
</style>


