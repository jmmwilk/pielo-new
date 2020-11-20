import * as state from '../state.js';

let database = firebase.database();
let storage = firebase.storage();
let viewNumber = 0;
let view;

export function createForm (data) {
	const promise = getFormCategories ();
	promise.then(function(formCategories){		
		createTemplate ('form-page-template', 'page')
		createDiaperCategoriesPage (data)
		document.getElementById('diaper-category-button').onclick = function () {
			let views = getViews ()
			view = views[viewNumber];
			saveCategoryData (data)
			clearFormWrapper ();
			createFormNavigation ()
			createStructurePage (state.item.categoryData, formCategories)
			document.getElementById('form-button').onclick = function() {
				saveAnswers ();
				viewNumber = viewNumber + 1
				view = views[viewNumber];
				console.log('view', view)
				clearForm()
			}

		}
	})
}

function saveAnswers () {
	if (view == 'structure') {
		let flaps = document.getElementById('flaps')
		console.log('flaps', flaps)
		if (flaps !== null) {
			if (flaps.checked == true) {
				state.item.answers.flaps = true;
			} else {
				state.item.answers.flaps = false;
			}
		}
		let pockets = document.getElementById('pocket');
		if (pockets !== null) {
			if (pockets.checked == true) {
				state.item.answers.pocket = true;
				state.item.answers['pocket-types'] = $('#pocket-types-select').val();
			} else {
				state.item.answers.pocket = false;
				state.item.answers['pocket-types'] = false;
			}
		}
		console.log('state.item', state.item)
	}
}

function saveCategoryData (data) {
	state.item.category = $('#diaper-categories-input').val()[0]
	let categoryData = findCategoryData (data);
	state.item.categoryData = categoryData;
}

function createDiaperCategoriesPage (data) {
	let diaperCategories = getDiaperCategories (data);
	createTemplate ('diaper-category-template', 'form-page-wrapper');
	createTemplate ('new-input-template', 'diaper-categories-input', diaperCategories);
	$('#diaper-categories-input').selectpicker();
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

function getDiaperCategories (data) {
	let diaperCategories;
	for (let i=0; i<data.length; i++) {
		if (data[i].id == 'diaper-categories') {
			diaperCategories = data[i];
			return diaperCategories
		}
	}
}

let navItems = {
	items: [
		{
			'name': 'Budowa',
			'id': 'structure',
		},
		{
			'name': 'Materiały',
			'id': 'fabrics',
		},
		{
			'name': 'Wymiary',
			'id': 'dimensions',
		},
		{
			'name': 'Inne',
			'id': 'others',
		},
		{
			'name': 'Opis',
			'id': 'description',
		}
	]
}

function getViews () {
	let formViews = [];
	Array.from(navItems.items).forEach(function(navItem){
		formViews.push(navItem.id)
	})
	return formViews
}

// let views = ['structure', 'fabrics', 'dimensions', 'others', 'description'];

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

function clearFormWrapper () {
	document.getElementById('form-page-wrapper').innerHTML = '';
}

function clearForm () {
	document.getElementById('form-wrapper').innerHTML = '';
}

function createTemplate (templateId, parentId, data) {
	let template = $('#' + templateId).html();
	let compiledTemplate = Handlebars.compile(template);
	$('#' + parentId).append(compiledTemplate(data));
}