
<template>
	<div>
		 <div class="container" style="display:flex; flex-direction:row; justify-content: flex-end">
			<div style="text-align: left; padding:1ch;">
				<p style="font-size: 2.0ch ;font-weight:500;" >
					This website is under development. Breaking updates may occur irregularly and without warning, so dont get too attached to your drawings or even your account. 
				</p>
				<p>
					Click <span class="prevent-select" style="color:red;" @click.prevent="showArrows">here</span> for some guiding arrows. 
				</p>
				
			</div>
			

			<div style="width:10%;">
				<img src="@/assets/github-mark/github-mark.png" alt="Girl in a jacket" style="width:100%;cursor:pointer;" @click="onLink('https://github.com/Bullhoff/canvas-together/')" title="https://github.com/Bullhoff/canvas-together/" >
				<button @click="onClick" style="width:100%;height:60%;">OK. Dont show this ever again</button>
				
			</div>
		 </div>
		
	</div>
</template>


<script setup>
//import SocketioService from './../socketio.service.js';
import * as utils from './../utils.js'
import { canvasStore, styleStore, configStore, windowStore, store, someStore } from "@/stores/store.js";
import { defineComponent, onMounted, onBeforeMount, onUpdated, nextTick, ref, reactive, computed } from 'vue'

import Spinner from '@/components/cSpinner.vue'
import Dropdown2 from '@/components/cDropdown2.vue'
import * as Svg from '@/components/cSvg.vue' 


//const emit = defineEmits(['resetZoom'])
const props = defineProps({
	window_id: {
		type: String,
		required: false,
		default: '',
	},
	text: {
		type: Object,
		required: false,
		default: {onChange:()=>{}, hideMess: true, },
	},
})
const refs = reactive([])
let messageQueue = computed(()=>{})

onMounted(async ()=>{
	await nextTick()
	const divRect = windowStore().refs[props.window_id].getBoundingClientRect()
	console.log('windowStore().refs[props.window_id].style', windowStore().refs[props.window_id].style.width)
	windowStore().refs[props.window_id].style.left = `${window.innerWidth/2 - (divRect.width)/2}px`
	windowStore().refs[props.window_id].style.top = `${window.innerHeight/2  - (divRect.height)/2}px`
})

const bool = reactive({
	showMessages: false, 
	showValues: false
})

function onClick(e){
	//configStore().popup_notes_read = localStorage.getItem('popup_notes_read')
	store().popup_notes_read = new Date()
	localStorage.setItem('popup_notes_read', store().popup_notes_read)
	
	//localStorage.setItem('popup_development_disabled', true)
	delete windowStore().windows[props.window_id]
}
function onLink(link){
	//url = `${window.location.origin}/6?picture=${url}`
	//window.open(`https://github.com/Bullhoff/`, '_blank', 'noreferrer');
	window.open(link, '_blank', 'noreferrer');
}

function showArrows(){
	Object.entries(someStore().list).map(([key, value])=>{
		if(someStore().activePopups[key]) return delete someStore().activePopups[key];
		someStore().activePopups[key] = {text:someStore().list[key].text, rect: {}, overlap:false};
	})
}

</script>


<style scoped>

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

</style>


