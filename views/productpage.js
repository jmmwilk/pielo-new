import * as diaperslist from '../mocks/diapers.js';
import * as productslist from '../views/productslist.js';
import * as reviewslist from '../mocks/reviews.js';
import * as form from '../views/form.js';
import * as state from '../state.js';

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
		createPreviewScreen (diaper, view);
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
	createTemplate ('size-buttons-template', 'size-buttons-container', diaper);
	let buttons = document.getElementsByClassName('size-button');
	Array.from(buttons).forEach(function(button){
		button.onclick = function (event) {
			let sizeData = {};
			let sizeName = event.target.getAttribute('size');
			let sizes = diaper.diaper.sizes;
			for (let i=0; i<sizes.length; i++) {
				if (sizeName == sizes[i].id) {
					sizeData = {'size': sizes[i]};
				}
			};
			document.getElementById('size-description').innerHTML = '';
			createTemplate ('size-range-template', 'size-description', sizeData);
		};
	});
}

function createDimensions (diaper) {
	createTemplate('dimensions-template', 'attributes-right', diaper);
	let buttons = document.getElementsByClassName('dimensions-button');
	Array.from(buttons).forEach(function(button){
		console.log('button', button)
		let sizeName = button.getAttribute('size');
		let size = diaper.diaper.sizes.find(function(size){
			return sizeName == size.id
		});
		let dimensionsData = [];
		Array.from(size.dimensions).forEach(function(sizeDimension){
			let dimensionData = getDimensionTitle (sizeDimension.id, diaper);
			dimensionData.value = sizeDimension.value;
			dimensionsData.push(dimensionData);
			console.log('dimensionData', dimensionData)
		});
		console.log('dimensionsData', dimensionsData)
		createTemplate ('dimensions-values-template', 'dimensions-wrapper', {'dimensions': dimensionsData});

		// button.onclick = function (event) {
		// 	event.stopPropagation ();
		// 	console.log('zenek')
		// 	let sizeName = event.target.getAttribute('size');
		// 	let size = diaper.diaper.sizes.find(function(size){
		// 		return sizeName == size.id
		// 	});
		// 	Array.from(size.dimensions).forEach(function(sizeDimension){
		// 		dimensionData = getDimensionTitle (sizeDimension.id, diaper);
		// 		console.log('dimensionData', dimensionData)
		// 	});
		// 	createTemplate ('dimensions-values-template', 'dimensions-wrapper', dimensionsData);
		// };
	});
}

function getDimensionTitle (dimensionId, diaper) {
	let dimensionData = {};
//	let diaper = state.newItem.categoryData.attributes;
	Array.from(state.attributesTitles).forEach(function(attributeTitle){
		if (attributeTitle['attribute-id'] == dimensionId) {
			const textGroups = Object.values(attributeTitle['text-groups']);
			Array.from(textGroups).forEach(function(group){
				if (group.id == diaper.diaper['category-data'].attributes[dimensionId]['title-group-id']) {
					dimensionData['title'] = group.text
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
		console.log('parametersGroup', parametersGroup)
		createTemplate ('parameters-group-wrapper-template', 'attributes-left', {'parameters-group': parametersGroup});
		let parameters = getParameters (diaper, parametersGroup);
		let parametersBox = parametersGroup.id + '-parameters-group';
		createTemplate ('attribute-template', parametersBox, {'parameters': parameters});
	})
	
	createDimensions (diaper)
	let sizes = diaper.diaper.sizes
}



function getParameters (diaper, parametersGroup) {
	let parameters = [];
	let diaperAttributes = Object.keys(diaper.diaper.attributes);
	let categoryAttributes = diaper.diaper['category-data'].attributes;
	Array.from(parametersGroup.attributes).forEach(function(attribute){
		let diaperAttribute = diaperAttributes.find(function(diaperAtt){
			return attribute.id == diaperAtt
		});
		if (diaperAttribute !== undefined) {
			parameters.push(attribute)
		} 
	});
	const filteredParameters = parameters.filter(function(parameter) {
		let parameterId = parameter.id;
		return (diaper.diaper['category-data'].attributes[parameterId].answer !== true)
	})
	let attributesToPrint = [];
	filteredParameters.forEach(function(parameter){
		let parameterId = parameter.id;
		let attributeToPrint = {};

		attributeToPrint.title = parameterId;

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
			attributeToPrint.value = attributeValue;
		}
		// let titleGroups = Array.from(state.attributesTitles).find(function(attributeTitle){
		// 	return attributeTitle['attribute-id'] == parameterId
		// })
		// console.log('titleGroups', titleGroups)
//		Object
		attributeToPrint.title = getParameterTitle (parameterId);
		attributesToPrint.push(attributeToPrint);
	})
	return attributesToPrint
}

function getParameterTitle (parameterId) {
	let diaper = state.newItem.categoryData.attributes;
	let titles = state.attributesTitles;
	let titleText;
	Array.from(titles).forEach(function(title){
		if (title['attribute-id'] == parameterId) {
			const textGroups = Object.values(title['text-groups']);
			Array.from(textGroups).forEach(function(group){
				if (group.id == diaper[parameterId]['title-group-id']) {
					titleText = group.text;
//					questionData['question-id'] = attributeId;
					return
				}
			})
		}
	})
	return titleText
}

export function createPreviewScreen (diaper, view) {
	console.log('diaper', diaper)
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
	}
	fillDiaperPreview (diaper);
	createProfileImage (diaper, 1, 1);
	createPatternsProfileImages (diaper)
	createImagesOnLeftSide (diaper, 1)
	setClassesToParameters ();
	enableMainImageChange (diaper);
	enablePatternChange (diaper);
}

function removeBorderFromImages (images) {
	Array.from(images).forEach(function(img){
		img.classList.remove('border-primary');
	});
}

function makeBorderOnImage (image) {
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
	const profileImages = patterns.filter(function(pattern){
		return (pattern['image-nr'] == 1)
	}).forEach(function(profileImage){
		if (profileImage['pattern-nr'] == 1) {
			profileImage.profile = true;
			profileImage.id = 'first-profile-image'
		}
		createTemplate ('pattern-profile-image-template', 'patterns-images-box', {'image': profileImage})
	})
	let firstImage = document.getElementById('first-profile-image');
	makeBorderOnImage (firstImage);
}

// function createPreviewTemplate (key) {
// 	let dbRef = firebase.database().ref('diapers-mocks/' + key + '/');
// 	let previewTemplate = $('#item-preview').html();
// 	let compiledPreviewTemplate = Handlebars.compile(previewTemplate);
// 	dbRef.on('value', function(snap){
// 		$('#page').html(compiledPreviewTemplate(snap.val()))
// 	})
// }

function loadItemData (key) {

	const promise = new Promise ((resolve, reject) => {
		let diaper;
		let dbRef = firebase.database().ref('mock-diapers/' + key + '/');
		dbRef.on('value', function(snap){
			diaper = snap.val();
			console.log('diaper', diaper)
			state.downloadedItem.attributes = diaper.attributes;
			state.downloadedItem.categoryData = diaper['category-data'];
			state.downloadedItem.sizes = diaper.sizes;
			state.downloadedItem.images = diaper.images;
			console.log('state.downloadedItem', state.downloadedItem)
			resolve (diaper)
		})
	});
	return promise

	// let diaper;
	// let dbRef = firebase.database().ref('diapers-mocks/' + key + '/');
	// dbRef.on('value', function(snap){
	// 	diaper = snap.val();
	// 	console.log ('diaper', diaper)
	// })
	// console.log ('diaper', diaper)
	// return diaper
}

function fillProductMainInfo () {
	let itemPreview = $('#item-preview').html();
	Handlebars.registerHelper('printnewinfo', function(){
		return this['category-data'].name
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
		parameter.classList.add("mb-3");
	})
}

function setClassesToParameters () {
	let parameters = document.getElementsByClassName('parameters-row');
	Array.from(parameters).forEach(function(parameter){
		parameter.classList.add("mb-2");
	});
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

function stopProp () {
	$('#ar-child-title').click(function( event ) {
	  	event.stopPropagation();
	});
}

function createTemplate (templateId, parentId, data) {
	let template = $('#' + templateId).html();
	let compiledTemplate = Handlebars.compile(template);
	$('#' + parentId).append(compiledTemplate(data));
}


// aria-expanded="false" aria-controls="ar-child-wrapper" data-toggle="collapse" href="#ar-child-wrapper"
//streched-link
//button
