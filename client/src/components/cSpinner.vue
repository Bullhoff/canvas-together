<template >
	<!-- 
		object-fit: contain;
		margin: 0; padding: 0;
		font-size:1ch;
		width:3ch;
		width:3ch;
		background-color: gray;
		position:relative;
	 -->
	 <div style="position:relative ;height: inherit; line-height: 50%; width:1.0ch; " >

		<div style="height:50%; width:inherit; margin: 0; padding: 0;" 
			
			@mousedown.prevent.left="arrowMouseEvent($event,'mousedown', 'up')"
			@mouseup.left="arrowMouseEvent($event,'mouseup', 'up')"
			@mouseleave="arrowMouseEvent($event,'mouseleave', 'up')"
			>
			<svg preserveAspectRatio="none" width='100%' height='100%' viewBox="0 0 2 2" style=" box-sizing: content-box;object-fit: contain;margin: 0; padding: 0;justify-self: start;">
				<polygon points="0,2 1,0 2,2" style="box-sizing: content-box;" class="arrow"/>
			</svg>
		</div>
		<div style="height:50%; width:inherit; margin: 0; padding: 0;" 
			
			@mousedown.prevent.left="arrowMouseEvent($event,'mousedown', 'down')"
			@mouseup.left="arrowMouseEvent($event,'mouseup', 'down')"
			@mouseleave="arrowMouseEvent($event,'mouseleave', 'down')"
			>
			<svg preserveAspectRatio="none" width='100%' height='100%' viewBox="0 0 2 2"  style="transform: rotate(180deg);">
				<polygon points="0,2 1,0 2,2" style="" class="arrow"/>
			</svg> 
		</div>

	</div>

</template>


<script setup>
//import { defineComponent, onMounted, onBeforeMount, onUpdated, nextTick, ref, reactive, defineEmits } from 'vue'
//import { channel } from 'diagnostics_channel';
import {
	ref, reactive, toRefs, watch, watchEffect, onMounted, onBeforeMount, onUpdated, nextTick,
	onDeactivated, onRenderTriggered
} from 'vue'

const props = defineProps({
	options: {
		type: Array,
		default: [],
		required: false,
	},
	state: {
		type: Object,
		default: {},
		required: false,
	},
	default: {
		type: String,
		required: false,
		default: null,
	},
	settings: {
		type: Object,
		required: false,
		default: {
			closeOnSelect: true,
			tooltipActive: true,
			tooltipText: 'bla'
		},
	},
	propStyle: {
		type: Object,
		required: false,
		default: {},
	},

})
const emit = defineEmits(['increase', 'decrease'])


const defaultSettings = {
	closeOnSelect: true,
	tooltipActive: true,
	tooltipText: 'blawwww'
}
const settings = reactive(Object.assign(defaultSettings, props.settings));

const defaultStyle = {container: {},}
const style = reactive(Object.assign(defaultStyle, props.propStyle));




function arrowMouseEvent(e, event, button){
	if(event == 'mousedown' && button == 'up') emit('increase', button)
	if(event == 'mousedown' && button == 'down') emit('decrease', button)
}


onMounted(() => { })



</script>



<style scoped>
.arrow {
	stroke: rgb(243, 10, 2);
	stroke-width: 0.2;
	fill: #1f00ec;
	opacity: 0.5;
}

.arrow:hover {
	fill: #ec008c;
	opacity: 1.0;
}
</style>