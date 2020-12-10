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
			let buttonId = event.target.id;
			let sizes = diaper.diaper.sizes;
			for (let i=0; i<sizes.length; i++) {
				if (buttonId == sizes[i].shortcut) {
					sizeData = {'size': sizes[i]};
				}
			}
			createTemplate ('size-range-template', 'size-description', sizeData);
		}
	})
}

function fillDiaperPreview (diaper) {
	createSizeButtons (diaper);
	createTemplate ('parameters-template', 'parameters', diaper);
	let parameters = getParameters (diaper)
	createTemplate ('attribute-template', 'attributes-left', {'parameters': parameters});
}

function getParameters (diaper) {
	console.log('diaper', diaper)
	let parameters = [];
	let diaperAttributes = Object.keys(diaper.diaper.attributes);
	let categoryAttributes = diaper.diaper['category-data'].attributes;
	Array.from(state.attributesOrder.structure).forEach(function(attribute){
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
			attributeToPrint.value = 'tak';
		}
		if (attributeValue == false) {
			attributeToPrint.value = 'nie';
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
		console.log('attributeToPrint.title', attributeToPrint.title)
		attributesToPrint.push(attributeToPrint);
	})
	console.log('attributesToPrint', attributesToPrint)
	return attributesToPrint
}

function getParameterTitle (parameterId) {
	let diaper = state.newItem.categoryData.attributes;
	let titles = state.attributesTitles;
	let titleText;
	console.log('titles', titles)
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
	fillProductMainInfo ();
	fillSizesInfo ();
	createTemplate ('item-preview', 'page', diaper)
	if (view == 'productScreen') {
		createTemplate ('stars-box-template', 'stars-box-wrapper');
		createTemplate ('reviews-box-template', 'product-page');
		createTemplate ('add-review-template', 'add-review-form-wrapper', diaper);
		createTemplate ('detail-reviews-summary-template', 'detail-summary-wrapper');
		createTemplate ('add-review-child-template', 'ar-child-wrapper');
//		stopProp ();
	}
	fillDiaperPreview (diaper);
	setClassesToParameters ();
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
			state.downloadedItem.attributes = diaper.attributes;
			state.downloadedItem.categoryData = diaper['category-data'];
			state.downloadedItem.sizes = diaper.sizes;
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
