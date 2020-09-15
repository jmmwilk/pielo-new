import * as diaperslist from '../mocks/diapers.js';
import * as productslist from '../views/productslist.js';
import * as reviewslist from '../mocks/reviews.js';
import * as form from '../views/form.js';

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

function fillProductMainInfo () {
	let productPageTemplate = $('#product-page-template').html();
	Handlebars.registerHelper('printinfo', function(){
		return this.name + ' ' + this.type + ' ' + this.fabricprint
	})
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
				console.log('sizeData', sizeData)
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

function getSizesShortcuts (diaper, data) {
	console.log('data', data)
	console.log('diaper', diaper)
	let sizeInfo = [];
	for (let i=0; i<diaper.sizes.length; i++) {
		for (let x=0; x<data.length; x++) {
			if (diaper.sizes[i] == data[x].name) {
				let size = {};
				size.shortcut = data[x].shortcut;
				size.name = data[x].name;
				size.id = data[x].id;
				size.min = diaper.sizesRange[i].min;
				size.max = diaper.sizesRange[i].max;
				sizeInfo.push(size);
			}
		}
	}
	return sizeInfo
}

export function fillMockDiaperPreview (diaper) {
	console.log('mock-diaper', diaper)
	createSizeButtons (diaper);
}





