import * as diaperslist from '../mocks/diapers.js';
import * as productslist from '../views/productslist.js';
import * as reviewslist from '../mocks/reviews.js';
import * as form from '../views/new-form.js';
import * as state from '../state.js';
import * as index from '/index.js';

let database = firebase.database();

export function createProductScreen (key, view) {
	const promise = getAttributesTitles ();
	promise
	.then(function(){
		let newPromise = loadItemData (key)
		return newPromise
	})
	.then (function (diaperData) {
		let diaper = {'diaper': diaperData}
		console.log ('diaper', diaper)
		createPreviewScreen (diaper, key, view);
	})
}

function getAttributesTitles () {
	const promise = new Promise ((resolve, reject) => {
		let dbRef = firebase.database().ref('attributes-titles/');
		dbRef.once('value',   function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
		      var childData = childSnapshot.val();
		      state.attributesTitles.push(childData);
		    });
		    resolve ()
	  	});
	});
	return promise
}

export function removeProductScreen () {
	let page = document.getElementById('page');
	let main = document.getElementById('main');
	page.removeChild(main);
}

function createReviews (indexNumber) {
	let selectedReviews = selectReviews (indexNumber);
	createTemplate ('review-template', 'reviews-container', selectedReviews);
}

function selectReviews (indexNumber) {
	let selectedReviews = {'reviews': []};
	let reviews = reviewslist.items.reviews
	for (let i=0; i<reviews.length; i++) {
		if (indexNumber == reviews[i].indexnumber) {
			selectedReviews.reviews.push(reviews[i]);
		}
	}
	return selectedReviews
}

function createSizeButtons (diaper) {
	createTemplate ('size-buttons-template', 'size-buttons-container', {'diaper': diaper.diaper, 'container': 'main'});
	let buttons = $('.main-size-button');
	markFirstSizeButton (buttons);
	showWeightInfo (buttons[0], diaper);
	Array.from(buttons).forEach(function(button){
		button.onclick = function (event) {
			let label = button.parentElement;
			$(label).button('toggle')
			showWeightInfo (event.target, diaper);
		};
	});
}

function showWeightInfo (sizeButton, diaper) {
	let sizeData = {};
	let sizeName = sizeButton.getAttribute('size');
	let sizes = diaper.diaper.sizes;
	for (let i=0; i<sizes.length; i++) {
		if (sizeName == sizes[i].id) {
			sizeData = {'size': sizes[i]};
		};
	};
	document.getElementById('size-description').innerHTML = '';
	createTemplate ('size-range-template', 'size-description', sizeData);
}

function createFabrics (diaper) {
	let layers = diaper.diaper.layers;
	if (layers == undefined) {
		return
	}
	let parameters = [];
	layers.forEach(function(layer){
		let parameter = {};
		parameter.title = getParameterTitle(diaper, layer['id']);
		parameter.value = [];
		if (layer.fabrics == undefined) {
			return
		}
		parameter.values = [];
		layer.fabrics.forEach(function(fabric){
			let fabricValue = fabric.name + ' ' + fabric.percentage + '%';
			parameter.values.push({'value': fabricValue});
		})
		parameters.push(parameter);
	});
	createTemplate ('attribute-template', 'fabrics-parameters-group', {'parameters': parameters});
}

function createDimensions (diaper) {
	createTemplate ('dimensions-template', 'attributes-right', diaper);
	createTemplate ('size-buttons-template', 'size-buttons-dimensions', {'diaper': diaper.diaper, 'container': 'dimensions'});

	let buttons = $('.dimensions-size-button');
	createFirstSizeDimensions (diaper, buttons);
	markFirstSizeButton (buttons);
	Array.from(buttons).forEach(function(button){
		button.onclick = function (event) {
			let label = button.parentElement;
			$(label).button('toggle')
			let sizeName = event.target.getAttribute('size');
			let size = diaper.diaper.sizes.find(function(size){
				return sizeName == size.id
			});
			let dimensionsData = [];
			Array.from(size.dimensions).forEach(function(sizeDimension){
				let dimensionData = getDimensionTitle (sizeDimension.id, diaper);
				dimensionData.value = sizeDimension.value;
				dimensionsData.push(dimensionData);
			});
			document.getElementById('dimensions-wrapper').innerHTML = '';
			createTemplate ('dimensions-values-template', 'dimensions-wrapper', {'dimensions': dimensionsData});
			addMarginToParameters ();
		};
	});
}

function markFirstSizeButton (buttons) {
	let label = buttons[0].parentElement;
	$(label).button('toggle')
}

function createFirstSizeDimensions (diaper, buttons) {
	let firstButton = buttons[0];
	firstButton.classList.remove('btn-outline-secondary');
	firstButton.classList.add('btn-secondary');
	let sizeName = firstButton.getAttribute('size');
	let size = diaper.diaper.sizes.find(function(size){
		return sizeName == size.id
	});
	let dimensionsData = [];
	Array.from(size.dimensions).forEach(function(sizeDimension){
		let dimensionData = getDimensionTitle (sizeDimension.id, diaper);
		dimensionData.value = sizeDimension.value;
		dimensionsData.push(dimensionData);
	});
	document.getElementById('dimensions-wrapper').innerHTML = '';
	createTemplate ('dimensions-values-template', 'dimensions-wrapper', {'dimensions': dimensionsData});

}

function getDimensionTitle (dimensionId, diaper) {
	let dimensionData = {};
	Array.from(state.attributesTitles).forEach(function(attributeTitle){
		if (attributeTitle['attribute-id'] == dimensionId) {
			const textGroups = Object.values(attributeTitle['text-groups']);
			Array.from(textGroups).forEach(function(group){
				if (group.id == diaper.diaper['category-data'].attributes[dimensionId]['title-group-id']) {
					dimensionData['title'] = group.text;
					dimensionData['letter'] = group.letter;
					dimensionData['id'] = dimensionId;
					return
				}
			})
		}
	})
	return dimensionData
}

function fillDiaperPreview (diaper) {
	createSizeButtons (diaper);
	createTemplate ('parameters-wrapper-template', 'parameters', diaper);
	let parametersGroups = state.attributesOrder;
	parametersGroups.forEach(function(parametersGroup){
		createTemplate ('parameters-group-wrapper-template', 'attributes-left', {'parameters-group': parametersGroup});
		let parameters = getParameters (diaper, parametersGroup);
		let parametersBox = parametersGroup.id + '-parameters-group';

		createTemplate ('attribute-template', parametersBox, {'parameters': parameters});
	})
	createDimensions (diaper);
	createFabrics (diaper);
	let sizes = diaper.diaper.sizes
}

function getParameters (diaper, parametersGroup) {
	let parameters = [];
	let diaperAttributes = Object.keys(diaper.diaper.attributes);
	Array.from(parametersGroup.attributes).forEach(function(attribute){
		let diaperAttribute = diaperAttributes.find(function(diaperAtt){
			return attribute.id == diaperAtt
		});
		if (diaperAttribute !== undefined) {
			parameters.push(attribute)
		};
	});
	const filteredParameters = parameters.filter(function(parameter) {
		let parameterId = parameter.id;
		return (diaper.diaper['category-data'].attributes[parameterId].answer !== true)
	});

	let attributesToPrint = [];
	filteredParameters.forEach(function(parameter){
		let parameterId = parameter.id;
		console.log('parameterId', parameterId)
		let attributeToPrint = {};

		let attributeValue = diaper.diaper.attributes[parameterId];
		if (attributeValue == true) {
			attributeToPrint.tick = true;
			attributeToPrint.src = "/images/yes.png";
		}
		if (attributeValue == false) {
			attributeToPrint.tick = true;
			attributeToPrint.src = "/images/no.png";
		}
		if (attributeValue !== false && attributeValue !== true) {
			if (Array.isArray(attributeValue) == true && attributeValue.length > 1) {
				attributeToPrint.values = [];
				Array.from(attributeValue).forEach(function(attValue){
					attributeToPrint.values.push({'value': attValue})
				});
			} else {
				attributeToPrint.value = attributeValue;
			};
		};
		attributeToPrint.title = getParameterTitle (diaper, parameterId);
		attributesToPrint.push(attributeToPrint);
	});
	return attributesToPrint
}



function getParameterTitle (diaper, parameterId) {
	let diaperAttributes = diaper.diaper['category-data'].attributes;
	let titles = state.attributesTitles;
	let titleText;
	Array.from(titles).forEach(function(title){
		if (title['attribute-id'] == parameterId) {
			const textGroups = Object.values(title['text-groups']);
			Array.from(textGroups).forEach(function(group){
				if (group.id == diaperAttributes[parameterId]['title-group-id']) {
					titleText = group.text;
					return
				};
			});
		};
	});
	return titleText
}

export function createPreviewScreen (diaper, key, view) {
	console.log('diaper', diaper)
	let formDiaper = diaper;
	console.log ('formDiaper', formDiaper)
	let images = diaper.diaper.images;
	let profileImage = images.find(function(image){
		return image['pattern-nr'] == 1 && image['image-nr'] == 1
	})
	diaper.diaper.profileImage = profileImage;
	fillProductMainInfo ();
	fillSizesInfo ();
	createTemplate ('item-preview', 'page', diaper)
	if (view == 'productScreen') {
		createTemplate ('stars-box-template', 'stars-box-wrapper');
		createTemplate ('reviews-box-template', 'product-page');
		createTemplate ('add-review-template', 'add-review-form-wrapper', diaper);
		createTemplate ('detail-reviews-summary-template', 'detail-summary-wrapper');
		createTemplate ('add-review-child-template', 'ar-child-wrapper');
		createTemplate ('edit-item-button-template', 'edit-diaper-wrapper');
		createTemplate ('delete-item-button-template', 'edit-diaper-wrapper');
		$('#edit-item-button').click( function(){
			console.log('IIIIIII', diaper)
			index.clearPage ();
			console.log('formDiaper', formDiaper)
			form.goToForm ('editItem', formDiaper, key)
		});
	};
	fillDiaperPreview (diaper);
	createProfileImage (diaper, 1, 1);
	createImagesOnLeftSide (diaper, 1)
	createPatternsProfileImages (diaper)
	setClassesToParameters ();
	enableMainImageChange (diaper);
	enablePatternChange (diaper);
	createTemplate ('pattern-name-template', 'pattern-name', {'name': diaper.diaper.patterns[0].name});
	setTimeout(function(){console.log('UUUUU', diaper)}, 3000)
}

function removeBorderFromImages (images) {
	Array.from(images).forEach(function(img){
		img.classList.remove('border-primary');
		img.classList.remove('border');
	});
}

function makeBorderOnImage (image) {
	image.classList.add('border');
	image.classList.add('border-primary');
}

function enableMainImageChange (diaper) {
	let images = $('.left-image');
	Array.from(images).forEach(function(image){
		image.onclick = function (event) {
			removeBorderFromImages (images);
			makeBorderOnImage (event.target);
			let patternNr = event.target.getAttribute('pattern-nr');
			let imageNr = event.target.getAttribute('image-nr');
			document.getElementById('profile-image-box').innerHTML = '';
			createProfileImage (diaper, patternNr, imageNr);
		}
	})
}

function enablePatternChange (diaper) {
	let images = $('.pattern-profile-image');
	Array.from(images).forEach(function(image){
		image.onclick = function (event) {
			removeBorderFromImages (images);
			makeBorderOnImage (event.target);
			let patternNr = event.target.getAttribute('pattern-nr');
			let imageNr = event.target.getAttribute('image-nr');
			document.getElementById('profile-image-box').innerHTML = '';
			createProfileImage (diaper, patternNr, imageNr);
			document.getElementById('images-left-box').innerHTML = '';
			createImagesOnLeftSide (diaper, patternNr);
			enableMainImageChange (diaper);
			let profileImage = document.getElementById('left-profile-image');
			makeBorderOnImage (profileImage);
			document.getElementById('pattern-name').innerHTML = '';
			let pattern = diaper.diaper.patterns.find(function(ptrn){
				return ptrn['pattern-nr'] == patternNr
			});
			createTemplate ('pattern-name-template', 'pattern-name', {'name': pattern.name});
		}
	})
}

function createImagesOnLeftSide (diaper, patternNr) {
	let patterns = diaper.diaper.images;
	const patternImages = patterns.filter(function(pattern){
		return (pattern['pattern-nr'] == patternNr)
	}).forEach(function(patternImage){
		if (patternImage['image-nr'] == 1) {
			patternImage.profile = true;
			patternImage.id = 'left-profile-image'
		}
		createTemplate ('left-image-template', 'images-left-box', {'image': patternImage})
	})
	let profileImage = document.getElementById('left-profile-image');
	makeBorderOnImage (profileImage);
}

function createProfileImage (diaper, patternNr, imageNr) {
	const patterns = diaper.diaper.images;
	let image = patterns.find(function(pattern){
		return pattern['image-nr'] == imageNr && pattern['pattern-nr'] == patternNr
	})
	createTemplate ('profile-image-template', 'profile-image-box', {'image': image})
}

function createPatternsProfileImages (diaper) {
	let patterns = diaper.diaper.images;
	let height = document.getElementsByClassName('left-image')[0].parentElement.offsetHeight;
	const profileImages = patterns.filter(function(pattern){
		return (pattern['image-nr'] == 1)
	})
	for (let i=0; i<profileImages.length; i++) {
		if (i%3 == 0 && i !== 0) {
			createTemplate ('devider-template', 'patterns-images-box');
		}
		if (profileImages[i]['pattern-nr'] == 1) {
			profileImages[i].profile = true;
			profileImages[i].id = 'first-profile-image'
		}
		createTemplate ('pattern-profile-image-template', 'patterns-images-box', {'image': profileImages[i]});
	}
	let firstImage = document.getElementById('first-profile-image');
	makeBorderOnImage (firstImage);
}

function loadItemData (key) {
	const promise = new Promise ((resolve, reject) => {
		let diaper;
		let dbRef = firebase.database().ref('mock-diapers/' + key + '/');
		dbRef.on('value', function(snap){
			diaper = snap.val();
			state.downloadedItem.attributes = diaper.attributes;
			state.downloadedItem.categoryData = diaper['category-data'];
			state.downloadedItem.sizes = diaper.sizes;
			state.downloadedItem.images = diaper.images;
			resolve (diaper)
		})
	});
	return promise
}

function fillProductMainInfo () {
	let itemPreview = $('#item-preview').html();
	Handlebars.registerHelper('printnewinfo', function(){
		return this['item-name']
	})
}

function fillSizesInfo () {
	let itemPreview = $('#item-preview').html();
	Handlebars.registerHelper('printsizesinfo', function(){
		return this.name + ' ' + this.min + ' - ' + this.max + ' kg';
	})
}

function addMarginToParameters () {
	let parameters = document.getElementsByClassName('parameters-row');
	Array.from(parameters).forEach(function(parameter){
		parameter.classList.add("my-3");
	})
}

function setClassesToParameters () {
	let parameters = document.getElementsByClassName('parameters-row');
	addMarginToParameters ();
	let parametersLeft = document.getElementsByClassName('parameter-column-left');
	Array.from(parametersLeft).forEach(function(parameter){
		parameter.classList.add("col-6");
	});
	let parametersRight = document.getElementsByClassName('parameter-column-right');
	Array.from(parametersRight).forEach(function(parameter){
		parameter.classList.add("col-6");
	})
}

function getCategoryData (category) {
	const promise1 = new Promise ((resolve, reject) => {
		let dbRef = firebase.database().ref(category + '/');
		let data = [];
		dbRef.once('value',   function(snapshot) {
		    snapshot.forEach(function(childSnapshot) {
		      var childData = childSnapshot.val();
		      data.push(childData);
		    });
		    resolve (data)
	  	});
	});
	return promise1
}

function createTemplate (templateId, parentId, data) {
	let template = $('#' + templateId).html();
	let compiledTemplate = Handlebars.compile(template);
	$('#' + parentId).append(compiledTemplate(data));
}
