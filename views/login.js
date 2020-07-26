export function enableLogin () {
	let loginIcon = document.getElementById('login-icon');
	loginIcon.onclick = function () {
		clearPage ();
		createLoginPage ();
	}
}

function clearPage () {
	let page = document.getElementById('page');
	page.innerHTML = '';
}

function createLoginPage () {
	let loginTemplate = $('#login-page-template').html();
	$('#page').html(loginTemplate);
}