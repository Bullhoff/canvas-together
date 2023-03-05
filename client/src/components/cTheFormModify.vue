
<template>
	<div class="container">
		ye not yet
	</div>
</template>


<script setup>
import SocketioService from './../socketio.service.js';
//import { CanvasManager } from '@/CanvasManager8.js'
import { canvasStore, styleStore, configStore } from "@/stores/store.js";
import { h, onMounted, onBeforeMount, watch, onUpdated, nextTick, ref, reactive } from 'vue'

import axios from "axios";
import FormData from 'form-data'	//npm install --save form-data
import * as utils from '@/utils.js'

const conf = reactive(configStore());
const canvasses = reactive(canvasStore());

const displayToggle = ref(false)
const file = ref(null)
const parentName = ref(null)


onBeforeMount(() => {
})
onMounted(() => {
})

</script>


<style scoped>
/* .container{} */

</style>


