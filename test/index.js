import * as productslist from '/test/views/productslist.js';
import * as sidebarmenu from '/test/views/sidebarmenu.js';
import * as form from '/test/views/new-form.js';
import * as login from '/test/views/login.js';
import * as eventBus from '/test/eventBus.js';
import * as state from '/test/state.js';

$(document).ready(function(){
	addDataToDatabase ();
	createTemplate ('title-bar-template', 'application');
	createTemplate ('page-template', 'application');
	eventBus.eventBus.subscribe('userLoggedIn', fillUserName);
	login.goToLoginScreen ();
})

export function createHomePage () {
	getCategories ().
	then(function(data) {
		getDiaperCategories ();
		getSizes ();
		getCategoriesData (data).
		then(function(categoriesData) {
			createStartPage (categoriesData);
			enableHomeClick (categoriesData);
			enableCreateFormButton ();
			
		});
	});
}
 
function getDiaperCategories () {
	const promise1 = new Promise ((resolve, reject) => {
		let dbRef = firebase.database().ref('diaper-categories/');
		dbRef.once('value',   function(snapshot) {
		    snapshot.forEach(function(childSnapshot) {
		      var childData = childSnapshot.val();
		      state.diaperCategories.push(childData);
		    });
		    resolve ()
	  	});
	});
}

function getSizes () {
	const promise1 = new Promise ((resolve, reject) => {
		let dbRef = firebase.database().ref('sizes/');
		dbRef.once('value',   function(snapshot) {
		    snapshot.forEach(function(childSnapshot) {
		      var childData = childSnapshot.val();
		      state.sizes.push(childData);
		    });
		    resolve ()
	  	});
	});
}

export function createTemplate (templateId, parentTemplate) {
	let template = $('#' + templateId).html();
	let compiledTemplate = Handlebars.compile(template);
	$('#' + parentTemplate).html(compiledTemplate());
}

function fillUserName () {
	let userNameBox = document.getElementById('user-name-box');
 	userNameBox.innerText = state.state.user.email
}

export function createStartPage (categoriesData) {
	sidebarmenu.createSideBar (categoriesData);
	productslist.createProductsList ();
}

function enableCreateFormButton () {
	let button = document.getElementById('add-diaper');
	button.onclick = function() {
		state.whereToAddNewItem.addTo = 'mock-diapers-preview';
		clearPage ();
		form.goToForm ('newItem');
	}
}

function enableHomeClick (categoriesData) {
	let home = document.getElementById('home');
	home.onclick = function () {
		clearPage ();
		createStartPage (categoriesData);
	}
}

export function clearPage () {
	let page = document.getElementById('page');
	page.innerHTML = '';
}

export function getCategories () {
	const promise1 = new Promise ((resolve, reject) => {
		let dbRef = firebase.database().ref('categories/');
		let data = [];
		dbRef.once('value',   function(snapshot) {
		    snapshot.forEach(function(childSnapshot) {
		      var childData = childSnapshot.val();
		      data.push(childData);
		    });
		    resolve (data)
	  	});
	  	
	});
	return promise1
}

export function getCategoriesData (data) {
	let categories = data;
	let categoriesData = [];
	let count = 0;
	const promise = new Promise ((resolve, reject) => {
		Array.from(categories).forEach(function(category){
		    let dbRef = firebase.database().ref(category.id + '/');
		    let categoryData = [];
		    dbRef.once('value',   function(snapshot) {
			    snapshot.forEach(function(childSnapshot) {
			      var childData = childSnapshot.val();
			      categoryData.push(childData);
			    });
			    count = count + 1;
				let object = {};
				object.data = categoryData;
				object.name = category.name;
				object['menu-name'] = category['menu-name'];
				object.id = category.id;
				object.issubmenu = category.issubmenu;
			    categoriesData.push(object);
			    if (count == categories.length) {
			    	resolve (categoriesData)
			    }
		  	});
		})
	});
	return promise
}

function addDataToDatabase () {
		// let dbRef = firebase.database().ref('diaper-categories/-MF0Ea0U4Yi9TXqG1WSw/');
	// dbRef.once('value',   function(snapshot) {
	//     snapshot.forEach(function(childSnapshot) {
	//       var childData = childSnapshot.val();
	//       console.log('childData', childData)
	//       let answer = childData['answer'];
	//       if (!answer) {
	//       	return
	//       }
	//       var childKey = childSnapshot.key
	//       console.log('childKey', childKey)

	//       let newDbRef = firebase.database().ref('diaper-categories/-MF0Ea0U4Yi9TXqG1WSw/attributes/' + childKey)
	//       newDbRef.update(childData)

	//       let newDbRef = firebase.database().ref('diaper-categories/-MF0Ea0U4Yi9TXqG1WSw/' + childKey)
	//       newDbRef.set(null)

	//     });
 //  	});

// 	let dbRef = firebase.database().ref('form-categories/');
// 	let newDbRef = dbRef.push();
// 	newDbRef.set({
// 	  'id': 'production-country-poland',
// 	  'input-type': 'checkbox',
// //	  'question-type': 'dependent',
// 	  'form-page-name': 'others',
// //	  'dependent-questions': [{'id': 'waterproof-layer-fabrics'}],
// //		'parent-id': ''
// 	});


	// let dbRef = firebase.database().ref('form-questions/');
	// let newDbRef = dbRef.push();
	// let key = newDbRef.key
	// newDbRef.set({
	//   'attribute-id': 'applications',
	// });
	// let groupRef = firebase.database().ref('form-questions/' + key +'/text-groups')
	// let newGroupRef = groupRef.push();
	// newGroupRef.set({
	// 	'id': 'applications-main',
	//  	'text': 'Aplikacje',
	// })

	// let dbRef = firebase.database().ref('attributes-titles/');
	// let newDbRef = dbRef.push();
	// let key = newDbRef.key
	// newDbRef.set({
	//   'attribute-id': 'applications',
	// });
	// let groupRef = firebase.database().ref('attributes-titles/' + key +'/text-groups')
	// let newGroupRef = groupRef.push();
	// newGroupRef.set({
	// 	'id': 'applications-main',
	//  	'text': 'Aplikacje',
	// })

	
// 	let dbbRef = firebase.database().ref('form-answers/');
// 	let newDbbRef = dbbRef.push();
// 	newDbbRef.set({
// 	  'id': 'applications',
// //	  'for-multiple-questions': true,
// 	  'options': [
// 	  		{	
// 	  		'name': 'Aplikacja wełniana',
// 	  		},
// 	  		{	
// 	  		'name': 'Aplikacja z chusty',
// 	  		},
// 	  		{	
// 	  		'name': 'Haft',
// 	  		},
// 	  	]
// 	});
}

