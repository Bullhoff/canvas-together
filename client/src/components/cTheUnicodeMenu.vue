


<template>
	<div class="container" :class="[state.preventSelect ? 'prevent-select':'']">
		<div class="displaySelection">
			<div v-for="(value, key) in configStore().lists.unicodePrimarySymbols"
				:class="{ highlighted: value == conf.tools.unicode.code, notHighlighted: value != conf.tools.unicode.code }"
				@click="onSelect(key, value)"
				:title="key+': '+value"
				@contextmenu.prevent="contextMenuTest($event, key, value, 'Remove')">
				{{ String.fromCodePoint(`0x${value}`) }}
			</div>
		</div>

		<div>
			<button
				@click="addToPrimaryList"
				:disabled="(configStore().lists.unicodePrimarySymbols[conf.tools.unicode])">
				+
			</button>
			<select v-model="configStore().tools.unicode.selectedCategory" @change.stop.prevent="changeCategory" >
				<template v-for="(key, index) in configStore().lists.unicodePrimaryCategories" @mousedown.stop.prevent="">
					<option :value="key" @mousedown.stop.prevent=""> {{ key }} </option>
				</template>
			</select>
			<input type="number" v-model="selectedCategoryIndex" @change="spinnerCategory"
				style="width:3ch; left:0px;" />

			<select v-model="conf.tools.unicode.sizeMultiplier">
				<template v-for="(key) in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]">
					<option :value="key"> {{ key }} </option>
				</template>
			</select>
			<input type="checkbox" v-model="state.preventSelect" title="Prevent select"/> 
		</div>

		<div class="displaySelection" > <!-- configStore().unicode.selectedCategory --> <!-- unicode[selectedCategory] -->
			<div v-for="(value, key) in unicodeFullList[configStore().tools.unicode.selectedCategory]"
				:class="{ highlighted: value == conf.tools.unicode.code, notHighlighted: value != conf.tools.unicode.code }"
				@click="onSelect(key, value)" @dblclick.prevent="addToPrimaryList" :title="key+': '+value" :value="value" 
				@contextmenu.prevent="contextMenuTest($event, key, value, 'Add')">
				{{ String.fromCodePoint(`0x${value}`) }}
			</div>
		</div>
		
	</div>
	
	


</template>


<script setup>
import unicodeFullList from "./../assets/unicode.json"
import { canvasStore, styleStore, configStore, contextMenuStore } from "@/stores/store.js";
import { defineComponent, onMounted, onBeforeMount, onUpdated, nextTick, ref, reactive } from 'vue'
import { objectExpression } from "@babel/types";
import { store } from "../stores/store";
import Dropdown2 from '@/components/cDropdown2.vue'
//import SocketioService from './../socketio.service.js';
//import * as utils from './../utils.js'
//const emit = defineEmits(['resetZoom'])


function contextMenuTest(e, key, value, addOrRemove){
	//console.log('contextMenuTest', key, value, e.target?.value, e.target?.textContent, e.target?.textContent.codePointAt(0), e.target, e)
	let item = (addOrRemove == 'Add') ? 
				{[`Add ${String.fromCodePoint('0x'+value)}`]: () => {
					if(configStore().lists.unicodePrimarySymbols[key]) return
					configStore().lists.unicodePrimarySymbols[key] = value
					store().configFunctions.saveList({key:'lists__unicodePrimarySymbols', value: configStore().lists.unicodePrimarySymbols})
				}} : 
				{[`Remove ${String.fromCodePoint('0x'+value)}`]: () => {
					if(!configStore().lists.unicodePrimarySymbols[key]) return
					delete configStore().lists.unicodePrimarySymbols[key]
					store().configFunctions.saveList({key:'lists__unicodePrimarySymbols', value: configStore().lists.unicodePrimarySymbols})
				}}

	let items = {
		'aa':{ 
			type: 'enlarged', 
			value: String.fromCodePoint('0x'+value), 
			//style: {fontSize:'10ch'},
		},
		...item, 
		'Prevent Select':{ 
			type: 'checkbox', 
			name: 'Prevent Select', 
			value: state.preventSelect, 
			onClick: (e)=>{console.log('click', e);state.preventSelect=e;},
			//onClick: (e)=>{console.log('click', e);state.preventSelect=e.target.checked;},
		},
		
		Copy: [
			() => navigator.clipboard.writeText(String.fromCodePoint('0x'+value)),	// await navigator.clipboard.readText()	
			{
				'Copy\xa0selection': ()=> navigator.clipboard.writeText(window.getSelection().toString()), 
				'Copy\xa0symbol': () => navigator.clipboard.writeText(String.fromCodePoint('0x'+value)),
				//'Copy\xa0unicode': () => navigator.clipboard.writeText(value),
				'Copy\xa0unicode': [
					() => navigator.clipboard.writeText(value),	
					{
						'Copy\xa0unicode in \"fromCodePoint\" format': () => navigator.clipboard.writeText(`String.fromCodePoint('0x${value}')`),
					}
				],
				'Copy\xa0name': () => navigator.clipboard.writeText(`${key}: ${value}`),
				Paste: async() => {console.log(await navigator.clipboard.readText())},
				
			}
			
		], 
	}
	//if(configStore().general.debug)
	items['Test'] = {
			Nothing: () =>console.log('Nothing'),
			SubMenu1: () => {console.log('SubMenu1')},
			SubMenu2: () => {console.log('SubMenu2')},
			SubMenu3: {
				SubMenu1a: () => {console.log('SubMenu1')},
				SubMenu2b: () => {console.log('SubMenu2')},
				SubMenu33c: {
					SubMenu111: () => {console.log('SubMenu1')},
					SubMenu222: {
						SubMenu22: {
							SubMenu222: {
								SubMenu2222: {
									SubMenu2: {
										SubMenu2: {
											SubMenu2: {
												SubMenu1: () => {console.log('SubMenu1')},
											},
										},
										'aa':{ 
											type: 'enlarged', 
											value: String.fromCodePoint('0x'+value), 
											style: {fontSize:'50ch'},
										}
									},
								},
							},
						},
					},
				},
				SubMenu4d: () => {console.log('SubMenu4')},
			},
			SubMenu4: 'hejhej',
			SubMenu5_longname: () => {console.log('SubMenu3')},
			SubMenu6: {
				SubMenu19: () => {console.log('SubMenu1')},
				SubMenu29: () => {console.log('SubMenu2')},
			},
	}
	contextMenuStore().onContextMenu(e, items)
}

const conf = reactive(configStore());

const props = defineProps({
	obj: {
		type: Object,
		required: false,
		default: {},
	},
	lists: {
		type: Object,
		required: false,
		default: {
			mainDisplay: ['Emoticons', 'Misc_Pictographs', 'Misc_Symbols', 'Sup_Symbols_And_Pictographs', 'Transport_And_Map', 'Dingbats', 'Ornamental_Dingbats', 'Misc_Math_Symbols_A', 'Sup_Arrows_A', 'Sup_Arrows_B', 'Sup_Arrows_C', 'Music', 'Cuneiform', 'Braille', 'Egyptian_Hieroglyphs', 'Block_Elements', 'Box_Drawing', 'Enclosed_Alphanum', 'Greek', 'Math_Operators', 'Misc_Technical', 'Geometric_Shapes'],
			secondaryDisplay: [],
			tertiary: []
		},
	},
	propStyle: {
		type: Object,
		required: false,
		default: {},
	},
})

const state = reactive({
	preventSelect: true,
	contextMenu: false,
})

/* let currentUnicode = reactive(conf.toolState.unicode) */
let currentUnicode = conf.tools.unicode
//const selectedCategory = ref('Emoticons')
const selectedCategory = ref(null)
const selectedCategoryIndex = ref(0)
const selectedCategorySpinner = ref(0)

function spinnerCategory(e) {
	console.log('spinnerCategory', e, selectedCategorySpinner.value)
	if (-selectedCategoryIndex.value < 0) selectedCategoryIndex.value = 0
	configStore().tools.unicode.selectedCategory = configStore().lists.unicodePrimaryCategories[-selectedCategoryIndex.value]
}
function changeCategory(e) {
	selectedCategoryIndex.value = configStore().lists.unicodePrimaryCategories.indexOf(configStore().tools.unicode.selectedCategory)
}

function onSelect(key, value) {
	conf.tools.unicode.name = key
	conf.tools.unicode.code = value
	conf.toolState.toolActive = 'unicode'
}

function addToPrimaryList() {
	configStore().lists.unicodePrimarySymbols[currentUnicode.name]  = currentUnicode.code
	store().configFunctions.saveList({key:'lists__unicodePrimarySymbols', value: configStore().lists.unicodePrimarySymbols})
}



onBeforeMount(() => {})
onMounted(() => {})


</script>


<style scoped>

.displaySelection {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	padding: 0.5ch;

}

.displaySelection div {
	/* font-size:xx-large; */
	padding: 0.05ch;
}
</style>


