import { defineConfig } from 'vite'
import mjml from './plugin/index.ts'

export default defineConfig({

	plugins: [
		mjml({
			input: 'resources/mails/',
			output: 'resources/dist/',
			extension: '.html'
		}),
	],
})