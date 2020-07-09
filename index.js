import * as menu from './menu.js';
import * as diaperslist  from './diapers.js';
import * as nameslist  from './diaperstype.js';


let clickedMenuItem;

$(document).ready(function(){
	createSidebarMenu ();
	fillDiaperCards ();
	createDiapersTemplate ();
	printDiapers ();
	enableButton ();
	hideSurveyScreen ();
	createNamesInputTemplate ();
	createSizesInputTemplate ();
	createFabricsInputTemplate ();
})

function hideSurveyScreen () {
	let surveyScreen = document.getElementById('survey-screen');
	surveyScreen.classList.remove('d-block');
	surveyScreen.classList.add('d-none');
}

function showSurveyScreen () {
	let surveyScreen = document.getElementById('survey-screen');
	surveyScreen.classList.remove('d-none');
	surveyScreen.classList.add('d-block');
}

function enableButton () {
	let button = document.getElementById('add-diaper');
	button.onclick = function() {
		hideProductsScreen ();
		showSurveyScreen ();
	}
}

function hideProductsScreen () {
	let productsContainer = document.getElementById('products-container');
	productsContainer.classList.add('d-none')
}

function createSidebarMenu () {
	let categories = menu.sideBarMenu
	let menuTemplate = $('#menu-template').html();
	let compiledMenuTemplate = Handlebars.compile(menuTemplate);
	$('#menu-template').html(compiledMenuTemplate(categories))
}

function createDiapersTemplate () {
	let pieluchaTemplate = $('#pielucha-template').html();
	let compiledPieluchaTemplate = Handlebars.compile(pieluchaTemplate);
	$('#products-container').html(compiledPieluchaTemplate(diaperslist.items));
}

function fillDiaperCards () {
	let pieluchaTemplate = $('#pielucha-template').html();
	Handlebars.registerHelper('printdiaper', function(name){
		return this.name + ' ' + this.type + ' ' + this.fabricprint
	})
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

function createNamesInputTemplate () {
	let namesInputTemplate = $('#names-input-template').html();
	let compiledNamesInputTemplate = Handlebars.compile(namesInputTemplate);
	$('#form-input-name').html(compiledNamesInputTemplate(nameslist.diapers));
}

function createSizesInputTemplate () {
	let sizesInputTemplate = $('#sizes-input-template').html();
	let compiledSizesInputTemplate = Handlebars.compile(sizesInputTemplate);
	$('#input-size').html(compiledSizesInputTemplate(menu.sideBarMenu.categories[3]));
}

function createFabricsInputTemplate () {
	let fabricsInputTemplate = $('#fabrics-input-template').html();
	let compiledfabricsInputTemplate = Handlebars.compile(fabricsInputTemplate);
	$('#input-fabric').html(compiledfabricsInputTemplate(menu.sideBarMenu.categories[1]));
}





