
<template>
	<!-- 
		style="width:100%; height:100%;"
		background-color: gray;
	 -->

	 <!-- overflow-y: scroll;  -->
	<div style="height: 100%;">
		<button @click="store().configFunctions.saveAllChanged()">Save Changes</button>
		<button @click="store().configFunctions.clearStorage({all:false})">Clear Settings</button>
		<button @click="store().configFunctions.clearStorage({all:true})">Clear Settings (including user)</button>


		<button @click="store().configFunctions.load()" v-if="!props.prop?.hideMess">Load</button>
		<button @click="store().configFunctions.save()" v-if="!props.prop?.hideMess">Save</button>
		<button @click="store().configFunctions.load()" v-if="!props.prop?.hideMess">selectDefault</button>
		<button @click="store().configFunctions.selectNone()" v-if="!props.prop?.hideMess">selectNone</button>
		<button @click="store().configFunctions.selectAll()" v-if="!props.prop?.hideMess">selectAll</button>

		<button @click="store().configFunctions.saveAll()" v-if="!props.prop?.hideMess">saveAll</button>
		
		
		<!-- <TreeView :obj="store().getSettings()" @emit-handler="emitHandler"/> -->
		<TreeView :obj="settings" :treeSettings="treeSettings" @emit-handler="emitHandler" :prop="prop" :defaults="JSON.parse(JSON.stringify(store().defaults))" :factoryDefault="JSON.parse(JSON.stringify(store().factoryDefault))" :hideMess="props.prop.hideMess"/>
	</div>

</template>


<script setup>
// https://medium.com/@ronnow/dropdowns-in-vue-the-right-way-8ff9e8f36d4a
//import SocketioService from './../socketio.service.js';
//import { CanvasManager } from '@/CanvasManager8.js'
import { canvasStore, styleStore, configStore, store, refs } from "@/stores/store.js";
import { h, onMounted, onBeforeMount, watch, onUpdated, nextTick, ref, reactive } from 'vue'

import FormData from 'form-data'	//npm install --save form-data
import * as utils from '@/utils.js'

import TreeView from "@/components/cTreeView.vue";

const props = defineProps({
	prop: {
		type: Object,
		required: false,
		default: {onChange:()=>{}, hideMess: true, },
	},
})
onBeforeMount(() => {})
onMounted(() => {})

function emitHandler(emitObj){
	let pathString = emitObj.path.join(' ==> ')
	console.log(`***cSETTINGSTREE*** ${emitObj.type} Full path: ${pathString}  _____  ${emitObj.key} = ${emitObj.value}`)
	setValue(emitObj)
}
function clear(){
	localStorage.clear()
}
function saveSettings(){
	//store().functions.save()
}
function saveAutosaveSettings(){
	//store().functions.save()
}

let settings = reactive(store().getSettings())
let treeSettings = reactive(store().settingSettings)

function resetState(key, obj, defaultObj){
	if(typeof obj[key] == 'object')
		Object.assign(obj[key], defaultObj[key] )
	else 
		obj[key] = defaultObj[key]

	//checkRedraw(key)
	checkActions(key)
	
}
const prop = {
	resetState: resetState,
	saveValue: store().configFunctions.saveValue,
	
}



function setValue({path, key, value, autoSave, type, settingsObj=settings, count = 0}){
	checkActions(key)
	//if(key == 'startWindowNameWithIcon') store().setTitle()
	//console.log(key, value, path)
	if(type == 'autoSave' || type == 'includeInSaveAll' || count > 999) return 
	
	count += 1
	if(!path) {
		settingsObj[key] = value
		//checkRedraw(key)
	}
	else {
		let nextKey
		if(path.length > 1){
			nextKey = path[0]
			path.shift()
		} else{
			nextKey = path
			path = null
		}
		setValue({path: path, key, value, settingsObj:settingsObj[nextKey], count })
	}
}
function checkActions(key){
	if(key == 'navState' || key == 'ofs' ||  key == 'scale' || key == 'x' || key == 'y' ){
		let ofs = {x: configStore().navState.ofs.x, y: configStore().navState.ofs.y}
		refs().TheZoom.resetZoom(ofs, configStore().navState.scale)
	}
	if(key == 'startWindowNameWithIcon') store().setTitle()
}

function checkRedraw(key){
	if(key == 'navState' || key == 'ofs' ||  key == 'scale' || key == 'x' || key == 'y' ){
		let ofs = {x: configStore().navState.ofs.x, y: configStore().navState.ofs.y}
		refs().TheZoom.resetZoom(ofs, configStore().navState.scale)
	}
}






</script>


<style scoped>

</style>


