
<template style="width:100%; position:relative;">

		<div v-for="(value, key, index) in props.obj" style="width:100%; position:relative;" class="container">	
			<ul style="width:100%; position:relative;">
				<template class="row"
					v-if="key == '_expanded' || key[0] == '$' || (props.obj['$'+key]?.hideIf && props.obj['$'+key]?.hideIf())"  >
					 
				</template>
					<li v-else-if="typeof value == 'boolean' || value == 'true' || value == 'false' || value == 'on' || value == 'off'" class="row" >
						<div style="position:relative; padding-right:2ch;" v-if="!props.hideMess">
							<label class="checkbox-container-autosave" :title="'includeInSaveAll: '+key">
							<input class="check-box-autosave" type="checkbox" :value="props.treeSettings[key].$includeInSaveAll" v-model="props.treeSettings[key].$includeInSaveAll" @change="onChange($event, key, value, 'includeInSaveAll')" > 
							<span class="checkbox-autosave" ></span>
							</label>
						</div>
						<div style="position:relative; padding-right:2ch;" v-if="!props.hideMess">
							<label class="checkbox-container-autosave" :title="'Autosave: '+key">
							<input class="check-box-autosave" type="checkbox" :value="props.treeSettings[key].$autoSave" v-model="props.treeSettings[key].$autoSave" @change="onChange($event, key, value, 'autoSave')" > 
							<span class="checkbox-autosave" ></span>
							</label>
						</div>

						<button @click="props.prop.resetState(key, props.obj, props.factoryDefault)" 
							style="width:2ch;padding:0; margin:0;" 
							:title="'Reset value ('+key+'): '+props.obj[key]+' to '+props.factoryDefault[key]" 
							:disabled="value == props.factoryDefault[key]" > &#8634; </button>
						<button @click="props.prop.resetState(key, props.obj, props.defaults)" 
							style="width:2ch;padding:0; margin:0;"
							:title="'Reset value ('+key+'): '+props.obj[key]+' to '+props.defaults[key]" 
							:disabled="value == props.defaults[key]"> &#8634; </button>
						<button @click="props.prop.saveValue({key, value, obj: props.obj, path:pathLocal, })" 
							style="width:fit-content;padding:0; margin:0;" 	
							:title="'Save value:  '+key+' = '+props.obj[key]" 
							:disabled="value == props.defaults[key]" >&#128190; </button>

						{{key}} = 
						<input type="checkbox"   @change="onChange($event, key, value)" :class="[value != props.defaults[key] ? 'value-changed' : '']" 
							:checked="value" :disabled="(!configStore().general.debug && props.obj['$'+key]?.disabled)"
							:title="(true) ? props.obj['$'+key]?.tooltip : null"/>  
							
					</li>
					
					<li v-else-if="value == null" class="row" v-if="!props.hideMess">
						<div style="position:relative; padding-right:2ch;">
							<label class="checkbox-container-autosave" :title="'includeInSaveAll: '+key">
							<input class="check-box-autosave" type="checkbox" :value="props.treeSettings[key].$includeInSaveAll" v-model="props.treeSettings[key].$includeInSaveAll" @change="onChange($event, key, value, 'includeInSaveAll')" > 
							<span class="checkbox-autosave" ></span>
							</label>
						</div>
						<div style="position:relative; padding-right:2ch;" v-if="props.treeSettings[key] && !props.hideMess" >
							<label class="checkbox-container-autosave" :title="'Autosave: '+key">
								<input class="check-box-autosave" type="checkbox" :value="props.treeSettings[key]?.$autoSave" v-model="props.treeSettings[key].$autoSave" @change="onChange($event, key, value, 'autoSave')" > 
								<span class="checkbox-autosave" ></span>
							</label>
						</div>
						<button @click="props.prop.resetState(key, props.obj, props.factoryDefault)" 
							style="width:2ch;padding:0; margin:0;" 
							:title="'Reset value ('+key+'): '+props.obj[key]+' to '+props.factoryDefault[key]" 
							:disabled="value == props.factoryDefault[key]" > &#8634; </button>
						<button @click="props.prop.resetState(key, props.obj, props.defaults)" style="width:2ch;padding:0; margin:0;" 
							:title="'Reset value ('+key+'): '+props.obj[key]+' to '+props.defaults[key]" 
							:disabled="value == props.defaults[key]" > &#8634; </button>
						<button @click="props.prop.saveValue({key, value, obj: props.obj, path:pathLocal, })" 
							style="width:fit-content;padding:0; margin:0;" 	
							:title="'Save value:  '+key+' = '+props.obj[key]" 
							:disabled="value == props.defaults[key]"> &#128190; </button>
						{{key}} = <input type="text" :value="value" @change="onChange($event, key, value)" :class="[value != props.defaults[key] ? 'value-changed' : '']"/> 
						
					</li>
				
					<li v-else-if="typeof value == 'number' || !isNaN(value)" class="row" :title="(true) ? props.obj['$'+key]?.tooltip : null">
						<div style="position:relative; padding-right:2ch;" v-if="!props.hideMess">
							<label class="checkbox-container-autosave" :title="'includeInSaveAll: '+key" >
							<input class="check-box-autosave" type="checkbox" :value="props.treeSettings[key].$includeInSaveAll" v-model="props.treeSettings[key].$includeInSaveAll" @change="onChange($event, key, value, 'includeInSaveAll')" > 
							<span class="checkbox-autosave" ></span>
							</label>
						</div>
						<div style="position:relative; padding-right:2ch;" v-if="!props.hideMess">
							<label class="checkbox-container-autosave" :title="'Autosave: '+key">
							<input class="check-box-autosave" type="checkbox" :value="props.treeSettings[key].$autoSave" v-model="props.treeSettings[key].$autoSave" @change="onChange($event, key, value, 'autoSave')" > 
							<span class="checkbox-autosave" ></span>
							</label>
						</div>
						
						<button @click="props.prop.resetState(key, props.obj, props.factoryDefault)" 
							style="width:2ch;padding:0; margin:0;" 
							:title="'Reset value ('+key+'): '+props.obj[key]+' to '+props.factoryDefault[key]" 
							:disabled="value == props.factoryDefault[key]" > &#8634; </button>

						<button @click="props.prop.resetState(key, props.obj, props.defaults)" 
							style="width:2ch;padding:0; margin:0;" 
							:title="'Reset value ('+key+'): '+props.obj[key]+' to '+props.defaults[key]" 
							:disabled="value == props.defaults[key]" > &#8634; </button>
						<!-- &#128190; &#128427; &#128426; -->
						<button @click="props.prop.saveValue({key, value, obj: props.obj, path:pathLocal, })" 
							style="width:fit-content;padding:0; margin:0;" 	
							:title="'Save value:  '+key+' = '+props.obj[key]" 
							:disabled="value == props.defaults[key]"> &#128190; </button>
						
						{{key}} = <input type="number" :value="value" @change="onChange($event, key, value)" :class="[value != props.defaults[key] ? 'value-changed' : '']" />
						
					</li>
					
					<li v-else-if="typeof value == 'string'" style="display:flex;" class="row" :title="(true) ? props.obj['$'+key]?.tooltip : null" >
						<div style="position:relative; padding-right:2ch;" v-if="!props.hideMess">
							<label class="checkbox-container-autosave" :title="'includeInSaveAll: '+key">
							<input class="check-box-autosave" type="checkbox" :value="props.treeSettings[key].$includeInSaveAll" v-model="props.treeSettings[key].$includeInSaveAll" @change="onChange($event, key, value, 'includeInSaveAll')" > 
							<span class="checkbox-autosave" ></span>
							</label>
						</div>
						<div style="position:relative; padding-right:2ch;" v-if="!props.hideMess">
							<label class="checkbox-container-autosave" :title="'Autosave: '+key">
								<input class="check-box-autosave" type="checkbox" :value="props.treeSettings[key]?.$autoSave" v-model="props.treeSettings[key].$autoSave" @change="onChange($event, key, value, 'autoSave')" > 
								<span class="checkbox-autosave" ></span>
							</label>
						</div>
						<button @click="props.prop.resetState(key, props.obj, props.factoryDefault)" 
							style="width:2ch;padding:0; margin:0;" 
							:title="'Reset value ('+key+'): '+props.obj[key]+' to '+props.factoryDefault[key]" 
							:disabled="value == props.factoryDefault[key]" > &#8634; </button>

						<button @click="props.prop.resetState(key, props.obj, props.defaults)" 
							style="width:2ch;padding:0; margin:0;" 
							:title="'Reset value ('+key+'): '+props.obj[key]+' to '+props.defaults[key]" 
							:disabled="value == props.defaults[key]" > &#8634;</button>
						<button @click="props.prop.saveValue({key, value, obj: props.obj, path:pathLocal, })" 
							style="width:fit-content;padding:0; margin:0;" 	
							:title="'Save value:  '+key+' = '+props.obj[key]" 
							:disabled="value == props.defaults[key]" >&#128190; </button>
						{{key}} = <input type="text" :value="value" @change="onChange($event, key, value)" :class="[value != props.defaults[key] ? 'value-changed' : '']" /> 
						<!-- props.obj['$'+key]?.tooltip -->
						<input type="color" v-if="key.includes('Color')" @change="onChange($event, key, value)"/>
					</li>
					

				<template v-else-if="typeof value == 'object'" >
					
					<li  class="row">	<!-- style="white-space:nowrap;" -->
						<div style="position:relative; padding-right:2ch;" v-if="!props.hideMess">
							<label class="checkbox-container-autosave" :title="'includeInSaveAll category: '+key">
							<input class="check-box-autosave" type="checkbox" :value="props.treeSettings[key].$includeInSaveAll" v-model="props.treeSettings[key].$includeInSaveAll" @change="onChange($event, key, value, 'includeInSaveAll')" > 
							<span class="checkbox-autosave" ></span>
							</label>
						</div>
						<div style="position:relative; padding-right:2ch;" v-if="!props.hideMess">
							<label class="checkbox-container-autosave" :title="'Autosave category: '+key">
							<input class="check-box-autosave" type="checkbox" :value="props.treeSettings[key].$autoSave" v-model="props.treeSettings[key].$autoSave" @change="onChange($event, key, value, 'autoSave')" > 
							<span class="checkbox-autosave" ></span>
							</label>
						</div>
						
						<button :title="key+': '+JSON.stringify(value, null, 2)"
							@click="buttonExpand(key)"
							:ref="(el)=>refs[key]=el"
							>
							{{key}} 
						</button>  
						
					</li>

					<!-- props.objSettings[key] != undefined && props.objSettings[key]['_expanded'] -->
					<TreeView v-if="objSettings[key]?._expanded"  @emit-handler="emitHandler"
						:obj="props.obj[key]"
						:objSettings="props.objSettings[key]"
						:treeSettings="props.treeSettings[key]"
						:parent="key"
						:path="pathLocal"
						:prop="props.prop"
						:defaults="props.defaults[key]"
						:factoryDefault="props.factoryDefault[key]"
						:hideMess="props.hideMess"
					/>
				</template>
				

				<template v-else>
					{{ key }} {{ value }} ({{ typeof value }})
				</template>
				
			</ul>
		</div>
</template>


<script setup>
import SocketioService from './../socketio.service.js';
import { canvasStore, styleStore, configStore } from "@/stores/store.js";
import { h, onMounted, onBeforeMount, watch, onUpdated, nextTick, ref, reactive, unref, toRaw, isRef, onRenderTriggered, computed } from 'vue'

import TreeView from "@/components/cTreeView.vue";

import FormData from 'form-data'	//npm install --save form-data
import * as utils from '@/utils.js'


const emit = defineEmits(["emit-handler"])

const props = defineProps({
	hideMess:{type: Boolean, required:false, default: false},
	prop:{
		type: Object,
		required: false,
		default:{}
	},
	defaults:{
		type: Object,
		required: false,
		default:{}
	}, 
	factoryDefault:{
		type: Object,
		required: false,
		default:{}
	},
	objSettings: {
		type: Object,
		required: false,
		default:{}
	},
	obj: {
		type: Object,
		required: false,
	},
	treeSettings: {
		type: Object,
		required: false,
	},
	parent: {
		type: String,
		required: false,
		//default: 
	},
	path: {
		type: Array,
		required: false,
		default: []
	},
})
var objSettings = reactive(props.objSettings)
//var objSettingsComputed = computed(()=>props.objSettings)
const pathh = ref(props.path)
var pathLocal = reactive([])
const refs = reactive({})

function onChange(e, key, value, type) {
	//return console.log('onChange', key, value, type, e?.target?.value)
	let val = (e.target.type == 'checkbox') ? e.target.checked : e.target.value
	console.log('onChange', e.target.value, key, value, type)
	let emitObj = {
		path: pathLocal, 
		parent: props.parent, 
		key: key, 
		value: val, 
		autoSave: type, 
		type: type
		//value: e.target.value
	}
	emit('emit-handler', emitObj)
}
function emitHandler(emitObj){
	let obj = JSON.parse(JSON.stringify(emitObj))
	if(JSON.stringify(pathLocal) != JSON.stringify(emitObj.path))
		emit('emit-handler', obj)
}


function buttonExpand(key){
	if(!objSettings[key]) objSettings[key] = {}
	objSettings[key]['_expanded'] =! objSettings[key]['_expanded']
	setClass(key)
}
function setClass(key){
	if(objSettings[key]['_expanded'])
		refs[key].classList.add("button-expanded");
	else if(objSettings[key]['_expanded'] == false)
		refs[key].classList.remove("button-expanded");
}

onBeforeMount(() => {
	if(props.parent)
		pathLocal.push(
			...props.path, 
			...[props.parent]
		)
	else 
		pathLocal.push(...props.path)

	for (const [key, value] of Object.entries(props.obj)) {
		if(!objSettings[key]) objSettings[key] = {}
		if(!props.treeSettings[key]) props.treeSettings[key] = {$autosave: false}
		if(!props.defaults[key]) props.defaults[key] = value
	}
})
onMounted(() => {
	for (const [key, value] of Object.entries(refs)) {
		setClass(key)
	}
})



</script>


<style scoped>



.value-changed{
	background-color: bisque;
}


.row{
	display: flex;
	flex-direction: row;
	gap: 1ch;
	width:100%;
}

.checkbox-container-autosave{
	display: block;
	position: relative;
	/* padding-left: 35px; */
	margin-bottom: 0ch;
	/* margin-bottom: 12px; */
	cursor: pointer;
	font-size: 22px;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}
.checkbox-container-autosave input{
	position: absolute;
	opacity: 0;
	cursor: pointer;
	height: 0;
	width: 0;
}
.checkbox-autosave{
	position: absolute;
	top: 0;
	left: 0;
	height: 2ch;
	width: 2ch;
	/* background-color: #eee; */
	background-color: rgb(0, 0, 0);
}
.checkbox-container-autosave:hover input ~ .checkbox-autosave {
  background-color: #ccc;
}
/* .checkbox-container-autosave input:checked ~ .checkbox-autosave {
  background-color: #2196F3;
  background-color: #000000;
} */
.checkbox-autosave:after {
  content: "";
  position: absolute;
  display: none;
}
.checkbox-container-autosave input:checked ~ .checkbox-autosave:after {
  display: inline-block;
}
.checkbox-container-autosave .checkbox-autosave:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.container{
	/* overflow-y: hidden; */
	overflow: hidden;
	white-space: nowrap;
	/* background-color: antiquewhite;
	color:aqua; */
}

input{
	background-color: gray;
	/* flex-grow:1; */
	max-width:100%;
}

li,ul, button{
	text-align: left;
	white-space: nowrap;
	/* overflow-y: hidden; */
}
button{
	background-color: gray;
	
}
.button-expanded{
	background-color: darkcyan;
}



</style>


