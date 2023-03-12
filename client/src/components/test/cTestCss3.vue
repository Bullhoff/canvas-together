
<template>
	<div>
		<img src="https://www.tutorialspoint.com/assets/questions/media/426142-1668760872.png" style="width:50px;height:50px;">
	</div>
	<div>
		<img :src="img" style="width:50px;height:50px;">
	</div>
	<div>
		<img :src="img" style="width:50px;height:50px;" :ref="(el)=>refs.img=el">
	</div>
	<div :ref="(el)=>refs.divRef=el">
		
	</div>

	
</template>


<script setup>
//import SocketioService from './../socketio.service.js';
import { canvasStore, styleStore, configStore } from "@/stores/store.js";
import { h, onMounted, onBeforeMount, watch, onUpdated, nextTick, ref, reactive } from 'vue'
import FormData from 'form-data'	//npm install --save form-data
import * as utils from '@/utils.js'

var img = new Image();
img.onload = (e) => {
	console.log('img.onload', e)
	refs.img.append(img)
	refs.divRef.appendChild(img);

}
img.src = `https://www.tutorialspoint.com/assets/questions/media/426142-1668760872.png`

const refs = reactive({
	img: null, 
	divRef: null
})

onMounted(() => {
	
})


onBeforeMount(() => {
})


function onClick(e){
	//const rect = refs.body.getBoundingClientRect()
}
</script>


<style scoped>

</style>


