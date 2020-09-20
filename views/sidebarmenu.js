import * as menu from '../mocks/menu.js';
import * as productslist from '../views/productslist.js';
import * as form from '../views/form.js';

export function createSideBar () {
	const promise = form.getCategories ();
	promise.
	then(function(data) {
		const promise2 = form.getCategoriesData (data);
		console.log(JSON.stringify('333data', data));
		promise2.
		then(function(data) {
			console.log(JSON.stringify('222data', data));
			console.log ('111data', data)
			createSideBarTemplate (data);
			productslist.enableAllDiapersClick ();
		})
	})
}

export function removeSidebarMenu () {
	let sideBarMenu = document.getElementById('side-bar');
	let page = document.getElementById('page');
	page.removeChild(sideBarMenu);
}

function createSideBarTemplate (data) {

	console.log('data', data)
	console.log('data.brands', data.brands)
	console.log('data[brands]', data['brands'])
//	let categories = menu.sideBarMenu;
	let categories = data;
	let sideBarTemplate = $('#sidebar-template').html();
	let compiledSideBarTemplate = Handlebars.compile(sideBarTemplate)
	$('#page').append(compiledSideBarTemplate(categories))
}