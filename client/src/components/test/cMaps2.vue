<template>
	--
	<div id="map" ref="divRef" style="" />
	--
  </template>
  
  <script setup>
  import { defineComponent, watch, toRefs, watchEffect, onMounted, onBeforeMount, onBeforeUnmount, onUpdated, nextTick, ref, reactive } from 'vue'
  import "leaflet/dist/leaflet.css"
  //import markerIcon from "leaflet/dist/images/marker-icon-2x.png"
  //import markerIconShadow from "leaflet/dist/images/marker-shadow.png"
  import L from "leaflet"
  //import { Icon, Map, TileLayer, Marker, Circle, Control } from "leaflet"
  //import type { GeoResult } from "@/lib/api"
  const props = defineProps({
  })
 
  const divRef = ref(null)
  
  onMounted(async () => {
	var map = L.map('map').setView([51.505, -0.09], 13);
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
  })
  
  </script>
  
  <style scoped>

#map{
	height: 95vh;
	/* height: 2000px; */
}
  /* @media (prefers-color-scheme: dark), (prefers-color-scheme: no-preference) {
	div {
	  filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
	}
  } */
  </style>