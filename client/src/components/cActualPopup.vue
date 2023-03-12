
<template>
	<div>
		 <div class="container" style="display:flex; flex-direction:row; justify-content: flex-end">
			<div style="text-align: left; padding:1ch;">
				<!-- <p style="font-size: 2.0ch ;font-weight:500;" >
					*This website is under development. Breaking updates may occur irregularly and without warning, so dont get too attached to your drawings or even your account. 
				</p>
				<p style="font-size: 2.0ch ;font-weight:500;" >
					*For now, settings can only be saved in your browser. Your user account only keeps track of what canvasses and layers you can access. 
				</p>
				<p>
					Click <span class="prevent-select" style="color:red;" @click.prevent="showArrows">here</span> for some guiding arrows. 
				</p> -->
				<ul style="margin:1ch;padding:1ch;">
  					<li style="font-size: 2.0ch ;font-weight:500; padding:1ch;">
						This website is under development. Breaking updates may occur irregularly and without warning, so dont get too attached to your drawings or even your account. 
					</li>
					<li style="padding:1ch;">
						For now, settings can only be saved in your browser. Your user account only keeps track of which canvasses and layers you can access.
					</li>
					<li style="">
						Click <span class="prevent-select" style="color:red;" @click.prevent="showArrows">here</span> for some guiding arrows. 
					</li>
				</ul>
				
			</div>
			
			
			<div style="width:10%;">
				<img src="@/assets/github-mark/github-mark.png" alt="Girl in a jacket" style="width:100%;height:auto; cursor:pointer;" @click="onLink('https://github.com/Bullhoff/canvas-together/')" title="https://github.com/Bullhoff/canvas-together/" >
				<button @click="onClick" style="width:100%;height:80%;">OK.*</button>
				<!-- *By pressing OK you agree to OKing -->
				
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

onMounted( async()=>{
	await nextTick()
	console.log('windowStore().refs[props.window_id].style', windowStore().refs[props.window_id]?.style?.width, props.window_id, windowStore().refs[props.window_id])
	const divRect = windowStore().refs[props.window_id].getBoundingClientRect()
	
	windowStore().refs[props.window_id].style.left = `${window.innerWidth/2 - (divRect.width)/2}px`
	windowStore().refs[props.window_id].style.top = `${window.innerHeight/2  - (divRect.height)/2}px`
})

const bool = reactive({
	showMessages: false, 
	showValues: false
})

function onClick(e){
	console.log('windowStore().refs[props.window_id].style', windowStore().refs[props.window_id]?.style?.width, props.window_id, windowStore().refs[props.window_id])
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


