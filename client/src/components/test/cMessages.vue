
<template>
	<div>
		<!-- 
			position:relative; 
			width:100%; 
			height:100%;
			display:inline-block;
			@click="()=>{refs[index].style.height=''; refs[index].style.height = refs[index].scrollHeight + 'px'}"
			display:flex; flex-direction: row;
		 -->
		 <div style="display:flex; flex-direction:row;">
			<button @click="bool.showMessages=!bool.showMessages">Messages</button>
			<button @click="bool.showValues=!bool.showValues">Values</button>
		 </div>
		
		<div v-if="bool.showMessages">
			<template v-for="(item, index) in store().messageQueue">
				<div v-for="(value, key) in item" style="width:100%;" class="row-container">
					<button style="display:inline-block; width:fit-content;"
						@click="()=>onClick(index)"
						><p style="">{{index}}_{{key}}</p></button>
					<textarea rows="1" style="display:inline-block; width:100%; overflow-y:hidden;" :ref="(el)=>refs[index] = el">{{ (typeof value == 'object') ? JSON.stringify(value,null,2) : value }}</textarea>
				</div>
			</template>
		</div>

		<div v-if="bool.showValues">
			<dl>
				<template  v-for="(catObj, cat) in store().debug()">
					<!-- <div style="display:flex; flex-direction:row;"> -->
						<dt style="background-color:brown;" @click="bool[cat]=!bool[cat]">{{cat}}</dt>
					<!-- </div> -->
					<template v-for="(value, key) in catObj" v-if="bool[cat]">
						<dd style="text-decoration: underline;">
							<!-- <div style="display:flex; flex-direction:row;"> -->
								<p style="display:inline-block; text-decoration: underline;">{{key}}</p>  
							<!-- </div> -->
							<template v-if="typeof value == 'number' || typeof value == 'string'">
								<p style="display:inline-block;"> : {{ 	(typeof value == 'number') ? utils.round(value, 2) : value }}</p>
							</template>
							<template v-else-if="typeof value == 'object'">
								<p v-for="(value2, key2) in value" style="display:inline-block;">
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ key2 }}: {{ utils.round(value2, 2) }}
								</p>
							</template>
						</dd>
					</template>
				</template>
				
			</dl>
		</div>
		
	</div>
</template>


<script setup>
// {{ (typeof value == 'object') ? JSON.stringify(value,null,2) : value }}
//import unicode from "./../assets/unicode.json"
// https://medium.com/@ronnow/dropdowns-in-vue-the-right-way-8ff9e8f36d4a
//import SocketioService from './../socketio.service.js';
//import { CanvasManager } from '@/CanvasManager8.js'
import { canvasStore, styleStore, configStore, windowStore, store } from "@/stores/store.js";
import { defineComponent, onMounted, onBeforeMount, onUpdated, nextTick, ref, reactive, computed } from 'vue'
//import socketioService from './../socketio.service.js';

//import NewImage from '@/components/cNewImage.vue'
//import TheModifyForm from '@/components/cTheModifyForm4.vue'
//import TheModifyForm2 from '@/components/cTheModifyForm5.vue'
/* import Dropdown from '@/components/cDropdown.vue'
import ColorPicker from '@/components/cColorPicker.vue'
import Draggable from '@/components/cDraggable.vue'
import TheUnicodeMenu from '@/components/cTheUnicodeMenu.vue'
import TheRegisterUser from '@/components/cTheRegisterUser.vue'
import Settings from '@/components/cSettings.vue'
import SettingsLocalStorage from '@/components/cSettingsLocalStorage.vue'
import Spinner from '@/components/cSpinner.vue'
import SimpleDropdown from '@/components/cSimpleDropdown.vue'
import * as Svg from './../components/cSvg.vue' */

/* import ContextMenu from '@/components/cContextMenu.vue' */
//import Tooltip from '@/components/cTooltip.vue'
//import Tooltip2 from '@/components/cTooltip2.vue'

import * as utils from './../utils.js'
//const emit = defineEmits(['resetZoom'])

const refs = reactive([])
let messageQueue = computed(()=>{

})
const bool = reactive({
	showMessages: false, 
	showValues: false
})

function onClick(i){
}

</script>


<style scoped>

button{
	background-color: gray;
}
textarea{
	background-color: gray;
	caret-color: red;
	cursor:cell;
}

.row-container{
	display:flex;
	flex-direction: row;
}

</style>


