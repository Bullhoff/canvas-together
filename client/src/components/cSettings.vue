

<script lang="jsx">


import { canvasStore, styleStore, configStore } from "@/stores/store.js";
import { h, onMounted, onBeforeMount, watch, onUpdated, nextTick, ref, reactive, toRef, toRefs, unref, toRaw, markRaw } from 'vue'
import { defineComponent } from 'vue';

import SocketioService from './../socketio.service.js';
import FormData from 'form-data'
import * as utils from '@/utils.js'
import SettingsTree from "@/components/cSettingsTree.vue";
import {ListComponent} from "@/components/Components.vue";


export const SettingsListStorage = defineComponent({
	props:['storage', 'storageType'], 
	emit: [],
	setup(props, {emit}) {
		const storage = props.storageType
		console.log('SettingsListStorage', this, props.storageType, storage)
		async function buttonClearAll(e){
			window[props.storageType].clear();
		}
		async function buttonRemove(key){
			window[props.storageType].removeItem(key);
			items[key].displayStyle = 'none'
		}
		async function buttonSave(e){}
		function buttonCancel(){}
		const items = reactive({})
		getStorage()
		function getStorage(){
			for (let [key, val] of Object.entries(window[props.storageType]) ) {
				val = val.replaceAll('\"', '')
				let type = (val=='true' || val=='false') ? 'bool' : 'string'
				if(type == 'bool') val = (val=='true') ? Boolean(true) : Boolean(false)
				items[key] = {
					key:key,
					value:val,
					type: type, 
					displayStyle: 'block'
				}
			}
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



export const SettingsListFull = defineComponent({
	setup() {
		utils.printBrowser({ text: `fullSettings: ${''}`, whoSentYou: 'settings' })
		console.log('fullSettings')
		const items = reactive({})
		const layout = reactive([])

		

		async function buttonClearAll(e){
			window.localStorage.clear();
			utils.printBrowser({text:`buttonClearAll: ${localStorage}`, whoSentYou:'settings'})
		}

		async function buttonRemove({category, key} = {}){
			utils.printBrowser({text:`buttonRemove: ${category}, ${key}, ${items[category][key].displayStyle}`, whoSentYou:'settings'})
			localStorage.removeItem(key);
			items[category][key].displayStyle = 'none'
			utils.printBrowser({text:`buttonRemove: ${key}`, whoSentYou:'settings'})
		}

		let settings = toRaw({
			user: {val:configStore().$state.user}, 
			navigation: {val:configStore().$state.navigation},
			navState: {val:configStore().$state.navState},
			toolState: {val:configStore().$state.toolState},
			tools: {val:configStore().$state.tools},
		 	current: {val:canvasStore().$state.current},
		})
		init()
		function init(){
			let arr = []
			for (let [key, val] of Object.entries(settings)) {
				arr = [...arr, ...organizeMenu({parent:key, obj:val})]
			}
			return arr
		}
		function organizeMenu({parent, obj}) {
			let arr = []
			if(!items[parent]) items[parent] = {}
			arr.push(<div style='grid-column: 1 / 11;'> <b >{parent}</b> </div>)
			for (let [key, val] of Object.entries(obj.val)) {
				if(typeof val == 'object') val = JSON.stringify(val)
				if(typeof val == 'string') val = val.replaceAll('\"', '')
				
				let type = (val == 'true' || val == 'false') ? 'bool' : 'string'
				if (type == 'bool') val = (val == 'true') ? Boolean(true) : Boolean(false)

				items[parent][key] = ({
					category: parent,
					key: key,
					value: val,
					type: type,
					displayStyle: 'block'
				})
				arr = [...arr, ...jsxPart({obj:items[parent][key], parent: parent})]
			}
			return arr
		}
		function renderStuff(){
			let arr = []
			for (let [category, categoryItems] of Object.entries(items)) {
				arr.push(<div style='grid-column: 1 / 11;'> <b >{category}</b> </div>)
				for (let [key, val] of Object.entries(categoryItems)) {
					arr = [...arr, ...jsxPart({obj:items[category][key]})]
				}
			}
			return arr
		}
		function jsxPart({obj, parent=''} = {}){
			let arrTemp = []
			let {category, key} = obj
			let styleAdd = `display:${items[category][key].displayStyle};`
			arrTemp.push(<div style={"grid-column: 1/1; text-align:left;" + styleAdd}> <button onClick={($event) => { buttonRemove(obj) }}>X</button> </div>)
			arrTemp.push(<div style={"grid-column: 2/4; text-align:left;" + styleAdd}> {obj.key}</div>)

			if(obj.type == 'string')
				arrTemp.push(
					<div style={"grid-column: 5/11; text-align:left;" + styleAdd}>
						<input type="text" value={obj.value} />
					</div>
				)
			if (obj.type == 'bool' || obj.type == 'boolean')
				arrTemp.push(
						<div style={"grid-column: 5/11; text-align:left;" + styleAdd} >
							<input type="checkbox" checked={obj.value} value={obj.value}  /> {/* {val} onChange={handleChange}*/}
						</div>
					)
			return arrTemp
		}
		return () => (
			<div class="formGrid">
				{renderStuff()}
			</div>
		)
	}
});



export const SettingsGeneral = defineComponent({
	props:['prop'],
	emit:[],
	setup(props, {emit}) {
		var sum = ref(0)
		function getLocalStorageSize(){
			sum.value = 0;
			for(var i in localStorage) {
				var amount = (localStorage[i].length * 2) / 1024 / 1024;
				sum.value += (amount)?amount:0;
			}
		}
		//const input
		return () => (
			<div style="text-align:left; border: 2px solid black; margin: 0.2ch;padding: 1ch;">
				<div class="" style="display:inline-block">
					Scale:{ utils.round(configStore().navState.scale, 2)  },
					x:{ utils.round(configStore().navState.ofs.x, 0)  },
					y:{ utils.round(configStore().navState.ofs.y, 0)  }
				</div>
				<div>
					<button onClick={getLocalStorageSize}>{(sum.value)?sum.value.toFixed(4)+' MB':'Get localStorage size'}</button>
				</div>
				<div>
					<p>
						FontSize: <input type="number" style="width:5ch; font-size:2ch; background-color:black; color:white;" value={parseInt(styleStore().app.fontSize)} onchange={($event)=>styleStore().app.fontSize=`${$event.target.value}px`}/>
					</p>
					<p>
						Hide mess: <input type="checkbox" checked={props.prop.hideMess} onChange={($event)=>props.prop.onChange('hideMess', $event.target)}/> 
					</p>
					<p>
						Save settings to browser: <input type="checkbox" checked={configStore().general.saveConfigToBrowser} onChange={($event)=>{configStore().general.saveConfigToBrowser = $event.target.checked;}}/> {Number(configStore().general.saveConfigToBrowser)}
					</p>

					
				</div>
			</div>
		)
	}
});


export const TheLists = defineComponent({
	components: { SettingsGeneral, SettingsListFull, SettingsListStorage, SettingsTree, ListComponent },
	props:[],
	emit:[],
	setup(props, {emit}) {
		function emitHandler(msg){}
		// windowStore().createNewWindow({component:'List', componentSettings:{head:['accessList']}, prop:{body:[{list:inputFields.accessList, listTemplate:objTemplate, emitHandler,}]} })
		let prop = {
			list:configStore().lists.unicode
		}
		return () => (
			<div>
				<ListComponent prop={{list:configStore().lists.unicode}} />
			</div>
		)
	}
})


export default defineComponent({
	components: { SettingsGeneral, SettingsListFull, SettingsListStorage, SettingsTree, ListComponent, TheLists },
	props:[],
	emit:[],
	setup(props, {emit}) {
		const display = reactive({
			SettingsGeneral: true,
			SettingsTree: true, 
			SettingsListFull: false, 
			SettingsListLocalStorage: false, 
			SettingsListSessionStorage: false, 
			SettingsTheLists: false,
		})
		const prop = reactive({
			onChange: (key, target)=> prop[key] = (target.type == 'checkbox') ? target.checked : target.value,
			hideMess: true,
		})
		const sessionStorageComponent = markRaw(SettingsListStorage)
		const localStorageComponent = markRaw(SettingsListStorage)

		const main = () => {
			let renderList = []
			if(!prop.hideMess) {
				renderList.push(<button onclick={()=>onClick('SettingsListFull')} class={display.SettingsListFull ? 'button-active' : 'button'}>SettingsList</button>)
				renderList.push(<button onclick={()=>onClick('SettingsListLocalStorage')} class={display.SettingsListLocalStorage ? 'button-active' : 'button'}>LocalStorage{Number(display.SettingsListLocalStorage)}</button>)
				renderList.push(<button onclick={()=>onClick('SettingsListSessionStorage')} class={display.SettingsListSessionStorage ? 'button-active' : 'button'}>SessionStorage{Number(display.SettingsListSessionStorage)}</button>)
			}
			if(display.SettingsGeneral) renderList.push(<SettingsGeneral prop={prop} />)
			if(display.SettingsTree) renderList.push(<SettingsTree prop={prop}/>)
			if(display.SettingsListFull) renderList.push(<SettingsListFull />)
			if(display.SettingsListSessionStorage) renderList.push(<sessionStorageComponent storage={sessionStorage} storageType={'sessionStorage'} />)
			if(display.SettingsListLocalStorage) renderList.push(<localStorageComponent storage={localStorage} storageType={'localStorage'} />)
			if(display.SettingsTheLists) renderList.push(<TheLists />)
			function onClick(comp){
				display[comp] =! display[comp]
				console.log('onClick', display[comp], comp)
			}
			return (
				<div>
					<button onclick={()=>onClick('SettingsGeneral')} class={display.SettingsGeneral ? 'button-active' : 'button'}>SettingsGeneral</button>
					<button onclick={()=>onClick('SettingsTree')} class={display.SettingsTree ? 'button-active' : 'button'}>SettingsTree</button>
					{/* <button onclick={()=>onClick('SettingsTheLists')} class={display.SettingsTheLists ? 'button-active' : 'button'}>SettingsTheLists</button> */}
					{renderList}
				</div>
			)
		}
		return () => main()
	},
});



</script>


<style >

.button{
	background-color: gray;
}

.button-active{
	background-color: aquamarine;
}

.test-class {
	background-color: blue;
}

/* <style scoped> */

.formContainer {
	width: fit-content
}

.formGrid {
	display: grid;
	column-gap: 1ch;
	/* grid-template-columns: repeat(auto-fills, 50px);  */
	/* grid-template-columns: repeat(auto-fit, 50px); */
	grid-template-columns: repeat(10, minmax(10px, 1fr));
	border: solid 1px rgb(99, 10, 10);
}
</style>


