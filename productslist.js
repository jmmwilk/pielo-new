import * as diaperslist from './diapers.js';
import * as productpage from './productpage.js';

let clickedMenuItem;

export function createProductsList () {
	let productsContainer = document.createElement('div');
	productsContainer.id = 'products-container';
	productsContainer.className = 'col-md-10 d-flex flex-row row row-cols-1 row-cols-md-2 row-cols-lg-3 w-100';
	let page = document.getElementById('page');
	page.appendChild(productsContainer);
	fillDiaperCards ();
	createDiapersTemplate ();
	printDiapers ();
	enableCardClick ();
}

export function removeProductsList () {
	let productsContainer = document.getElementById('products-container');
	let page = document.getElementById('page');
	page.removeChild('productsContainer');
}

function fillDiaperCards () {
	let pieluchaTemplate = $('#pielucha-template').html();
	Handlebars.registerHelper('printdiaper', function(name){
		return this.name + ' ' + this.type + ' ' + this.fabricprint
	})
}

function createDiapersTemplate () {
	let pieluchaTemplate = $('#pielucha-template').html();
	let compiledPieluchaTemplate = Handlebars.compile(pieluchaTemplate);
	$('#products-container').html(compiledPieluchaTemplate(diaperslist.items));
}

function createNewDiapersTemplate (newItems) {
	let pieluchaTemplate = $('#pielucha-template').html();
	let compiledPieluchaTemplate = Handlebars.compile(pieluchaTemplate);
	$('#products-container').html(compiledPieluchaTemplate(newItems));
}

function printDiapers () {
	let menuItems = document.getElementsByClassName('menu-item');
	Array.from(menuItems).forEach(function(menuItem) {
		menuItem.onclick = function() {
			clickedMenuItem = menuItem;
			let category = findCategory ();
			let newItems = {'diapers': []} ;
			let dpr;
			for (let i=0; i<diaperslist.items.diapers.length; i++) {
				dpr = diaperslist.items.diapers[i][category].toLowerCase();
				if (dpr == clickedMenuItem.id) {
					newItems.diapers.push(diaperslist.items.diapers[i]);
				} else {
				}
			}
			removeCards ();
			createNewDiapersTemplate (newItems);
			fillDiaperCards ();
		}
	})
}

function enableCardClick () {
	let cards = document.getElementsByClassName('card');
	Array.from(cards).forEach(function(card) {
		card.onclick = function () {
			removeProductsContainer ();
			productpage.createProductScreen (card);
		}
	})
}

function removeProductsContainer () {
	let productsContainer = document.getElementById('products-container');
	let page = document.getElementById('page');
	page.removeChild(productsContainer);
}

function findCategory () {
	let category;
	let isItType = clickedMenuItem.classList.contains('type');
	let isItFabric = clickedMenuItem.classList.contains('fabric');
	let isItSize = clickedMenuItem.classList.contains('size');
	let isItBrand = clickedMenuItem.classList.contains('brand');
	if (isItType == true) {
		category = 'name';
		return category
	};
	if (isItFabric == true) {
		category = 'fabric';
		return category
	};
	if (isItSize == true) {
		category = 'size';
		return category
	};
	if (isItBrand == true) {
		category = 'brand';
		return category
	};
}

function removeCards () {
	let productsContainer = document.getElementById('products-container')
	let cards = document.getElementsByClassName('card');
	Array.from(cards).forEach(function(card) {
		productsContainer.removeChild(card)
	})
}