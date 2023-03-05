

<template>
	<div>
		<!-- Test2 -->

		<!-- <button @click="()=>display.testCss =! display.testCss">TestCss</button>
		<template v-if="display.testCss">
			<TestCss />
		</template>
		
		<button @click="()=>display.testCompiler =! display.testCompiler">TestCompiler</button>
		<template v-if="display.testCompiler">
			<TestCompiler />
		</template>

		<template v-if="display.test0General">
			<Test0General />
		</template> -->

		<!-- <div class="menu" style="
			position: relative;
			display: inline-flex;
			flex-direction: row;
			padding: 0ch 2ch 0ch 2ch;
		" >
			<input type="radio" id="html" name="fav_language" value="HTML">
  			<label for="html">HTML</label>
			<input type="radio" id="html" name="fav_language" value="HTML">
  			<label for="html">HTML</label>
			
			<input type="radio" id="html" name="fav_language" value="HTML" style="order: 2;">
  			<label for="html" style="order: 1;">HTML</label>

			  
			<label> 
				Name:
				<input type="text" name="name" />
			</label>


			


		</div> -->

		<!-- preserveAspectRatio="none" -->
		<!-- <div class="menu" style="display: inline-flex;">
			
			<div style="width:12ch; height:4ch;" @click="display.testCss =! display.testCss">
				<svg viewBox="0 0 100 30" width='100%' height='100%' class="prevent-select svg-button">
					<rect rx="10%" ry="35%" width='100%' height='100%' fill="black" stroke="green" stroke-width="0.2px" />
					<text x="50%" y ="50%" fill="red" stroke="green" stroke-width="0.2px" text-anchor="middle" dominant-baseline="central"	font-size="100%" >TestCss</text>
				</svg>
			</div>
			<div style="width:12ch; height:4ch;" @click="display.test0General =! display.test0General">
				<svg viewBox="0 0 100 30" width='100%' height='100%' class="prevent-select svg-button" >
					<rect rx="10%" ry="35%" width='100%' height='100%' fill="black" stroke="green" stroke-width="0.2px" />
					<text x="50%" y ="50%" fill="red" stroke="green" stroke-width="0.2px" text-anchor="middle" dominant-baseline="central"	font-size="100%" >Test0General</text>
				</svg>
			</div>
			<div style="width:12ch; height:4ch;" @click="display.testCompiler =! display.testCompiler">
				<svg viewBox="0 0 100 30" width='100%' height='100%' class="prevent-select svg-button">
					<rect rx="10%" ry="35%" width='100%' height='100%' fill="black" stroke="green" stroke-width="0.2px" />
					<text x="50%" y ="50%" fill="red" stroke="green" stroke-width="0.2px" text-anchor="middle" dominant-baseline="central"	font-size="100%" >TestCompiler</text>
				</svg>
			</div>
			<div style="width:12ch; height:4ch;" @click="display.testRegex =! display.testRegex">
				<svg viewBox="0 0 100 30" width='100%' height='100%' class="prevent-select svg-button">
					<rect rx="10%" ry="35%" width='100%' height='100%' fill="black" stroke="green" stroke-width="0.2px" />
					<text x="50%" y ="50%" fill="red" stroke="green" stroke-width="0.2px" text-anchor="middle" dominant-baseline="central"	font-size="100%" >TestRegex</text>
				</svg>
			</div>

		</div> -->
		<!-- <div style="display: inline-flex; background-color: darkgray; width:2ch;height: 2ch;">
			<p>■</p>
			<p>▬</p>
			<p>▮</p>
			<p>◯</p>
		</div> -->
		<!-- <div style="display: inline-flex; background-color: gray; width:2ch;height: 2ch;">
			<p>◯</p>
		</div> -->

		<div style="display: inline-flex;">
			<Svg.Button style="width:12ch; height:4ch;" @onClick="display.testCss =! display.testCss" :text="'TestCss'" :active="display.testCss"/>
			<Svg.Button style="width:12ch; height:4ch;" @onClick="display.testCss2 =! display.testCss2" :text="'TestCss2'" :active="display.testCss2"/>
			<Svg.Button style="width:12ch; height:4ch;" @onClick="display.testCss3Tree =! display.testCss3Tree" :text="'TestCss3Tree'" :active="display.testCss3Tree"/>
			<Svg.Button style="width:12ch; height:4ch;" @onClick="display.test0General =! display.test0General" :text="'Test0General'" :active="display.test0General"/>
			<Svg.Button style="width:12ch; height:4ch;" @onClick="display.testCompiler =! display.testCompiler" :text="'TestCompiler'" :active="display.testCompiler"/>
			<Svg.Button style="width:12ch; height:4ch;" @onClick="display.testRegex =! display.testRegex" :text="'TestRegex'" :active="display.testRegex"/>
		</div>

		<!-- <div class="menu" style="display: inline-flex;">
			<button @click="()=>display.testCss =! display.testCss">TestCss</button>
			<button @click="()=>display.test0General =! display.test0General">Test0General</button>
			<button @click="()=>display.testCompiler =! display.testCompiler">TestCompiler</button>
			<button @click="()=>display.testCompiler2 =! display.testCompiler2">TestCompiler2</button>
			<button @click="()=>display.testRegex =! display.testRegex">TestRegex</button>
		</div> -->

		
		<TestCss v-if="display.testCss"/>
		<TestCss2 v-if="display.testCss2"/>
		<TestCss3Tree v-if="display.testCss3Tree" />
		<TestCompiler v-if="display.testCompiler"/>
		<TestCompiler2 v-if="display.testCompiler2"/>
		<Test0General v-if="display.test0General"/>
		<TestRegex v-if="display.testRegex" />

		
		
		
		
		


		<!-- <Maps /> -->
		<!-- <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Spas_vsederzhitel_sinay_%28cropped%29.jpg" crossorigin="anonymous" /> -->
	</div>
</template>

<script setup>

import TestCss from './../components/test/cTestCss.vue'
import TestCss2 from './../components/test/cTestCss2.vue'
import TestCss3Tree from './../components/test/cTestCss3Tree.vue'
import TestCompiler from './../components/test/cTestCompiler.vue'
import TestCompiler2 from './../components/test/cTestCompiler2.vue'
import Test0General from './../components/test/cTest0General.vue'
import TestRegex from './../components/test/cTestRegex.vue'
import * as Svg from './../components/cSvg.vue'



//import { onMounted } from 'vue';
import { defineComponent, watch, toRefs, toRef, watchEffect, onMounted, onBeforeMount, onBeforeUnmount, onUpdated, nextTick, ref, reactive } from 'vue'

/* http://athom-light-15w-rgbct-dfb57b.local/ */
/* 192.168.0.53 */
/* http://192.168.0.53 */

import axios from 'axios';
import * as utils from "./../utils.js"

const display = reactive({
	testCss: false, 
	testCss2: false, 
	testCss3Tree: false, 
	testCompiler: false, 
	test0General: false, 
	testRegex: false
})

function testFunction(e){
	console.log('e',e)
}


onMounted(() => {})



</script>

<style >

.menu{
	background-color: rgba(67, 18, 18, 0.25);
}

.svg-button text:hover,rect:hover{
	fill:green;
}

</style>
