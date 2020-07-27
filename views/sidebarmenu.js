import * as menu from '../mocks/menu.js';
import * as productslist from '../views/productslist.js';

export function removeSidebarMenu () {
	let sideBarMenu = document.getElementById('side-bar');
	let page = document.getElementById('page');
	page.removeChild(sideBarMenu);
}

function createSideBarTemplate () {
	console.log('banana')
	let categories = menu.sideBarMenu;
	let sideBarTemplate = $('#sidebar-template').html();
	let compiledSideBarTemplate = Handlebars.compile(sideBarTemplate)
	$('#page').html(compiledSideBarTemplate(categories))
}

export function createSideBar () {
	// let sideBar = document.createElement('nav');
	// sideBar.id = 'side-bar';
	// sideBar.className = 'col-md-2 align-items-start order-1';
	// let page = document.getElementById('page');
	// page.appendChild(sideBar);
	createSideBarTemplate ();
//	productslist.enableAllDiapersClick ();
}