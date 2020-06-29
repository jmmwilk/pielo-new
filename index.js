import * as menu from './menu.js';

let items = {
	'diapers': [
		{
			'photo': 'pielucha',
			'name': 'Formowanka',
			'type': 'Kieszonka',
			'brand': 'Jellyfish',
			'size': 'One Size',
			'fabric': 'bawełniana'
		},
		{
			'photo': 'puppi2',
			'name': 'Otulacz',
			'type': '',
			'brand': 'Puppi',
			'size': 'New Born',
			'fabric': 'wełniany'
		},
		{
			'photo': 'drimi',
			'name': 'Otulacz',
			'type': '',
			'brand': 'Drimi',
			'size': 'New Born',
			'fabric': 'wełniany'
		},
		{
			'photo': 'puppi2',
			'name': 'Otulacz',
			'type': '',
			'brand': 'Puppi',
			'size': 'New Born',
			'fabric': 'wełniany'
		},
		{
			'photo': 'puppi2',
			'name': 'Otulacz',
			'type': '',
			'brand': 'Puppi',
			'size': 'New Born',
			'fabric': 'wełniany'
		},
		{
			'photo': 'puppi2',
			'name': 'Otulacz',
			'type': '',
			'brand': 'Puppi',
			'size': 'New Born',
			'fabric': 'wełniany'
		}
	]
}

let pieluchaTemplate = $('#pielucha-template').html();

Handlebars.registerHelper('printdiaper', function(name){
		return this.name + ' ' + this.type + ' ' + this.fabric
	})

$(document).ready(function(){
	let pieluchaTemplate = $('#pielucha-template').html();
	let compiledPieluchaTemplate = Handlebars.compile(pieluchaTemplate);
	$('#products-container').html(compiledPieluchaTemplate(items));
})


$(document).ready(function(){
	let categories = menu.sideBarMenu
	let menuTemplate = $('#menu-template').html();
	let compiledMenuTemplate = Handlebars.compile(menuTemplate);
	$('#side-bar').html(compiledMenuTemplate(categories))
})
