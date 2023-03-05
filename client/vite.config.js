import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
//const fs = require('fs')
//import fs from 'node:fs'

// https://vitejs.dev/config/
export default defineConfig({
	define: {
		'process.env': {},
	},

	plugins: [
		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => ['tooltipSlot'].includes(tag),
				},
			},
		}),
		vueJsx(),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	devServer: {
		/* proxy: 'http://127.0.0.1:3000/', */
		/* https: true, */
	},
});
