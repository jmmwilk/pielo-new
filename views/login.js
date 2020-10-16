import * as index from '../index.js';
import * as state from '../state.js';

let user;

export function goToLoginScreen (categoriesData) {
	let loginIcon = document.getElementById('login-icon');
	loginIcon.onclick = function () {
		clearPage ();
		createLoginPage ();
		firebase.auth().signOut();
		checkForAuthStateChange ();
		enablelogIn (categoriesData);
		enableLogOut ();
		enableCreateAccount (categoriesData);
	}
}

function enableCreateAccount (categoriesData) {
	let createAccountButton = document.getElementById('create-account');
	createAccountButton.onclick = function(){
		createAccountScreen ();
		enableSignUp (categoriesData);
	};
}

function createAccountScreen () {
	let subscribeTemplate = $('#subscribe-template').html();
	let compiledSubscribeTemplate = Handlebars.compile(subscribeTemplate);
	$('#page').html(compiledSubscribeTemplate());
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
		const roleCheckbox = document.getElementById('producer');
		let role;
		console.log('roleCheckbox.checked', roleCheckbox.checked);
		if (roleCheckbox.checked == true) {
			role = 'producer';
		} else {
			role = 'normalUser'
		}
		const auth = firebase.auth();
		const promise = auth.createUserWithEmailAndPassword(email, password);
		promise.then(function() {
		    firebase.auth().onAuthStateChanged(firebaseUser => {
				if (firebaseUser) {
					console.log('role', role)
					const promise = state.changeEventBus (role);
					promise
					.then (function () {
						state.eventBus.subscribe();
					})
				} else {
				}
			})
		  })
		goToStartPage (categoriesData);
	})
}

function checkForAuthStateChange () {
	const btnLogOut = document.getElementById('log-out');
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if (firebaseUser) {
			btnLogOut.classList.remove('d-none');
			console.log('firebaseUser', firebaseUser)
			user = firebaseUser;
			console.log('user123', user)
			const promise = state.changeEventBus ();
			promise
			.then (function () {
				state.eventBus.trigger();
			})
		} else {
			btnLogOut.classList.add('d-none');
		}
		console.log('state.eventBus', state.eventBus)
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


