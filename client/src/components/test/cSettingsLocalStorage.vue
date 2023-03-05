p




<script lang="jsx">
{/* <template>
	<div>ye</div>
</template> */}
// https://medium.com/@ronnow/dropdowns-in-vue-the-right-way-8ff9e8f36d4a
//import SocketioService from './../socketio.service.js';
//import { CanvasManager } from '@/CanvasManager8.js'
//import socketioService from './../socketio.service.js';

import { canvasStore, styleStore, configStore } from "@/stores/store.js";
import { h, onMounted, onBeforeMount, watch, onUpdated, nextTick, ref, reactive, toRef, toRefs } from 'vue'
import { defineComponent } from 'vue';
//import HelloWorld from './components/HelloWorld.vue';
//import { canvasStore, styleStore, configStore } from "@/stores/store.js";

import socketioService from './../socketio.service.js';
import FormData from 'form-data'
import * as utils from '@/utils.js'


export const fullLocalStorage = defineComponent({
	setup() {
		async function buttonClearAll(e){
			window.localStorage.clear();
			//utils.printBrowser({text:`buttonClearAll: ${localStorage}`, whoSentYou:'settings'})
		}
		async function buttonRemove(key){
			window.localStorage.removeItem(key);
			items[key].displayStyle = 'none'
			//utils.printBrowser({text:`buttonRemove: ${key}`, whoSentYou:'settings'})
		}
		async function buttonSave(e){
			//utils.printBrowser({text:`buttonSave: ${'buttonSave'}`, whoSentYou:'settings'})
		}
		function buttonCancel(){
			//utils.printBrowser({text:`buttonCancel: ${'buttonCancel'}`, whoSentYou:'settings'})
		}

		const items = reactive({})
		getStorage()
		function getStorage(){
			//localStorage.setItem('testfalse',false)
			for (let [key, val] of Object.entries(localStorage)) {
				val = val.replaceAll('\"', '')
				let type = (val=='true' || val=='false') ? 'bool' : 'string'
				if(type == 'bool') val = (val=='true') ? Boolean(true) : Boolean(false)

				items[key] = {
					key:key,
					value:val,
					type: type, 
					displayStyle: 'block'
				}
				//utils.printBrowser({text:`localStorage: ${items[key].type}, ${items[key].key} == ${items[key].value}`, whoSentYou:'settings,loop'})
			}
			//console.log('items', items)
		}
		const elements = () => {
			let arr = []
			for (let [key, val] of Object.entries(items)) {
				let styleAdd = `display:${val.displayStyle};`
				arr.push( <div style={"grid-column: 1/1; text-align:left;"+styleAdd}> <button onClick={($event)=>{buttonRemove(key)}}>X</button> </div> )
				arr.push( <div style={"grid-column: 2/4; text-align:left;"+styleAdd}> {key}</div> )
				
				if(val.type == 'string')
					arr.push( 
						<div style={"grid-column: 5/11; text-align:left;"+styleAdd}>	
							<input type="text" value={val.value} />
						</div> 
					)
				if(val.type == 'bool' || val.type == 'boolean')
					arr.push( 
						<div style={"grid-column: 5/11; text-align:left;"+styleAdd} >	
							<input type="checkbox" checked={val.value} value={val.value} onChange={handleChange}/> {/* {val} */}
						</div> 
					)
					/* checked={val.value} value={val.value} */
			}
			return arr
		}
		function handleChange(){
			console.log('handleChange')
		}
		
		return () => (<div class="formGrid">{elements()}</div>)
	}
});



export default defineComponent({
	components: {fullLocalStorage},
	setup() {
		// <button onClick={() => { }}></button>
		return () => (<fullLocalStorage />)
	},
});



</script>


<style scoped>






.test-class{
	background-color: blue;
}


.formContainer{
	width:fit-content
}

.formGrid{
	display: grid;
	column-gap: 1ch;
	/* grid-template-columns: repeat(auto-fills, 50px);  */
	/* grid-template-columns: repeat(auto-fit, 50px); */
	grid-template-columns: repeat(10, minmax(10px, 1fr));
    border: solid 1px rgb(99, 10, 10);
}
</style>


