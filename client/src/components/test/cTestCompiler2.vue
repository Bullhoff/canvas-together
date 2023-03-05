
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
				<textarea rows="1" cols="30" :value="importArrayObject" placeholder="[{input:'', regex:'', res:'', command:'match()'}, {input:'', regex:'', res:'', command:'match()'}]"></textarea>
				<button @click="importArrayObjectButton" style="">Import</button>
			</div>

			<div class="flex-group" style="">
				
				<button @click="addSvg">Add</button>
				<button @click="clearLocalStorage">Clear localStorage</button>
			</div>
		</div>
	<!-- </div> -->
		

		<div v-for="(item, index) in svgList" class="flex-group" style="">
			<button style="background-color:gray;" @click="remove(index)" >-</button>
			<button style="background-color:gray;" @click="duplicate(index)" >+</button>
			<button @click="render(index)">R</button>

			<textarea :rows="svgList[index].style.rows" :cols="svgList[index].style.cols" :style="svgList[index].style" @change="" v-model="svgList[index].html" placeholder="html"></textarea>
			<!-- <textarea rows="1" cols="30" :style="svgList[index].style" @change="regexChange(index)" v-model="svgList[index].html" placeholder="html"></textarea> -->
			
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

let defaultStyle = {rows:1,cols:20}
const svgLocalStorageKey = 'svgTestList'
const importArrayObject = ref(null)
let svgList = reactive([
	{html:'', iframeRef:null, style:{rows:defaultStyle.rows, cols:defaultStyle.cols}},
])
const clearLocalStorage = () => localStorage.removeItem(svgLocalStorageKey);
const saveToLocalStorage = () => localStorage.setItem(svgLocalStorageKey, JSON.stringify(svgList));
const addSvg = (html='') => svgList.push({html:html, iframeRef:null, style:{rows:defaultStyle.rows, cols:defaultStyle.cols}})
const duplicate = (index) => svgList.push(JSON.parse(JSON.stringify(svgList[index])))
const remove = (index) => svgList[index].splice(index, 1);
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
	var codeGetted = getHtml({html:svg.html, css:'', js:''})

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

{/* <code>&lt;center&gt;</code> */}
const val = reactive({
	html: `<div>val html</div><div>div2</div><div>div3</div><div><p>ye</p></div>`,
	css: `body{}`,
	js: ``,
	code: ``,
})
watch(val,({html,css,js,code})=> {
	//console.log('watch', val)
	//compile(val)
	//fontStyle.fontSize = `${value.value}${key.value}`
})


const svg = {
	rect:
`<svg viewBox="0 0 220 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" />
  <rect x="120" width="100" height="100" rx="15" />
</svg>`
}

const refs = reactive({
	html: null,
	css: null,
	js: null,
	code: null,
})

let someCode = [
{
html: val.html,
css: val.css,
js: val.js
},{
html: 
`<div>somecode</div>`
}]

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
function processTags(e){
	console.log('processTags', e)
}

function compile({html=``, css=``, js=``}) {
	console.log('Compile')
	var codeGetted = getHtml({html, css, js})
	//console.log('compile 1', codeGetted)
	/* var html = document.getElementById("html");
	var css = document.getElementById("css");
	var js = document.getElementById("js"); */
	//var code = document.getElementById("code").contentWindow.document;
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
}


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

// let line = str.match(/Valve (?<from>-?[AA-ZZ]+) has flow rate=(?<flowRate>-?[0-99]+); tunnels lead to valves ((?<leadsTo>-?\D+(\,\D)*)?([AA-ZZ]*))/).groups;
function testFormat2(){
	let strEx = 'Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE'
	let lineEx = strEx.match(/Valve (?<from>-?[AA-ZZ]+) has flow rate=(?<flowRate>-?[0-99]+); tunnels lead to valves ((?<leadsTo>-?\D+(\,\D)*)?([AA-ZZ]*))/).groups;
	console.log('strEx:', strEx)
	console.log('lineEx:', lineEx)


	let str = val.html
	//let line = str.match(/<(?<tag>-?[AA-ZZ]+)> (?<content>-?[AA-ZZ]+) <(?<tag>-?[AA-ZZ]+)> /).groups;
	console.log('str:', str)
	//let line = str.match(/<(?<tag>-?[AA-ZZ]+)>/);
	//let line = str.match(/<(.)>/);	
	//let line = str.match(/<(*)>/);
	/* let line = str.match(/<(*)>/);
	console.log('line:', line) */
	//console.log('linegroups:', line.groups)

	//var regex = /(<([^>]+)>)/ig
	let line2 = str.match(/(<([^>]+)>)/);
	console.log('line2:', line2)

	//var htmlTagRe = /<\/?[\w\s="/.':;#-\/\?]+>/gi;
	let line3 = str.match(/<\/?[\w\s="/.':;#-\/\?]+>/);
	console.log('line3:', line3)

	//let htmlTagRe2 = /<[a-z][\s\S]*>/i;
	let line4 = str.match(/<[a-z][\s\S]*>/);
	console.log('line4:', line4)
	/* var email = c("RashNErel@gmail.com",
          "rash.nerel@regen04.net",
          "rash_48@uni.edu",
          "rash_48_nerel@STB.org")
		console.log('email',email) */
}

function testFormat(){
	let str = val.html
	console.log('f1', str)
	let strSplit = str.split(/<|>/) 
	console.log('f2', strSplit)

	for (let i = 0; i < strSplit.length; i++) {
		const el = strSplit[i];
		console.log('for', i, el)
	}
}



let key = 'test_key'
let obj = {
	key1: 6,
	key2: 'abc',
	key3: 'keynr3',
}


function saveStorage(key, data) {
	console.log('saveStorage:', key, data)
	localStorage.setItem(key, JSON.stringify(data));
};
function getStorage(key, item) {
	console.log('getStorage', key, item)
	if (localStorage.getItem(key) && item) {
		const data = JSON.parse(localStorage.getItem(key))
		return data[item]
	}
	else if (localStorage.getItem(key)) {
		return localStorage.getItem(key)
	}
};

function testValues() {
	refs.html.value =
		`<div class="test-class">
	test
	<button @click="testButton">test</button>
	<button onclick="testButton2()">test2</button>
</div>`

	refs.css.value =
		`body{
	background-color: black;
}
.test-class{
	background-color: aqua;
	color:black;
}`

	refs.js.value =
		`function testButton(e){
	console.log('testButton', e)
}
function testButton2(e){
	console.log('testButton2', e)
}`
	console.log('testValues', refs)
}

function _compile() {

	var html = document.getElementById("html");
	var css = document.getElementById("css");
	var js = document.getElementById("js");
	var code = document.getElementById("code").contentWindow.document;
	//console.log('Compile', html, css, js, code)
	code.open();
	//code.html.value = ''
	/* code = `
		<style>
			${css.value}
		</style>
		<script${'>'}
			${js.value}
		</script${'>'}
	` */
	/* code = `
		${html.value}
		<style>
			${css.value}
		</style>
		<script${'>'}
			${js.value}
		</script${'>'}
	` */
	code.writeln(`
		${html.value}
		<style>
			${css.value}
		</style>
		<script${'>'}
			${js.value}
		</script${'>'}
	`)
	code.close();
	console.log('Compile 2', html, css, js, code)
}

//compile();



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

/* function eventHandler(e, text) {
	console.log('', text, e)
}


function testButton() {
	console.log('testButton. input')
	console.log('testButton. radio')
} */






//	},
	//created() {		window.addEventListener("resize", this.resizeHandler);	},
	//beforeUnmount() {		window.removeEventListener("resize", this.resizeHandler);	},
//}
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


</style>


