p




<script lang="jsx">
import { canvasStore, styleStore, configStore, windowStore } from "@/stores/store.js";
import { h, onMounted, onBeforeMount, watch, onUpdated, nextTick, ref, reactive, toRef, toRefs } from 'vue'
import { defineComponent } from 'vue';

import SocketioService from './../socketio.service.js';
import FormData from 'form-data'
import * as utils from '@/utils.js'
import _ from 'lodash';
import { ListComponent } from '@/components/Components.vue'




export default defineComponent({
	components: {ListComponent},
	setup() {
		const conf = reactive(configStore())
		//const un = toRefs(configStore().userName)
		watch(() => (configStore().user.username), (username) => {
			console.log('configStore().user.username', configStore().user.username)
			inputFields.owner = `${conf.user.username}`
			inputFields.layerName = `${conf.user.username}_default`
			inputFields.accessList = `${configStore().user.username}: 'owner';`
			inputFields.accessListCanvas = `${configStore().user.username}: 'owner';*:*;`
		})
		const list = reactive([])
		
		const bool = reactive({
			radioParent:false,
			radioParentType:false,
		})

		const resObj = reactive({test1:null, test2:null})

		
		const inputFields = reactive({
			file: '', 
			fileName: '',

			owner: `${configStore().user.username}`,
			category: '',
			group: '',

			canvasName: '', 
			layerName: `${conf.user.username}_default`, 
			
			/* accessList: reactive([
				{username: 'Hans', access:'owner'}, 
				{username: 'Hans2', access:'view'}, 
				{group_id: 'Hans Fan Club', access:'view'}, 
			]), */
			//accessList: `${configStore().user.username}: 'owner';`,
			accessList: reactive([
				{username: configStore().user.username, access:'owner'}, 
				{username: 'Hans2', access:'edit'},
				{username: 'Hans3', access:'view'},
			]),
			accessListCanvas: reactive([
				{username: configStore().user.username, access:'owner'}, 
				{username: '*', access:'view'},
			]),

			licenceAttribution: ``,
			maxDrawSize: 10,
		})

		function fileSelected(e) {
			console.log('fileSelected', e.target.files[0], e.target, e)
			inputFields['file'] = e.target
			if (inputFields['file'] && inputFields['file'].files[0]) {
				inputFields['fileName'] = e.target?.files[0]?.name
				inputFields.canvasName = inputFields['file'].files[0].name.split(/\.(?=[^\.]+$)/)[0]
			}
		}
		async function createNewCanvas(properties, history = [], background=false) {
			return await utils.axiosPost({
				url: 'postNewCanvas', obj: { properties, history, background }
			})
		}

		async function sendPictureSqlite({} = {}){
			if(!inputFields['file']?.files || !inputFields['file']?.files[0]) return
			const dataForm = new FormData()
			dataForm.append('img', inputFields['file'].files[0])
			dataForm.append('properties', JSON.stringify({
				canvas_name: inputFields['canvasName'],
				background_type: 'picture_file',
				picture_file: inputFields['fileName'],
				owner: inputFields['owner'], 
				accessList: inputFields.accessList, 
				licenceAttribution: inputFields.licenceAttribution, 
			}))
			let canvasProperties = await utils.axiosPost({ url: 'new-canvas', dataForm: dataForm })
			resObj.test1 = canvasProperties
			if(!canvasProperties) return console.log('!canvasProperties', canvasProperties)
			return canvasProperties
		}
		async function createCanvasSqlite({background_type='none'} = {}){
			const dataForm = new FormData()
			dataForm.append('properties', JSON.stringify({
				canvas_name: inputFields['canvasName'],
				background_type: background_type,
				//picture_file: inputFields['fileName'],
				owner: inputFields['owner'], 
				accessList: inputFields.accessList
			}))
			let canvasProperties = await utils.axiosPost({ url: 'new-canvas', dataForm: dataForm })
			return canvasProperties
		}
		async function createLayerSqlite(argObj){
			let properties = {
				...{
					canvas_id: canvasStore().current.canvas_id,
					layer_name: inputFields['layerName'], //'background', 
					//canvas_id: inputFields['canvasName'], //canvasStore().current.canvas_id,
					type: 'draw',
					owner: configStore().user.username, 
					accessList: inputFields.accessListCanvas, 
					history: []
				},
				...argObj
			}
			
			properties = await utils.axiosPost({
				url: 'new-layer', obj: { properties,  }
			})
			return properties
		}
		async function buttonSave(e){
			let properties
			if(bool.radioParent == 'newParent' && bool.radioParentType == 'file') {
				properties = await sendPictureSqlite()
				SocketioService.socket.emit('parent:add', properties);
				//console.log('PROPERTIES 1', properties)
				properties = await createLayerSqlite({canvas_id: properties.canvas_id, layer_name: 'background',  type: 'background', history: [{ type: 'drawImage', x: 0, y: 0, w: null, h: null }]})
				//console.log('PROPERTIES 2', properties)
				properties = await createLayerSqlite({canvas_id: properties.canvas_id,})
				//console.log('PROPERTIES 3', properties)
				canvasStore().changeParent({canvas_id:properties.canvas_id, layer_id:properties.layer_id})
			}
			if(bool.radioParent == 'newParent'  && bool.radioParentType == 'none') {
				properties = await createCanvasSqlite({background_type:'transparent'})
				SocketioService.socket.emit('parent:add', properties);
				//await createLayerSqlite({canvas_id: properties.canvas_id, layer_name: 'background', type: 'background', })

				properties = await createLayerSqlite({canvas_id: properties.canvas_id,})
				canvasStore().changeParent({canvas_id:properties.canvas_id, layer_id:properties.layer_id})
			}
			if(bool.radioParent == 'sameParent'){
				properties = await createLayerSqlite()
				SocketioService.socket.emit('canvas:add', { canvas_id: properties.canvas_id, layer_id: properties.layer_id, arr: [], properties });
				canvasStore().changeCanvas({layer_id: properties.layer_id})
			} 
			//SocketioService.socket.emit('canvas:add', { canvas_id: properties.canvas_id, layer_id: properties.layer_id, arr: [], properties });
			//canvasStore().current.canvas_id = properties.canvas_id
			//canvasStore().current.layer_id = properties.layer_id
			
		}
		
		function buttonCancel(){

		}


		const styleGridColumn = (from=1, to=1) => `grid-column:${from}/${to};`

		const radio = ({type='radio', style='', styleItem1='width:2ch;', name='', id='', label='', disabled=false}={}) => {return (
				<div style={"display:inline-grid;"+style}>
					<input type={type} name={name} id={id} value={id} style={"grid-column:1/1;"+styleItem1+'justify-self: right;'}
						onClick={($event) => {
							bool[$event.target.name] = $event.target.value
							console.log('onClick - ', $event.target.value, $event.target)
							}}
						onChange={($event) => {
							if($event.target.type == 'file') fileSelected($event)
							if($event.target.id == 'sameParent') inputFields['canvasName'] = canvasStore().current.parent
							console.log('onChange - ', $event.target.value, $event.target, bool, inputFields)
						}}
						disabled={disabled}/>
					<label for={id} style="grid-column:2/2; justify-self: left;">{label}</label>
				</div>
		)}	/* {required?styleRequired:''} */
		const input_field = ({type='text', style='', value='', name='', id='', text='', title=null,disabled=false, styleItem1='', styleItem2='', required=false}={}) => {return (
					<input type={type} name={name} id={id} value={value} style={style} title={title}
						onChange={($event) => {
							inputFields[$event.target.id] = $event.target.value
							console.log('onChange - ', $event.target.id, $event.target.value, $event.target, bool, inputFields)
						}}
						disabled={disabled}/>
		)}
		
		var objTemplate = {active:'bool', username:'string', group_id:'string', access: ['owner','edit','view'], Clone: 'button', Remove: 'button'}	// , 'co-owner'
		var testList = reactive([
			{username: 'Hans', access:'owner'}, 
			{username: 'Hans2', access:'view'}, 
			{group_id: 'Hans Fan Club', access:'view'}, 
		])
		//inputFields.accessList = JSON.stringify(testList)
		var testList2 = reactive([{name: 'abc2'}, {name: 'abcdef2'}, {name: 'abceeqqrdef2'}])
		function emitHandler(msg){
			console.log('emitHandler 1', inputFields.accessList, msg)
			inputFields.accessList = msg
			console.log('emitHandler 2', inputFields.accessList)
		}
		function onClick(action){
			if(action == 'accessListParent')
				windowStore().createNewWindow({component:'List', componentSettings:{head:['accessList']}, prop:{body:[{list:inputFields.accessList, listTemplate:objTemplate, emitHandler,}]} })
			if(action == 'accessListChild')
				windowStore().createNewWindow({component:'List', componentSettings:{head:['accessListCanvas']}, prop:{body:[{list:inputFields.accessListCanvas, listTemplate:objTemplate, emitHandler}]} })
		}
		let styleRequired = 'background-color: yellow;'
		const testFields = () =>{ return
			if(!configStore().general.debug) return 
			return (
				<div style='grid-column: 1 / 4;'>
					<button style='grid-column: 1 / 11;' onClick={($event)=>{sendPictureSqlite()}}>Test1</button>
					<textarea id="w3review" name="w3review" rows="7" cols="1" style='grid-column: 1 / 11; resize: both; overflow: hidden;'>
						{JSON.stringify(resObj.test1, null, 2)}
					</textarea>
					
					<button style='grid-column: 1 / 11;' onClick={($event)=>{createCanvasSqlite()}}>Test2</button>
					<textarea id="w3review" name="w3review" rows="7" cols="1" style='grid-column: 1 / 11; resize: both; overflow: hidden;'>
						{JSON.stringify(resObj.test2, null, 2)}
					</textarea>
				</div>
			)
		}
		const main2 = () => {
			return (
			<div class="formContainer">
				<div class="formGrid">
					{/* RADIO - Parent New or Same */}
					{/* {radio({style:styleGridColumn(1,5), name:'radioParent', id:'newParent', label:'New Canvas'})}
					{radio({style:styleGridColumn(6,11), name:'radioParent', id:'sameParent', label:'Same Canvas'})} */}
					{radio({style:styleGridColumn(2,4), name:'radioParent', id:'newParent', label:'New Canvas'})}
					{radio({style:styleGridColumn(5,11), name:'radioParent', id:'sameParent', label:'New Layer (Same Canvas)'})}
					<hr style='grid-column: 1 / 11;'></hr>

					{/* RADIO - Parent Source */}
					{radio({style:styleGridColumn(2,3), name:'radioParentType', id:'file', label:'File', disabled:bool.radioParent=='sameParent'})}
					{radio({style:styleGridColumn(3,6), name:'radioParentType', id:'link', label:'Link', disabled:bool.radioParent=='sameParent' || true,})}
					{radio({style:styleGridColumn(6,8), name:'radioParentType', id:'none', label:'None', disabled:bool.radioParent=='sameParent'})}
					<hr style='grid-column: 1 / 11;'></hr>
					
					{/* file */}
					{/* {radio({style:styleGridColumn(1,11), type:'file', name:'fileName', styleItem1:'', 
						disabled:bool.radioParent!='newParent'||bool.radioParentType!='file'})} */}
					<input type='file' name={inputFields.file} id={inputFields.file} style='grid-column: 1 / 10;'
						onChange={($event) => {	fileSelected($event) }}
						disabled={bool.radioParent!='newParent'||bool.radioParentType!='file'}/>

					{/* TEXT - Current Parent */}
					{/* {text({style:styleGridColumn(1,11), text:canvasStore().current.parent})} */}
					
					{/* Owner */}
					<p style='grid-column: 1 / 4;'>Owner</p>
					{input_field({style:'grid-column: 4/10;', type:'text', value:inputFields.owner, id:'owner', text:'Owner', 
						disabled:true})}

					{/* Category */}
					<p style='grid-column: 1 / 4;'>Category</p>
					{input_field({style:'grid-column: 4/10;', type:'text', value:inputFields.category, id:'category', text:'Category', 
						disabled:true})}
					<button style='grid-column: 10/10;' id='' onClick={($event)=>{}}>+</button>

					{/* Group */}
					<p style='grid-column: 1 / 4;'>Group</p>
					{input_field({style:'grid-column: 4/10;', type:'text', value:inputFields.group, id:'group', text:'Group', 
						disabled:true})}
					<button style='grid-column: 10/10;' id='' onClick={($event)=>{}}>+</button>

					{/* Parent Name */}	{/* style:'grid-column: 4/10;'+styleRequired */}
					<p style='grid-column: 1 / 4;'>Canvas Name</p>
					{input_field({style:'grid-column: 4/10;', type:'text', value:inputFields.canvasName, id:'canvasName', text:'Canvas Name', required:true, 
						disabled:bool.radioParent=='sameParent'})}
					<button style='grid-column: 10/10;' id='getCurrentcanvasName' onClick={($event)=>{inputFields.canvasName=canvasStore().current.parent}}>*</button>
					
					{/* Canvas Name */}	{/* style:'grid-column: 4/10;'+styleRequired */}
					<p style='grid-column: 1 / 4;'>Layer Name</p>
					{input_field({style:'grid-column: 4/10;', type:'text', value:inputFields.layerName, id:'layerName', text:'Layer Name', 
						disabled:false})}
					<button style='grid-column: 10/10;' id='getCurrentlayerName' onClick={($event)=>{inputFields.layerName=canvasStore().current.id}}>*</button>

					{/* Access List PARENT */}
					<p style='grid-column: 1 / 4;'>Access List (Canvas)</p>
					{input_field({style:'grid-column: 4/10;', type:'text', value:JSON.stringify(inputFields.accessList), id:'accessList', text:'Access List', 
						disabled:bool.radioParent!='newParent'})}
					<button style='grid-column: 10/10;' id='getCurrentlayerName' onClick={($event)=>onClick('accessListParent')}>*</button>
						
					{/* Access List CHILD */}
					<p style='grid-column: 1 / 4;'>Access List (Layer)</p>
					{input_field({style:'grid-column: 4/10;', type:'text', value:JSON.stringify(inputFields.accessListCanvas), id:'accessListCanvas', 
						disabled:false})}
					<button style='grid-column: 10/10;' id='getCurrentlayerName' onClick={($event)=>onClick('accessListChild')}>*</button>
					{/* Credit */}
					<p style='grid-column: 1 / 4;' title='Enter credit attribution according to licence'>Licence attribution</p>
					{input_field({style:'grid-column: 4/10;', type:'text', value:inputFields.licenceAttribution, id:'licenceAttribution', title: 'Enter credit attribution according to licence',
						disabled:bool.radioParent!='newParent'})}

					
					<br />
					<button style='grid-column: 1 / 5;' onClick={($event)=>{buttonSave()}}>Save</button>
					<button style='grid-column: 5 / 11;' onClick={($event)=>{buttonCancel()}}>Cancel</button>
					
					{testFields()}
				</div>
				{list}
			</div>
		)}
		return () => main2()
	},
});



</script>


<style scoped>

.test-class{
	background-color: blue;
}


.formContainer{
	width:100%;
	/* background-color: blue; */
	/* width:fit-content; */
	/* max-width:50%; */
}

.formGrid{
	/* width:fit-content; */
	display: grid;
	column-gap: 1ch;
	/* grid-template-columns: repeat(auto-fills, 50px);  */
	/* grid-template-columns: repeat(auto-fit, 50px); */
	grid-template-columns: repeat(10, minmax(10px, 1fr));
    border: solid 1px rgb(99, 10, 10);
}

</style>


