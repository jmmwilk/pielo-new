import * as menu from './menu.js';
import * as diaperslist  from './diapers.js';
import * as nameslist  from './diaperstype.js';
import * as productslist from './productslist.js';
import * as sidebarmenu from './sidebarmenu.js';
import * as form from './form.js';

$(document).ready(function(){
	sidebarmenu.createSideBar ();
	productslist.createProductsList ();
	enableButton ();
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

// function showDiaperScreen () {
// 	let diaperScreen = document.getElementById('diaper-screen');
// 	diaperScreen.style.display = ''
// }

// function hideDiaperScreen () {
// 	let diaperScreen = document.getElementById('diaper-screen');
// 	diaperScreen.style.display = 'none'
// }

// function hideFormScreen () {
// 	let formScreen = document.getElementById('form-screen');
// 	formScreen.style.display = 'none';
// }

// function showFormScreen () {
// 	let formScreen = document.getElementById('form-screen');
// 	formScreen.style.display = '';
// }

// function hideProductsScreen () {
// 	let productsContainer = document.getElementById('products-container');
// 	productsContainer.style.display = 'none';
// }

// function hideSideBar () {
// 	let sideBar = document.getElementById('side-bar');
// 	sideBar.style.display = 'none';
// }


