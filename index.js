import * as menu from './menu.js';

import * as diaperslist  from './diapers.js'

let clickedMenuItem;

$(document).ready(function(){
	createSidebarMenu ();
	fillDiaperCards ();
	createDiapersTemplate ();
	printDiapers ();
})

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
		return this.name + ' ' + this.type + ' ' + this.fabric
	})
}

function createNewDiapersTemplate (newItems) {
	console.log(newItems)
	let pieluchaTemplate = $('#pielucha-template').html();
	console.log('pieluchaTemplate', pieluchaTemplate)
	let compiledPieluchaTemplate = Handlebars.compile(pieluchaTemplate);
	$('#products-container').html(compiledPieluchaTemplate(newItems));
}

function printDiapers () {
	let menuItems = document.getElementsByClassName('menu-item');
	Array.from(menuItems).forEach(function(menuItem) {
		menuItem.onclick = function() {
			clickedMenuItem = menuItem;
			let newItems = {'diapers': []} ;
			let dpr;
			for (let i=0; i<diaperslist.items.diapers.length; i++) {
				dpr = diaperslist.items.diapers[i].name.toLowerCase();
				console.log (dpr);
				console.log(clickedMenuItem.id);
				if (dpr == clickedMenuItem.id) {
					console.log('yes!')
					newItems.diapers.push(diaperslist.items.diapers[i]);
				} else {
					console.log('no!')
				}
			}
			removeCards ();
			createNewDiapersTemplate (newItems);
			fillDiaperCards ();
		}
	})
	
	// let pieluchaTemplate = $('#pielucha-template').html();
	// let compiledPieluchaTemplate = Handlebars.compile(pieluchaTemplate);
	// $('#products-container').html(compiledPieluchaTemplate(diaperslist.items));
}

function removeCards () {
	let productsContainer = document.getElementById('products-container')
	let cards = document.getElementsByClassName('card');
	Array.from(cards).forEach(function(card) {
		productsContainer.removeChild(card)
	})
}

function saveClickedMenuItem () {
	let menuItems = document.getElementsByClassName('menu-item');
	Array.from(menuItems).forEach(function(menuItem) {
		menuItem.onclick = function() {
			clickedMenuItem = menuItem;
			console.log(clickedMenuItem)
		}
	})
}



//co zostalo klikniete, zrobic wlasciwa tablice przejezdzajac petla, uzywajac templejtu stworz nowy
