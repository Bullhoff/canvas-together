
<template>
	<div class="container">
		<div style="display:flex; flex-direction: row; ">
			<button @click="onClick('Canvasses',$event)" :class="[(state.page=='Canvasses')? 'active':'']">Canvasses</button>
			<button @click="onClick('Layers',$event)" :class="[(state.page=='Layers')? 'active':'']">Layers</button>
		</div>
		<div  :style="style.gridContainer">
			<template  v-for="(canvas, index, index2) in yeee[state.page].list" >

				<div :style="style.gridItem" v-if="index==0 || index2==0" v-for="(value, key, i) in canvas" style="background-color: green;font-weight: bold;">
					<template v-if="key != 'id'">
							{{ key }}
					</template>
					<template v-else></template>
				</div>
				<div :style="style.gridItem" v-for="(value, key, i) in canvas" :title="value" :class="[canvas.id == canvasStore().current.canvas_id || canvas.id == canvasStore().current.layer_id ? 'highlight' : '']">
					<template v-if="key != 'id'" >
							{{ value }}
					</template>
					<template v-else >
							<button :disabled="true" v-if="false"
							style="background-color: rgba(26, 14, 76, 1.0); width: fit-content; font-size: 2ch;" 
							:title="'Save'">{{ String.fromCodePoint('0x1F5AB') }}</button>
					</template>
				</div>
			</template>
		</div>
	</div>
</template>


<script setup>
//import SocketioService from './../socketio.service.js';
//import { CanvasManager } from '@/CanvasManager8.js'
import { canvasStore, styleStore, configStore } from "@/stores/store.js";
import { h, onMounted, onBeforeMount, watch, onUpdated, nextTick, ref, reactive } from 'vue'
import _ from 'lodash';
import FormData from 'form-data'	//npm install --save form-data
import * as utils from '@/utils.js'

const defaultStyle = reactive({
	gridContainer: {
		'display': 'grid',
		'white-space': 'nowrap',
		'overflow': 'hidden',
		'width': '100%',
		'height': '100%',
		//'grid-gap': '1px',
		'grid-template-columns': 'repeat(8, auto)',
		//'grid-template-columns': 'repeat(8, fit-content(15%))',
		'text-align': 'left',
	},
	gridItem: {
		position: 'relative',
		'border': '2px  solid rgba(26, 14, 76, 0.8)',
		'white-space': 'nowrap',
		'overflow': 'hidden',
		'overflow-x': 'auto',
		display:'block',
		'align-content': 'center',
		'justify-content': 'center',
		'padding': '0px 5px 0px 5px', 
		'width': '100%',
		'margin': '0 auto',
		//'max-width': '10%',
		//'max-width': '10ch',
	},
});
const style = reactive({...defaultStyle,})

const state = reactive({
	page: 'Canvasses', 
	
})
const yeee = reactive({
	Canvasses: {
		list :canvasStore().parentList, 
		style: {
			gridContainer: {
				//'grid-template-columns': 'repeat(8, fit-content(15%))',
			},
			gridItem: {},
		}, 
	},
    Layers: {
		list : canvasStore().canvasList,
		style: {
			gridContainer: {
				//'grid-template-columns': 'repeat(8, fit-content(15%))',
			},
			gridItem: {},
		}, 
	},
});

async function onClick(opt, event) {
	if(opt == state.page) {return}
	else if(opt == 'Canvasses') {state.page = 'Canvasses'}
	else if(opt == 'Layers') {state.page = 'Layers'}
	else console.log('aaaonClick', opt, state.page)
	console.log('onClick', opt, state.page)
	await _.merge(style, yeee[state.page].style)
}

const displayToggle = ref(false)
const file = ref(null)
const parentName = ref(null)


onBeforeMount(() => {})
onMounted(() => {})

</script>


<style scoped>

.container{
	position: relative;
	/* display:block;
	white-space: nowrap;
	overflow:hidden; */
	width:1600px;
}

button{
	background-color: gray;
	color: rgb(255, 255, 255);
	align-self: center;
}
.active{
	background-color: green;
	font-weight: bold;
}
.highlight{
	background-color: rgb(208, 255, 0);
    font-weight: bold;
}
div::-webkit-scrollbar{
  display: none;
}

</style>


