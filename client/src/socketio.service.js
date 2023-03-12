import { io } from 'socket.io-client';
import { ref } from 'vue';
import { canvasStore, styleStore, configStore } from '@/stores/store.js';
//import { timeStore, sensorsStore, alarmStore } from "@/stores/store.js";
//import c from './constants.js';
import c from './constants.js';
console.log('c', c)

class SocketioService {
	socket;
	constructor() {}

	disconnect(msg = 'idk') {
		if (this.socket) {
			console.log('socket.disconnect()');
			this.socket.disconnect(msg);
		}
	}
	setupSocketConnection() {
		console.log('setupSocketConnection');
    this.socket = io.connect(c.SERVERIP, {
      extraHeaders: {
        username: `${configStore().user.accounts?.[configStore().user.username]?.username}`,
        token: `${configStore().user.accounts?.[configStore().user.username]?.accessToken}`
      }
    });
    
		/* this.socket = io.connect('localhost:3000'); */
		this.socket.on('error', function () {
			console.log('reconnecting..');
			this.socket.socket.reconnect();
		});

		this.socket.emit('connected', 'Hello there from Vue.');
		
    this.socket.on('parent:add', (obj) => {		
      canvasStore().parentList.push(obj)
      console.log('SOCKETIO parent:add', obj, canvasStore().parentList)
    });
    this.socket.on('parent:remove', ({canvas_id}) => {		
      canvasStore().removeParent({canvas_id})
    });

    this.socket.on('canvas:add', (obj) => {
			let { canvas_id, layer_id, history, properties } = obj;
      console.log('canvas:add', obj)
      canvasStore().addCanvas(obj);
		});
    this.socket.on('canvas:remove', (obj) => {
			let { canvas_id, layer_id, history } = obj;
			canvasStore().removeCanvas({ canvas_id, layer_id:layer_id, arr: history });
		});

		this.socket.on('stroke:add', (obj) => { 
			let { canvas_id, layer_id, strokeIndex, arr } = obj;
			canvasStore().addStrokeToHistory({ canvas_id, layer_id, strokeIndex, arr: arr });
    });
    this.socket.on('stroke:remove', (obj) => {
			let { canvas_id, layer_id, strokeIndex } = obj;
      canvasStore().removeStrokeFromHistory(obj)
		});

    this.socket.on('point:add', (obj) => {  
			let { canvas_id, layer_id, strokeIndex, point } = obj;
      if(canvas_id == canvasStore().current.canvas_id){
        if(point.type == 'cursor' && configStore().cursor.receiveCursor){
          canvasStore().addStrokeToHistory({ canvas_id:canvasStore().current.canvas_id, layer_id:'users', strokeIndex:'1', arr: [point] });
          canvasStore().queue.push({event:'redraw', layer_id:'users'})
        }
        else if(point.type != 'cursor') 
          canvasStore().queue.push({event:'drawPoint', point, layer_id,  strokeIndex})
      }
			
    });

    
	}

}

export default new SocketioService();
