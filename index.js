let menu = {
	'categories': [
		{
			'name': 'Rozmiar',
			'types': [
				'New Born',
				'Small',
				'Mini One Size',
				'One Size',
				'Medium',
				'One Size Plus',
				'Large'
			]
		},

		{
			'name': 'Materiał',
			'types': [
				'Wełna',
				'PUL',
				'Bawełna',
				'Bambus',
				'Len',
				'Mikrofibra',
				'Konopie'
			]
		},

		{
			'name': 'Rodzaj',
			'types': [
				'Otulacz',
				'Gatki',
				'Longi',
				'AIO',
				'SIO',
				'Kieszonka',
				'Kąpieluszki',
				'Trenerki',
				'Wkłady'
			]
		}
	]
}

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
			'type': undefined,
			'brand': 'Puppi',
			'size': 'New Born'
		}
	]
}

$(document).ready(function(){
	let menuTemplate = $('#menu-template').html();
	let compiledMenuTemplate = Handlebars.compile(menuTemplate);
	console.log(compiledMenuTemplate(menu.categories[0]));
	$('#side-bar').html(compiledMenuTemplate(menu.categories[0]));
});

$(document).ready(function(){
	let pieluchaTemplate = $('#pielucha-template').html();
	let compiledPieluchaTemplate = Handlebars.compile(pieluchaTemplate);
	$('#pielucha').html(compiledPieluchaTemplate(items));
})
