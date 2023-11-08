import fs from 'node:fs';
import path from 'node:path'; 
import mjml from 'mjml';
import fsExtra  from 'fs-extra';
import c from 'picocolors';
import makeDebugger from 'debug';

const debug = {
  mjml: makeDebugger("vite:mjml"),
  compile: makeDebugger("vite:mjml:compile"),
  watch: makeDebugger("vite:mjml:watch")
};

function compileInput(input, options, build) {
  debug.compile("Compiling input:", { input, options });
  const log = options.log === false ? () => {
  } : options.building ? (text) => console.log(`${c.cyan(c.bold("mjml"))} - ${text}`) : (text) => options.logger.info(text, { timestamp: true });
  const content = fs.readFileSync(input, "utf-8");
  try {
    build && fsExtra.emptyDirSync(options.output);

    const result = mjml(content, options.mjml);

    const outputFile = input.replace(path.normalize(options.input), path.normalize(options.output)).replace(".mjml", options.extension);


    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, result.html);
    log(c.gray(`${input} -> ${outputFile} (${fs.statSync(outputFile).size} B)`));
    debug.compile("Compilation done:", { result, outputFile });
    
  } catch (error) {
    debug.compile("An error occured:", error);
    if (options.building) {
      throw error;
    }
    options.logger.error("Could not compile MJML file.", { timestamp: true });
    options.logger.error(error);
  }
}
function plugin(options = {}) {
  let compileOptions;

  return {
    name: "mjml",
    configResolved(config) {
      compileOptions = {
        input: "resources/mail",
        output: "resources/views/emails",
        extension: ".html",
        logger: config.logger,
        building: config.command === "build",
        log: true,
        watch: true,
        ...options
      };
      debug.mjml("Configuration resolved:", compileOptions);
    }, 	
		async buildEnd() {
			let input: string = compileOptions.input;
      input = compileOptions.input;


      fs.readdirSync(input).forEach(file => {
        if(path.extname(file) === '.mjml') {
          let passAbs = path.resolve(input, file);
          passAbs && compileInput(passAbs, compileOptions, true)
        }
      });
		},

    configureServer(server) {
     
      if (compileOptions.watch === false) {
        debug.watch("Watching disabled.");
        return; 
      }
      
      function handleReload(path2) {        
        if (path.extname(path2) === '.mjml' && path2.includes(path.normalize(compileOptions.input))) {
          debug.watch(`${path2} changed, compiling`);
          compileInput(path2, compileOptions, false);
        }
      }
      server.watcher.on("add", handleReload).on("change", handleReload).on("unlink", handleReload);
      debug.watch("Configured server.");
    }
  };
}

export { plugin as default };
