<p align="center">
<h2 align="center">vite-plugin-mjml plugin with Vite demo projects</h2>


<p>
 Based on 
 <a href="https://github.com/innocenzi/vite-plugin-mjml#readme">
    vite-plugin-mjml
 </a>,
 fixed some issues with path normilize, and build options
</p>


&nbsp;

## Usage

```ts
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
```

When running `vite dev`, all `.mjml` files in your `input` directory will be compiled to `output` when saved. 
Similarly, when building for production, all files in `input` will be compiled as well.

&nbsp;

## Options

| Option      | Type                 | Description                                                                     | Default                  |
| ----------- | -------------------- | ------------------------------------------------------------------------------- | ------------------------ |
| `input`     | `string`             | Path to the directory in which `.mjml` files are stored                         | `resources/mail`         |
| `output`    | `string`             | Path to the directory in which compiled files will be written                   | `resources/views/emails` |
| `extension` | `string`             | Extension that will be used by compiled `.mjml` files                           | `.blade.php`             |
| `mjml`      | `MJMLParsingOptions` | Specific MJML [compiler options](https://documentation.mjml.io/#inside-node-js) | `{}`                     |
| `watch`     | `boolean`            | Whether to watch and compile on the fly in development mode                     | `true`                   |
| `log`       | `boolean`            | Whether to print output in the console                                          | `true`                   |

