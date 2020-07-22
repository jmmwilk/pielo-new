import * as diaperslist from './diapers.js';

export function createProductScreen (card) {
	let productPage = document.createElement('div');
	productPage.id = 'product-page';
	productPage.className = 'col-md-10 d-flex flex-column order-1';
	let page = document.getElementById('page');
	page.appendChild(productPage);
	let indexNumber = card.dataset.indexnumber;
	let diapers = diaperslist.items.diapers;
	for (let i=0; i<diapers.length; i++) {
		if (indexNumber == diapers[i].indexnum) {
			fillProductMainInfo ();
			createProductPageTempate (i);
		}
	}
}

function createProductPageTempate (i, diapers) {
	let productPageTemplate = $('#product-page-template').html();
	let compiledProductPageTemplate = Handlebars.compile(productPageTemplate);
	$('#product-page').html(compiledProductPageTemplate(diaperslist.items.diapers[i]));
}

function fillProductMainInfo () {
	let productPageTemplate = $('#product-page-template').html();
	Handlebars.registerHelper('printinfo', function(){
		return this.name + ' ' + this.type + ' ' + this.fabricprint
	})
}