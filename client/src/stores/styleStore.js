import { ref, computed, reactive, watch } from 'vue';
import { defineStore } from 'pinia';
import * as utils from './../utils.js'
import c from './../constants.js'


export const styleStore = defineStore('styles', () => {
	const app = reactive({
		fontSize:'16px'
	})
	function getSize(){
		console.log('parseInt(this.app.fontSize)', parseInt(this.app.fontSize))
		return parseInt(this.app.fontSize)
	}
	return {
		app,
		canvas: reactive({
			position: 'absolute', 
			left: 0, 
			top: 0, 
		}), 
		canvasContainer: reactive({
			position:'relative',
			zIndex: 0,
			overflow: 'hidden',
			alignItems: 'center',
			color: 'red', 
			width: '100vw',
			height: '95vh',
		}),
	}
});