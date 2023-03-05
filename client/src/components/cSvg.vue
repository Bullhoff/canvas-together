p




<script lang="jsx">

//import SocketioService from './../socketio.service.js';
import { canvasStore, styleStore, configStore } from "@/stores/store.js";
import { h, onMounted, onBeforeMount, watch, onUpdated, nextTick, ref, reactive, toRef, toRefs, defineEmits, computed } from 'vue'
import { defineComponent } from 'vue';
import _ from 'lodash';
import FormData from 'form-data'
import * as utils from '@/utils.js'


export const Arrow = defineComponent({
	emit: ['onClick', 'onHover'],
	props: ['text', 'active', 'propStyle'],
	setup(props, aa) {
		let { emit } = aa
		const refs = reactive({
			rect: null,
			text: null,
		})
		const onClick = () => emit('onClick', 'yeaaa')
		return () => (
			/* viewBox="0 0 100 30" */
			<svg preserveAspectRatio="none" width='100%' height='100%' viewBox="0 0 2 2" style=" box-sizing: content-box;object-fit: contain;margin: 0; padding: 0;justify-self: start;">
				<polygon points="0,2 1,0 2,2" style="box-sizing: content-box;" class="arrow"/>
			</svg>
		)

	},
});

export const Button = defineComponent({
	emit: ['onClick', 'onHover'],
	props: ['text', 'active', 'propStyle', 'amountBadge', 'image'],
	setup(props, aa) {
		let { emit } = aa
		const refs = reactive({
			rect: null,
			text: null,
		})
		const styleDefault = {
			rect: {
				rx: '10%',
				ry: "35%",
				//minWidth: 'min-content',
				//minWidth: '19ch',
				width: '100%',
				//width: '10ch',
				height: '100%',
				fill: 'black',
				stroke: 'green',
				strokeWidth: '0px',
			},
			text: {
				/* x: "50%", 
				y: "50%",  */
				fill: "red",
				stroke: "green",
				strokeWidth: "0.2px",
				textAnchor: "middle",
				dominantBaseline: "central",
				fontSize: "100%",
			},
		}
		const highlightDefault = {
			rect: {
				fill: 'yellow',
				stroke: 'green',
				strokeWidth: '5.5px',
				/* strokeWidth: '5.5px', */
			},
			text: {
				fill: 'red',
				stroke: "green",
				strokeWidth: "1.2px",
			},
		}
		const hoverDefault = {
			rect: {
				fill: 'green',
				stroke: 'red',
				strokeWidth: '5.5px',
			},
			text: {
				fill: 'white',
				//stroke: "green",
				strokeWidth: "0.5px",
			},
		}
		const eventStyle = reactive([])
		//typeof props.amountBadge == 'object')
		const amountBadge = computed(() => {
			if(Array.isArray(props.amountBadge))
				return props.amountBadge.length
			else if(typeof props.amountBadge == 'object')
				Object.keys(props.amountBadge).length
			else props.amountBadge
		})

		onBeforeMount(() => { })
		onMounted(() => {
			eventStyle[0] = _.merge(styleDefault, props.propStyle?.default)
			eventStyle[1] = _.merge(highlightDefault, props.propStyle?.highlight)
			eventStyle[2] = _.merge(hoverDefault, props.propStyle?.hover)
			let styleIndex = (props.active) ? Number(props.active) : 0
			Object.assign(refs.rect?.style, eventStyle[styleIndex]?.rect)
			if(refs.text)
				Object.assign(refs.text?.style, eventStyle[styleIndex]?.text)
		})
		onUpdated(() => {
			let styleIndex = (props.active) ? Number(props.active) : 0
			Object.assign(refs.rect?.style, eventStyle[styleIndex]?.rect)
			if(refs.text)
			Object.assign(refs.text?.style, eventStyle[styleIndex]?.text)

		})


		const onMouseEnter = () => {
			Object.assign(refs.rect.style, eventStyle[2]?.rect)
			if(refs.text)
				Object.assign(refs.text.style, eventStyle[2]?.text)
		}
		const onMouseLeave = () => { //emit('onHover') 
			let styleIndex = (props.active) ? Number(props.active) : 0
			Object.assign(refs.rect.style, eventStyle[styleIndex]?.rect)
			if(refs.text)
				Object.assign(refs.text.style, eventStyle[styleIndex]?.text)
		}
		const onClick = () => emit('onClick', 'yeaaa')
		const imageRender = () => {
			if(!props.image) return
			return(	<image href={props.image} height="100%" width="100%" />)
		}
		const badgeRender = () => {
			if(!props.amountBadge) return
			return(<text x="60%" y="40%" font-size="1.2ch" fill="red">{props.amountBadge.length}</text>)
		}
		const textRender = () => {
			if(!props.text) return
			return(<text ref={(el) => refs.text = el} x="50%" y="50%" style={styleDefault.text}>{props.text}</text> )
		}
		return () => (
			<svg width='100%' height='100%' class="prevent-select" onclick={onClick} onmouseenter={onMouseEnter} onmouseleave={onMouseLeave}>
				<rect ref={(el) => refs.rect = el} style={styleDefault.rect} /> {/* style={style.rect} */}	{/* style={style.default.rect}    eventStyle[0].rect*/}
				{imageRender()}
				{textRender()}
				{badgeRender()}
			</svg>
		)

	},
});

/* <text ref={(el) => refs.text = el} x="50%" y="50%" style={styleDefault.text}>{props.text}</text> */

{/* style={style.text} */} {/* {props.text} */}












// rx="10%" ry="35%" width='100%' height='100%'
// text x="50%" y="50%" fill="red" stroke="green" stroke-width="0.2px" text-anchor="middle" dominant-baseline="central" font-size="100%"

{/* <svg  width='100%' height='100%' class="prevent-select" onclick={onClick} onmouseenter={onMouseEnter} onmouseleave={onMouseLeave}>
				<rect ref={(el)=>refs.rect=el} rx="10%" ry="35%" width='100%' height='100%' style={eventStyle[0].rect} /> 
				<text ref={(el)=>refs.text=el} x="50%" y="50%" fill="red" stroke="green" stroke-width="0.2px" text-anchor="middle" dominant-baseline="central" font-size="100%" style={eventStyle[0].text}>{props.text}</text> 
			</svg> */}

/* 
<svg viewBox="0 0 100 30" width='100%' height='100%' class="prevent-select" onclick={onClick} onmouseenter={onMouseEnter} onmouseleave={onMouseLeave}>
				<rect ref={(el)=>refs.rect=el} rx="10%" ry="35%" width='100%' height='100%' style={style.rect} />
				<text ref={(el)=>refs.text=el} x="50%" y="50%" fill="red" stroke="green" stroke-width="0.2px" text-anchor="middle" dominant-baseline="central" font-size="100%" style={style.text}>{props.text}</text>
			</svg>
*/
/* onmouseover={onMouseOver} onmouseout={onMouseOut} onmouseenter={onMouseEnter} onmouseleave={onMouseLeave} */
/* class="prevent-select svg-button" */

/* const onMouseOver = () => { //emit('onHover') 
			//style.rect.fill = "blue"
		}
		const onMouseOut = () => { //emit('onHover') 
			console.log('style 1', style, styleDefault)
			//style = reactive({...styleDefault})
			//Object.assign(styleDefault, style)
			Object.assign(style, styleDefault)
			console.log('style 2', style, styleDefault)
			//style.rect.fill = "red"
		} */

/* return () => (
<div style="width:12ch; height:4ch;" >
	<svg viewBox="0 0 100 30" width='100%' height='100%' class="prevent-select" onclick={onClick} onmouseenter={onMouseEnter} onmouseleave={onMouseLeave}>
		<rect ref={(el)=>refs.rect=el} rx="10%" ry="35%" width='100%' height='100%' style={style.rect} />
		<text ref={(el)=>refs.text=el} x="50%" y="50%" fill="red" stroke="green" stroke-width="0.2px" text-anchor="middle" dominant-baseline="central" font-size="100%" style={style.text}>{props.text}</text>
	</svg>
</div>) */

export default defineComponent({
	components: {},
	setup() {
		const conf = reactive(configStore())
		//const un = toRefs(configStore().userName)
		//watch(() => (configStore().user.username), (username) => {	})
		/* watch(()=>{	}) */

		// <button onClick={() => { }}></button>
		return () => main2()
	},
});





/* <div style="width:12ch; height:4ch;" @click="display.testCss =! display.testCss">
				<svg viewBox="0 0 100 30" width='100%' height='100%' class="prevent-select svg-button">
					<rect rx="10%" ry="35%" width='100%' height='100%' fill="black" stroke="green" stroke-width="0.2px" />
					<text x="50%" y ="50%" fill="red" stroke="green" stroke-width="0.2px" text-anchor="middle" dominant-baseline="central"	font-size="100%" >TestCss</text>
				</svg>
			</div> */




/* export const HelloWorld = defineComponent({
	render() {
		return (
			<div>
				squeeky
			</div>
		);
	},
}); */

</script>


<style scoped>
/* .svg-button text:hover,
rect:hover {
	fill: green;
} */




.test-class {
	background-color: blue;
}


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

/* .formGrid div{ */
/* display: inline-grid; */
/* } */

/* .col-full-row{ */
/* grid-column:  1 /  11; */
/* display: inline-grid; */
/* display: flex;
	flex-direction: row; */
/* display: inline-grid; */
/* display: grid;
	grid-template-columns: repeat(auto-fit, auto-fit); */
/* }
.col1{ */
/* grid-column: 1 / 10; */
/* grid-column:  1 /  5; */
/* background-color: aqua; */
/* } */
/* .col2{ */
/* grid-column: 5 / 10; */
/* grid-column:  5 / 11; */
/* background-color:blue; */
/* display: flex;
	flex-direction: row; */
/* grid-template-columns: repeat(auto-fit, 50px); */
/* display: inline-grid; */

/* } */




/* .wrapper {
  display: grid;
  grid-template-columns: repeat(12, [col-start] 1fr);
  gap: 20px;
}

.item1 {
  grid-column: col-start / span 3;
}
.item2 {
  grid-column: col-start 6 / span 4;
  grid-row: 1 / 3;
}
.item3 {
  grid-column: col-start 2 / span 2;
  grid-row: 2;
}
.item4 {
  grid-column: col-start 3 / -1;
  grid-row: 3;
} */
</style>


