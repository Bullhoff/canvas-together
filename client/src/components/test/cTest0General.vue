
<template>
	<!-- <div>test</div> -->

	<div>
		<button @click="button1">button1</button>
		<button @click="button2">button2</button>

	</div>
	<div>
		<div>
			<textarea id="html" placeholder="HTML" :ref="(el)=>refs.html=el"></textarea>
			<textarea id="css" placeholder="CSS" :ref="(el)=>refs.css=el"></textarea>
			<textarea id="js" placeholder="JavaScript" :ref="(el)=>refs.js=el"></textarea>
		</div>
		<div>
			<iframe id="code" :ref="(el)=>refs.code=el"></iframe>
		</div>
		
	</div>
	<div>
		{{ String.fromCharCode(32, 55357, 56442) }} 👺 &#x1f47a;	<br />
		☃★♲你 <br />
		{{ String.fromCharCode(9731, 9733, 9842, 0x2F804) }} <br />
		{{ String.fromCodePoint(9731, 9733, 9842, 0x2F804) }} <br />
		{{ String.fromCodePoint(`0x${'9731'}`, `0x9733`, `0x9842`, `0x2F804`) }}	<br />
		&#x9731;&#x9733;&#x9842;&#x2F804;	<br />
		{{ String.fromCodePoint(`0x${'9731'}`, `0x55357`, `0x56442`, `0x2F804`) }}	<br />
		&#x270a;
	</div>
	<!-- 
		console.log(String.fromCharCode(9731, 9733, 9842, 0x2F804));
		console.log(String.fromCodePoint(9731, 9733, 9842, 0x2F804));
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


const getHtml = ({html=``, css=``, js=``}) => 
`${html}
<style>
	${css}
</style>
<script${'>'}
	${js}
</script${'>'}`


const refs = reactive({
	html: null,
	css: null,
	js: null,
	code: null,
})

let someCode = {
	html: 
`<div>somecode</div>
`
}

onMounted(() => {
	compile(someCode)
})

function compile({html=``, css=``, js=``}) {
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







let key = 'test_key'
let obj = {
	key1: 6,
	key2: 'abc',
	key3: 'keynr3',
}

function codeTest(){
	let a = `a	b	c	d	e	f	g	h	i	j	k	l	m	n	o	p	q	r	s	t	u	v	w	x	y	z	å	ä	ö`
	let small = 'a	b	c	d	e	f	g	h	i	j	k	l	m	n	o	p	q	r	s	t	u	v	w	x	y	z	å	ä	ö 👺'
	let capital = 'A	B	C	D	E	F	G	H	I	J	K	L	M	N	O	P	Q	R	S	T	U	V	W	X	Y	Z	Å	Ä	Ö'

	for (let i = 0; i < small.length; i++) {
		let el = small[i]
		if(el.charCodeAt(0) == 9) continue
		console.log(el, el.charCodeAt(0), String.fromCharCode(el.charCodeAt(0)), String.fromCodePoint(el.charCodeAt(0)))
		
	}
	/* small.forEach(el => {
		console.log('el', el)
	}); */
	console.log(String.fromCharCode(9731, 9733, 9842, 0x2F804));
	console.log(String.fromCodePoint(9731, 9733, 9842, 0x2F804));
	console.log(String.fromCodePoint(32, 55357, 56442), String.fromCodePoint(32), String.fromCodePoint(55357), String.fromCodePoint(56442));
}

function button1() {
	codeTest()
	/* console.log('button1:')
	localStorage.setItem(key, JSON.stringify(obj)); */
}
function button2() {
	console.log('button2:', localStorage)
	let val = localStorage.getItem(key)
	console.log('val 1', val)
	val = JSON.parse(val)
	console.log('val 2', val)
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

textarea{
	background-color: black;
	color: aliceblue;
}


</style>


