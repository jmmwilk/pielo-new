import * as menu from '../mocks/menu.js';
import * as productslist from '../views/productslist.js';
import * as sidebarmenu from '../views/sidebarmenu.js';
import * as form from '../views/form.js';
import * as login from '../views/login.js'

$(document).ready(function(){
	sidebarmenu.createSideBar ();
	productslist.createProductsList ();
	enableButton ();
	login.enableLogin ();
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


