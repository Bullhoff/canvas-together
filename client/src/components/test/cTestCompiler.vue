
<template>
	<!-- <div>test</div> -->

	<div>
		<button @click="button1">button1</button>
		<button @click="button2">button2</button>
		<button @click="button3">button3</button>

	</div>
	<!-- <div>
		<div @keydown.tab.prevent="processTags($event.target.value)">
			<textarea id="html" placeholder="HTML" v-model="val.html" :ref="(el)=>refs.html=el"></textarea>
			<textarea id="css" placeholder="CSS" v-model="val.css" :ref="(el)=>refs.css=el"></textarea>
			<textarea id="js" placeholder="JavaScript" v-model="val.js" :ref="(el)=>refs.js=el"></textarea>
		</div>
		<div>
			<iframe id="code" :ref="(el)=>refs.code=el" style="width:1000px;"></iframe>
		</div>
		<code>&lt;center&gt; ye &lt;/center&gt;</code>
	</div> -->

	<!-- <div v-if="false"> -->
		<div>
			<div v-for="(item, index) in codeRefs" class="flex-group" style="display:inline-block;" :title="codeRefs[index].containerStyle.width">
				<iframe id="code" :ref="(el)=>codeRefs[index].ref=el" :style="codeRefs[index].containerStyle" :title="codeRefs[index].containerStyle.height"
					style="display:inline-block;"></iframe>
				<!-- {{ codeRefs[index].ref }} - {{ codeRefs[index].containerStyle }} -->
			</div>
			
		</div>

		<div>

		<div style="display:inline-flex;gap:5ch; padding:2ch;">
			<div class="flex-group" style="">
				<textarea rows="1" cols="30" :value="importArrayObject" 
					placeholder="[{input:'', regex:'', res:'', command:'match()'}, {input:'', regex:'', res:'', command:'match()'}]"></textarea>
				<button @click="importArrayObjectButton" style="">Import</button>
			</div>

			<div class="flex-group" style="">
				
				<button @click="addSvg">Add</button>
				<button @click="clearLocalStorage">Clear localStorage</button>
			</div>
		</div>
	<!-- </div> -->
		

		<div v-for="(item, index) in svgList" class="flex-group" style="">
			<button style="background-color:gray;" @click="remove(index);saveToLocalStorage();" >-</button>
			<button style="background-color:gray;" @click="duplicate(index);saveToLocalStorage();" >+</button>
			<button @click="render(index)">R</button>

			<!-- preserveAspectRatio="none" -->
			<!-- <svg viewBox="0 0 100 20" >
				<rect rx="10" ry="10" width="100" height="20" fill="black" stroke="green" stroke-width="0.2px" />
				<text x="50%" y ="50%" fill="red" stroke="green" stroke-width="0.2px" text-anchor="middle" dominant-baseline="central">Text!</text>
			</svg> -->
			<!-- <svg width="5ch" height="2ch" @click="display.html =! display.html" class="prevent-select svg-button">
				<rect rx="10" ry="10" width="100" height="20" fill="black" stroke="green" stroke-width="0.2px" />
				<text x="50%" y ="50%" fill="red" stroke="green" stroke-width="0.2px" text-anchor="middle" dominant-baseline="central">html</text>
			</svg> -->
			<!-- <div style="width:7ch; height:2ch;" >
				<svg viewBox="0 0 100 20" width='100%' height='100%' preserveAspectRatio="none" @click="display.html =! display.html" class="prevent-select svg-button">
					<rect rx="10" ry="10" width="100" height="20" fill="black" stroke="green" stroke-width="0.2px" />
					<text x="50%" y ="50%" fill="red" stroke="green" stroke-width="0.2px" text-anchor="middle" dominant-baseline="central">html</text>
				</svg>
			</div> -->
			<div style="width:4ch; height:2ch;" @click="display.html =! display.html">
				<svg viewBox="0 0 100 50" width='100%' height='100%' class="prevent-select svg-button">
					<rect rx="10" ry="10" width="100" height="50" fill="black" stroke="green" stroke-width="0.2px" />
					<text x="50%" y ="50%" fill="red" stroke="green" stroke-width="0.2px" text-anchor="middle" dominant-baseline="central"	font-size="5ch" >html</text>
				</svg>
			</div>
			
			
			<!-- <button @click="display.html =! display.html">html</button> -->
			<textarea v-if="display.html" :rows="svgList[index].style.rows" :cols="svgList[index].style.cols" :style="svgList[index].style" @change="" v-model="svgList[index].html" placeholder="html" @keydown.tab.prevent=""></textarea>
			<!-- <button v-else>html</button> -->
			<!-- <button @click="display.css =! display.css">css</button> -->

			<div style="width:4ch; height:2ch;" @click="display.css =! display.css">
				<svg viewBox="0 0 100 50" width='100%' height='100%' class="prevent-select svg-button">
					<rect rx="10" ry="10" width="100" height="50" fill="black" stroke="green" stroke-width="0.2px" />
					<text x="50%" y ="50%" fill="red" stroke="green" stroke-width="0.2px" text-anchor="middle" dominant-baseline="central" font-size="5ch" >css</text>
				</svg>
			</div>
			<textarea v-if="display.css" :rows="svgList[index].style.rows" :cols="svgList[index].style.cols" :style="svgList[index].style" @change="" v-model="svgList[index].css" placeholder="css" @keydown.tab.prevent=""></textarea>
			<!-- <button v-else>css</button> -->
			<!-- <button @click="display.js =! display.js">js</button> -->

			<div style="width:4ch; height:2ch;" @click="display.js =! display.js">
				<svg viewBox="0 0 100 50" width='100%' height='100%' class="prevent-select svg-button">
					<rect rx="10" ry="10" width="100" height="50" fill="black" stroke="green" stroke-width="0.2px" />
					<text x="50%" y ="50%" fill="red" stroke="green" stroke-width="0.2px" text-anchor="middle" dominant-baseline="central"	font-size="5ch" >js</text>
				</svg>
			</div>
			<textarea v-if="display.js" :rows="svgList[index].style.rows" :cols="svgList[index].style.cols" :style="svgList[index].style" @change="" v-model="svgList[index].js" placeholder="js" @keydown.tab.prevent=""></textarea>
			
			<!-- {{ JSON.stringify({abs:`adf👺`}) }} -->
			<!-- <textarea rows="1" cols="30" :style="svgList[index].style" @change="regexChange(index)" v-model="svgList[index].html" placeholder="html"></textarea> -->
			
			<!-- <select name="pets" id="pet-select" v-model="svgList[index].command" style="background-color:gray;" @change="saveToLocalStorage()">
				<option value="match()" title="Returns an array containing all of the matches, including capturing groups, or null if no match is found.">match()</option>
				<option value="matchAll()" title="Returns an iterator containing all of the matches, including capturing groups.">matchAll()</option>
				<option value="replace()" title="Executes a search for a match in a string, and replaces the matched substring with a replacement substring.">replace()</option>
				<option value="replaceAll()" title="Executes a search for all matches in a string, and replaces the matched substrings with a replacement substring.">replaceAll()</option>
				<option value="search()" title="Tests for a match in a string. It returns the index of the match, or -1 if the search fails.">search()</option>
				<option value="split()" title="Uses a regular expression or a fixed string to break a string into an array of substrings.">split()</option>
				<option value="exec()" title="Executes a search for a match in a string. It returns an array of information or null on a mismatch.">
					<svg viewBox="0 0 100 20" >

						<rect rx="10" ry="10" width="100" height="20" 
						fill="black" stroke="green" stroke-width="0.2px" />

						<text x="50%" y ="50%" 
						fill="red" stroke="green" stroke-width="0.2px"
						text-anchor="middle" 
						dominant-baseline="central"
						>Text!</text>

					</svg>
				</option>
				<option value="test()" title="Tests for a match in a string. It returns true or false."><p style="color:red;">test()</p></option>
				<option value="test()" title="Tests for a match in a string. It returns true or false.">test()</option>
			</select> -->
			<!-- <select name="pets" id="pet-select" v-model="svgList[index].command" style="background-color:gray;" @change="saveToLocalStorage()">
				<option value="match()" title="Returns an array containing all of the matches, including capturing groups, or null if no match is found.">match()</option>
				<option value="matchAll()" title="Returns an iterator containing all of the matches, including capturing groups.">matchAll()</option>
				<option value="replace()" title="Executes a search for a match in a string, and replaces the matched substring with a replacement substring.">replace()</option>
				<option value="replaceAll()" title="Executes a search for all matches in a string, and replaces the matched substrings with a replacement substring.">replaceAll()</option>
				<option value="search()" title="Tests for a match in a string. It returns the index of the match, or -1 if the search fails.">search()</option>
				<option value="split()" title="Uses a regular expression or a fixed string to break a string into an array of substrings.">split()</option>
				<option value="exec()" title="Executes a search for a match in a string. It returns an array of information or null on a mismatch.">exec()</option>
				<option value="test()" title="Tests for a match in a string. It returns true or false.">test()</option>
			</select> -->

			<!-- {{ svgList[index].html }} -->
			<!-- <p> {{ regexList[index].res }} </p>
			<p> _____&#9608;{{ (regexList[index].res) ? regexList[index].res.join('&#9608;') : ''  }}&#9608;</p> -->

			
			<!-- <p> {{ (regexList[index].res.length>0) ? regexList[index].res.join('-') : ''  }} </p> -->
			<!-- <p> {{  regexList[index].res.join(' ---- ') }} </p> -->
			<!-- {{ index }} - {{ item }}  -->

		</div>
	</div>
	<!-- 
		display:inline-block;
	 -->
</template>


<script setup>
// https://medium.com/@ronnow/dropdowns-in-vue-the-right-way-8ff9e8f36d4a
//import SocketioService from './../socketio.service.js';
//import { CanvasManager } from '@/CanvasManager8.js'
import { canvasStore, styleStore, configStore } from "@/stores/store.js";
import { h, onMounted, onBeforeMount, watch, onUpdated, nextTick, ref, reactive } from 'vue'
import FormData from 'form-data'	//npm install --save form-data
import * as utils from '@/utils.js'
const codeRefs = reactive([
	{ref: null, containerStyle:{width:'200px', height:'200px', resize:'both',}},
	{ref: null, containerStyle:{width:'200px', height:'200px',}},
	{ref: null, containerStyle:{width:'50px', height:'50px',}}, 
	{ref: null, containerStyle:{width:'500px', height:'100px',}}, 
	{ref: null, containerStyle:{width:'10ch', height:'10ch',}}
])

const refs = reactive({
	code: null,
})
const display = reactive({
	html: true,
	css: false,
	js: false,
})

let defaultStyle = {rows:1,cols:20}
const svgLocalStorageKey = 'svgTestList'
const importArrayObject = ref(null)
let svgList = reactive([
	{html:'', css:'', js:'', iframeRef:null, style:{rows:defaultStyle.rows, cols:defaultStyle.cols}},
])
const clearLocalStorage = () => localStorage.removeItem(svgLocalStorageKey);
const saveToLocalStorage = () => localStorage.setItem(svgLocalStorageKey, JSON.stringify(svgList));
const addSvg = (html='') => svgList.push({html:html, iframeRef:null, style:{rows:defaultStyle.rows, cols:defaultStyle.cols}})
const duplicate = (index) => svgList.push(JSON.parse(JSON.stringify(svgList[index])))
const remove = (index) => svgList.splice(index, 1);
addSvg(
`<svg viewBox="0 0 220 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" />
  <rect x="120" width="100" height="100" rx="15" />
</svg>`)


/* watch(regex2,()=> {
	console.log('watch', regex2)
	//compile(val)
	//fontStyle.fontSize = `${value.value}${key.value}`
	
}) */

function render(index){
	let svg = svgList[index]
	var codeGetted = getHtml({html:svg.html, css:svg.css, js:svg.js})

	for (const [key, value] of Object.entries(codeRefs)) {
		console.log(`${key}: ${value}`);
		var code = value.ref.contentWindow.document
		code.open();
		code.writeln(codeGetted)
		code.close();
	}
	
	saveToLocalStorage()
}

function _render(index){
	//svgList[0].style.rows="5"
	//svgList[1].style.rows=5
	let svg = svgList[index]
	var codeGetted = getHtml({html:svg.html, css:'', js:''})
	var code = refs.code.contentWindow.document
	code.open();
	code.writeln(codeGetted)
	/* code.writeln(`
		${html.value}
		<style>
			${css.value}
		</style>
		<script${'>'}
			${js.value}
		</script${'>'}
	`) */
	code.close();
	//saveToLocalStorage()
}


const symbol = {
	tab: '&#9;',
	enter:'',
}

const getHtml = ({html=``, css=``, js=``}) => 
`${html}
<style>
	${css}
</style>
<script${'>'}
	${js}
</script${'>'}`






onMounted(() => {
	let storage = localStorage.getItem(svgLocalStorageKey)
	console.log('storage 1',storage)
	if(storage)
		Object.assign(svgList, JSON.parse(storage))
	console.log('storage 2',svgList)
	
	//compile(someCode[0])
})
onUpdated(() => {
	//compile(someCode[0])
})


function button1() {
	compile(val)
}
function button2() {
	val.html = svg.rect
}
function button3() {
	testFormat2()
}

function importArrayObjectButton(){
	console.log('importArrayObjectButton', importArrayObject.value)
}

</script>


<style scoped>
.flex-group{
	position: relative;
	display: flex;
	flex-direction: row;
	gap:0.1ch;
	padding: 0ch 0.2ch 0ch 0.2ch;
}
/* iframe{
	background-color: rgb(77, 77, 77);
	color: rgb(5, 137, 252);
} */
textarea{
	background-color: black;
	color: aliceblue;
}

.svg-button text:hover,rect:hover{
	fill:green;
}


</style>


