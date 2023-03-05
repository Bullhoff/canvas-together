<template >
	<div :style="[style?.container]">
		<div :style="[style?.subContainer]">
			<div style="font-size:1ch;text-align:left;margin: 0; padding: 0;" >

				<div style="height:50%; width:3ch; margin: 0; padding: 0; object-fit: contain;" title="Add color" @click="changeColorsAmount(+1)">
					<svg width='100%' height='100%' viewBox="0 0 2 2" preserveAspectRatio="none">
						<polygon points="0,2 1,0 2,2" style="" class="color-amount-spinner"/>
					</svg>
				</div>
				<div style="height:50%; max-width:3ch; margin: 0; padding: 0;" title="Remove color" @click="changeColorsAmount(-1)">
					<svg width='100%' height='100%' viewBox="0 0 2 2" preserveAspectRatio="none" style="transform: rotate(180deg);">
						<polygon points="0,2 1,0 2,2" style="" class="color-amount-spinner"/>
					</svg> 
				</div>
				
			</div>

			<template v-for="(color, i) of colors" :key="i" >
				<template v-if="colors[i] == 'random'">
					<p title="Random color"
						:style="[style?.colorBox]"
						style="text-align:center;"
						@change="colorChanged(i, color)"
						:class="{ highlighted: i == activeColor, notHighlighted: i != activeColor }"
						@click="changeColorIndex(i, color)"
						@mousedown="changeColorIndex(i, color)"
						@contextmenu.prevent=""
						>
						<!-- &#127752; -->
						<!-- &#128256; -->
						<!-- &#6469; -->
						<!-- &#9072; -->
						<!-- &#11860; -->
						&#127922;
						<!-- R -->
					</p>
				</template>	
				<template v-else-if="colors[i] == 'erase'">
					<p
						:style="[style?.colorBox]"
						style="text-align:center;"
						@change="colorChanged(i, color)"
						:class="{ highlighted: i == activeColor, notHighlighted: i != activeColor }"
						@click="changeColorIndex(i, color)"
						@mousedown.middle="changeColorIndex(i, color)"
						@contextmenu.prevent=""
						>
						<!-- &#x26aa; -->
						&#9003;
					</p>
				</template>	
				<template v-else>
					<div>
						<input type="color" style=""
							:style="[style?.colorBox]"
							v-model="colors[i]"
							@change="colorChanged(i, color)"
							:class="{ highlighted: i == activeColor, notHighlighted: i != activeColor }"
							@click="changeColorIndex(i, color)"
							@mousedown="changeColorIndex(i, color)"
							@contextmenu.stop.prevent=""
							:title="colors[i]">

						<div style="z-index:5;display:inline;position:absolute;left:0.5ch;" v-if="i == activeColor"
							:title="colors[i]"
							:style="checkMarkColor">✔</div>
					</div>
						
				</template>
				
			</template>
			
		</div>
		
	</div>
</template>


<script setup>

import * as utils from './../utils.js'
import { ref, reactive, toRefs, toRef, watch, watchEffect, onMounted, onBeforeMount, onUpdated, nextTick } from 'vue'
import Spinner from '@/components/cSpinner.vue'
import { store, configStore } from "../stores/store";
const emit = defineEmits(['input', 'toggleHidden', 'remove', 'setActiveIndex'])


const props = defineProps({
	colorList: {
		type: Array,
		required: false,
		default: ['#9c1c1c', '#9c1c9c'],
	},
	color: {
		type: String,
		required: false,
		default: '#9c1c1c',
	},
	tabindex: {
		type: Number,
		required: false,
		default: 0,
	},
	propStyle: {
		type: Object,
		required: false,
		default: {},
	},
	activeColorIndex: {
		type: Number,
		required: false,
		default: 0,
	}


})

var defaultStyle = {
	cont_ainer: {
		position: 'relative',
		display: 'inline-block',
		width: '3.0ch',
		height: '3.0ch',
		padding: '0em',
		border: 'none',
	},
	container: {
		display: 'inline-block',
		paddingLeft: '1ch',
		height: '3ch',
		outline: 'none',
	},
	subContainer: {
		display: 'flex',
		flexDirection: 'row',
		height: '3ch',
		marginTop: '0%',
	},
	colorBox: {
		margin: '0ch',
		padding: '0ch',
		width: '3ch',
		height: '100%',
		border: 'none',
	},
	inputBox: {
		width: '3ch',
		backgroundColor: 'black',
	},
}

var style = reactive({
	...defaultStyle,
	...props.propStyle
});

var activeColor = ref(props.activeColorIndex)
var colors = reactive(props.colorList)
var amountOfColors = ref(null)


const checkMarkColor = reactive({color: 'rgb(255,255,255)'})
//const rgbInverted = reactive({})
function changeColorIndex(i, color) {
	console.log('changeColorIndex', i, color, activeColor)
	activeColor.value = i
	emit('setActiveIndex', i, color)
	if(color == 'random') return

	var rgb = hexToRgb(color)
	Object.assign(checkMarkColor, {color: 'rgb('+[255-rgb.r, 255-rgb.g, 255-rgb.b].join(',')+')'})
}
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}


function changeColorsAmount(diff) {
	console.log(diff, props.colorList.length)
	if (diff < 0 && props.colorList.length > 1)
		props.colorList.pop()
	else if(diff > 0)
		props.colorList.push(utils.getRandomColor({ format: 'hex' }))
	
	store().configFunctions.saveList({key:'lists__colors', value: configStore().lists.colors})
}


function colorChanged(e) {
	store().configFunctions.saveList({key:'lists__colors', value: configStore().lists.colors})
}

onMounted(async () => {
	amountOfColors.value = props.colorList.length
})


</script>



<style scoped>

.color-amount-spinner{
	stroke:rgb(243, 10, 2);
	stroke-width:0.2;
	fill: #1f00ec;
    opacity: 0.5;
}
.color-amount-spinner:hover{
	fill: #ec008c;
    opacity: 1.0;
}


</style>