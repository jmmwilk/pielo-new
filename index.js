import * as menu from '../mocks/menu.js';
import * as productslist from '../views/productslist.js';
import * as sidebarmenu from '../views/sidebarmenu.js';
import * as form from '../views/form.js';
import * as login from '../views/login.js';

$(document).ready(function(){
	sidebarmenu.createSideBar ();
	productslist.createProductsList ();
	enableButton ();
	login.enableLogin ();
//	enableHomeClick ();
})

function enableButton () {
	let button = document.getElementById('add-diaper');
	button.onclick = function() {
		removePage ();
		form.createForm ();
	}
}

// function enableHomeClick () {
// 	let home = document.getElementById('home');
// 	home.onclick = function () {
// 		productslist.createProductsList ();
// 	}
// }

function removePage () {
	let application = document.getElementById('application');
	let page = document.getElementById('page');
	application.removeChild(page);
}


function setData () {
	 let zupa = document.getElementById('zupa');

	 let dbRef = firebase.database().ref('zupy/');
	// dbRef.on('value', snap => console.log(snap.val()));
	  dbRef.on('value', snap => zupa.innerText = snap.val());
	 
//	 addNewZupa ();
	 addAnotherZupa ();
}

function addAnotherZupa () {
	var zupaRef = firebase.database().ref("zupy");

	var newZupaRef = zupaRef.push();
	newZupaRef.set({
	  3: "pomidorowa",
	});
}

function addNewZupa() {
  // A post entry.
  var postData = {
    '1': 'ogorkowa',
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref('zupy/').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/zupy/'] = postData;

  return firebase.database().ref().update(updates);
}