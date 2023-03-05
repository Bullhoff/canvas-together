<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { defineComponent, onMounted, onBeforeMount, watch, onUpdated, nextTick, ref, reactive, computed } from 'vue'
import { canvasStore, styleStore, configStore, store } from "@/stores/store.js";
import SocketioService from './socketio.service.js';
import * as utils from './utils.js'
import c from './constants.js';
import _ from 'lodash';


watch(() => (configStore().user.username), async (username) => {
      store().msg({USER1: {
        username: configStore().user.username,
        accounts: Object.keys(configStore().user.accounts),
        accounts: configStore().user.accounts,
      }})
      if(configStore().user.username == 'undefined') configStore().user.username = 'Guest'
      
      if(configStore().user.username != 'Guest' && configStore().user.username != 'Guest'){
        let responseJson = await utils.fetchJson({ obj:{ token: configStore().user.accounts[configStore().user.username]?.refreshToken }, path:'/users/token' })
        //utils.printBrowser({text:`user.username CHANGE... username:${username}: user:${responseJson?.user}, accessToken:${responseJson?.accessToken}`, whoSentYou:'store,login', fg:'white', bg:'black'})
        store().msg({USER_RES: {
          username: configStore().user.username, 
          responseJson: responseJson, 
        }})
        if(!responseJson) configStore().user.username = 'Guest'
        else if(responseJson.user != configStore().user.username){
          configStore().user.username = responseJson?.user
          if(!configStore().user.accounts[configStore().user.username]) configStore().user.accounts[configStore().user.username] = {}
          store().msg({USER2: configStore().user})
          configStore().user.accounts[configStore().user.username].accessToken = responseJson.accessToken
        } 
      }
      if(localStorage.getItem('username'))
        localStorage.setItem('username', configStore().user.username)
      
      
      canvasStore().current.canvas_id = null
      canvasStore().current.layer_id = null
      canvasStore().initCanvasPage()
})

onMounted(() => { 
  
  store().init()
  if(utils.getStorage('accounts')) configStore().user.accounts = JSON.parse(utils.getStorage('accounts'))
  configStore().user.username = utils.getStorage('username') ? utils.getStorage('username').replaceAll('\"','') : 'Guest'
  

  if(configStore().general.killConnectionWhenWindowNotVisible)
  document.addEventListener("visibilitychange", (e) => {
    console.log(document.visibilityState)
    if (document.visibilityState === 'visible') { } else { }
  });
})






</script>

<template>
  <header>
  <!-- 
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/canvas1">canvas1</RouterLink>
      </nav>
    </div>
 -->
  </header>
  <RouterView  style="overflow: hidden;" :style="[styleStore().app]" />
</template>

<style >

.prevent-select {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}

.highlight {
	background: rgb(255, 221, 0);
  color:black;
}
.highlight-reset {
	background: rgba(228, 30, 12, 0.0);
}

.highlighted {
	background: rgb(255, 221, 0);
  color:black;
}
.notHighlighted {
	background: rgba(228, 30, 12, 0.0);
}

.cursor-default{
  cursor: default;
}
.cursor-grab{
  cursor: grab;
}
.cursor-grabbing{
  cursor: grabbing;
}
.cursor-reset{
  cursor: auto;
  cursor: pointer;

}




header {
  background-color: blue;
  height: fit-content;
}

nav {
  font-size: 12px;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0rem 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

element-highlight {
  background-color: yellow;
}

.fade-in {
  animation: fadeIn ease 10s;
  -webkit-animation: fadeIn ease 10s;
  -moz-animation: fadeIn ease 10s;
  -o-animation: fadeIn ease 10s;
  -ms-animation: fadeIn ease 10s;
}
@keyframes fadeIn {
  0% {
    opacity:0;
  }
  100% {
    opacity:1;
  }
}

@-moz-keyframes fadeIn {
  0% {
    opacity:0;
  }
  100% {
    opacity:1;
  }
}

@-webkit-keyframes fadeIn {
  0% {
    opacity:0;
  }
  100% {
    opacity:1;
  }
}

@-o-keyframes fadeIn {
  0% {
    opacity:0;
  }
  100% {
    opacity:1;
  }
}

@-ms-keyframes fadeIn {
  0% {
    opacity:0;
  }
  100% {
    opacity:1;
  }
}

.fade-out {
  animation: fadeOut ease 3s;
  -webkit-animation: fadeOut ease 3s;
  -moz-animation: fadeOut ease 3s;
  -o-animation: fadeOut ease 3s;
  -ms-animation: fadeOut ease 3s;
}
@keyframes fadeOut {
  0% {
    opacity:1;
  }
  100% {
    opacity:0;
  }
}

@-moz-keyframes fadeOut {
  0% {
    opacity:1;
  }
  100% {
    opacity:0;
  }
}

@-webkit-keyframes fadeOut {
  0% {
    opacity:1;
  }
  100% {
    opacity:0;
  }
}

@-o-keyframes fadeOut {
  0% {
    opacity:1;
  }
  100% {
    opacity:0;
  }
}

@-ms-keyframes fadeOut {
  0% {
    opacity:1;
  }
  100% {
    opacity:0;
  }
}



</style>
