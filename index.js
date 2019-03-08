// Requires
const yargs = require('yargs');
const tools = require('simple-svg-tools');
const fs = require('fs');
const path = require('path');
const prompt = require('prompt');
const colors = require("colors/safe");

// Options > Rebrand options 
const brandOptions = { 
	// eg: 'green':'red' replaces the colour green with red.
	// 'default': 'red' change all to red if no colours specified.
	'#696868': 'red'
}  

// Options > Input/Output 
let input = './input/'; 
let output = './output/'; 

// Did you start correctly?
prompt.message = colors.magenta('SVG APP reporting for duty.');

prompt.start(); 
 
console.log('What would you like to do?');

prompt.get([{
	name: 'command',
	required: true,
	description: '\n Type \'bulkbrand\' to run the bulk rebrander \n Type \'sym\' to run the icon to njk symbolise function \n'
}], function (err, result) {
	console.log('------------------------------------------');
    console.log('Command-line input received:'  + result.command);
    console.log('Please wait...');

    if (result.command === 'bulkbrand') {
    	console.log('Running bulk rebrander');
    	collectionSVG(); 
    }

    if (result.command === 'sym') {
    	console.log('Running symboliser');
    	symbolise(); 
    }
  });

// Bulk manipulate SVGs by folder
const collectionSVG = () => {
	console.log(JSON.stringify(brandOptions, null, "  ")); 
	console.log('------------------------------------------');
	
	// Import SVGs from direction
	tools.ImportDir(input, {'include-subdirs': false}).then(collection => {

	// Perform action on each SVG located.
    collection.forEach((svg, name) => { 
	    console.log('Imported SVG: ' + name + '.svg');

	    tools.GetPalette(svg).then(result => {
		    //console.log('Colors used in SVG: ' + result.colors.join(', '));
		}).catch(err => {
		    console.log(err);
		});
 
	    // Optimise SVG for manipulation
		tools.SVGO(svg, { 'mergePaths': true}).then(svg => {

			// Change colours
			tools.ChangePalette(svg, brandOptions).then(svg => {
				//console.log('Rebranded: ' + name + '.svg'); 

				//Export
				tools.ExportSVG(svg, output + name + '.svg').then(() => { 
					console.log(colors.green('Exported: ' + name + '.svg'));
				}).catch(err => {
					console.log(err);
				}); 

			}).catch(err => console.log(err));

		}).catch(err => console.log(err));

	});


	process.stdin.setRawMode(true);
	process.stdin.resume();
	process.stdin.on('data', process.exit.bind(process, 0));

	}).catch(err => { 
	    console.log(err);
	}); 
}

// Rebrand single SVG
const singleSVG = () => {
	// Import SVG(s)
	tools.ImportSVG('test.svg').then(svg => {
		// SVG imported
		console.log('SVG Imported');

		// Optimise SVG for manipulation
		tools.SVGO(svg).then(svg => {
			
			console.log('Optimising SVG');

			// Change colours
			tools.ChangePalette(svg, brandOptions).then(svg => {
				console.log('Colours have been changed');

				// Export
				tools.ExportSVG(svg, 'filename.svg').then(() => {
					console.log('Exported');

					console.log('Press any key to exit');

					process.stdin.setRawMode(true);
					process.stdin.resume();
					process.stdin.on('data', process.exit.bind(process, 0));
				}).catch(err => {
					console.log(err);
				}); 

			}).catch(err => console.log(err));

		}).catch(err => console.log(err));

	}).catch(err => console.log(err));
};
 
// Symbolise
const symbolise = () => {
	
	// Read Directory
	fs.readdir(input, function(err, items) {
	    for (var i=0; i<items.length; i++) {
	    	const filename = items[i];
	    	const ext = path.extname(filename);
	    	if (ext === '.svg') {

				// If SVG then run through the templater
				console.log(colors.green('Processing SVG: ', filename));

				const symbol = (`<symbol id="${filename.split('.').slice(0, -1).join('.')}">{% include "../brand/coop/images/${filename}" %}</symbol>`);
				fs.appendFileSync(output + 'icon-sym-list.njk', symbol+"\r\n");
			
			} else {
				
				// If not SVG then ignore. 
				console.log(colors.red('IGNORING: ', filename));
			
			}
	    } 
	}); 
};
