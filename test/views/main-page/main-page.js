import * as state from '/test/state.js';
import * as sidebarmenu from '/test/views/sidebar-menu/sidebarmenu.js';
import * as productslist from '/test/views/products-list/productslist.js';
import * as form from '/test/views/form/new-form.js';
import * as general from '/test/general.js';
import * as eventBus from '/test/eventBus.js';

export function createMainPage () {
	document.getElementById('application').innerHTML = '';
	createTemplate ('title-bar', 'application');
	createTemplate ('page', 'application');
	getSizes ()
	getDiaperCategories ().
	then(function() {
		createStartPage ();
		enableHomeClick ();
		enableCreateFormButton ();
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

function getDiaperCategories () {
	const promise = new Promise ((resolve, reject) => {
		let dbRef = firebase.database().ref('diaper-categories/');
		dbRef.once('value',   function(snapshot) {
		    snapshot.forEach(function(childSnapshot) {
		      var childData = childSnapshot.val();
		      state.diaperCategories.push(childData);
		    });
//		    console.log ('state.diaperCategories', state.diaperCategories)
		    resolve ()
	  	});
	});
	return promise
}

function fillUserName () {
	let userNameBox = document.getElementById('user-name-box');
 	userNameBox.innerText = state.state.user.email
}

export function createStartPage () {
	sidebarmenu.createSideBar ();
	productslist.createProductsList ();
}

function enableCreateFormButton () {
	let button = document.getElementById('add-diaper');
	button.onclick = function() {
		state.whereToAddNewItem.addTo = 'mock-diapers-preview';
		clearPage ();
		window.location.href='#new-form';
		general.updateHistory('#new-form');
		form.goToForm ('newItem');
	}
}

function enableHomeClick () {
	let home = document.getElementById('home');
	home.onclick = function () {
		clearPage ();
		window.location.href='#main-page';
		general.updateHistory('#main-page');
		createStartPage ();
	}
}

function clearPage () {
	let page = document.getElementById('page');
	page.innerHTML = '';
}

function createTemplate (templateId, parentTemplate) {
	let template = Handlebars.templates[templateId];
	$('#' + parentTemplate).append(template());
}