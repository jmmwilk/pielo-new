import * as state from '../state.js';

let database = firebase.database();
let storage = firebase.storage();
let formPageNumber = 0;
let formPageName;
let patternNumber = 0;

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
			document.getElementById(formPageName + '-nav').classList.add('font-weight-bold');
			createFormPage ();
			activateNavItem ();
			document.getElementById('next-button').onclick = activateNextButton;
		}
	})
}

function activateNextButton () {
	saveAnswers ();
	if (formPageName == 'description') {
//		goToItemPreview		
	}
	let formPageNames = getformPageNames ()
	formPageNumber = formPageNumber + 1
	formPageName = formPageNames[formPageNumber];
	document.getElementById(formPageName + '-nav').classList.add('font-weight-bold');
	clearForm();
	createFormPage ();
}

function activateNavItem () {
	document.getElementById(formPageName + '-nav').classList.add('active');
}

function createFormPage () {
	let formPageNameData = {'formPageName': formPageName}
	createTemplate ('form-page-template', 'form-wrapper', formPageNameData);
	if (formPageName == 'images') {
		createImagesPage ();
		return
	}
	if (formPageName == 'sizes') {
		createSizesQuestion ();
		return
	}
	if (formPageName == 'dimensions') {
		getDimensions ();
		createDimensionsPage ();
		return
	}
	createFormQuestions ();
}

function createImagesPage () {
	createTemplate ('add-pattern-button-template', formPageName);
	addPattern ();
	document.getElementById('add-pattern-button').onclick = function () {
		addPattern ();
	}
}

function addPattern () {
	patternNumber = patternNumber + 1;
	let imageNumbers = setImageNumber ();
	createTemplate ('add-pattern-template', formPageName, imageNumbers);
	state.item.images['patter-' + patternNumber] = {};
	loadImage ();
}

function loadImage () {
	Array.from($('.image-input')).forEach(function(input){
		$('#' + input.id).change(function(event) {
			if (event.target.files.length > 0) {
				createImagePreview (event, input);
				let patternNumberValue = input.getAttribute('pattern-number');
				let imageNumberValue = input.getAttribute('image-number');
				state.item.images['pattern-' + patternNumberValue] = {};
				state.item.images['pattern-' + patternNumberValue]['image-' + imageNumberValue] = {};
				addImageToStorage (input);
			}
		});
	})
}

function setImageNumber () {
	let imageNumbers = {
		'pattern-number': patternNumber, 
		'image-numbers': [
			{'image-number': 1, 
			'profile-image': true}, 
			{'image-number': 2}, 
			{'image-number': 3}, 
			{'image-number': 4}]
	};
	return imageNumbers
}

function createImagePreview (event, input) {
	let image = document.createElement('img');
	let box = document.getElementById('file-preview-' + input.id);
	box.innerHTML = '';
	image.className = 'small-image mx-auto img-fluid img-thumbnail m-1';
	image.src = URL.createObjectURL(event.target.files[0]);
	box.appendChild(image);
}

function addImageToStorage (input) {
	const selectedFile = document.getElementById(input.id).files[0];
	let dbRef = firebase.database().ref('images/');
	var newDbRef = dbRef.push();
	newDbRef.set({
	  'image': 'small'
	});
	let key = newDbRef.getKey(); 
	let imageRef = storage.ref().child(key);
	imageRef.put(selectedFile)
	.then(function(snapshot) {
	  	return imageRef.getDownloadURL();
	})
	.then(function(downloadURL) {
		let patternNumberValue = input.getAttribute('pattern-number');
		let imageNumberValue = input.getAttribute('image-number');
		state.item.images['patter-' + patternNumberValue] = {};
		state.item.images['patter-' + patternNumberValue]['image-' + imageNumberValue] = {};
		state.item.images['patter-' + patternNumberValue]['image-' + imageNumberValue].url = downloadURL;
		return downloadURL
	})
}

function createFormQuestions () {
	let diaper = state.item.categoryData.attributes;
	let attributes = state.attributes;

	const filteredAttributes = attributes.filter(function(attribute) {
		let attributeId = attribute.id;
		return !(!diaper[attributeId] || attribute['form-page-name'] !== formPageName);
	})

	filteredAttributes.forEach(function(attribute){
		let attributeId = attribute.id;
		if (attribute['question-type'] !== 'dependent'){
			if (attribute['input-type'] == 'checkbox') {
				if (diaper[attributeId].answer == 'ask') {
					createCheckboxInput (attributeId);
					if (attribute['dependent-questions']) {
						createDependentQuestions (attribute, filteredAttributes)
					}
				}
				if (diaper[attributeId].answer == true) {
					if (attribute['dependent-questions']) {
						createDependentQuestions (attribute, filteredAttributes)
					}
				}
			};
			if (attribute['input-type'] == 'select') {
				createSelectInput (attributeId);
			};
			if (attribute['input-type'] == 'text-input') {
				createTextInput (attributeId);
			};
		};
		let parentId = attribute['parent-id'];
		if (attribute['question-type'] == 'dependent'
			&& state.item.answers[parentId] == true) {
			let parentFormPageName = attributes.find(function(att){
				return att.id == parentId
			})['form-page-name']
			if (parentFormPageName !== formPageName) {
				createSelectInput (attributeId);
			}
			
		}
	})
}

function createDependentQuestions (attribute, attributes) {
	let diaper = state.item.categoryData.attributes
	Array.from(attribute['dependent-questions']).forEach(function(depAttribute){
		let depAttributeId = depAttribute.id
		let isThisFormPageName = isThisFormPage (state.attributes, depAttributeId);
		if (isThisFormPageName == false) {
			return
		}
		let attributeId = attribute.id;
		createSelectInput (depAttributeId);
		let depAttributeData = findDependentAttributeData (state.attributes, depAttributeId);
		if (diaper[depAttributeId].answer == 'ask'
			&& depAttributeData['input-type'] == 'select'
			&& diaper[attributeId].answer !== true) {
			collapseElement (depAttributeId + '-box', attributeId);
		}
		document.getElementById(depAttributeId + '-box').classList.add('mb-3')
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

function isThisFormPage (attributes, depAttributeId) {
	let isThisFormPage;
	Array.from(attributes).forEach(function(attribute){
		if (attribute.id == depAttributeId) {
			if (attribute['form-page-name'] !== formPageName)
			isThisFormPage = false
			return
		}
	})
	return isThisFormPage
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
	let questionData = getQuestionText (attributeId)
	createTemplate ('checkbox-input-template', formPageName, questionData);
}

function createTextInput (attributeId) {
	createTemplate ('text-input-template', formPageName, {'id': attributeId});
}

function createSelectInput (attributeId) {
	let questionData = getQuestionText (attributeId)
	createTemplate ('select-input-template', formPageName, questionData);
	let answersData = {};
	let answers = state.answersOptions;
	let diaper = state.item.categoryData.attributes;
	Array.from(answers).forEach(function(answer) {
		if (answer.id == diaper[attributeId]['answer-options-id']) {
			answersData.data = answer.options
		}
	})
	createTemplate ('new-input-template', attributeId, answersData);
	$('#' + attributeId).selectpicker();
}

function getQuestionText (attributeId) {
	let questionData = {};
	let diaper = state.item.categoryData.attributes;
	let questions = state.questionsText
	Array.from(questions).forEach(function(question){
		if (question['attribute-id'] == attributeId) {
			const textGroups = Object.values(question['text-groups']);
			Array.from(textGroups).forEach(function(group){
				if (group.id == diaper[attributeId]['question-text-group-id']) {
					questionData['text'] = group.text
					questionData['question-id'] = attributeId;
					return
				}
			})
		}
	})
	return questionData
}

function saveAnswers () {
	if (formPageName == 'sizes') {
		state.item.sizes = [];
		let chosenSizes = $('#sizes-input').val();
		let databaseSizes = state.sizes;
		chosenSizes.forEach(function(chosenSize){
			let sizeData = databaseSizes.find(function(databaseSize){
				return chosenSize == databaseSize.name
			})
			state.item.sizes.push(sizeData);
		})
		return
	}
	if (formPageName == 'dimensions') {
		saveDimensions ();
		return
	}
	if (formPageName == 'images') {
		savePatternNames ();
		return
	}
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
	let textInputs = $('.text-input');
	Array.from(textInputs).forEach(function(input){
		state.item.answers[input.id] = $('#' + input.id).val();
	})
}

function savePatternNames () {
	let patterNamesInputs = $('.pattern-name');
	state.item.answers.patterns = {};
	Array.from(patterNamesInputs).forEach(function(input){
		let patternNumberValue = input.getAttribute('pattern-number');
		state.item.answers.patterns[patternNumberValue] = {};
		let inputId = input.id
		let name = $('#' + inputId).val();
		state.item.answers.patterns[patternNumberValue].name = $('#' + input.id).val();
	})
}

function saveChosenCategoryData () {
	state.item.category = $('#diaper-categories-input').val()[0]
	state.item.categoryData = findCategoryData (state.diaperCategories);
	const attributes = Object.values(state.item.categoryData.attributes);
	attributes.forEach(function(attribute){
		if (attribute.answer == true) {
			let attributeId = attribute.id;
			state.item.answers[attributeId] = attribute.answer;
		}
	});
}

function createDimensionsPage () {
	let sizes = state.item.sizes;
	createTemplate ('dimensions-page-template', formPageName, {'sizes': sizes});
	let dimensions = state.item.dimensions;
	dimensions.forEach(function(dimension){
		let title = getQuestionText (dimension.id)
		createTemplate ('dimension-title-template', 'dimensions-titles', {'dimension-text': title.text});
	})
	createTemplate ('size-inputs-column-template', 'inputs-box', {'sizes': sizes});
	sizes.forEach(function(size){
		createTemplate ('size-input-template', size.shortcut + '-inputs-box', {'dimensions': dimensions, 'size': size});
	})
	let inputHeight = document.getElementsByClassName('dimension-input')[0].offsetHeight;
	Array.from(document.getElementsByClassName('dimension-title')).forEach(function(title){
		title.style.height = inputHeight + 'px'
	})
}

function saveDimensions () {
	let sizes = state.item.sizes;
	let dimensions = state.item.dimensions;
	let inputs = document.getElementsByClassName('dimension-input')
	sizes.forEach(function(size){
		size.dimensions = {};
		Array.from(inputs).forEach(function(input){
			Array.from(dimensions).forEach(function(dimension){
				if (input.classList.contains(size.id) && input.classList.contains(dimension.id)) {
					let dimensionId = dimension.id;
					size.dimensions[dimensionId] = input.value;
				}
			})
		})
	})
}

function getDimensions () {
	let attributes = state.attributes
	let diaper = state.item.categoryData.attributes;
//	let dimensions = attributes
	const filteredAttributes = attributes.filter(function(attribute) {
		let attributeId = attribute.id;
//		return !(!diaper[attributeId] || attribute['form-page-name'] !== formPageName);
		return (attribute.dimension == true && diaper[attributeId]);
	})
	state.item.dimensions = filteredAttributes;

}

function createDiaperCategoriesPage () {
	let diaperCategories = {'data': state.diaperCategories}
	createTemplate ('diaper-category-template', 'form-view-wrapper');
	createTemplate ('new-input-template', 'diaper-categories-input', diaperCategories);
	$('#diaper-categories-input').selectpicker();
}

function createSizesQuestion () {
	let sizes = {'data': state.sizes};
	createTemplate ('form-sizes-template', 'sizes');
	createTemplate ('new-input-template', 'sizes-input', sizes);
	$('#sizes-input').selectpicker();
}

function createFormNavigation () {
	let navItems = {'form-pages': formPages}
	createTemplate ('form-template', 'form-view-wrapper')
	createTemplate ('nav-item-template', 'nav-items-wrapper', navItems);
}

let formPages = [
	{
		'name': 'Zdjęcia',
		'id': 'images',
	},
	{
		'name': 'Budowa',
		'id': 'structure',
	},
	{
		'name': 'Materiały',
		'id': 'fabrics',
	},
	{
		'name': 'Rozmiary',
		'id': 'sizes',
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
	let dbRef = firebase.database().ref('form-questions/');
	dbRef.once('value',   function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
	      var childData = childSnapshot.val();
	      state.questionsText.push(childData);
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