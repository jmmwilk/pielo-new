import * as state from '../state.js';

let database = firebase.database();
let storage = firebase.storage();
let formPageNumber = 0;
let formPageName;

export function createForm () {
	getAttributes()
	.then(function(){
		getAttributesText ();
		getAnswersOptions ();
	})
	.then(function(){
		createTemplate ('form-view-template', 'page')
		createDiaperCategoriesPage ()
		document.getElementById('next-button').onclick = function () {
			let formPageNames = getformPageNames ()
			formPageName = formPageNames[formPageNumber];
			saveChosenCategoryData ();
			clearFormWrapper ();
			createFormNavigation ();
			createFormPage ();
			activateNavItem ();
			document.getElementById('next-button').onclick = function() {
				saveAnswers ();
				formPageNumber = formPageNumber + 1
				formPageName = formPageNames[formPageNumber];
				clearForm();
				createFormPage ();
			}
		}
	})
}

function activateNavItem () {
	document.getElementById(formPageName + '-nav').classList.add('active');
}

function createFormPage () {
	let formPageNameData = {'formPageName': formPageName}
	createTemplate ('form-page-template', 'form-wrapper', formPageNameData);
	createFormQuestions ();
}

function createFormQuestions () {
	let diaper = state.item.categoryData
	let attributes = state.attributes;
	attributes.forEach(function(attribute){
		let attributeId = attribute.id;
		const filteredAttributes = attributes.filter(function(attribute) {
			return !(!diaper[attributeId] || attribute['form-page-name'] !== formPageName);
		})
		if (attribute['question-type'] !== 'dependent' && attribute['input-type'] == 'checkbox'){
			if (diaper[attributeId].answer == 'ask') {
				createCheckboxInput (attributeId);
				if (attribute['dependent-questions']) {
					createDependentQuestions (attribute, attributes)
				}
			}
			if (diaper[attributeId].answer == true) {
				if (attribute['dependent-questions']) {
					createDependentQuestions (attribute, attributes)
				}
			}
		};
		if (attribute['question-type'] == 'dependent'
			&& attribute['parent-id'] !== formPageName
			&& state.item.answers['parent-id'] == true) {
			createSelectInput (attributeId)
		}
	})
}

function createDependentQuestions (attribute, attributes) {
	Array.from(attribute['dependent-questions']).forEach(function(depAttribute){
		let depAttributeId = depAttribute.id
		let attributeId = attribute.id;
		createSelectInput (depAttributeId);
		let depAttributeData = findDependentAttributeData (attributes, depAttributeId);
		if (state.item.categoryData[depAttributeId].answer == 'ask'
			&& depAttributeData['input-type'] == 'select'
			&& state.item.categoryData[attributeId].answer !== true) {
			collapseElement (depAttributeId + '-box', attributeId);
		}
	})
}

function collapseElement (elementId, parentId) {
	document.getElementById(parentId).setAttribute("data-toggle", "collapse");
	document.getElementById(parentId).setAttribute("aria-expanded", false);
	document.getElementById(parentId).setAttribute("href", "#" + elementId);
	document.getElementById(parentId).setAttribute("aria-controls", elementId);
	document.getElementById(elementId).setAttribute("collapse", "collapse");
	document.getElementById(elementId).classList.add('collapse')
}

function findDependentAttributeData (attributes, depAttributeId) {
	let dependentAttribute;
	Array.from(attributes).forEach(function(attribute){
		if (attribute.id == depAttributeId) {
			dependentAttribute = attribute
			return
		}
	})
	return dependentAttribute
}

function createCheckboxInput (attributeId) {
	let data = {};
	let diaper = state.item.categoryData;
	let attributes = state.attributesText
	Array.from(attributes).forEach(function(attribute){
		if (attribute['question-id'] == attributeId) {
			Array.from(attribute.options).forEach(function(option){
				if (option.name == diaper[attributeId]['answer-options']) {
					data['text'] = option.text
					data['question-id'] = attributeId;					
				}
			})
		}
	})
	createTemplate ('checkbox-input-template', formPageName, data);
}

function createSelectInput (attributeId) {
	let data = {};
	let diaper = state.item.categoryData;
	let attributes = state.attributesText;
	Array.from(attributes).forEach(function(attribute){
		if (attribute['question-id'] == attributeId) {
			Array.from(attribute.options).forEach(function(option){
				if (option.name == diaper[attributeId]['answer-options']) {
					data['text'] = option.text;
					data['question-id'] = attributeId;
				}
			})
		}
	})
	let answersData = {};
	createTemplate ('select-input-template', formPageName, data);
	let answers = state.answersOptions;
	Array.from(answers).forEach(function(answer) {
		if (answer.id == diaper[attributeId]['answer-options']) {
			answersData.data = answer.options
		}
	})
	createTemplate ('new-input-template', attributeId, answersData);
	$('#' + attributeId).selectpicker();
}

function saveAnswers () {
	let checkboxes = document.getElementsByClassName('form-input checkbox');
	Array.from(checkboxes).forEach(function(checkbox){
		state.item.answers[checkbox.id] = checkbox.checked;
	})

	let selects = $('.form-input .select');
	Array.from(selects).forEach(function(select){
		let parentId = Array.from(state.attributes).find(function(formCategory){
			return formCategory.id == select.id
		})['parent-id'];
		if (state.item.answers[parentId] == true) {
			state.item.answers[select.id] = $('#' + select.id).val();
		}
	})
}

function saveChosenCategoryData () {
	state.item.category = $('#diaper-categories-input').val()[0]
	state.item.categoryData = findCategoryData (state.diaperCategories);
}

function createDiaperCategoriesPage () {
	let diaperCategories = {'data': state.diaperCategories}
	createTemplate ('diaper-category-template', 'form-view-wrapper');
	createTemplate ('new-input-template', 'diaper-categories-input', diaperCategories);
	$('#diaper-categories-input').selectpicker();
}

function createFormNavigation () {
	let navItems = {'form-pages': formPages}
	createTemplate ('form-template', 'form-view-wrapper')
	createTemplate ('nav-item-template', 'nav-items-wrapper', navItems);
}

let formPages = [
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


function getformPageNames () {
	return Array.from(formPages).map(function(formPage){
		return formPage.id
	})
}

function findCategoryData (categories) {
	return Array.from(categories).find(function(category){
		return category.name == state.item.category
	})
}

export function getAttributes () {
	const promise1 = new Promise ((resolve, reject) => {
		let dbRef = firebase.database().ref('form-categories/');
		let data = [];
		dbRef.once('value',   function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
		      var childData = childSnapshot.val();
		      state.attributes.push(childData);
		    });
		    resolve ()
	  	});
	});
	return promise1
}

function getAttributesText () {
	let dbRef = firebase.database().ref('form-questions-text/');
	dbRef.once('value',   function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
	      var childData = childSnapshot.val();
	      state.attributesText.push(childData);
	    });
  	});
}

function getAnswersOptions () {
	const promise1 = new Promise ((resolve, reject) => {
		let dbRef = firebase.database().ref('form-answers/');
		dbRef.once('value',   function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
		      var childData = childSnapshot.val();
		      state.answersOptions.push(childData);
		    });
		    resolve ()
	  	});
	  	
	});
	return promise1
}

function clearFormWrapper () {
	document.getElementById('form-view-wrapper').innerHTML = '';
}

function clearForm () {
	document.getElementById('form-wrapper').innerHTML = '';
}

function createTemplate (templateId, parentId, data) {
	let template = $('#' + templateId).html();
	let compiledTemplate = Handlebars.compile(template);
	$('#' + parentId).append(compiledTemplate(data));
}