import * as index from '../index.js';

export function goToLoginScreen (categoriesData) {
	let loginIcon = document.getElementById('login-icon');
	loginIcon.onclick = function () {
		clearPage ();
		createLoginPage ();
		firebase.auth().signOut()
		checkForAuthStateChange ();
		enablelogIn (categoriesData);
		enableSignUp (categoriesData);
		enableLogOut ();
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

function enablelogIn (categoriesData) {
	const btnLogIn = document.getElementById('log-in');
	btnLogIn.addEventListener ('click', e => {
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		const auth = firebase.auth();
		const promise = auth.signInWithEmailAndPassword(email, password);
		goToStartPage (categoriesData);
	})
}

function goToStartPage (categoriesData) {
	clearPage ();
	index.createStartPage (categoriesData);
}

function enableSignUp (categoriesData) {
	const btnSignUp = document.getElementById('sign-up');
	btnSignUp.addEventListener ('click', e => {
		console.log('happy hindus')
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		const auth = firebase.auth();
		const promise = auth.createUserWithEmailAndPassword(email, password);
	})
}

function checkForAuthStateChange () {
	const btnLogOut = document.getElementById('log-out');
	let user;
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if (firebaseUser) {
			btnLogOut.classList.remove('d-none');
			console.log('firebaseUser', firebaseUser)
			user = firebaseUser;
			console.log('user', user)
		} else {
			btnLogOut.classList.add('d-none');
		}
		return firebaseUser
	})
	console.log ('user', user)
}

function enableLogOut () {
	const btnLogOut = document.getElementById('log-out');
	btnLogOut.addEventListener ('click', e => {
		firebase.auth().signOut()
	})
}


