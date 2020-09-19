import * as diaperslist from '../mocks/diapers.js';
import * as productslist from '../views/productslist.js';
import * as reviewslist from '../mocks/reviews.js';
import * as form from '../views/form.js';

let database = firebase.database();

export function createProductScreen (card) {
	let indexNumber = card.dataset.indexnumber;
	let diapers = diaperslist.items.diapers;
	for (let i=0; i<diapers.length; i++) {
		if (indexNumber == diapers[i].indexnum) {
			fillProductMainInfo ();
			createProductPageTempate (i, diapers);
			createReviews (indexNumber);
			enableSizeButton();
		}
	};
}

function createProductPageTempate (i, diapers) {
	let productPageTemplate = $('#product-page-template').html();
	let compiledProductPageTemplate = Handlebars.compile(productPageTemplate);
	$('#page').append(compiledProductPageTemplate(diaperslist.items.diapers[i]));
}

export function removeProductScreen () {
	let page = document.getElementById('page');
	let main = document.getElementById('main');
	page.removeChild(main);
}

function createReviews (indexNumber) {
	let selectedReviews = selectReviews (indexNumber);
	createReviewsTemplate (selectedReviews);
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

function createReviewsTemplate (selectedReviews) {
	let reviewTemplate = $('#review-template').html();
	let compiledReviewTemplate = Handlebars.compile(reviewTemplate);
	$('#reviews-container').html(compiledReviewTemplate(selectedReviews))
}

function enableSizeButton () {
	let nbText = 'New Born 3-5 kg';
	let mosText = 'Mini One Size 4-9 kg';
	let osText = 'One Size 6-12 kg';

	let nb = document.getElementById('nb');
	let mos = document.getElementById('mos');
	let os = document.getElementById('os');

	let text = document.getElementById('size-description');

	nb.onclick = function(){text.innerText = nbText};
	mos.onclick = function(){text.innerText = mosText};
	os.onclick = function(){text.innerText = osText};
}

function createSizeButtons (diaper) {
	const promise = form.getCategoryData ('sizes');
	promise.then(function(data) {
		let sizeInfo = getSizesShortcuts (diaper, data);
		let object = {'sizes': sizeInfo};
		console.log('object', object)
		createSizeButtonsTemplate (object);
		let buttons = document.getElementsByClassName('size-button');
		Array.from(buttons).forEach(function(button){
			button.onclick = function (event) {
				let sizeData = {};
				console.log('event', event)
				let buttonId = event.target.id;
				for (let i=0; i<sizeInfo.length; i++) {
					if (buttonId == sizeInfo[i].id) {
						sizeData = {'size': sizeInfo[i]};
					}
				}
				createSizeRangeTemplate (sizeData);
			}
		})
	});
}

function createSizeRangeTemplate (sizeData) {
	let sizeRangeTemplate = $('#size-range-template').html();
	let compiledSizeRangeTemplate = Handlebars.compile(sizeRangeTemplate);
	$('#size-description').html(compiledSizeRangeTemplate(sizeData));
}

function createSizeButtonsTemplate (object) {
	let sizeButtonsTemplate = $('#size-buttons-template').html();
	let compiledSizeButtonsTemplate = Handlebars.compile(sizeButtonsTemplate);
	$('#size-buttons-container').append(compiledSizeButtonsTemplate(object));
}

function createParametersTemplate (diaper) {
	let parametersTemplate = $('#parameters-template').html();
	let compiledParametersTemplate = Handlebars.compile(parametersTemplate);
	$('#parameters').html(compiledParametersTemplate(diaper));
}

function getSizesShortcuts (diaper, data) {
	console.log('diaper', diaper)
	console.log('diaper.sizes.length', diaper.diaper.sizes.length)
	let sizeInfo = [];
	for (let i=0; i<diaper.diaper.sizes.length; i++) {
		for (let x=0; x<data.length; x++) {
			if (diaper.diaper.sizes[i] == data[x].name) {
				let size = {};
				size.shortcut = data[x].shortcut;
				size.name = data[x].name;
				size.id = data[x].id;
				size.min = diaper.diaper.sizesRange[i].min;
				size.max = diaper.diaper.sizesRange[i].max;
				sizeInfo.push(size);
			}
		}
	}
	return sizeInfo
}

function fillMockDiaperPreview (diaper) {
	createSizeButtons (diaper);
	createParametersTemplate (diaper);
}

export function createPreviewScreen (key) {
	fillProductMainInfo ();
	fillSizesInfo ();
	let diaper = loadItemData (key);
	createPreviewTemplate (key)
	fillMockDiaperPreview (diaper);
	setClassesToParameters ();
}

function createPreviewTemplate (key) {
	let dbRef = firebase.database().ref('diapers-mocks/' + key + '/');
	let previewTemplate = $('#item-preview').html();
	let compiledPreviewTemplate = Handlebars.compile(previewTemplate);
	dbRef.on('value', function(snap){
		$('#page').html(compiledPreviewTemplate(snap.val()))
	})
}

function loadItemData (key) {
	let diaper;
	let dbRef = firebase.database().ref('diapers-mocks/' + key + '/');
	dbRef.on('value', function(snap){
		diaper = snap.val()
	})
	console.log ('diaper', diaper)
	return diaper
}

function fillProductMainInfo () {
	let itemPreview = $('#item-preview').html();
	Handlebars.registerHelper('printnewinfo', function(){
		return this.diaperCategory[0]
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

