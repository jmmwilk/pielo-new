import * as state from '../state.js';

let database = firebase.database();
let storage = firebase.storage();

export function createForm (data) {
	const promise = getFormCategories ();
	promise.then(function(formCategories){		
		console.log('data', data)
		createTemplate ('form-page-template', 'page')
		createTemplate ('diaper-category-template', 'form-page-wrapper');
		createNewInput (data, 'diaper-categories', 'diaper-categories-input');
		document.getElementById('diaper-category-button').onclick = function () {
			saveCategory ();
			let categoryData = findCategoryData (data);
			clearForm ();
			createFormNavigation ()
			createStructurePage (categoryData, formCategories)
			document.getElementById('form-button').onclick = function() {

			}

		}
	})
}

function createFormNavigation () {
	createTemplate ('form-template', 'form-page-wrapper')
	createTemplate ('nav-item-template', 'nav-items-wrapper', navItems);
}

function createStructurePage (categoryData, formCategories) {
	createTemplate ('structure-template', 'form-wrapper');
	
	if (categoryData.flaps == 'ask') {
		createTemplate ('flaps-template', 'structure');
	};
	if (categoryData.pocket == 'ask') {
		createTemplate ('pocket-template', 'structure');
	}
	if (categoryData.pocket == 'ask' || categoryData.pocket == true) {
		let pocketTypes = {'data': formCategories['pocket']} ;
		createTemplate ('pocket-types-template', 'structure');
		createTemplate ('new-input-template', 'pocket-types-select', pocketTypes);
	}
	if (categoryData.pocket == true) {
		document.getElementById('pocket-types').classList.remove("collapse");
	}
	$('.form-input').selectpicker();
	createTemplate ('button-template', 'structure');
}

function createNewInput (data, category, inputId) {
	let catData;
	for (let i=0; i<data.length; i++) {
		if (data[i].id == category) {
			catData = data[i];
		}
	}
	createTemplate ('new-input-template', inputId, catData);
	$('#' + inputId).selectpicker();
}

let navItems = {
	items: [
		{
			'name': 'Budowa'
		},
		{
			'name': 'Wymiary'
		},
		{
			'name': 'Materiały'
		},
		{
			'name': 'Inne'
		},
		{
			'name': 'Opis'
		}
	]
}

function findCategoryData (categories) {
	let chosenCategory;
	Array.from(categories).forEach(function(category){
		if (category.id == 'diaper-categories') {
			category.data.forEach(function(cat){
				if (cat.name == state.item.category) {
					chosenCategory = cat
					return
				}
			})
		}
	})
	return chosenCategory
}

export function getFormCategories () {
	const promise1 = new Promise ((resolve, reject) => {
		let dbRef = firebase.database().ref('form-categories/');
		let data = {};
		dbRef.once('value',   function(snapshot) {
		    data = snapshot.val();
		    resolve (data)
	  	});
	  	
	});
	return promise1
}

function saveCategory () {
	state.item.category = $('#diaper-categories-input').val()[0]
}

function clearForm () {
	document.getElementById('form-page-wrapper').innerHTML = '';
}

function createTemplate (templateId, parentId, data) {
	let template = $('#' + templateId).html();
	let compiledTemplate = Handlebars.compile(template);
	$('#' + parentId).append(compiledTemplate(data));
}