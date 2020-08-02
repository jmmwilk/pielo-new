import * as menu from '../mocks/menu.js';
import * as productslist from '../views/productslist.js';
import * as sidebarmenu from '../views/sidebarmenu.js';
import * as form from '../views/form.js';
import * as login from '../views/login.js';

let database = firebase.database();

$(document).ready(function(){
	sidebarmenu.createSideBar ();
	productslist.createProductsList ();
	enableButton ();
	login.enableLogin ();
	setData();
})

function enableButton () {
	let button = document.getElementById('add-diaper');
	button.onclick = function() {
		removePage ();
		form.createForm ();
	}
}

function removePage () {
	let application = document.getElementById('application');
	let page = document.getElementById('page');
	application.removeChild(page);
}


function setData () {
	let zupa = document.getElementById('zupa');
	let dbRef = firebase.database().ref('zupy/').child('pomidorowa');
	 dbRef.on('value', snap => console.log(snap.val()));
	// get() = moge uzyc once()
		// firebase.database().ref('zupy/').set({
	 //    'kalafiorowa': 'niesmaczna',
	 //  });
	console.log('kupa kupa');
	// function writeUserData(Zenon) {
	// 	firebase.database().ref('form/' + userId).set({
	// 	    name: valueName,
	// 	});
	// }
}