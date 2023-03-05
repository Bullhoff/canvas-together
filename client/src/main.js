import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
//import utils from './utils.js';
import * as utils from './utils.js'
import c from './constants.js'

import './assets/main.css'

const app = createApp(App)
app.config.globalProperties.utils = utils;
app.config.globalProperties.c = c;

/* app.config.globalProperties = {
	utils
}; */
app.use(createPinia())
app.use(router)

app.mount('#app')
