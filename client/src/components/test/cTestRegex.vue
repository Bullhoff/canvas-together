
<template>
	<!-- <div>test</div> -->

	<div>
		<button @click="button1">button1</button>
		<button @click="button2">button2</button>
		<button @click="button3">button3</button>

		
		

	</div>
	<!-- 
		background-color:blue;
		display: flex; flex-direction: row; gap:1ch; padding: 0ch 0.2ch 0ch 0.2ch;
		position: relative;
			display: flex;
			flex-direction: row;
			gap:1ch;
			padding: 0ch 0.2ch 0ch 0.2ch;
	 -->
	<div>
		<div style="display:inline-flex;gap:5ch; padding:2ch;">
			<div class="flex-group" style="">
				<textarea rows="1" cols="30" :value="importArrayObject" placeholder="[{input:'', regex:'', res:'', command:'match()'}, {input:'', regex:'', res:'', command:'match()'}]"></textarea>
				<button @click="importArrayObjectButton" style="">Import</button>
			</div>

			<div class="flex-group" style="">
				<button @click="addRegex">Add</button>
				<button @click="clearLocalStorage">Clear localStorage</button>
			</div>
		</div>
		
		

		<div v-for="(item, index) in regexList" class="flex-group" style="">

			<!-- <iframe :ref="(el)=>regex2[index].iframeRef=el" style="height:3ch; margin:0; padding:0;"></iframe> -->
			<!-- <input type="text" v-model="regex2[index].input" style="margin:0; padding:0; resize: both;" @change="regexChange(index)" placeholder="input"/>
			<input type="text" v-model="regex2[index].regex" style="margin:0; padding:0; resize: both;" @change="regexChange(index)" placeholder="regex"/> -->
			<!-- <button style="background-color:gray;" @click="removeRegex(index)" >-</button>
			<button style="background-color:gray;" @click="duplicateRegex(index)" >+</button> -->
			
			<!-- <div style="display:inline-flex;"> -->
				<button style="background-color:gray;" @click="removeRegex(index)" >-</button>
				<button style="background-color:gray;" @click="duplicateRegex(index)" >+</button>
			<!-- </div> -->
			<textarea rows="1" cols="30" @change="regexChange(index)" v-model="regexList[index].input" placeholder="input"></textarea>
			<textarea rows="1" cols="30" @change="regexChange(index)" v-model="regexList[index].regex" placeholder="regex"></textarea>
			
			<select name="pets" id="pet-select" v-model="regexList[index].command" style="background-color:gray;" @change="saveToLocalStorage()">
				<option value="match()" title="Returns an array containing all of the matches, including capturing groups, or null if no match is found.">match()</option>
				<option value="matchAll()" title="Returns an iterator containing all of the matches, including capturing groups.">matchAll()</option>
				<option value="replace()" title="Executes a search for a match in a string, and replaces the matched substring with a replacement substring.">replace()</option>
				<option value="replaceAll()" title="Executes a search for all matches in a string, and replaces the matched substrings with a replacement substring.">replaceAll()</option>
				<option value="search()" title="Tests for a match in a string. It returns the index of the match, or -1 if the search fails.">search()</option>
				<option value="split()" title="Uses a regular expression or a fixed string to break a string into an array of substrings.">split()</option>
				<option value="exec()" title="Executes a search for a match in a string. It returns an array of information or null on a mismatch.">exec()</option>
				<option value="test()" title="Tests for a match in a string. It returns true or false.">test()</option>
			</select>

			<p> {{ regexList[index].res }} </p>
			<p> _____&#9608;{{ (regexList[index].res) ? regexList[index].res.join('&#9608;') : ''  }}&#9608;</p>

			
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


const regexLocalStorageKey = 'regexTestList'
const importArrayObject = ref(null)
let regexList = reactive([
	{input:'', regex:'', res:'', command:'match()'},
	{regex:/(<([^>]+)>)/, res:'', input:'', command:'match()'}
])
const clearLocalStorage = () => localStorage.removeItem(regexLocalStorageKey);
const saveToLocalStorage = () => localStorage.setItem(regexLocalStorageKey, JSON.stringify(regexList));
const addRegex = () => regexList.push({input:'', regex:'', res:'', command:'match()'})
//const duplicateRegex = (index) => addRegex(regexList[index]);
//const duplicateRegex = (index) => regexList.push(regexList[index])
const duplicateRegex = (index) => regexList.push(JSON.parse(JSON.stringify(regexList[index])))
const removeRegex = (index) => regexList[index].splice(index, 1);


/* function clearLocalStorage(){
	localStorage.removeItem(regexLocalStorageKey);
}
function duplicate(index){
	addRegex(regexList[index])
} */
//watch(regexList,()=> {}) 

function regexChange(index){
	//var code = regexList[index].iframeRef.contentWindow.document
	let regex = regexList[index].regex
	let input = regexList[index].input
	//console.log('input/regex', input, regex)

	//let res = input.match(/(<([^>]+)>)/);
	let res = input.match(regex);
	//console.log('res:', res)
	regexList[index].res = res
	
	saveToLocalStorage()
	//localStorage.setItem(regexLocalStorageKey, JSON.stringify(regexList));
	//console.log('localStorage', localStorage.getItem(regexLocalStorageKey))
	console.log('aaa', regexList[0].command)
}

function importArrayObjectButton(){
	console.log('importArrayObjectButton', importArrayObject.value)
}



const symbol = {
	tab: '&#9;',
	enter:'',
}



onMounted(() => {
	let storage = localStorage.getItem(regexLocalStorageKey)
	console.log('storage 1',storage)
	if(storage)
		Object.assign(regexList, JSON.parse(storage))
	console.log('storage 2',regexList)
})
onUpdated(() => {})
function processTags(e){
	console.log('processTags', e)
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

// let line = str.match(/Valve (?<from>-?[AA-ZZ]+) has flow rate=(?<flowRate>-?[0-99]+); tunnels lead to valves ((?<leadsTo>-?\D+(\,\D)*)?([AA-ZZ]*))/).groups;
function testFormat2(){
	let strEx = 'Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE'
	let lineEx = strEx.match(/Valve (?<from>-?[AA-ZZ]+) has flow rate=(?<flowRate>-?[0-99]+); tunnels lead to valves ((?<leadsTo>-?\D+(\,\D)*)?([AA-ZZ]*))/).groups;
	console.log('strEx:', strEx)
	console.log('lineEx:', lineEx)


	let str = val.html
	//let line = str.match(/<(?<tag>-?[AA-ZZ]+)> (?<content>-?[AA-ZZ]+) <(?<tag>-?[AA-ZZ]+)> /).groups;
	console.log('str:', str)
	
	let line2 = str.match(/(<([^>]+)>)/);
	console.log('line2:', line2)

	let line3 = str.match(/<\/?[\w\s="/.':;#-\/\?]+>/);
	console.log('line3:', line3)

	let line4 = str.match(/<[a-z][\s\S]*>/);
	console.log('line4:', line4)
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


</script>


<style scoped>

.flex-group{
	position: relative;
	display: flex;
	flex-direction: row;
	gap:0.1ch;
	padding: 0ch 0.2ch 0ch 0.2ch;
}

iframe{
	background-color: rgb(77, 77, 77);
	color: rgb(5, 137, 252);
}
textarea{
	background-color: black;
	color: aliceblue;
}


</style>


