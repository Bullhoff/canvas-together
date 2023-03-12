
<template>
	<!-- <div id="menu-container" style="z-index:9999"> -->
		<!-- style="z-index:1;" -->
		<div id="menu-container" >
			

			<span title="Create new canvas or layer">
				<div style="display:inline; width:fit-content;" :ref="(el)=>someStore().list.newCanvas.ref=el">
					<Svg.Button style="width:3ch; height:3ch;" 
						@onClick="windowStore().createNewOrUnminimize({component:'TheFormCreate'})" 
						@click.middle="windowStore().createNewWindow({component:'TheFormCreate'})"
						@contextmenu.prevent="contextMenu($event, ['create', 'modify', 'overview'])"
						:amountBadge="windowStore()?.windowListComponentKey['TheFormCreate']"
						:text="'&#x2795;'"  />
				</div>
			</span>

			<!-- <Suspense> 
				<template #fallback>
					Loading...
				</template>
			</Suspense> -->
			<!-- <div style="display:inline; width:fit-content;" :ref="(el)=>someStore().list.newCanvas.ref=el">
				<Svg.Button style="width:3ch; height:3ch;" 
					@onClick="windowStore().createNewOrUnminimize({component:'TheFormCreate'})" 
					@click.middle="windowStore().createNewWindow({component:'TheFormCreate'})"
					:amountBadge="windowStore()?.windowListComponentKey['TheFormCreate']"
					:text="'&#x2795;'"  />
			</div> -->
			<span title="Modify">
				<div style="display:inline;" :ref="(el)=>someStore().list.edit.ref=el">
					<Svg.Button style="width:3ch; height:3ch;" 
						@click.left="windowStore().createNewOrUnminimize({component:'TheFormModify'})" 
						@click.middle="windowStore().createNewWindow({component:'TheFormModify'})"
						@contextmenu.prevent="contextMenu($event, ['create', 'modify', 'overview'])"
						:amountBadge="windowStore()?.windowListComponentKey['TheFormModify']"
						:text="'&#x1f511;'"  />
				</div>
			</span>
					
		<div class="menu-group">
			<div style="display:inline;" :ref="(el)=>someStore().list.canvas.ref=el">
				<Dropdown2 
					propName="Canvas/Parent"
					titleContainer="Canvas List"
					:settings="{titleContainer:'Draw size', titleArrowUp:'Increase', titleArrowUp:'Decrease', arrowHoldDelay: 300, arrowHoldSpeed:100, editable:false, containerWidthMode:'adjustContainerWidth'}"
					:parts="{dropdownArrow:true, selectedSpinner: false, moveItemSpinner:false, remove:true}"
					:propStyle="{container:{width:'15ch'},list:{mixWidth:'15ch', width:'fit-content'}, itemRow:{}}"
					:list="canvasStore().parentListComputed2"
					:selected="canvasStore().parentListComputed[canvasStore().current.canvas_id]?.canvas_name"
					valueType="string"
					:increment=0.5
					:limits="{min:0.5, max:20}"
					@selected="(canvasStore().changeParent({canvas_id:$event}))"
					@click-middle="openInNewTab($event)"
					@remove="removeParent($event)" 
				/>
			</div>
				
			<div style="display:inline;" :ref="(el)=>someStore().list.layer.ref=el"> 
				<Dropdown2 
					propName="Layer"
					titleContainer="Layer List"
					:settings="{titleContainer:'Draw size', titleArrowUp:'Increase', titleArrowUp:'Decrease', arrowHoldDelay: 300, arrowHoldSpeed:100, editable:false, containerWidthMode:'adjustContainerWidth'}"
					:parts="{dropdownArrow:true, selectedSpinner: false, moveItemSpinner:true, hide:true, remove:true,}"
					:propStyle="{container:{width:'18ch'},list:{width:'min-content'}, itemRow:{}}"
					:list="canvasStore().canvasOrder.map((x)=>{return{id:x.layer_id, name:x.layer_name, ...x}})"
					:selected="canvasStore().canvasList[canvasStore().current.layer_id]?.layer_name"
					:state="canvasses.canvasState"
					@move-up="canvasStore().moveCanvasPrio({layer_id:$event, direction:'up'})"
					@move-down="canvasStore().moveCanvasPrio({layer_id:$event, direction:'down'})"
					@selected="(canvasStore().changeCanvas({layer_id:$event}))"
					@remove="removeCanvas($event)" 
					@hide="canvasses.canvasState[$event].hidden = !canvasses.canvasState[$event].hidden; canvasStore().queue.push({event:'redraw', id:$event})"
					valueType="string"
					:increment=0.5
					:limits="{min:0.5, max:20}"
					@increase="configStore().toolState.drawSize += 1"
					@decrease="configStore().toolState.drawSize -= 1"
				/>
			</div>
		</div>

		<div class="cursor-default menu-group" style="display:inline-block; " @contextmenu.prevent="" title="Reset Zoom">
			<Svg.Button style="width:3ch; height:3ch;"  :text="'🔍'" :active="false" @contextmenu.prevent="contextMenu($event, 'scale')"
				@onClick="canvasStore().queue.push({event:'resetZoom'})" 
				:propStyle="{default:{rect:{fill:'none'}}, highlight:{rect:{fill:'yellow'}}}" />
		</div>
		
		
		<div class="cursor-default menu-group" style="display:inline-block; " @contextmenu.prevent=""  :ref="(el)=>someStore().list.tools.ref=el">
				<span title="Nav">
					<Svg.Button style="width:3ch; height:3ch;"  :text="'&#x270a;'" :active="conf.toolState.toolActive=='nav'" :class="{ highlighted: conf.toolState.toolActive == 'nav', notHighlighted: conf.toolState.toolActive != 'nav' }" 
						@onClick="conf.toolState.toolActive = 'nav'" 
						:propStyle="{default:{rect:{fill:'none'}}, highlight:{rect:{fill:'yellow'}}}" />
				</span>
				<span title="Pencil">
					<Svg.Button style="width:3ch; height:3ch;"  :text="'&#x270f;&#xfe0f;'" :active="conf.toolState.toolActive=='pencil'" :class="{ highlighted: conf.toolState.toolActive == 'pencil', notHighlighted: conf.toolState.toolActive != 'pencil' }" 
						@onClick="conf.toolState.toolActive = 'pencil'" 
						:propStyle="{default:{rect:{fill:'none'}}, highlight:{rect:{fill:'yellow'}}}" />
				</span>
				<span title="Eraser">
					<Svg.Button style="width:3ch; height:3ch;"  :text="'&#9003;'" :active="conf.toolState.toolActive=='eraser'" :class="{ highlighted: conf.toolState.toolActive == 'eraser', notHighlighted: conf.toolState.toolActive != 'eraser' }" 
						@onClick="conf.toolState.toolActive = 'eraser'"
						:propStyle="{default:{rect:{fill:'none'}}, highlight:{rect:{fill:'yellow'}}}" />
				</span>
				<span title="Unicode">
					<Svg.Button style="width:3ch; height:3ch;cursor:help;" :text="String.fromCodePoint(`0x${conf.tools.unicode.code}`)"  :class="{ highlighted: conf.toolState.toolActive == 'unicode', notHighlighted: conf.toolState.toolActive != 'unicode' }"
						@onClick="conf.toolState.toolActive = 'unicode'"
						@click.middle="windowStore().createNewWindow({component:'unicode'})"
						@contextmenu.prevent="windowStore().createNewOrUnminimize({component:'unicode'})"	 
						:propStyle="{default:{rect:{fill:'none'}}, highlight:{rect:{fill:'yellow'}}}" 
						:amountBadge="windowStore()?.windowListComponentKey['unicode']"/>
				</span>
				<span title="Pictures">
					<Svg.Button style="width:3ch; height:3ch;cursor:help;" :text="null"  :class="{ highlighted: conf.toolState.toolActive == 'picture', notHighlighted: conf.toolState.toolActive != 'picture' }"
						@onClick="conf.toolState.toolActive = 'picture'"
						@click.middle="windowStore().createNewWindow({component:'picture'})"
						@contextmenu.prevent="windowStore().createNewOrUnminimize({component:'picture'})"	 
						:propStyle="{default:{rect:{fill:'none'}}, highlight:{rect:{fill:'yellow'}}}" 
						:amountBadge="windowStore()?.windowListComponentKey['picture']"
						:image="configStore().picturesPath+configStore().lists.pictureList[configStore().tools.picture.name].file"
						/>
				</span>
				
		</div>

		
		
		
		<div class="menu-group">
			<div :ref="(el)=>someStore().list.size.ref=el">
			<Dropdown2 
				titleContainer="Draw size"
				titleArrowUp="Increase"
				titleArrowDown="Decrease"
				:settings="{titleContainer:'Draw size', titleArrowUp:'Increase', titleArrowUp:'Decrease', arrowHoldDelay: 300, arrowHoldSpeed:100, containerWidthMode:'adjustFontSize'}"
				:prop-style="{list:{width:'5ch'}}"
				:list="drawSizeList"
				:selected=configStore().toolState.drawSize
				
				valueType="float"
				:increment=0.5
				:limits="{min:0.5, max:20}"
				@increase="configStore().toolState.drawSize += 1"
				@decrease="configStore().toolState.drawSize -= 1"
				@selected="(configStore().toolState.drawSize = $event)"
			/>
			</div>
		</div>

		
		<div class="menu-group" :ref="(el)=>someStore().list.colors.ref=el">
			<ColorPicker
				:color-list="configStore().lists.colors"
				:active-color-index="Number(configStore().toolState.activeColor)"
				@setActiveIndex="(configStore().toolState.activeColor = $event)" />
		</div>

		

		<div class="cursor-default menu-group" style="display:inline-block" v-if="configStore().general.debug">
			<Dropdown2 
					propName="Action"
					titleContainer="Action"
					:settings="{changeSelectedTextOnSelect:false, titleContainer:'Draw size', titleArrowUp:'Increase', titleArrowUp:'Decrease', arrowHoldDelay: 300, arrowHoldSpeed:100, editable:false, containerWidthMode:'adjustContainerWidth'}"
					:parts="{dropdownArrow:true, selectedSpinner: false, moveItemSpinner:false}"
					:propStyle="{container:{width:'15ch'},list:{width:'min-content'}}"
					:list="(['Reset Zoom', ...windowStore().windowNames])"
					:listObject="windowStore().windowListComponentKey"
					selected="Action"
					@selected="(
						($event == 'Reset Zoom') ? canvasStore().queue.push({event:'resetZoom'}) : 
						windowStore().createNewOrUnminimize({component:$event})
					)"
				/>
		</div>

		
		<div class="cursor-default menu-group" 
			:ref="(el)=>store().statusMessage.ref=el"
			:title="store().statusMessage.tooltip"
			style="display:none; color:red; border: 1px solid red; border-radius:5px; text-shadow: 0 0 3px #FF0000;	box-shadow: 0px 0px 4px #FF0000;"
			@click=""
			>
			{{store().statusMessage.msg}}
		</div>

		
			<div class="cursor-default menu-group">
				<span title="Pizza companion">
					<Svg.Button style="width:3ch; height:3ch;cursor:help;" :text="null"  :class="{ highlighted: conf.toolState.toolActive == 'picture', notHighlighted: conf.toolState.toolActive != 'picture' }"
						@onClick="windowStore().createNewOrUnminimize({component:'PizzaCompanion'})"
						@click.middle="windowStore().createNewWindow({component:'PizzaCompanion'})"
						@contextmenu.prevent=""	 
						:amountBadge="windowStore()?.windowListComponentKey['PizzaCompanion']"
						:propStyle="{default:{rect:{fill:'none'}}, highlight:{rect:{fill:'yellow'}}}" 
						:image="configStore().picturesPath+configStore().lists.pictureList['Kebabpizza'].file"
						:active="false"
						/>
				</span>
				<!-- <Svg.Button style="width:3ch; height:3ch;cursor:help;" :text="null"  :class="{ highlighted: conf.toolState.toolActive == 'picture', notHighlighted: conf.toolState.toolActive != 'picture' }"
					@onClick="configStore().pizzaCompanion.open =! configStore().pizzaCompanion.open"
					@click.middle=""
					@contextmenu.prevent=""	 
					:propStyle="{default:{rect:{fill:'none'}}, highlight:{rect:{fill:'yellow'}}}" 
					:tooltip="'Pizza companion'"
					:image="configStore().picturesPath+configStore().lists.pictureList['Kebabpizza'].file"
					/> -->
				
				<span title=""></span>
				<Svg.Button style="width:3ch; height:3ch;" 
					@onClick="windowStore().createNewOrUnminimize({component:'ActualPopup'})" 
					@click.middle="windowStore().createNewWindow({component:'ActualPopup'})"
					:amountBadge="windowStore()?.windowListComponentKey['ActualPopup']"
					:text="String.fromCodePoint('0x'+'2753')" 	
					:class="{ highlighted: conf.toolState.toolActive == 'nav', notHighlighted: conf.toolState.toolActive != 'nav' }"
					:active="isExpired"
					 />

					 <span title=""></span>
				<Svg.Button style="width:3ch; height:3ch;" 
					@onClick="windowStore().createNewOrUnminimize({component:'TheWindowHandler'})" 
					@click.middle="windowStore().createNewWindow({component:'TheWindowHandler'})"
					:amountBadge="windowStore()?.windowListComponentKey['TheWindowHandler']"
					:text="'&#128471;'" 	 />

					<span title=""></span>
				<Svg.Button style="width:3ch; height:3ch;" 
					@onClick="windowStore().createNewOrUnminimize({component:'debug'})" 
					@click.middle="windowStore().createNewWindow({component:'debug'})"
					:amountBadge="windowStore()?.windowListComponentKey['debug']"
					:text="'&#128030;'" 	 />

					
				<span :ref="(el)=>someStore().list.settings.ref=el" title="Settings">
					<Svg.Button style="width:3ch; height:3ch;" 
						@onClick="windowStore().createNewOrUnminimize({component:'Settings'})" 
						@click.middle="windowStore().createNewWindow({component:'Settings'})"
						:amountBadge="windowStore()?.windowListComponentKey['Settings']"
						text="&#9881;&#65039;"	 />
				</span>

				<span title=""></span>
				<div :ref="(el)=>someStore().list.login.ref=el">
					<Dropdown
						:options="['Login', 'Logout', '&#129372;']"
						:default="configStore().user.username+'&#x1f511;'"
						:settings="{ closeOnSelect: true, tooltipActive:true, tooltipText:'Login' }"
						:parts="{ name: true }"
						@input="($event=='Login') ? windowStore().createNewOrUnminimize({component:'login'}) : null" />
				</div>
				
			</div>
			
			
	</div>

</template>


<script setup>
import SocketioService from './../socketio.service.js';
import { canvasStore, styleStore, configStore, windowStore, refs, contextMenuStore, someStore, store } from "@/stores/store.js";
import { defineComponent, onMounted, onBeforeMount, onUpdated, nextTick, ref, reactive, computed } from 'vue'

import Dropdown from '@/components/cDropdown.vue'
import ColorPicker from '@/components/cColorPicker.vue'
import Dropdown2 from '@/components/cDropdown2.vue'
import * as Svg from './../components/cSvg.vue'
import * as utils from './../utils.js'

//const emit = defineEmits(["reset-zoom", "test-emit"])
const conf = reactive(configStore());
const canvasses = reactive(canvasStore());


const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

const drawSizeList = Array.from({length:20}).map((_, i) =>  i);

function unnamedMiddleWareDashIshThatWillLiveInWindowStore(component, {tooltip=null, rightClickFunction}={}){
	return {
		type: 'function', 
		tooltip: tooltip,
		clickLeft: ()=>windowStore().createNewOrUnminimize({component}), 
		clickMiddle: ()=>windowStore().createNewWindow({component}), 
		clickRight: (rightClickFunction)? ()=>rightClickFunction() : '', 
	}
}

function contextMenu(e, val){
	let items = {
		//defaultItem: '',
	}
	if(val.includes('scale')) items = {...items,
		['🔍'+' Scale to 1']: ()=> refs().TheZoom.resetZoom({},1),
		['🔍'+' Zoom to fit image']: ()=> refs().TheZoom.resetZoom({mode:'scaleToFit'}), 
		['🔍'+' Zoom to fill screen']: ()=> refs().TheZoom.resetZoom({mode:'scaleToFill'}),
	}
	if(val.includes('create')) items['Create new canvas or layer'] = unnamedMiddleWareDashIshThatWillLiveInWindowStore('TheFormCreate', {rightClickFunction:()=>console.log('right click')});
	if(val.includes('modify')) items['Modify current canvas or layer'] = unnamedMiddleWareDashIshThatWillLiveInWindowStore('TheFormModify', {})
	if(val.includes('overview')) items['Overview'] = unnamedMiddleWareDashIshThatWillLiveInWindowStore('TheOverview', {})
	
	contextMenuStore().onContextMenu(e, items)
}

function openInNewTab(url){
	console.log('window', window.location.origin, url)
	url = `${window.location.origin}/?canvas_id=${url}`
	window.open(url, '_blank', 'noreferrer');
}



function removeParent(e) {
	console.log('removeCanvas', e)
	if (confirm(`u sure? \n\r This will delete "${e}" and all its layers`) == true) {
		SocketioService.socket.emit('parent:remove', { parent: e, canvas_id:e });
	}
}

function removeCanvas(e) {
	console.log('removeLayer', e)
	if (confirm(`u sure? \n\r This will delete "${e}"`) == true) {
		SocketioService.socket.emit('canvas:remove', { canvas_id: canvasStore().current.canvas_id, layer_id: e });
	}
}

const isExpired = computed(()=>{
	let latestMessageDate = (store().popup_notes_read) ? store().popup_notes_read-10 : true 
	return latestMessageDate > store().popup_notes_read
})


onBeforeMount(() => {})
onMounted(() => {})



</script>


<style scoped>
#menu-container{
	position: relative;
	display:flex;
	width: 100%;
	background-color: #000000;
	height: 3ch;
	/* overflow-x: hidden; */
	/* overflow-x:visible; */
	white-space: nowrap;
}
#menu-container > div:last-child {
  margin-left: auto;
}

.menu-group{
	position: relative;
	display: inline-flex;
	flex-direction: row;
	padding: 0ch 2ch 0ch 2ch;
	/* z-index: 9999999999; */
	/* border: 1px solid red; */
	/* border-right: 1px solid rgb(0, 0, 0);
	border-left: 1px solid rgb(0, 0, 0); */
	/* border-right: 1px solid;
	border-left: 1px solid; */

}

</style>


