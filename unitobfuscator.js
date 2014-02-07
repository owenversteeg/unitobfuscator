//unitobfuscator.js: A Javascript library for obfuscating units. MIT license; created by Owen Versteeg.

/*
	All 'default' aliases apply to all obfuscations.
	All other aliases replace an SI unit with an uncommon unit.
	The last item in all arrays is the multiplier.
	For example, if 1 meter = 0.5 froblet:
	'meter': ['froblet', 0.5]
	Or, if 1 doodad = 0.5 meter:
	'meter': ['doodad', 1/0.5]

	Include the unit's origin and any interesting facts in an inline comment.

	Useful Wikipedia pages:
	https://en.wikipedia.org/wiki/Ottoman_units_of_measurement
	https://en.wikipedia.org/wiki/Ancient_Roman_units_of_measurement
*/

var defaultAliases = {
	'default': [
		['square hogshead', 'US butt rundlet', 1/(3.5*0.5)], //UK; wine cask capacities
		['firkin', 'siliqua', 40823.3133/(1/0.19)] //England (firkin), Ancient Rome (siliqua); one firkin = mass of 1 ale firkin of water and one siliqua=1/144 of a Roman ounce
	],

	//Volume
	'liter': ['puncheon', 0.003145], //UK and US; wine cask capacity

	//Distance
	'meter': ['furlong', 0.004971], //Old English; length of the furrow in one acre of ploughed open field

	//Mass
	'gram': ['scrupulum', 1.14], //Ottoman Empire; general usage. Banned from use in current Turkey
};

function obfuscate(originalData) {
	//eliminate trailing "s"es
	if (originalData.charAt(originalData.length-1).toLowerCase() == "s") {
		originalData = originalData.substr(0, originalData.length-1);
	}
	
	var amount = parseInt(originalData.split(' ')[0]);
	var originalUnit = originalData.substr(amount.toString().length+1);

	var textBottom = textTop = ''; //Top or bottom of a fraction

	defaultAliasesArray = Object.keys(defaultAliases);

	for (var i = 0; i < defaultAliasesArray.length; i++) {
		var currentAliasName = defaultAliasesArray[i];
		if (currentAliasName == 'default') {
			//Are we at the defaults? If so, add them to all sides
			for (var x = 0; x < defaultAliases.default.length; x++) {
				textTop += defaultAliases.default[x][0] + ' ';
				textBottom += ' '+defaultAliases.default[x][1];
				amount *= defaultAliases.default[x][2];
			}
			textBottom = textBottom.substr(1); //trim leading space

			//Append the original unit; it's obfuscated below
			//We don't append it at first because we want to ensure correct form (higher powers first, so fir^4 is before m^2)
			textTop += originalUnit;
		} else if (textTop.indexOf(currentAliasName) != -1) {
			textTop = textTop.replace(currentAliasName, defaultAliases[currentAliasName][0]);
			amount *= defaultAliases[currentAliasName][1];
		}
	}

	//return amount + ' ('+textTop+'s)/('+textBottom+'s)';
	return amount + ' ' + textTop + ' per ' + textBottom;
}
