import * as state from '../state.js';

let database = firebase.database();
let storage = firebase.storage();
let viewNumber = 0;
let view;

export function createForm (data) {
	console.log('data', data)


	const promise = getFormCategories ();
	promise.then(function(){
		getQuestionsText ();
	})
	.then(function(){
		getAnswersOptions ();
	})
	.then(function(){
		createTemplate ('form-page-template', 'page')
		createDiaperCategoriesPage (data)
		document.getElementById('diaper-category-button').onclick = function () {
			let views = getViews ()
			view = views[viewNumber];
			saveDiaperCategoryData (data);
			clearFormWrapper ();
			createFormNavigation ();
			createTemplate ('structure-template', 'form-wrapper');
			createFormQuestions ();
			$('.form-input').selectpicker();
			console.log('state.item', state.item)
//			createStructurePage (formCategories)
			// document.getElementById('form-button').onclick = function() {
			// 	saveAnswers ();
			// 	viewNumber = viewNumber + 1
			// 	view = views[viewNumber];
			// 	console.log('view', view)
			// 	clearForm()
			// }

		}
	})
}

function createFormQuestions () {
	console.log ('view', view)
	let diaper = state.item.categoryData
	console.log('diaper', diaper)
	let questions = state.formCategories.categories;
	console.log('questions', questions)
	questions.forEach(function(question){
		let questionId = question.id;
		if (!diaper[questionId]) {
			return
		};
		if (question.view !== view) {
			return
		}
		if (question['question-type'] == 'main' && question['input-type'] == 'checkbox'){
			if (diaper[questionId].answer == 'ask') {
				createCheckboxInput (questionId);
				if (question['dependent-questions']) {
					createDependentQuestions (question, questions)
				}
			}
			if (diaper[questionId].answer == true) {
				if (question['dependent-questions']) {
					createDependentQuestions (question, questions)
				}
			}
		};
		if (question['question-type'] == 'dependent'
			&& question['parent-id'] !== view
			&& state.item.answers['parent-id'] == true) {
			createSelectInput (questionId)
		}
	})

}

function createDependentQuestions (question, questions) {
	Array.from(question['dependent-questions']).forEach(function(depQuestion){
		let depQuestionId = depQuestion.id
		let depQuestionData = findDependentQuestionData (questions, depQuestionId);
		console.log('state.item.categoryData', state.item.categoryData)				
		if (state.item.categoryData[depQuestionId].answer == 'ask'
			&& depQuestionData['input-type'] == 'select') {
			createSelectInput (depQuestionId)
		}
	})
}

function findDependentQuestionData (questions, depQuestionId) {
	let dependentQuestion;
	Array.from(questions).forEach(function(question){
		if (question.id == depQuestionId) {
			dependentQuestion = question
			return
		}
	})
	return dependentQuestion
}

function createCheckboxInput (questionId) {
	let data = {};
	let diaper = state.item.categoryData;
	let questions = state.formCategories['questions-text']
	let questionText;
	Array.from(questions).forEach(function(question){
		if (question['question-id'] == questionId) {
			Array.from(question.options).forEach(function(option){
				if (option.name == diaper[questionId]['answer-options']) {
					questionText = option.text;
					data['text'] = questionText
					data['question-id'] = questionId;
				}
			})
		}
	})
	console.log ('questionText', questionText)
	createTemplate ('checkbox-input-template', 'structure', data);
}

function createSelectInput (questionId) {
	let data = {};
	let diaper = state.item.categoryData;
	let questions = state.formCategories['questions-text'];
	let questionText;
	Array.from(questions).forEach(function(question){
		if (question['question-id'] == questionId) {
			Array.from(question.options).forEach(function(option){
				if (option.name == diaper[questionId]['answer-options']) {
					questionText = option.text;
					data['text'] = questionText
					data['question-id'] = questionId;
				}
			})
		}
	})
	let answersData = {};
	console.log ('data', data)
	createTemplate ('select-input-template', 'structure', data);
	let answers = state.formCategories['answers-options'];
	Array.from(answers).forEach(function(answer) {
		if (answer['question-id'] == questionId) {
			answersData.data = answer.options
		}
	})
	createTemplate ('new-input-template', questionId, answersData);
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

function saveDiaperCategoryData (data) {
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

function createStructurePage (formCategories) {
	let categoryData = state.item.categoryData
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
		let data = [];
		dbRef.once('value',   function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
		      var childData = childSnapshot.val();
		      data.push(childData);
		    });
		    state.formCategories.categories = data;
		    resolve (data)
	  	});
	  	
	});
	return promise1
}

function getQuestionsText () {
	const promise1 = new Promise ((resolve, reject) => {
		let dbRef = firebase.database().ref('form-questions-text/');
		let data = [];
		dbRef.once('value',   function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
		      var childData = childSnapshot.val();
		      data.push(childData);
		    });
		    state.formCategories['questions-text'] = data;
		    resolve (data)
	  	});
	  	
	});
	return promise1
}

function getAnswersOptions () {
	const promise1 = new Promise ((resolve, reject) => {
		let dbRef = firebase.database().ref('form-answers/');
		let data = [];
		dbRef.once('value',   function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
		      var childData = childSnapshot.val();
		      data.push(childData);
		    });
		    state.formCategories['answers-options'] = data;
		    console.log ('answersdata', data)
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