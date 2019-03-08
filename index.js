// Requires
const yargs = require('yargs');
const tools = require('simple-svg-tools');
const fs = require('fs');
const path = require('path');

// Options > Rebrand options 
const brandOptions = { 
	// eg: 'green':'red' replaces the colour green with red.
	// 'default': 'red' change all to red if no colours specified.
	'#696868': 'red'
} 

// Options > Input/Output 
const input = './input/';
const output = './output/'; 
 
// Did you start correctly?
console.log('------------------------------------------');
console.log('SVG rebrander reporting for duty.');
console.log('------------------------------------------');


// Commands 
const argv = yargs
    .options({
        u: {
            demand: false,
            alias: 'rebrand',
            describe: 'Rebrand an SVG',
            string: false
        }, 
        c:{
        	demand: false,
        	alias: 'collection',
        	describe: 'Bulk rebrand SVGs by folder',
        	string: false
        },
        o: {
        	demand: false,
        	alias: 'symbolise',
        	describe: 'output SVG symbols into a .njk file',
        	string: false
        }
    })
    .help()
    .alias('help', 'h')
    .argv; 

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
		    console.log('Colors used in SVG: ' + result.colors.join(', '));
		    if (result.notices.length) {
		        result.notices.forEach(notice => console.log(notice));
		    }
		}).catch(err => {
		    console.log(err);
		});
 
	    // Optimise SVG for manipulation
		tools.SVGO(svg, { 'mergePaths': true}).then(svg => {

			// Change colours
			tools.ChangePalette(svg, brandOptions).then(svg => {
				console.log('Rebranded: ' + name + '.svg'); 

				//Export
				tools.ExportSVG(svg, output + name + '.svg').then(() => { 
					console.log('Exported: ' + name + '.svg');

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
				console.log('Processing SVG: ', filename);
				const symbol = (`<symbol id="${filename.split('.').slice(0, -1).join('.')}">{% include "../brand/coop/images/${filename}" %}</symbol>`);
				fs.appendFileSync(output + 'icon-sym-list.njk', symbol+"\r\n");
			} else {
				// If not SVG then ignore. 
				console.log('Sorry, This file is not an SVG icon: ', filename);
			}
	    } 
	}); 
};

// REQ: Single SVG rebrand
if (argv.rebrand) {
    console.log('Hold tight. Rebranding SVGs...');
    // Update SVG...
    singleSVG(); 
}

// REQ: Bulk SVG rebrand
if (argv.collection) {
    console.log('Hold tight. Rebranding SVGs collection...');
    console.log('------------------------------------------');
    // Update SVGs...
    collectionSVG(); 
}

// REQ: Symbolise SVG icons
if (argv.symbolise) {
    console.log('Hold tight. Finding icons and collating them into symbols');
    console.log('------------------------------------------');
    // Update SVGs...
    symbolise(); 
}
