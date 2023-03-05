
<template>
	<!-- <div>test</div> -->

	<div>
		<button @click="compile()" style="display:inline-blocks;">Compile</button>
		<button @click="testValues()" style="display:inline-blocks;">testValues()</button>
		
	</div>
	<div style="background-color:gray; width:100%;">
		
		<textarea id="html" placeholder="HTML" :ref="(el)=>refs.html=el"></textarea>
		<textarea id="css" placeholder="CSS" :ref="(el)=>refs.css=el"></textarea>
		<textarea id="js" placeholder="JavaScript" :ref="(el)=>refs.js=el"></textarea>
		<iframe id="code" :ref="(el)=>refs.code=el"></iframe>


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

const refs = reactive({
	html:null,
	css:null,
	js:null,
	code:null,
})



function testValues(){
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

function compile() {
	
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

.test-class{
	background-color: aqua;
	color:black;
}

body {
  text-align: center;
}

textarea {
  width: 32%;
  /* float: top; */
  min-height: 250px;
  overflow: scroll;
  margin: auto;
  display: inline-block;
  background: #f4f4f9;
  outline: none;
  font-family: Courier, sans-serif;
  font-size: 14px;
}

iframe {
  bottom: 0;
  position: relative;
  width: 100%;
  height: 35em;
}


</style>


