
<template>


	<div>
		<p draggable="true">This text <strong>may</strong> be dragged.</p>
		<p draggable="false">This text <strong>may Nut</strong> be dragged.</p>
	</div>


	<div style="background-color:gray; width:20ch;">
		<div class="grid-container" style="display:grid; grid-template-columns: repeat(3, 1fr);">
			<div>1</div>
			<div>2</div>
			<div>3</div>
			<div>4 &#9650;</div>
			<div>5 &#9660;</div>
			<div style="font-size:1ch;">
				<div style="height:50%;">6</div>
				<div style="height:50%;">7</div>
			</div>
			<div>8</div>
			<div>9</div>
			<div style="font-size:1ch; text-align:center;">
				<div>&#9650;</div>
				<div>&#9660;</div>
			</div>
		</div>
	</div>
	&#9650;
	&#9660;

	<br>
	<div style="background-color:gray; width:20ch;">
		<input type="number" style="font-size:2ch;">
	</div>

	<br />
	<div style="background-color:gray; width:20ch;">
		<div style="background-color:blue; "> a </div>
		<div style="background-color:brown; margin:1ch;"> margin:1ch; </div>
	</div>
	<br />
	<div style="background-color:gray; width:20ch;">
		<div style="background-color:blue; "> a </div>
		<div style="background-color:brown; padding:1ch;"> padding:1ch; </div>
	</div>
	<br />
	<div style="background-color:gray; width:20ch;">
		<div style="background-color:blue; "> a </div>
		<div style="background-color:brown; margin:1ch; padding:1ch;"> margin:1ch; padding:1ch; </div>
	</div>

	<div>
		<p @contextmenu.prevent="eventHandler($event, 'contextmenu')">-contextmenu-</p>
		<p @auxclick.stop="eventHandle($event, 'auxclick')">-auxclick-</p>
		<button></button>
	</div>

	<!-- <div>
		<img src="./../../assets/pictures/icons8-chinese-64.png" alt="">
		<div style="display:inline-block; width:32px">
			<img src="./../../assets/pictures/icons8-chinese-64.png" alt="">
		</div>
		<div style="display:inline-block; width:32px">
			<img src="./../../assets/pictures/icons8-chinese-64.png" alt="" style="max-width:100%;max-height: 100%;">
		</div>
		<img src="./../../assets/pictures/icons8-chinese-64.png" alt="" width="64" height="64">



		<div style="display:inline-block;">
			<p style="display:inline-block;background-color:blueviolet;">M</p>
			<p style="display:inline-block;background-color: aqua;"><img
					src="./../../assets/pictures/icons8-chinese-64.png" alt="" style="width:16px;height:16px;"> </p>
			<p style="display:inline-block;background-color: aqua;"><img
					src="./../../assets/pictures/icons8-chinese-64.png" alt="" style="width:2ch;height:2ch;"> </p>
			<p style="display:inline-block;background-color: aqua;"><img
					src="./../../assets/pictures/icons8-chinese-64.png" alt="" width="16" height="16"> </p>
			<p style="display:inline-block;background-color: aqua;"><img
					src="./../../assets/pictures/icons8-chinese-64.png" alt="" width="16" height="16"> </p>
			<p style="display:inline-block;background-color: aqua;margin:0ch;padding:0ch;"><img
					src="./../../assets/pictures/icons8-chinese-64.png" alt="" width="16" height="16"
					style="margin:0ch;padding:0ch;"> </p>
			<p style="display:inline-block;">A</p>
			<img src="./../../assets/pictures/icons8-chinese-64.png" alt="" width="16" height="16">
			a
		</div>
	</div> -->

	<br />
	<div style="width:20%;">
		<div style="background-color:blue;">
			<div class="grid">
				<p>px</p>
				<p>ch</p>
				<p>em</p>
				<p>rem</p>
				<p></p>


				<input type="radio" name="keyword" value="px" v-model="fontObj.keyword" @change="onChange">
				<input type="radio" name="keyword" value="ch" v-model="fontObj.keyword" @change="onChange">
				<input type="radio" name="keyword" value="em" v-model="fontObj.keyword" @change="onChange">
				<input type="radio" name="keyword" value="rem" v-model="fontObj.keyword" @change="onChange">
				<p></p>

			</div>
			<input type="number" v-model="fontObj.value" style="width:5ch;" @change="onChange" />
			{{ fontStyle }}
		</div>
		<div class="grid" :style="[fontStyle]" title="hejaaa">

			<!-- px, em, ch, rem -->
			<p style="font-size:1px">1px</p>
			<p style="font-size:2px">2px</p>
			<p style="font-size:3px">3px</p>
			<p style="font-size:4px">4px</p>
			<p style="font-size:5px">5px</p>

			<p style="font-size:1ch">1ch</p>
			<p style="font-size:2ch">2ch</p>
			<p style="font-size:3ch">3ch</p>
			<p style="font-size:4ch">4ch</p>
			<p style="font-size:5ch">5ch</p>

			<p style="font-size:1em">1em</p>
			<p style="font-size:2em">2em</p>
			<p style="font-size:3em">3em</p>
			<p style="font-size:4em">4em</p>
			<p style="font-size:5em">5em</p>

			<p style="font-size:1rem">1rem</p>
			<p style="font-size:2rem">2rem</p>
			<p style="font-size:3rem">3rem</p>
			<p style="font-size:4rem">4rem</p>
			<p style="font-size:5rem" :title="testVars.text">5rem</p>
		</div>
	</div>

	<div title="hejyy">
		<svg width="100" height="100" title="hej">
			<circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
			Sorry, your browser does not support inline SVG.
		</svg>
	</div>

	<div>
		<svg width="3ch" height="100%">
			<polygon points="0,100 50,0 100,100" style="fill:lime;stroke:purple;stroke-width:1" />
			<polygon points="0,100 50,0 100,100" style="fill:lime;stroke:purple;stroke-width:1" />
			<!-- <polygon points="0,0 250,250 0,500" style="fill:lime;stroke:purple;stroke-width:1" /> -->
			<!-- 0,0 250,250 0,500 -->
			<!-- 0,100 50,0 100,100 -->
			<!-- <circle cx="1ch" cy="1ch" r="1ch" stroke="green" stroke-width="4" fill="yellow" /> -->
		</svg>
	</div>

	<div style="background-color:gray; width:3ch;height:3ch;">
		<svg width="100%" height="100%">
			<polygon points="0,2 1,0 2,2" style="fill:lime;stroke:purple;stroke-width:1" />
		</svg>
	</div>
	<div style="background-color:gray; width:3ch;height:3ch;">
		<svg width="3ch" height="100%">
			<polygon points="0,2 1,0 2,2" style="fill:lime;stroke:purple;stroke-width:1;object-fit: contain;" />
		</svg>
	</div>

	<svg height="210" width="500">
		<polygon points="0,100 50,0 100,100" style="fill:lime;stroke:purple;stroke-width:1" />
		Sorry, your browser does not support inline SVG.
	</svg>

	-1
	<div style="width:3ch;">
		<svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
			<!--
			with relative unit such as percentage, the visual size
			of the square looks unchanged regardless of the viewBox
			-->
			<rect x="0" y="0" width="100%" height="100%" />

			<!--
			with a small viewBox the circle looks large
			as it is using user units for the r attribute:
			4 resolved against 10 as set in the viewBox
			-->
			<circle cx="50%" cy="50%" r="4" fill="white" />
		</svg>
	</div>

	-2
	<!-- object-fit: contain; -->
	<!-- margin: 0; padding: 0;  -->
	<div style="background-color:gray;height:30ch; width:30ch; ">
		<svg width='100%' height='100%' viewBox="0 0 100 100" preserveAspectRatio="none">
			<rect x='40%' y='40%' width='25%' height='25%' />
			<polygon points="0,100 50,0 100,100" style="fill:lime;stroke:purple;stroke-width:1" />
			Sorry, your browser does not support inline SVG.
		</svg>
	</div>
	<div style="background-color:gray;height:30ch; width:30ch; ">
		<svg width='100%' height='100%' viewBox="0 0 2 2" preserveAspectRatio="none">
			<polygon points="0,2 1,0 2,2" style="fill:lime;stroke:purple;stroke-width:0.1;" />
		</svg>
	</div>

	<object data="horse.wav">
  <param name="autoplay" value="true">
</object>
	<!-- 
		style="float:top;vertical-align: top;position:fixed;"

	 -->
</template>


<script setup>
// https://medium.com/@ronnow/dropdowns-in-vue-the-right-way-8ff9e8f36d4a
//import SocketioService from './../socketio.service.js';
//import { CanvasManager } from '@/CanvasManager8.js'
import { canvasStore, styleStore, configStore } from "@/stores/store.js";
import { h, onMounted, onBeforeMount, watch, onUpdated, nextTick, ref, reactive } from 'vue'
//import socketioService from './../socketio.service.js';

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


watch(fontObj, () => {
	fontStyle.fontSize = `${fontObj.value}${fontObj.keyword}`
	console.log('fontObj', fontObj, fontStyle.fontSize)
})



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
	console.log('***Menu.TheModifyForm Start***');
	console.log('***Menu.TheModifyForm Done***');
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


