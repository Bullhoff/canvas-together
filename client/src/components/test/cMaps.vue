<template>
	<!-- -- -->
	<div id="map" ref="divRef" style="z-index: 1;" :style="teststyle"/>
	<!-- -- -->
</template>

<script setup>
import { defineComponent, watch, toRefs, watchEffect, onMounted, onBeforeMount, onBeforeUnmount, onUpdated, nextTick, ref, reactive } from 'vue'
//import "leaflet/dist/leaflet.css"
//import markerIcon from "leaflet/dist/images/marker-icon-2x.png"
//import markerIconShadow from "leaflet/dist/images/marker-shadow.png"
//import L from "leaflet"
//import { Icon, Map, TileLayer, Marker, Circle, Control } from "leaflet"
//import type { GeoResult } from "@/lib/api"
/* import Zoom from 'ol/control/Zoom.js';
import Control from 'ol/control/Control.js';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js'; */

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import Stamen from 'ol/source/Stamen';
import VectorLayer from 'ol/layer/Vector';
import Vector from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Overlay from 'ol/Overlay';
import {fromLonLat, toLonLat} from 'ol/proj';
//import sync from 'ol-hashed';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import {circular} from 'ol/geom/Polygon';
import Point from 'ol/geom/Point';
import Control from 'ol/control/Control';
import * as olProj from 'ol/proj';
import XYZ from 'ol/source/XYZ';

import { canvasStore, styleStore, configStore } from "@/stores/store.js";
const style = styleStore();
const canvasses = reactive(canvasStore());	// canvasStore().currentCanvas	// store.currentCanvas	// canvasName	// canvasHistory
const conf = reactive(configStore());

const props = defineProps({
	zoomprop: {
		type: Number,
		required: false,
		default: 2,
	},
})

const zoomValue = ref(props.zoomprop)

const divRef = ref(null)

const teststyle = reactive({
	zIndex:1
})

watch(zoomValue, (value)=>{
	console.log('!!!!!!!!!!!zoomValue!!!!!!!!!!!!', value)
})


/* watch(()=>conf.canvasState.scale, (scale)=>{
	console.log('!!!!!!!!!!!conf.canvasState.scale!!!!!!!!!!!!', scale, conf.canvasState.scale)
	testView.setZoom(conf.canvasState.scale)
}) */
watch(()=>configStore().canvasState.scale, (scale)=>{
	console.log('!!!!!!!!!!!configStore().canvasState.scale!!!!!!!!!!!!', scale, configStore().canvasState.scale)
	testView.setZoom(configStore().canvasState.scale)
})
//testView.setZoom(conf.canvasState.scale)
/* const myControl = new Control({element: myElement}); */
/* const searchResultSource = new Vector();
const searchResultLayer = new VectorLayer({
  source: searchResultSource
});

searchResultLayer.setStyle(new Style({
  image: new Circle({
    fill: new Fill({
      color: 'rgba(255,255,255,0.4)'
    }),
    stroke: new Stroke({
      color: '#3399CC',
      width: 1.25
    }),
    radius: 15
  })
}));

var ZoomLayer = new ZoomLayer({
  layer: searchResultLayer,
  colName: 'SearchLayer',
  zoom: 10,
  collapsed: true,
  map: Map,
  zoomTo: layer(5,xy)
}); */
const searchResultSource = new Vector();
const searchResultLayer = new VectorLayer({
  source: searchResultSource
});

var testView = reactive(new View({
			center: [0, 0],
			//zoom: zoomValue.value,
			zoom: 3,
		}))

var map = new Map()
onMounted(async () => {
	/* Control.defaults({
		zoomOptions: {
			className: "ol-zoom my-new-class-name"
		}
	}) */
	console.log('**************---------------**************',props.zoomprop)
	/* map.target = 'map'
	map.layers = [
			new TileLayer({
				source: new OSM(),
			}),
		]
	map.view = new View({
			center: [0, 0],
			zoom: zoomValue.value,
			//zoom: 2,
		}), */
	
	//const map = new Map({
	const map = new Map({
		target: 'map',
		layers: [
			searchResultLayer,
			new TileLayer({
				source: new OSM(),
			}),
		],
		view: testView,
		/* view: new View({
			center: [0, 0],
			zoom: zoomValue.value,
			//zoom: 2,
		}), */
	});
	/* map.getView().fit(searchResultSource.getExtent()); */

	/* Zoom.get() */

	setTimeout(() => {
		console.log("Delayed for 1 second.");
		teststyle.zIndex=1
		zoomValue.value += 5
		/* map.view.zoom = zoomValue.value */
		console.log('map', map)
		console.log('map.values_', map.values_)
		console.log('map.values_.view', map.values_.view)
		console.log('map.values_.view.zoomFactor_', map.values_.view.zoomFactor_)
		//map.values_.view.zoomFactor_ = zoomValue.value*5
		console.log('map.values_.view.zoomFactor_', map.values_.view.zoomFactor_)
		console.log('testView',testView)
		/* testView.zoom = zoomValue.value */
		//testView.set('zoom', zoomValue.value)
		console.log('conf.canvasState.scale', conf.canvasState.scale) 
		testView.setZoom(conf.canvasState.scale)
	}, "2000")


})



</script>

<style scoped>
/* @import "node_modules/ol/ol.css"; */

#map {
	height: 90vh;
	width: 90vw;
	/* height: 2000px; */
	position: absolute;
	top: 0;
	bottom: 0;
	

}

/* @media (prefers-color-scheme: dark), (prefers-color-scheme: no-preference) {
	div {
	  filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
	}
} */
</style>