
<template>
	<!-- 
		style="width:100%; height:100%;"
		background-color: gray;
	 -->
	<div @click="onClick" style="position:relative; width:100%; height:100vh; " :ref="(el)=>refs['body'] = el">
		<!-- <div>
			<p draggable="true">This text <strong>may</strong> be dragged.</p>
			<p draggable="false">This text <strong>may Nut</strong> be dragged.</p>
		</div> -->
	
		<!-- <template v-for="(item, index) in elements" style="position:absolute; width:fill; height:100vh; ">
			{{ index }} - {{ item }} 
			
			<div style="position:absolute;" :style="{left: item.x, top: item.y,}">
				*{{ index }} - {{ item }}*
			</div>
			
		</template> -->
		<div v-for="(item, index) in elements" style="position:absolute;" 
			:style="{
				left: `${item.x}px`, top: `${item.y}px`, backgroundColor:'blue',
				}">
				<p>[{{ item.x }},{{ item.y }}]</p>
				<!-- <p>{{ index }}:[{{ item.x }},{{ item.y }}]</p> -->
			<!-- {{ index }} - {{ item }}  -->
			
			<!-- <div style="position:absolute;" :style="{left: item.x, top: item.y,}">
				*{{ index }} - {{ item }}*
			</div> -->
			
		</div>

		<div :style="{
			position:'absolute', 
			left: '300px', 
			top: '300px', 
			
		}">text</div>
		
	
	</div>
</template>


<script setup>
// https://medium.com/@ronnow/dropdowns-in-vue-the-right-way-8ff9e8f36d4a
//import SocketioService from './../socketio.service.js';
//import { CanvasManager } from '@/CanvasManager8.js'
import { canvasStore, styleStore, configStore } from "@/stores/store.js";
import { h, onMounted, onBeforeMount, watch, onUpdated, nextTick, ref, reactive } from 'vue'

import FormData from 'form-data'	//npm install --save form-data
import * as utils from '@/utils.js'

const testVars = reactive({
	text: 'blabla'
})

const fontObj = reactive({
	value: 2,
	keyword: 'ch',
})

let fontStyle = {
	fontSize: `${fontObj.value}${fontObj.keyword}`,
}

const elements = reactive([])
const refs = reactive({
	body:null
})
// Theevent.pageX and event.pageY
function onClick(e){
	const rect = refs.body.getBoundingClientRect()
	console.log('e', e.clientX, e.clientY, ' -- ',e.pageX, e.pageY, '---', (e.clientX - rect.left), (e.clientY - rect.top),'---' ,rect)
	elements.push({
		x: (e.clientX - rect.left), 
		y: (e.clientY - rect.top), 
	})
}

/* watch(fontObj, () => {
	fontStyle.fontSize = `${fontObj.value}${fontObj.keyword}`
	console.log('fontObj', fontObj, fontStyle.fontSize)
}) */



function onChange() {
	//fontStyle.fontSize = `${value.value}${key.value}`
}

const value = ref(2)
const key = ref('ch')
let keyword = {
	px: 'px',
	ch: 'ch',
	em: 'em',
	rem: 'rem'
}
/* watch(()=>fontObj,(value)=> {
	console.log('fontObj', fontObj)
	fontStyle.fontSize = `${fontObj.value}${fontObj.key}`
}) */

/* watch(value,(value)=> {
	fontStyle.fontSize = `${value.value}${key.value}`
})
watch(value,(value)=> {
	fontStyle.fontSize = `${value.value}${key.value}`
}) */

function eventHandler(e, text) {
	console.log('', text, e)
}

const conf = reactive(configStore());
const canvasses = reactive(canvasStore());

const displayToggle = ref(false)
const file = ref(null)
const parentName = ref(null)


function testButton() {
	console.log('testButton. input', input)
	console.log('testButton. radio', radio)
}


onBeforeMount(() => {
	//console.log('***Menu.onBeforeMount Start***');			console.log('***Menu.onBeforeMount Done***');
})
onMounted(() => {
/* 	console.log('***Menu.TheModifyForm Start***');
	console.log('***Menu.TheModifyForm Done***'); */
})
//watch(conf.bool.newImage, (value) => {})
//watch(conf.bool, (val) => {})








//	},
	//created() {		window.addEventListener("resize", this.resizeHandler);	},
	//beforeUnmount() {		window.removeEventListener("resize", this.resizeHandler);	},
//}
</script>


<style scoped>
/* .container{} */

.grid {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
}

.grid-container div {
	border: 1px solid rgb(43, 0, 255);
}

.formContainer {
	width: fit-content
}

.formGrid {
	/* display: grid;
    border: solid 1px black;
    grid-auto-rows: 30px;
    grid-auto-columns: repeat (5, 50px);
    grid-gap: 5px; */
	/* position:relative; */

	/* grid-template-rows: 30px; */
	/* grid-gap: 5px; */


	display: grid;
	/* grid-template-columns: repeat(3, 50px); */
	/* grid-template-columns: repeat(auto-fills, 50px);  */
	/* grid-template-columns: repeat(auto-fit, 50px); */
	grid-template-columns: repeat(2, minmax(100px, 1fr));
	border: solid 1px rgb(99, 10, 10);

	/* display: grid;
	grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
	border: solid 1px rgb(0, 21, 255); */


}



#image-select-container {
	/* display: grid;
	grid-template-columns: 1fr 1fr 1fr; */
	width: 50%;
	align-items: left;
	background-color: rgb(81, 84, 81);
}

#select-new-or-same {
	display: grid;
	grid-template-columns: 1fr 10fr 10fr 15fr 15fr;
	column-gap: 1ch;

	/* width: 15ch; */
	/* width: 15ch; */
	align-items: center;
	/* background-color: rgb(26, 174, 61); */
}

/* #select-new-or-same input[type=radio]{
	height: 2ch;
} */
#select-new-or-same input[type=file] {
	/* background-color: rgb(159, 15, 195); */
	align-self: end;

	/* width: 30ch; */
}

/* #select-new-or-same{
	width: 15ch;
	align-items: left;
	background-color: rgb(26, 174, 61);
}
#select-new-or-same div{
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
} */
/* #select-new-or-same input[type=radio]{
	height: 2ch;
} */
</style>


