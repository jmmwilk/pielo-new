import * as diaperslist from '../mocks/diapers.js';
import * as productslist from '../views/productslist.js';
import * as reviewslist from '../mocks/reviews.js';

export function createProductScreen (card) {
	let indexNumber = card.dataset.indexnumber;
	let diapers = diaperslist.items.diapers;
	for (let i=0; i<diapers.length; i++) {
		if (indexNumber == diapers[i].indexnum) {
			fillProductMainInfo ();
			createProductPageTempate (i, diapers);
			createReviews (indexNumber);
			console.log(diapers[i].indexnum);
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
	console.log(selectedReviews.reviews)
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


