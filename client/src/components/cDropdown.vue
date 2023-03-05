<template >
	<div class="dropdown" :tabindex="tabindex" @blur="onBlur()"	:style="[style.container]">
		<div class="selected" :class="{ open: open }" @click="open = !open"	:style="[style.input]"	placeholder="" style="">
			<div v-if="settings.tooltipActive" style="position:absolute; width:100%;height: 100%;" :title="settings.tooltipText"></div>
			<div style="display:inline-block;">
				<template v-if="default">{{ default }}</template>
				<template v-else>&#8205;</template>
			</div>
		</div>

		<div class="items" :class="{ selectHide: !open }">
			<div
				:style="[style.itemRow, state[option]?.listStyle]" v-for="(option, i) of options" :key="i"
				:class="{ grayed: state[option]?.hidden }">
				<template v-if="!state[option]?.archived">

					<p v-if="parts.name" class="name"
						@click="buttonSelect(option)"
						@click.middle="emit('click-middle', option)"
						:style="[style.itemName]">
						{{ option }}
					</p>
					<p v-if="parts.hide" class="toggleShow"
						@click="emit('hide', option)"
						:style="[style.itemHide]">
						&#128065;
					</p>
					<p v-if="parts.remove && option != 'img'" class="remove"
						@click="buttonRemove(option)"
						:style="[style.itemCancel]">
						X
					</p>
					<p v-else-if="option == 'img'"
						:style="[style.itemCancel]" class="remove" style="opacity:0;">
						X
					</p>

					<div v-if="parts.spinner" style="font-size:1ch;text-align:left;margin: 0; padding: 0;"	>
						<div style="width:100%; text-align:start; box-sizing: content-box; margin: 0; padding: 0;"
							@click="emit('move-up', option)">&#9650;</div>
						<div style="width:100%; text-align:start; box-sizing: content-box; margin: 0; padding: 0;"
							@click="emit('move-down', option)">&#9660;</div>
					</div>

				</template>
			</div>
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
//import { utils } from '../../../server2/src/utils';
import Spinner from '@/components/cSpinner.vue'
// const props = defineProps({
// const props = defineProps(toRefs({
// const props = defineProps(reactive({
const props = defineProps({
	options: {
		type: Array,
		default: [],
		required: true,
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
	parts: {
		type: Object,
		required: false,
		default: {
			name: true,
			hide: true,
			remove: true, 
			spinner: true,
		},
	},
	settings: {
		type: Object,
		required: false,
		default: {
			closeOnSelect: true, 
			tooltipActive: true, 
			tooltipText: 'bla'
		},
	}
	
	/* width: {
		type: Text,
		required: false,
		default: '10ch',
	} */

})
const emit = defineEmits(['input', 'toggleHidden', 'remove', 'new', 'hide', 'move-up', 'move-down', 'click-middle'])

const focused = ref(false)
// https://vuejs.org/api/reactivity-utilities.html#toref
/* var selected = ref(props.default
	? props.default
	: props.options.length > 0
		? props.options[0]
		: null) */
var open = ref(false)

var isActive = true
const defaultParts = {
	name: true,
	hide: true,
	remove: true
}
const defaultSettings = {
	closeOnSelect: true, 
	tooltipActive: true, 
	tooltipText: 'blawwww'
}
const settings = reactive(Object.assign(defaultSettings, props.settings));
const defaultStyle = {
	container: {
		maxWidth: '20ch',
		width: '10ch',
		display: 'inline-block',
	},
	input: {
		height: '100%'
	},
	itemRow: {
		display: 'grid',
		minWidth: '10ch',
		/* gridTemplateColumns: '10fr 1fr auto  auto auto', */
		gridTemplateColumns: '10fr auto auto  auto auto',
		gap: '1ch',
		height:'3ch',
		/* clear: 'left', */
	},
	itemName: {},
	itemCancel: {},
	itemHide: {},
}

var style = reactive({
	...defaultStyle,
	...props.propStyle
});

style.container = {
	...defaultStyle.container,
	...props.propStyle.container
}

function onFocus(){
	console.log('onFocus')
	focused.value = true
}
function onBlur(){
	if(!focused.value)
		open.value = false
}


function buttonNew(option) {
	emit('new', option)
	if (props.settings.closeOnSelect && close != false)
		open.value = false
}
function buttonSelect(option, close = true) {
	emit('input', option)
	if (props.settings.closeOnSelect && close != false)
		open.value = false
}
function buttonRemove(option) {
	emit('remove', option)

}

function setStyle() {
	let widths = []
	for (let i = 0; i < props.options?.length; i++) {
		widths.push(props.options[i].length)
	}
	defaultStyle.itemName.width = `${Math.max(...widths) + 2}ch`
	defaultStyle.container.width = `${Math.max(...widths) * 2}ch`

	style = reactive({
		...defaultStyle,
		...props.style
	});
	//console.log('!!!!!!setStyle!!!!!!!!!!!!!', Math.max(...widths), defaultStyle, style, props.style)
}

onMounted(() => {
	setStyle()
})



</script>



<style scoped>

.arrow{
	stroke:rgb(243, 10, 2);
	stroke-width:0.2;
	fill: #1f00ec;
    opacity: 0.5;
}
.arrow:hover{
	fill: #ec008c;
    opacity: 1.0;
}

.grayed {
	opacity: 0.3
}

.test {
	/* display:inline; */
	/* display:block; */
	display: inline-block;
	position: relative;
}

.test-fade {
	color: 'gray'
}

.test-fade-not {
	color: 'red'
}

.dropdown {
	/* display: inline-block;  */
	/* display: inline-block;
	z-index: 9999;
	position: relative; */
	/* width: fit-content; */
	/* width: 20ch; */
	/* width: 100%; */
	/* position: 'relative'; */
	text-align: left;
	/* outline: none; */
	/* height: 3ch; */
	/* line-height: 3ch; */
	/* background-color: #ad8225; */
	/* height: 47px; */
	/* line-height: 47px; */
}

.dropdown .selected {
	/* position: relative; */
	/* position: absolute; */
	background-color: #0a0a0a;
	border-radius: 6px;
	border: 1px solid #666666;
	color: #fff;
	padding-left: 1em;
	cursor: pointer;
	user-select: none;

	height: 100%;
	/* height: 4ch; */
	/* min-height: 3ch; */
	/* background-color: #7c46f0; */
}

.dropdown .selected.open {
	border: 1px solid #ad8225;
	border-radius: 6px 6px 0px 0px;
}

.dropdown .selected:after {
	position: absolute;
	content: "";
	/* top: 22px; */
	top: 1.3ch;
	right: 0.5em;
	width: 0;
	height: 0;
	border: 5px solid transparent;
	border-color: #fff transparent transparent transparent;
}

.dropdown .items {
	color: #fff;
	border-radius: 0px 0px 6px 6px;
	overflow: hidden;
	border-right: 1px solid #ad8225;
	border-left: 1px solid #ad8225;
	border-bottom: 1px solid #ad8225;
	position: absolute;
	background-color: #0a0a0a;
	/* left: 0;
  right: 0; */
	z-index: 999;
	/* width: 50ch; */



	/* width: 50vw; */
	/* position: relative; */
	/* left: calc(-50vw + 50%); */
	/* left: 50%;
  right: 50%; */
	/* margin-left: -50vw;
  margin-right: -50vw; */


}

/* .dropdown .items div{ */
/* display: grid;
	grid-template-columns: 10fr 1fr 1fr;
 */
/* } */
/* .name{
	display: inline;
}
.remove{
	display: inline;
	align-self: right;
	align-items: right;
} */
/* <p class="name">{{ option }}</p>
			<p class="remove">X</p> */

.dropdown .items div {
	color: #fff;
	padding-left: 1em;
	/* cursor: pointer; */
	user-select: none;
}

.dropdown .items div p:hover {
	background-color: #ad8225;
}
.dropdown .items div div div:hover {
	background-color: #03f4a0;
}

/* .dropdown .items div:hover {
  background-color: #ad8225;
} */

.selectHide {
	display: none;
}
</style>