import { ref, computed, reactive, watch } from 'vue';
import { defineStore } from 'pinia';
import * as utils from './../utils.js'
import c from './../constants.js'
import assetlist from "@/assets/assetlist.json"
import { canvasStore, store } from './store.js';

export const configStore = defineStore('config', { 
	state:() => {
		
		return {
			sessionID : Math.random().toString(36).substr(2, 9),
			tools : ['pencil', 'eraser', 'unicode', 'nav'],
			//picturesPath: '/src/assets/pictures/',			
			//picturesPath: '/src/assets/',	
			picturesPath: '/',	
			user: reactive({
				username: '', 
				accounts: {
					Guest: {username: 'Guest', accessToken: null, refreshToken: null, }
				},
			}),
			general: reactive({
				saveConfigToBrowser: false, 
				startWindowNameWithIcon: true,
				normalContextMenu: false, 
				$killConnectionWhenWindowNotVisible: {tooltip:'Not implemented'},
				killConnectionWhenWindowNotVisible: false, 

				hideStartPageLayersByDefault: false, 
				hideLayersByDefault: false, 
				hideLayersNotOwnedBySelf: false,
				hideLayersLongerThan: 99,
				disableLoader: false, 
				guidePopupsEnabled: true,
				debug: false, 
				test: false, 
			}),
			pizzaCompanion: reactive({
				open: false, 
			}),
			debugSettings: reactive({
				$enableConsole: {tooltip:'Requires save and restart'},
				enableConsole: false
			}),
			navigation: reactive({
				keyTranslateIntensity: ref(100),
				doubleClickZoomIntensity: ref(2),
				scrollZoomIntensity : ref(0.5),
				infinateScroll : ref(false), 
				$dragDelay_ms: {tooltip: 'Adds a redraw delay when dragging'},
				dragDelay_ms: 100
			}),
			navState : reactive({
				scale: 1, 
				ofs: {x: 0, y:0}, 
			}), 
			toolState: ({
				$roundPencilRender: {disabled: true, tooltip:'is bad'},
				roundPencilRender : false, 
				$roundPencilDraw: {tooltip:'Great for drawing squares and 2d cubes'},
				roundPencilDraw : false, 
				$drawSize: {tooltip:'Base size for all toolsizes. Go to tools section for each tools individual multiplier'},
				drawSize : ref(2),
				scaleDrawSize : ref(true),
				activeColor: ref(2),
				toolActive: ref('pencil'), 
				$useSquareAsDot: {tooltip:'Should increase performance some'},
				useSquareAsDot: false,
				
			}),
			tools:{	
				nav:{},
				pencil: {sizeMultiplier:2,  },
				eraser: {sizeMultiplier:10, },
				picture: {sizeMultiplier:15, name:'Chinese man', file:'icons8-chinese-64.png', },
				unicode: {name:'FACE SCREAMING IN FEAR',code:'1F631',sizeMultiplier:15, selectedCategory : 'Emoticons', },
			},
			
			cursor: {
				display: true, 
				sizeMultiplier:1, 
				outline: true, 
				outlineColor: 'red',
				fill: false, 
				fillColor: 'same',
				emitCursor: true, 
				receiveCursor: true,

				updateDelay_ms: 100,
				usernameDisplay: true, 
				usernameColor: 'same', 
				usernameStyle: {
					'font-weight': 'bold', 
					'font-style': 'normal', 
					'font-variant': 'normal', 
					$usernameSizeMultiplier: {tooltip: 'more big more lag'}, 
					usernameSizeMultiplier: 4,
					'font-family': 'serif', 
				},
			},
			lists: reactive({
				colors: (['random','#ff0000', '#00ff00', '#0000ff']),
				pictureList:{
					[assetlist[0].name]: {
						category: 'Pictures',
						file:assetlist[0].filename, image:null
					},
					[assetlist[1].name]: {
						category: 'Pictures',
						file:assetlist[1].filename, image:null
					},
					'Chinese man':{
						category: 'icons8',
						file:'icons8-chinese-64.png',image:null, 
						attribution: {text: 'icons8', link:'https://icons8.com', by: '', licence:''}
					}, 
					'Roman soldier':{
						category: 'icons8',
						file:'icons8-roman-soldier-50.png',image:null, 
						attribution: {text: 'icons8', link:'https://icons8.com', by: '', licence:''}
					}, 
					
				},
				unicodePrimaryCategories : ['Emoticons', 'Misc_Pictographs', 'Misc_Symbols', 'Sup_Symbols_And_Pictographs', 'Transport_And_Map', 'Dingbats', 'Ornamental_Dingbats', 'Misc_Math_Symbols_A', 'Sup_Arrows_A', 'Sup_Arrows_B', 'Sup_Arrows_C', 'Music', 'Cuneiform', 'Braille', 'Egyptian_Hieroglyphs', 'Block_Elements', 'Box_Drawing', 'Enclosed_Alphanum', 'Greek', 'Math_Operators', 'Misc_Technical', 'Geometric_Shapes'],
				unicodePrimarySymbols : {
						'BANANA'		:		"1F34C",
						'BUST IN SILHOUETTE'		:		"1F464",
						'CHOCOLATE BAR'		:		"1F36B",
						'CUNEIFORM SIGN AN PLUS NAGA SQUARED'		:		"12031",
						'DOWNWARDS ARROW WITH LARGE TRIANGLE ARROWHEAD'		:		"1F80B",
						'FAIRY'		:		"1F9DA",
						'FATHER CHRISTMAS'		:		"1F385",
						'GHOST'		:		"1F47B",
						'JAPANESE GOBLIN'		:		"1F47A",
						'JAPANESE OGRE'		:		"1F479",
						'LEFTWARDS ARROW WITH LARGE TRIANGLE ARROWHEAD'		:		"1F808",
						'MAGE'		:		"1F9D9",
						'MAN WITH TURBAN'		:		"1F473",
						'MONEY-MOUTH FACE'		:		"1F911",
						'MOUSE'		:		"1F401",
						'MUSICAL SYMBOL EIGHTH NOTE'		:		"1D160",
						'NERD FACE'		:		"1F913",
						'NEW MOON WITH FACE'		:		"1F31A",
						'NO ENTRY'		:		"26D4",
						'PERSON WITH HEADSCARF'		:		"1F9D5",
						'PIG'		:		"1F416",
						'POLICE OFFICER'		:		"1F46E",
						'RAT'		:		"1F400",
						'RIGHTWARDS ARROW WITH LARGE TRIANGLE ARROWHEAD'		:		"1F80A",
						'SKULL'		:		"1F480",
						'SNAIL'	:	"1F40C",
						'UPWARDS ARROW WITH LARGE TRIANGLE ARROWHEAD'		:		"1F809",
						'WIDE-HEADED NORTH EAST HEAVY BARB ARROW'		:		"1F87D",
						'WIDE-HEADED NORTH WEST HEAVY BARB ARROW'		:		"1F87C",
						'WIDE-HEADED SOUTH EAST VERY HEAVY BARB ARROW'		:		"1F886",
						'WIDE-HEADED SOUTH WEST VERY HEAVY BARB ARROW'		:		"1F887",
					},
			}),
			
		}
	}, getters: {
	}, actions: {
		zoomHandler(e, zoom) {
			let ref = canvasStore().canvasRefs[Object.keys(canvasStore().canvasList)[0]]
			var x = e.clientX - ref.offsetLeft;
			var y = e.clientY - ref.offsetTop;
			for (const id of Object.keys(canvasStore().canvasRefs)) {
				const ctx = canvasStore().canvasRefs[id].getContext('2d')
				ctx.translate(configStore().navState.ofs.x, configStore().navState.ofs.y);
			}
			configStore().navState.ofs.x -= x / (configStore().navState.scale * zoom) - x / configStore().navState.scale;
			configStore().navState.ofs.y -= y / (configStore().navState.scale * zoom) - y / configStore().navState.scale;
			for (const id of Object.keys(canvasStore().canvasRefs)) {
				const ctx = canvasStore().canvasRefs[id].getContext('2d')
				ctx.scale(zoom, zoom);
				ctx.translate(-configStore().navState.ofs.x, -configStore().navState.ofs.y);
			}
			configStore().navState.scale *= zoom;
			canvasStore().queue.push({event:'redraw', layer_id:null, source:'self'})
		},
		_zoomHandler({e, scale = configStore().navState.scale} = {}) {
			let rect = canvasStore().canvasRefs[Object.keys(canvasStore().canvasRefs)[0]].getBoundingClientRect()
			let posIrl = {
				x: ((e.clientX+rect.x) / configStore().navState.scale) + (configStore().navState.ofs.x)/ 1 +0, 
				y: ((e.clientY+rect.y) / configStore().navState.scale) + (configStore().navState.ofs.y)/ 1 +0
			}
			let scaledSize = {
				x: window.innerWidth*scale, 
				y: window.innerHeight*scale
			}
			//let curr = canvasStore().ctx[Object.keys(canvasStore().ctx)[0]].getTransform()
			let constraints = {
				x0: -(configStore().navState.ofs.x / scale), 
				y0: -(configStore().navState.ofs.y / scale), 
				x: (canvasStore().state.sizeCanvas.w / scale) -(configStore().navState.ofs.x / scale), 
				y: (canvasStore().state.sizeCanvas.h / scale) -(configStore().navState.ofs.y / scale),
			}
			let visibleCanvas = {}
			visibleCanvas['x'] = constraints.x - constraints.x0
			visibleCanvas['y'] = constraints.y - constraints.y0
			/* visibleCanvas['x'] = Math.abs(constraints.x) + Math.abs(constraints.x0)
			visibleCanvas['y'] = Math.abs(constraints.y) + Math.abs(constraints.y0) */

			let center = {
				x: ((posIrl.x - visibleCanvas.x/2) / configStore().navState.scale) , 
				y: ((posIrl.y - visibleCanvas.y/2) / configStore().navState.scale) ,
			}
			configStore().navState.scale = scale
			store().msg({ye:{
				navState: {
					1: configStore().navState.scale, 
					2: scale,
					ofsX: configStore().navState.ofs.x, 
					ofsY: configStore().navState.ofs.y,
				}, 
				rect,
				e: {x:e.clientX,y:e.clientY},
				posIrl, 
				constraints: constraints, 
				visibleCanvas,
				center: center, 
			}})
			/* configStore().navState.ofs.x = -x
			configStore().navState.ofs.y = -y */
			for (const id of Object.keys(canvasStore().ctx)) {
				configStore().navState.ofs.x = center.x 	//+ 	configStore().navState.ofs.x*configStore().navState.ofs/2
				configStore().navState.ofs.y = center.y 	//+ 	configStore().navState.ofs.y*configStore().navState.ofs/2
				/* let center = {
					x: (((scaledSize.x) - canvasStore().state.sizeCanvas.w)/2) / configStore().navState.scale, 
					y: (((scaledSize.y) - canvasStore().state.sizeCanvas.h)/2) / configStore().navState.scale
				} 
				configStore().navState.ofs.x = center.x * x*2
				configStore().navState.ofs.y = center.y * y*2
				console.log(x, y, center) */
				canvasStore().ctx[id].setTransform(configStore().navState.scale, 0, 0, configStore().navState.scale, 0, 0);
				canvasStore().ctx[id].translate(-configStore().navState.ofs.x, -configStore().navState.ofs.y)
				
				/* canvasStore().ctx[id].setTransform(scale, 0, 0, scale, 0, 0);
				canvasStore().ctx[id].translate(-configStore().navState.ofs.x, -configStore().navState.ofs.y) */
				/* canvasStore().ctx[id].setTransform(scale, 0, 0, scale, 0, 0);
				canvasStore().ctx[id].translate(-configStore().navState.ofs.x, -configStore().navState.ofs.y) */
				//if (canvasRefs[id] == null || canvasRefs['img'] == null) return 
				//let def = canvasRefs['img'].getContext('2d').getTransform()
				//const ctx = canvasRefs[id].getContext('2d')
				//ctx.setTransform(def.a, def.b, def.c, def.d, def.e, def.f);
			}
			
			canvasStore().queue.push({event:'redraw', layer_id:null, source:'self'})
		},
		
		
	}
})