import * as state from '/test/state.js';
import * as sidebarmenu from '/test/views/sidebar-menu/sidebarmenu.js';
import * as productslist from '/test/views/products-list/productslist.js';
import * as form from '/test/views/form/new-form.js';
import * as eventBus from '/test/eventBus.js';

export function createMainPage () {
	document.getElementById('application').innerHTML = '';
	createTemplate ('title-bar', 'application');
	createTemplate ('page', 'application');
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

function createTemplate (templateId, parentTemplate) {
	let template = Handlebars.templates[templateId];
	$('#' + parentTemplate).append(template());
}
