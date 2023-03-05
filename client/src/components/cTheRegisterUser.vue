


<template>
	<div class="container">
		<!-- style="display:inline"  style="position:absolute; right:3px;"-->
		<div style="margin:0ch; width:100%;display:flex; flex-direction: row; ">
			<div style=""> 
				<input type="radio" id="radioLogin" value="Login" v-model="state.mode" @change="onSwapLoginRegister" />
				<label for="radioLogin">Login</label>
				<input type="radio" id="radioRegister" value="Register" v-model="state.mode" @change="onSwapLoginRegister"
					style="margin-left:1ch;" />
				<label for="radioRegister">Register</label>
			</div>
			<div style="justify-self:flex-end; width:50%;">
				<Dropdown2 style="position:absolute;justify-self:flex-end;"
					propName="SwapUser1"
					titleContainer=""
					:settings="{ titleContainer: 'SwapUser3', editable: false }"
					:parts="{ dropdownArrow: true, selectedSpinner: false, moveItemSpinner: false, hide: false, remove: true, }"
					:propStyle="{ container: { width: '18ch' }, list: { width: 'min-content' }, itemRow: {} }"
					:list="Object.keys(configStore().user.accounts).map((x) => {
						return {
							id: x,
							name: x,
							owner: (x!='Guest') ? configStore().user.username : false
						}
					})"
					:selected="configStore().user.username"

					@selected="(e) => {	configStore().user.username = e; }"
					@remove="(e)=>logout({username: e})" />
			</div>
		</div>

		<fieldset >
			<legend>{{ state.mode }}</legend>
			<form class="user-form">
				<label for="username">Username*</label>
				<input type="text" id="username" name="username" v-model="input.name" :autocomplete="mode[state.mode].autocompleteUsername" title="" tabindex="0" />
				<p style="width: auto"></p>
				
				<label for="password">Password*</label>
				<!-- <div style="grid-column: 2/2; grid-row: span 1; display: grid; grid-template-columns:subgrid; grid-template-rows:subgrid; width:auto;"> -->
				<input :type="state.passwordFieldType" id="password" name="password" v-model="input.password"
					:autocomplete="mode[state.mode].autocompletePassword" style="" tabindex="0" />
				<p v-if="true" :class="{ grayed: state.hiddenPassword }" @click="buttonShowPassword"
					class="prevent-select"
					style="cursor:pointer; width:fit-content;">&#128065;</p>
				<!-- </div> -->



				<template v-if="state.mode == 'Register'">

					<label for="email">Email</label>
					<input type="email" name="email" v-model="input.email" id="email"
						:autocomplete="mode[state.mode].autocompleteEmail" />

					<div style="text-align: left; grid-column: 2/2;align-self: end;">
						
						<button :disabled="!isValid" ref="refs.registerButton" @click.prevent="register()" tabindex="0">Register</button>
						<button @click.prevent="cancelButton" tabindex="0">Cancel</button>
						<!-- <span style="padding-left:2px;">{{ status.register }}</span> -->
					</div>
					<p></p>
				</template>


				<template v-if="state.mode == 'Login'">
					<div>
						<p><input type="checkbox" v-model="input.staySignedIn" id="staySignedIn" tabindex="0" /> <label
								for="staySignedIn">Stay signed in</label></p>
						<p><input type="checkbox" v-model="input.rememberMe" id="rememberMe" /> <label
								for="rememberMe">Remember me</label></p>
					</div>

					<!--  || configStore().user.username != 'Guest' -->
					<div style="grid-column: 2/2;grid-row: span 2; align-self: end;  ">
						<button :disabled="!isValid " ref="refs.loginButton"
							@click.prevent="loginButton()" tabindex="0">Login</button>
						<button :disabled="configStore().user.username == 'Guest'" ref="refs.logoutButton"
							@click.prevent="logout()">Logout</button>
						<button @click.prevent="cancelButton">Cancel</button>
					</div>
					<p></p>
				</template>
				<p v-if="status.msg" style="grid-column: 1 / span 3;" :class="[status.ok ? 'status-ok' : 'status-error']">
					{{ status.msg }}
				</p>
				

			</form>
		</fieldset>




	</div>


</template>


<script setup>
//import SocketioService from './../socketio.service.js';
//import { CanvasManager } from '@/CanvasManager8.js'
import { defineComponent, onMounted, onBeforeMount, onBeforeUnmount, watch, onUpdated, nextTick, ref, reactive } from 'vue'
import c from './../constants.js';
import { canvasStore, styleStore, configStore, store } from "@/stores/store.js";
import * as utils from '../utils.js'
import Dropdown2 from '@/components/cDropdown2.vue'


const emit = defineEmits(["reset-zoom", "test-emit"])
//const color2 = ref(conf.color)

const props = defineProps({
	propStyle: {
		type: Object,
		required: false,
		default: {},
	},
})

const conf = reactive(configStore());

const isValid = ref(false)
const bool = reactive({
	hiddenPassword: true
})

const refs = reactive({
	registerButton: null,
	registerUsername: null,
	registerPassword: null,
	registerEmail: null,

	loginButton: null,
	loginUsername: null,
	loginPassword: null,

	logoutButton: null,
})
const status = reactive({
	ok: null,
	msg: null, 
	register: null, 
	login: null
})
const input = reactive({
	name: '',
	password: '',
	email: '',
	staySignedIn: false,
	rememberMe: false,
})
const state = reactive({
	hiddenPassword: true,
	passwordFieldType: 'password',
	mode: 'Login',
	autocompleteUsername: 'username',
	autocompletePassword: 'current-password',
	autocompleteEmail: 'email',
})

const mode = {
	Login: {
		autocompleteUsername: 'username',
		autocompletePassword: 'current-password',
		autocompleteEmail: 'email',
	},
	Register: {
		autocompleteUsername: 'username',
		autocompletePassword: 'new-password',
		autocompleteEmail: 'email',
	}
}

function onSwapLoginRegister() {
	status.msg = null
	store().setTitle({ [state.mode]: true })
	if (mode == 'Login') {

	}
}
function buttonShowPassword() {
	state.hiddenPassword = !state.hiddenPassword
	if (state.passwordFieldType == 'password') state.passwordFieldType = 'text'
	else state.passwordFieldType = 'password'
}
/* setTimeout(() => {
  console.log("Delayed for 1 second.");
}, "1000") */

/* watch(() => (input.username), async (username) => {
	console.log('watch username',username)
}) */
watch(input, ({ name, password, email }) => {
	//console.log('watch', name, password, email, input)
	if (name.length >= 1 && password.length >= 1) {
		isValid.value = true
	} else {
		isValid.value = false
	}

})

async function register() {
	console.log('register', input)
	var data = new FormData();
	//data.append("input", input);
	data.append("name", input.name);
	data.append("password", input.password);
	data.append("email", input.email);
	let res = await fetch(`${c.SERVERIP}/users/register`, {
		method: 'POST',
		body: data
	})
	console.log('res',  res)
	let resText = await res.text() 
	//let responseJson = (res.ok) ? await res.json() : res.ok
	console.log('res', resText)
	status.register = resText
	status.msg = resText
	status.ok = res.ok
	if (!res.ok) {
		return
	}
	//configStore().user.accounts[configStore().user.username] 
}

async function logout({username=configStore().user.username}={}) {
	var data = new FormData();
	data.append("token", configStore().user.accounts[username].refreshToken);

	let res = await fetch(`${c.SERVERIP}/users/logout`, {
		method: 'POST',
		body: data
	})
	
	if(username == configStore().user.username)
		configStore().user.username = 'Guest'

	localStorage.setItem('username', configStore().user.username)
	delete configStore().user.accounts[username]
    localStorage.setItem('accounts', JSON.stringify(configStore().user.accounts))
	
}

async function loginButton() {
	console.log('login', input)
	var data = new FormData();
	data.append("name", input.name);
	data.append("password", input.password);
	data.append("email", input.email);
	data.append("staySignedIn", input.staySignedIn);


	let res = await fetch(`${c.SERVERIP}/users/login`, {
		method: 'POST',
		body: data
	})

	let responseJson = (res.ok) ? await res.json() : res.ok
	//let resText = await res.text()
	//console.log('resText', resText)
	/* status.msg = resText
	status.ok = res.ok */
	if (!res.ok) {
		status.msg = 'nah'
		status.ok = false
		return	
	}
	status.msg = 'Success'
	status.ok = true
	//console.log('configStore().user', configStore().user)
	configStore().user.accounts[input.name] = {
		username: input.name,
		accessToken: responseJson.accessToken,
		refreshToken: responseJson.refreshToken,
	}
	configStore().user.username = input.name

	if (input.rememberMe) {
		console.log('input.rememberMe', input.rememberMe)
		utils.saveStorage('username', conf.user.username)
		utils.saveStorage('rememberMe', input.rememberMe)
		utils.saveStorage('staySignedIn', input.staySignedIn)


		
		utils.saveStorage('accounts', configStore().user.accounts)
		utils.saveStorage('username', configStore().user.username)
	}
	
}


async function refreshToken(user = configStore().user.accounts[configStore().user.username]) {
	console.log('token', user.refreshToken)

	var data = new FormData();
	data.append("token", user.refreshToken);
	let res = await fetch(`${c.SERVERIP}/users/token`, {
		method: 'POST',
		body: data
	})
	let responseJson = (res.ok) ? await res.json() : res.ok
	if (!responseJson) return

	console.log('responseJson', responseJson)
	user.accessToken = responseJson.accessToken
	user.username = responseJson.user
}

function cancelButton() {
	//conf.bool.showLogin = !conf.bool.showLogin
}



onBeforeMount(() => { })
onMounted(() => {
	//console.log('username', localStorage)
	input.name = utils.getStorage('username') ? utils.getStorage('username').replaceAll('\"', '') : 'Guest'
	input.rememberMe = utils.getStorage('rememberMe') ? utils.getStorage('rememberMe').replaceAll('\"', '') : false
	input.staySignedIn = utils.getStorage('staySignedIn') ? utils.getStorage('staySignedIn').replaceAll('\"', '') : false
	store().setTitle({ [state.mode]: true })
})
onBeforeUnmount(() => {
	store().setTitle()
})



</script>



<style scoped>
.user-form {
	display: grid;
	grid-template-columns: 40% 57% auto;
	text-align: left;
}


.status-ok {
	color:green;
}
.status-error{
	color:red;
}

</style>


