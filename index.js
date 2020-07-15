import * as menu from './menu.js';
import * as diaperslist  from './diapers.js';
import * as nameslist  from './diaperstype.js';

let formInputs = {
	'inputs': [
		{
			'text': 'Nazwa',
			'id': 'input-name',
			'source': menu.sideBarMenu.categories[0]
		},
		{
			'text': 'Rozmiar',
			'id': 'input-size',
			'source': menu.sideBarMenu.categories[3]
		},
		{
			'text': 'Materiał',
			'id': 'input-fabric',
			'source': menu.sideBarMenu.categories[1]
		},
		{
			'text': 'Producent',
			'id': 'input-brand',
			'source': menu.sideBarMenu.categories[4]
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
	hideDiaperScreen ();
	createForm ();
	createInputsContainersTemplate ();
	createFormInputTemplate ();
	enableCardClick ();
})

function enableCardClick () {
	let cards = document.getElementsByClassName('card');
	Array.from(cards).forEach(function(card) {
		card.onclick = function () {
			removeCards ();
			hideProductsScreen ();
			showDiaperScreen ();
			fillDiaperScreen (card);
		}
	})
}

function fillDiaperScreen (card) {

}

function showDiaperScreen () {
	let diaperScreen = document.getElementById('diaper-screen');
	diaperScreen.style.display = ''
}

function hideDiaperScreen () {
	let diaperScreen = document.getElementById('diaper-screen');
	diaperScreen.style.display = 'none'
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

function createFormInputTemplate () {
	for (let i=0; i<4; i++) {
		let src = formInputs.inputs[i].source;
		let id = formInputs.inputs[i].id;
		let formInputTemplate = $('#input-template').html();
		let compiledFormInputTemplate = Handlebars.compile(formInputTemplate);
		$('#' + id).html(compiledFormInputTemplate(src));
	}
}

function createInputsContainersTemplate () {
	let inputsContainersTemplate = $('#inputs-container').html();
	let compiledInputsContainersTemplate = Handlebars.compile(inputsContainersTemplate);
	$('#inputs-container').html(compiledInputsContainersTemplate(formInputs))
}

function createForm () {
	let form = $('#form-template').html();
	let compiledForm = Handlebars.compile(form);
	$('#form-screen').html(compiledForm());
}




