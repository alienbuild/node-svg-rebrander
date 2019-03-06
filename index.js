// Requires
const yargs = require('yargs');
const fs = require("fs");
const tools = require('simple-svg-tools');

// Options > Rebrand options 
const brandOptions = {
	// eg: 'green':'red' replaces the colour green with red.
	'#6859a3':'green',
	'#675aa2':'green'
} 

// Options > Input/Output
const input = './svgs/';
const output = './svgs/output/';

// Did you start correctly?
console.log('-------------------------------------');
console.log('SVG rebrander reporting for duty.');
console.log('-------------------------------------');
console.log(JSON.stringify(brandOptions, null, "  ")); 
console.log('-------------------------------------');

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
        }
    })
    .help()
    .alias('help', 'h')
    .argv; 

// Bulk manipulate SVGs by folder
const collectionSVG = () => {
	// Import SVGs from direction
	tools.ImportDir(input).then(collection => {
	// Perform action on each SVG located.
    collection.forEach((svg, name) => { 
	    console.log('Imported SVG: ' + name + '.svg');

	    // Optimise SVG for manipulation
		tools.SVGO(svg).then(svg => {
			console.log('Optimising SVG');

			// Change colours
			tools.ChangePalette(svg, brandOptions).then(svg => {
				console.log('Rebranded: ' + name + '.svg'); 

				//Export
				tools.ExportSVG(svg, output + name + '.svg').then(() => { 
					console.log('Exported: ' + name + '.svg');

					console.log('Press any key to exit');

					process.stdin.setRawMode(true);
					process.stdin.resume();
					process.stdin.on('data', process.exit.bind(process, 0));
				}).catch(err => {
					console.log(err);
				}); 

			}).catch(err => console.log(err));

		}).catch(err => console.log(err));

	});

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

// REQ: Single SVG rebrand
if (argv.rebrand) {
    console.log('Hold tight. Rebranding SVGs...');
    // Update companies...
    singleSVG(); 
}

// REQ: Bulk SVG rebrand
if (argv.collection) {
    console.log('Hold tight. Rebranding SVGs Collection...');
    // Update companies...
    collectionSVG(); 
}
