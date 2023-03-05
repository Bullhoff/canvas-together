
<template>
	<!-- 
		style="width:100%; height:100%;"
		background-color: gray;
	 -->
	<div @click="onClick" style="position:relative; width:100%; height:100vh; " :ref="(el)=>refs['body'] = el">
		
		<!-- <table style="background-color:gray;" class="table-test">
			<tr>
				<td>tr1	</td>
			</tr>
			<tr>
				<td>tr21</td> <td>tr22</td> <td>tr23</td> <td>tr24</td> <td>tr25</td> 
			</tr>
			<tr>
				<td>tr21</td> <td>tr22</td> <td>tr23</td> <td>tr24</td> <td>tr25</td> 
			</tr>
			<tr>
				<td>tr4</td>	
			</tr>
			<tr>
				<td>tr4</td>		
			</tr>
			<tr>
				<td>tr4</td><td>tr4</td><td>tr4</td><td>tr4</td>	
			</tr>
			<tr>
				<td>tr4</td>	
			</tr>
		</table>


		<table style="background-color:gray;" class="table-test">
			<tr v-for="item in mockData">
				<td>{{ item }}	</td>
			</tr>
		</table>

		<table style="background-color:gray;" class="table-test">
			<tr v-for="item in mockData">
				<td v-for="item2 in item">{{ item2 }}	</td>
			</tr>
		</table>

		<table style="background-color:gray;" class="table-test">
			<tr v-for="(value, key, index) in mockData">
				<td v-for="(value2, key2, index) in value">
					{{ key }} - {{ key2 }} -- {{value2}}
				</td>
			</tr>
		</table>

		<table style="background-color:gray;" class="table-test">
			<template v-for="(value, key, index) in mockData">
				<tr v-for="(value2, key2, index) in value">
					{{ key }} -- {{ key2 }} -- {{value2}}
				</tr>
			</template>
		</table> -->

		<!-- <p>waaa</p><p>waaa</p><p>waaa</p><p>waaa</p>

		<table style="background-color:gray;" class="table-test">
			<template v-for="(value, key, index) in mockData">
				<template v-if="typeof value == 'object'">
					<tr>tr</tr>
				</template>
				<template v-else-if="typeof value == 'string'">
					<td>wa</td>
				</template>
				
				
			</template>
		</table> -->
		<!-- <li v-for="(value, key, index) in mockData">
			<p>li: {{ index }} -- {{ key }} -- {{ value }} </p>
		</li> -->
		<!-- <li v-for="(value, key, index) in mockData">
			li: {{ index }} -- {{ key }} -- {{ value }} 
		</li>
		<ul v-for="(value, key, index) in mockData">
			li: {{ index }} -- {{ key }} -- {{ value }} 
		</ul>
		<li v-for="(value, key, index) in mockData">
			li: {{ index }} -- {{ key }} -- {{ value }} 
		</li> -->
		<!-- <li v-for="(value, key, index) in mockData">
				<template v-if="typeof value == 'object'">
					<tr>tr</tr>
				</template>
				<template v-else-if="typeof value == 'string'">
					<td>wa</td>
				</template>
		</li> -->

		<!-- <template v-for="(value, key, index) in mockData">
			<li>
				li: {{ key }} -- {{ value }} 
			</li>
		</template> -->
		<span class="caret">key</span>
		<ul>NR 1</ul>
		<template v-for="(value, key, index) in mockData" v-if="false">
			<ul>
				<template v-if="typeof value == 'string'">
					<!-- <span class="caret">{{key}}</span> -->
					<li>{{key}} = {{value}} </li>
				</template>

				<template v-else-if="typeof value == 'object'">
					<!-- <li><span class="caret">{{key}}</span></li> -->
					<!-- <li><button @click="value['vis'] =! value['vis']">{{key}}</button></li> -->
					<li><button @click="mockData[key]['vis'] =! mockData[key]['vis']">{{key}} {{ mockData[key]['vis'] }}</button></li>

					<!-- <ul v-for="(value2, key2, index2) in value" v-if="value['vis']==true"> -->
					<ul v-for="(value2, key2, index2) in value" v-show="mockData[key]['vis']==true">
						<template v-if="typeof value2 == 'string'">
							<li>{{key2}} = {{value2}} </li>
						</template>

						<template v-else-if="typeof value == 'object'">
							<!-- <li><span class="caret">{{key2}}</span></li> -->
							<ul v-for="(value3, key3, index3) in value2">
								{{ value2 }}
								<!-- <template v-if="typeof value3 == 'string'">
									<ul>{{key3}} = {{value3}} </ul>
								</template>
								<template v-else>
									<ul>*{{value3}}*</ul>
								</template> -->
								
								
							</ul>
						</template>

						
					</ul>
				</template>
				
				<!-- li: {{ key }} -- {{ value }}  -->
			</ul>
		</template>




		<ul>NR 2</ul>
		<template v-for="(value, key, index) in mockData" v-if="false">
			<!-- <ul> -->
				<template v-if="typeof value == 'string'">
					<li>{{key}} = {{value}} </li>
				</template>

				<template v-else-if="typeof value == 'object'">
					<li><button @click="mockData[key]['vis'] =! mockData[key]['vis']">{{key}} {{ mockData[key]['vis'] }}</button></li>

					<!-- <ul v-for="(value2, key2, index2) in value" v-if="value['vis']==true"> -->
					<ul v-for="(value2, key2, index2) in value" v-show="mockData[key]['vis']==true">
						<template v-if="typeof value2 == 'string'">
							<li>{{key2}} = {{value2}} </li>
						</template>

						<template v-else-if="typeof value == 'object'">
							
						</template>

						
					</ul>
				</template>
				
				<!-- li: {{ key }} -- {{ value }}  -->
			<!-- </ul> -->
		</template>


		<ul>NR 3</ul>
		<template v-for="(value, key, index) in mockData" v-if="false">
			<ul>
				<template v-if="typeof value == 'string'">
					<li>{{key}} = {{value}} </li>
				</template>

				<template v-else-if="typeof value == 'object'">
					<li><button @click="mockData[key]['vis'] =! mockData[key]['vis']">{{key}} {{ mockData[key]['vis'] }}</button></li>
					<!-- RECALL ROOT -->
				</template>
			</ul>
		</template>

		<div style="background-color:gray;">
			<TestCss3Tree_recursive :obj="mockData"/>
		</div>

		<div style="overflow-y: scroll; height: 100%;">
			<TestCss3Tree_recursive :obj="store().getSettings()" />
		</div>
		
		
		

		
	
	</div>
</template>


<script setup>
// https://medium.com/@ronnow/dropdowns-in-vue-the-right-way-8ff9e8f36d4a
//import SocketioService from './../socketio.service.js';
//import { CanvasManager } from '@/CanvasManager8.js'
import { canvasStore, styleStore, configStore, store } from "@/stores/store.js";
import { h, onMounted, onBeforeMount, watch, onUpdated, nextTick, ref, reactive } from 'vue'

import FormData from 'form-data'	//npm install --save form-data
import * as utils from '@/utils.js'

import TestCss3Tree_recursive from "@/components/test/cTestCss3Tree_recursive.vue";


const emit = defineEmits(["emit-handler"])
const props = defineProps({
	obj: {
		type: Object,
		required: false,
	},
})

let mockData = reactive({
	tr1: {
		vis: false, 
		td1: 'abc', 
		td2: 'abc2'
	}, 
	tr2: {
		vis: true, 
		td11: '*abc_', 
		td22: '*abc2_', 
		td23: '*abc3_', 
		tr22: {
			val22: 'abc'
		}
	}, 
	val:'rootbal',
	tr3: {
		vis: false, 
		td111: 'abc__', 
		td222: 'abc2__'
	}
})


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
	console.log('e', e.clientX, e.clientY, ' ---> ',e.pageX, e.pageY, '--->', (e.clientX - rect.left), (e.clientY - rect.top),'--->' ,rect)
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


