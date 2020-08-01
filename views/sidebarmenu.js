import * as menu from '../mocks/menu.js';
import * as productslist from '../views/productslist.js';

export function removeSidebarMenu () {
	let sideBarMenu = document.getElementById('side-bar');
	let page = document.getElementById('page');
	page.removeChild(sideBarMenu);
}

function createSideBarTemplate () {
	let categories = menu.sideBarMenu;
	let sideBarTemplate = $('#sidebar-template').html();
	let compiledSideBarTemplate = Handlebars.compile(sideBarTemplate)
	$('#page').append(compiledSideBarTemplate(categories))
}

export function createSideBar () {
	createSideBarTemplate ();
	productslist.enableAllDiapersClick ();
}