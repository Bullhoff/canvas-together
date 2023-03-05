<script lang="jsx">


import { canvasStore, styleStore, configStore, store } from "@/stores/store.js";
import { h, onMounted, onBeforeMount, watch, onUpdated, nextTick, ref, reactive, toRef, toRefs, defineEmits, computed } from 'vue'
import { defineComponent } from 'vue';
import _ from 'lodash';

import FormData from 'form-data'
import * as utils from '@/utils.js'
import { windowStore } from "../stores/windowStore";
import TreeView from "@/components/cTreeView.vue";

// cTreeView

export default defineComponent({
	components: {},
	setup() {
		return () => (<div></div>)
	},
});

export const Comp = defineComponent({
	components: [],
	emit: ['emit-handler'],
	props: [],
	setup(props, { emit }) {
		onBeforeMount(() => { })
		onMounted(() => {})
		onUpdated(() => {})
		return () => (<div></div>)
	}
})

export const Messages = defineComponent({
	emit: [],
	props: [],
	setup(props, {emit}) {
		let message = ref(`aa`)
		function prepareRow(queueRow, i){
			let key = i
			let value
			if (typeof queueRow == 'object' && !Array.isArray(store().messageQueue[i]))
				[key, value] = Object.entries(queueRow)[0]
				
			value = (typeof value == 'object') ? JSON.stringify(value, null, 2) : value
			
			return {key, value}
		}
		let styles = reactive([])
		function entryRow(){
			let rows = []
			for (let i = 0; i < store().messageQueue.length; i++) {
				let {key, value} = prepareRow(store().messageQueue[i], i)
				styles[i] = {
					width: '20ch'
				}
				let style = reactive({
					textarea:{
						display: 'inline-block',
						width: '20ch'
					},
				})
				const onClick = () => {
					console.log('onClick', i, styles)
					style.textarea.width = '50ch'
					styles[i].width = '50ch'
				}
				rows.push(
					<div>
						<button style="position: sticky; left:0px;" onclick={onClick}>{key}</button>
						<textarea rows="1" cols="1" style={styles[i]}>
							*{value}*
						</textarea>
					</div>
				)
			}
			return rows
		}
		return () => (
		<div style='width:100%; height:100%; '>
			<button>Clear</button>
			<textarea id="w3review" name="w3review" rows="7" cols="1" style='width:100%; height:100%; resize: both; box-sizing: border-box;'>
				{message.value}
			</textarea>
			{entryRow()}
		</div>)
	}
})

export const ListComponent = defineComponent({
	emit: [],
	props: ['list', 'prop'],
	setup(props, {emit}) {
		console.log('ListComponent', props.list, props.prop)
		let list = reactive(props?.prop?.list)
		
		let listTemplate = (props?.prop?.listTemplate) ? props?.prop?.listTemplate : []
		let emptyRow =  []
		
		for (const [key, value] of Object.entries(list[0])) {
			if(!listTemplate) listTemplate[key] = ''
			emptyRow[key] = ''
		}
		
		function buttonAdd(obj = {name:'new'}){
			console.log('template1', emptyRow)
			list.push(JSON.parse(JSON.stringify(emptyRow)))
		}
		function buttonClone(obj){
			list.push(JSON.parse(JSON.stringify(obj)))
		}
		function buttonRemove(index){
			list.splice(index, 1)
		}
		function onClick(action, index, obj = {name:'new'}){
			console.log('onClick', action, list)
			if(action == 'add')
				list.push(obj)
			if(action == 'clone')
				list.push(obj)
			if(action == 'remove')
				list.splice(index, 1)
		}

		function renderFieldList(template, val){
			console.log('renderFieldList', template)
			let tempList = []
			for (let i = 0; i < template.length; i++) {
				tempList.push( <option value={template[i]}> {template[i]} </option> )
			}
			return tempList
		}
		function onChange(event, index, key, value){
			if(event.target.type == 'checkbox') 
				list[index][key] = event.target.checked
			else
				list[index][key] = event.target.value
		}
		function  renderFields(obj, index){
			let tempList = []
			if(index==0){
				for (const [key, value] of Object.entries(listTemplate)) {
					tempList.push(<div><p style="font-size:1ch;"> {key} </p></div>)
				}
			}
			for (const [key, value] of Object.entries(listTemplate)) {
				if(Array.isArray(value)){
					tempList.push(
						<select name="pets" id="pet-select" value={obj[key]} title={key+": "+value} onchange={(e)=>onChange(e, index, key, obj[key])} >
							{value.map((el, i) => <option value={el}> {el} </option> )}
						</select>
					)
				}
				else if(value == 'button'){
					if(key == 'Clone') tempList.push(<button onclick={()=>buttonClone(list[index])} title="Clone">+</button>)
					if(key == 'Remove') tempList.push(<button onclick={()=>buttonRemove(index)} title="Remove">-</button>)
				}
				else if(value == 'bool') {
					let boolVal = (obj[key] == 'on') ? true : (obj[key] == 'off') ? false : obj[key]
					tempList.push(<input type="checkbox" value={obj[key]} checked={obj[key]} onchange={(e)=>onChange(e, index, key, obj[key])} />)
				}
				else if(value == 'string')
					tempList.push(<input type="text" title={key+": "+value} value={obj[key]} onchange={(e)=>onChange(e, index, key, obj[key])} />)
					
			}
			return tempList
		}
		function renderList(){
			console.log('ListComponent', list)
			let tempList = []
			for (let i = 0; i < list.length; i++) {
				tempList.push( renderFields(list[i], i))
			}
			return tempList
			
		}
		const gridColumns = Object.keys(listTemplate).length
		const styleGrid = `display:grid; grid-template-columns: repeat(${gridColumns}, auto);`
		return () => (
			<div style={"text-align:left; min-width=fit-content; white-space: nowrap;"}>
				<button onclick={()=>buttonAdd()} title="Add Empty">Add</button>
				<div style={styleGrid} key="">
					{renderList()}
				</div>
				
			</div>
		)
	},
});

export const TestTree = defineComponent({
	components: [],
	emit: [],
	props: [],
	setup(props, { emit }) {
		const obj = reactive(store().getSettings())
		onBeforeMount(() => {})
		onMounted(() => {})
		onUpdated(() => {})
		function onChange(e){}
		function emitHandler(e){}
		/* emitHandler={emitHandler} onchange={onChange}*/
		watch(obj,()=>{	})
		return () => (<div>
			<TreeView obj={obj}  />
		</div>)
	}
})



export const TheWindowHandler = defineComponent({
	emit: [],
	props: [],
	setup(props, { emit }) {
		onBeforeMount(() => { })
		onMounted(() => {})
		onUpdated(() => {})

		const onMouseEnter = () => {}
		const onMouseLeave = () => {}
		const onClick = (key, value) => {}

		const splitColumns = (value) => {
			for (const [key, value] of Object.entries(windowStore().windows)) {}
		}
		const listIt = () => {
			let list = []
			list.push(<div style="border-bottom: 1px solid #fff; padding:0.1ch">X</div>)
			list.push(<div style="border-bottom: 1px solid #fff; padding:0.1ch">👁</div>)
			for (const [rowId, rowObj] of Object.entries(windowStore().windows[Object.keys(windowStore().windows)[0]])) {
				list.push(<div style="border-bottom: 1px solid #fff; padding:0.1ch">{rowId}</div>)
			}
			for (const [rowId, rowObj] of Object.entries(windowStore().windows)) {
				list.push(<button onclick={()=>windowStore().func.close(rowId)}>X</button>)
				list.push(<button onclick={()=>windowStore().func.minimize(rowId)}>👁</button>)
				for (const [key, value] of Object.entries(rowObj)) {
					if(!value) 
						list.push(<div>-</div>)
					else 
						list.push(<div style="border: 1px solid rgba(254,254,254,0.2); padding:0.1ch">{JSON.stringify(value)}</div>)
				}
			}
			return list
		}
		let firstKey = Object.keys(windowStore().windows)[0]
		let length = Object.keys(windowStore().windows[firstKey]).length
		const styleGrid = `text-align:left; display: grid; grid-template-columns: repeat(${length+2}, auto);`
		return () => (
			<div style={styleGrid}>
				{listIt()}
			</div>
		)

	},
});
/* onclick={()=>onClick(key, value)}  */
/* style="display:inline-block;" */
/* className={`${value.file == configStore().tools.picture.file ? "highlighted" : "notHighlighted"}`} */

export const ThePictureMenu = defineComponent({
	emit: ['onClick', 'onHover'],
	props: ['text', 'active', 'propStyle'],
	setup(props, { emit }) {
		onBeforeMount(() => { })
		onMounted(() => {})
		onUpdated(() => {})
		//watch(props.active,(active)=>{ console.log('props.active', props, props.active, active) })

		const onMouseEnter = () => {}
		const onMouseLeave = () => {}
		const onClick = (key, value) => {
			//console.log('picture.onClick 1', arguments)
			configStore().tools.picture.name = key;
			configStore().tools.picture.file = value.file; 
			configStore().toolState.toolActive = 'picture';
			//console.log('picture.onClick 2', configStore().toolState.toolActive, configStore().tools.picture, )
		}
		
		const listCategoryItems = (categoryItems) => {
			let list = []
			for (const [key, value] of Object.entries(categoryItems)) {
				list.push(
					<div style="display:inline-block;" onclick={()=>onClick(key, value)}
						className={`${value.file == configStore().tools.picture.file ? "highlighted" : "notHighlighted"}`} >
						<img src={configStore().picturesPath+value.file} alt="" style="width:64px;height:64px;" />
					</div>
				)
			}
			return list
		}
		
		const listCategory = (categoryItems) => {
			let link = categoryItems[Object.keys(categoryItems)[0]]?.attribution?.link
			if(link) return (
				<div style="font-size:1.5ch;text-align: left;"><a href="link" target="_blank" >{categoryItems[Object.keys(categoryItems)[0]]?.attribution?.link}</a> </div>
			)
			else return (
				<div style="font-size:1.5ch;text-align: left;"><p >{categoryItems[Object.keys(categoryItems)[0]]?.category}</p> </div>
			)
		}
		//canvasStore().parentList.reduce((a, v) => ({ ...a, [v.canvas_id]: v}), {})
		/* const parentListCategories = computed(()=>{
			//return Object.entries(configStore().lists.pictureList).reduce((a, v) => ({ ...a, [v.category]: v}), {})
			return Object.entries(configStore().lists.pictureList).reduce((a, [key, value]) => {
				console.log('v', value, '\t*', a)
				if(!a[value.category]) a[value.category] = {}
				let obj = {}
				return ({ ...a, [value.category][key]: value})
			}, {})
		}) */
		const listIt = () => {
			let list = []
			let pictureList = {}
			Object.entries(configStore().lists.pictureList).map(([key, value])=>{
				if(!pictureList[value.category]) pictureList[value.category] = {}
				pictureList[value.category][key] = value
			})
			for (const [category, categoryItems] of Object.entries(pictureList)) {
				list.push(
					<div style="border: 1px solid blue;">
						{listCategory(categoryItems)}
						{listCategoryItems(categoryItems)}
					</div>
				)
			}
			return list
		}
		return () => (
			<div>
				{listIt()}
			</div>
		)

	},
});




</script>