
<template>

		<template v-for="(value, key, index) in props.obj" >	<!-- style="overflow-y: scroll;" -->
			<ul>
				<template v-if="key == '_expanded'">
					
				</template>
				<template v-else-if="value == null">
					<!-- {{ key }} = {{ value }} {{ typeof value }} -->
					<li :title="index+','+key+': '+value" >{{key}} = {{value}} </li>
				</template>

				<template v-else-if="typeof value == 'string'">
					<li :title="index+','+key+': '+value" >{{key}} = {{value}} </li>
				</template>

				<template v-else-if="typeof value == 'number'">
					<li :title="index+','+key+': '+value" >{{key}} = {{value}} </li>
				</template>

				<template v-else-if="typeof value == 'object'">
					<li :title="index+','+key+': '+JSON.stringify(value)" >	<!-- style="white-space:nowrap;" -->
						<!-- <button @click="props.obj[key]['vis'] =! props.obj[key]['vis']">{{key}} {{ props.obj[key]['vis'] }}</button> -->
						<button 
							@click="buttonExpand(key)"
							:ref="(el)=>refs[key]=el"
							>
							{{key}} 
						</button> 
						<!-- <p style="display:inline; overflow: hidden; white-space:nowrap;">
							-- ({{ props.obj[key]['_expanded'] }}) -- ({{ typeof value }})
							{{ JSON.stringify(value) }}
						</p> -->
					</li>

					<TestCss3Tree_recursive v-if="props.obj[key]['_expanded']" :obj="props.obj[key]"/>
				</template>

				<template v-else>
					{{ key }} {{ value }} ({{ typeof value }})
				</template>
			</ul>
		</template>
</template>


<script setup>
// https://medium.com/@ronnow/dropdowns-in-vue-the-right-way-8ff9e8f36d4a
//import SocketioService from './../socketio.service.js';
//import { CanvasManager } from '@/CanvasManager8.js'
import { canvasStore, styleStore, configStore } from "@/stores/store.js";
import { h, onMounted, onBeforeMount, watch, onUpdated, nextTick, ref, reactive } from 'vue'

import TestCss3Tree_recursive from "@/components/test/cTestCss3Tree_recursive.vue";

import FormData from 'form-data'	//npm install --save form-data
import * as utils from '@/utils.js'


const emit = defineEmits(["emit-handler"])
const props = defineProps({
	obj: {
		type: Object,
		required: false,
	},
})
const refs = reactive({})


function buttonExpand(key){
	props.obj[key]['_expanded'] =! props.obj[key]['_expanded']
	
	//refs[key].remove("button-expanded");
	//refs[key].classList.add("button-expanded");

	setClass(key)
	/* if(props.obj[key]['vis'])
		refs[key].classList.add("button-expanded");
	else 
		refs[key].classList.remove("button-expanded"); */
	/* if(props.obj[key]['vis'])
		refs[key].style.backgroundColor = 'gray'
	else 
		refs[key].style.backgroundColor = 'blue' */
}
function setClass(key){
	if(props.obj[key]['_expanded'])
		refs[key].classList.add("button-expanded");
	else 
		refs[key].classList.remove("button-expanded");
}

onMounted(() => {
	for (const [key, value] of Object.entries(refs)) {
		setClass(key)
	}
})


onBeforeMount(() => {})

//watch(conf.bool.newImage, (value) => {})
//watch(conf.bool, (val) => {})
//created() {		window.addEventListener("resize", this.resizeHandler);	},
//beforeUnmount() {		window.removeEventListener("resize", this.resizeHandler);	},
/* watch(fontObj, () => {}) */
function onChange() {
	//fontStyle.fontSize = `${value.value}${key.value}`
}
function eventHandler(e, text) {
	console.log('', text, e)
}


</script>


<style scoped>

.button-expanded{
	background-color: gray;
}
/* .container{} */

/* ul{
	background-color: gray;
}
li{
	background-color: rgb(52, 41, 41);
} */
.table-test{
	background-color: gray;
}
.table-test tr{
	background-color: rgb(64, 32, 32);
}
.table-test td{
	background-color: rgb(54, 75, 55);
}
.table-test th{
	background-color: rgb(81, 41, 41);
}


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


