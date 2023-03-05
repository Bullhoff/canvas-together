
<template style="">
	<div style="z-index: 9;">
	
	<div v-for="(item, id) in someStore().activePopups" :key="id" v-if="configStore().general.guidePopupsEnabled" style="">
		<component :is="Popup" :componentName="id" :text="someStore().list[id]?.text"/>
	</div>
	<div v-for="(window, id) in windowStore().windows"  :key="window.id" v-show="!windowStore().windows[id].minimized">
		<Draggable  
			:divRef="windowStore().refs[id]"
			:windowState="windowStore().windows[id]"
			:functions="windowStore().func"
			:propStyle="windowStore().draggableContent[id]?.propStyle"
			:key="window.id"
		>
		<template v-slot:header :key="window.id">
			<template 
				v-if="windowStore().draggableContent[id]?.head" 
				v-for="(item, index) in windowStore().draggableContent[id]?.head"	>
				{{ windowStore().draggableContent[id].head[index] }}
			</template>
			<template 
				v-if="windowStore().draggableContent[id]?.headComputed" 
				v-for="(item, index) in windowStore().draggableContent[id]?.headComputed"	>
				{{ windowStore().draggableContent[id].headComputed[index].value }}
			</template>
			<template 
				v-if="windowStore().draggableContent[id]?.headComponent" 
				v-for="(item, index) in windowStore().draggableContent[id]?.headComponent"	>
				<component :is="windowStore().draggableContent[id].headComponent[index]" :prop="windowStore().props[id].head[index]" :window_id="id"/>
			</template>
			
		</template>
		<p>
			<template 
				v-if="windowStore().draggableContent[id]?.body" 
				v-for="(item, index) in windowStore().draggableContent[id]?.body"	>
				*{{ windowStore().draggableContent[id]?.body[index] }}*
			</template>
			<template 
				v-if="windowStore().draggableContent[id]?.bodyComputed" 
				v-for="(item, index) in windowStore().draggableContent[id]?.bodyComputed"	>
				{{ windowStore().draggableContent[id].bodyComputed[index].value }}
			</template>
			<template 
				v-if="windowStore().draggableContent[id]?.bodyComponent" 
				v-for="(item, index) in windowStore().draggableContent[id]?.bodyComponent"	>
				<component :is="windowStore().draggableContent[id].bodyComponent[index]" :prop="windowStore().props[id].body[index]" :window_id="id"/>
			</template>
		</p>
	</Draggable>
	</div>
</div>

</template>


<script setup>
import unicode from "./../assets/unicode.json"
// https://medium.com/@ronnow/dropdowns-in-vue-the-right-way-8ff9e8f36d4a
import SocketioService from './../socketio.service.js';
//import { CanvasManager } from '@/CanvasManager8.js'
import { canvasStore, styleStore, configStore, windowStore, refs, someStore } from "@/stores/store.js";
import { defineComponent, onMounted, onBeforeMount, onUpdated, nextTick, ref, reactive, watch } from 'vue'
//import socketioService from './../socketio.service.js';

import Draggable from '@/components/cDraggable.vue'
import Popup from '@/components/cPopup.vue'

import * as utils from './../utils.js'
//const emit = defineEmits([])

const conf = reactive(configStore());
const canvasses = reactive(canvasStore());


onBeforeMount(() => {})
onMounted(() => {})


</script>


<style scoped>

</style>


