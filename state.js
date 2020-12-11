export let state = {
	user: undefined,
	userRole: undefined,
}

export let newItem = {
	answers: {},
	images: [],
}

export let attributesTitles = [];

export let questionsText = [];

export let answersOptions = [];

export let attributes = [];

export let diaperCategories = [];

export let sizes = [];

export let dimensions = [];

export let downloadedItem = {};

export let attributesOrder = {
	'structure': [
		{'id': 'flaps'}, 
		{'id': 'next-to-skin-layer'}, 
		{'id': 'pocket'},
		{'id': 'pocket-openning'},
		{'id': 'pants'}, 
		{'id': 'sio'}, 
		{'id': 'lining'}, 
		{'id': 'lining-types'},
		{'id': 'second-lining'}, 
		{'id': 'inner-layers-nr'}, 
		{'id': 'sides'},
		{'id': 'contour'}, 
		{'id': 'petal'}, 
		{'id': 'gsm'}, 
		{'id': 'closures'},
		{'id': 'closures-types'},
		{'id': 'length-regulation'},
		{'id': 'length-regulation-number'},
		{'id': 'legs-elastics'},
		{'id': 'legs-elastics-types'}, 
		{'id': 'back-elastic'},
		{'id': 'back-elastic-types'},
		{'id': 'front-elastic'},
		{'id': 'front-elastic-types'},
	],
	'fabrics': [
		{'id': 'waterproof-layer-fabrics'},
		{'id': 'second-waterproof-layer-fabrics'},
		{'id': 'inner-layer-fabrics'},
		{'id': 'next-to-skin-layer-fabrics'},
		{'id': 'flaps-fabrics'},
		{'id': 'ribbing-fabrics'},
		{'id': 'wool-state'},
		{'id': 'lanolised'},
		{'id': 'impregnated'},
	],
	'others': []
}