import * as index from '../index.js';
import * as state from '../state.js';
import * as eventBus from '../eventBus.js';

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

		promise.then(function() {
		    firebase.auth().onAuthStateChanged(firebaseUser => {
				if (firebaseUser) {
					const promise2 = findUserInDatabase (firebaseUser);
					promise2.then(function(user) {
						let role = user.role;
						const promise3 = new Promise ((resolve, reject) => {
							changeState (role)
							resolve()
						});
						promise3.then (function () {
							eventBus.eventBus.trigger('userLoggedIn');
						})
					})
				} else {
				}
			})
		})

		goToStartPage (categoriesData);
	})
}

function findUserInDatabase (firebaseUser) {
	const promise = new Promise ((resolve, reject) => {
		const promise2 = getAllUsersFromDatabase ();
		promise2.then(function(data) {
			for (let i=0; i<data.length; i++) {
				if (firebaseUser.uid == data[i].user.uid) {
					resolve (data[i].user)
				}
			}
		})
	})
	return promise
}

function getAllUsersFromDatabase () {
	const promise1 = new Promise ((resolve, reject) => {
		let dbRef = firebase.database().ref('users/');
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

function goToStartPage (categoriesData) {
	clearPage ();
	index.createStartPage (categoriesData);
}

function enableSignUp (categoriesData) {
	eventBus.eventBus.subscribe('userLoggedIn', createUserInFirestore);
	const btnSignUp = document.getElementById('sign-up');
	btnSignUp.addEventListener ('click', e => {
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		const roleCheckbox = document.getElementById('producer');
		let role;
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
					const promise = new Promise ((resolve, reject) => {
						changeState (role)
						resolve()
					});
					promise.then (function () {
						eventBus.eventBus.trigger('userLoggedIn');
					})
				} else {
				}
			})
		})
		goToStartPage (categoriesData);
	})
}

function changeState (role) {
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if (firebaseUser) {
			state.state.user = firebaseUser;
			state.state.userRole = role;
		}
	})
}

function createUserInFirestore () {
	let user = {};
	user.uid = state.state.user.uid;
	user.email = state.state.user.email;
	user.role = state.state.userRole
	let dbRef = firebase.database().ref('users/');
	var newDbRef = dbRef.push();
	newDbRef.set({
	  user
	});
	// let key = newDbRef.getKey();
	// return key
}

function checkForAuthStateChange () {
	const btnLogOut = document.getElementById('log-out');
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if (firebaseUser) {
			btnLogOut.classList.remove('d-none');
			user = firebaseUser;
//			eventBus.eventBus.trigger('subscribe')

			// const promise = state.changeEventBus ();
			// promise
			// .then (function () {
			// 	state.eventBus.trigger();
			// })
		} else {
			btnLogOut.classList.add('d-none');
		}
		return firebaseUser
	})
}

function enableLogOut () {
	const btnLogOut = document.getElementById('log-out');
	btnLogOut.addEventListener ('click', e => {
		firebase.auth().signOut()
	})
}


