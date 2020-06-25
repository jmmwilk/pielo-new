import * as menu from './menu.js';

let items = {
	'diapers': [
		{
			'photo': 'pielucha',
			'name': 'Formowanka',
			'type': 'Kieszonka',
			'brand': 'Jellyfish',
			'size': 'One Size'
		},
		{
			'photo': 'puppi',
			'name': 'Otulacz',
			'type': 'blabla',
			'brand': 'Puppi',
			'size': 'New Born'
		}
	]
}

// $(document).ready(function(){
// 	let menuTemplate = $('#menu-template').html();
// 	let compiledMenuTemplate = Handlebars.compile(menuTemplate);
// 	console.log(compiledMenuTemplate(menu.categories[0]));
// 	$('#side-bar').html(compiledMenuTemplate(menu.categories[0]));
// });

// $(document).ready(function(){
// 	let pieluchaTemplate = $('#pielucha-template').html();
// 	let compiledPieluchaTemplate = Handlebars.compile(pieluchaTemplate);
// 	$('#pielucha').html(compiledPieluchaTemplate(items));
// })


$(document).ready(function(){
	let categories = menu.sideBarMenu
	let menuTemplate = $('#menu-template').html();
	let compiledMenuTemplate = Handlebars.compile(menuTemplate);
	$('#side-bar').html(compiledMenuTemplate(categories))
})