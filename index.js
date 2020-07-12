import * as menu from './menu.js';
import * as diaperslist  from './diapers.js';
import * as nameslist  from './diaperstype.js';

let formInputs = {
	'inputs': [
		{
			'text': 'Rozmiar',
			'id': 'input-size',
			'number': 3
		},
		{
			'text': 'Materiał',
			'id': 'input-fabric',
			'number': 1
		},
		{
			'text': 'Producent',
			'id': 'input-brand',
			'number': 4
		},
	]
}

let clickedMenuItem;

$(document).ready(function(){
	createSidebarMenu ();
	fillDiaperCards ();
	createDiapersTemplate ();
	printDiapers ();
	enableButton ();
	hideFormScreen ();
	createInputs ();
	createFormTemplates ();
	enableCardClick ();
})

function enableCardClick () {
	let cards = document.getElementsByClassName('card');
	Array.from(cards).forEach(function(card) {
		card.onclick = function () {
			removeCards ();
			hideProductsScreen ();
			showDiaperScreen (card);
		}
	})
}

function showDiaperScreen (card) {

}

function createFormTemplates () {
	createNamesInputTemplate ();
	createForm ();
}

function hideFormScreen () {
	let formScreen = document.getElementById('form-screen');
	formScreen.style.display = 'none';
}

function showFormScreen () {
	let formScreen = document.getElementById('form-screen');
	formScreen.style.display = '';
}

function enableButton () {
	let button = document.getElementById('add-diaper');
	button.onclick = function() {
		removeCards ();
		hideProductsScreen ();
		hideSideBar ();
		showFormScreen ();
	}
}

function hideProductsScreen () {
	let productsContainer = document.getElementById('products-container');
	productsContainer.style.display = 'none';
}

function hideSideBar () {
	let sideBar = document.getElementById('side-bar');
	sideBar.style.display = 'none';
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
	$('#input-name').html(compiledNamesInputTemplate(nameslist.diapers));
}

function createFormInputTemplate (i) {
	let number = formInputs.inputs[i].number;
	let id = formInputs.inputs[i].id;
	console.log(number)
	console.log('#' + id)
	let formInputTemplate = $('#input-template').html();
	let compiledFormInputTemplate = Handlebars.compile(formInputTemplate);
	$('#' + id).html(compiledFormInputTemplate(menu.sideBarMenu.categories[number]));
}

function createInputs () {
	let formTemplate = $('#container').html();
	let compiledFormTemplate = Handlebars.compile(formTemplate);
	$('#inputs-container').html(compiledFormTemplate(formInputs.inputs))
}

function createForm () {
	for (let i=0; i<3; i++) {
		createFormInputTemplate (i)
	}
}

