import * as index from '/test/index.js';
import * as state from '/test/state.js';
import * as eventBus from '/test/eventBus.js';

let user;

export function goToLoginScreen () {
// 	let loginIcon = document.getElementById('login-icon');
// 	loginIcon.onclick = function () {
// 		clearPage ();
// 		createLoginPage ();
// 		firebase.auth().signOut();
// 		checkForAuthStateChange ();
// 		enablelogIn (categoriesData);
// 		enableLogOut ();
// //		enableCreateAccount (categoriesData);
// 	};
		clearPage ();
		createTemplate('login-page-template', 'page');
		firebase.auth().signOut();
		checkForAuthStateChange ();
		enablelogIn ();
		enableLogOut ();
}

function enableCreateAccount () {
	let createAccountButton = document.getElementById('create-account');
	createAccountButton.onclick = function(){
		createAccountScreen ();
//		enableSignUp (categoriesData);
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

function findUserInDatabase (firebaseUser) {
	const promise = new Promise ((resolve, reject) => {
		const promise2 = getAllUsersFromDatabase ();
		promise2.then(function(usersData) {
			for (let i=0; i<usersData.length; i++) {
				let user = usersData[i].data[0].user
				if (firebaseUser.uid == user.uid) {
					let key = usersData[i].key;
					user.key = key;
					resolve (user)
				}
			}
		})
	})
	return promise
}

function getAllUsersFromDatabase () {
	const promise1 = new Promise ((resolve, reject) => {
		let dbRef = firebase.database().ref('users/');
		let usersData = [];
		dbRef.once('value',   function(snapshot) {
		    snapshot.forEach(function(childSnapshot) {
		    	let data = [];
			    var key = childSnapshot.key;
			    var childData = childSnapshot.val();
			    data.push(childData);
			    let userData = {'data': data, 'key': key};
			   	usersData.push(userData);
		    });
		    resolve (usersData)
	  	});
	  	
	});
	return promise1
}

function goToStartPage () {
	clearPage ();
	index.createStartPage ();
}

function enablelogIn () {
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
						changeStateLogIn (user, firebaseUser)
					})
					.then (function () {
						document.getElementById('application').innerHTML = '';
						createTemplate ('title-bar-template', 'application');
						createTemplate ('page-template', 'application');
						index.createHomePage ();
//						eventBus.eventBus.trigger('userLoggedIn');
					})
				} else {
				}
			})
		})
	})
}

function enableSignUp () {
//	eventBus.eventBus.subscribe('userLoggedIn', createUserInFirestore);
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
					const promise2 = changeStateSignUp (firebaseUser, role)
					promise2.then (function () {
						const promise3 = createUserInFirestore ();
						promise3.then (function(key) {
							state.state.userKey = key;
						})
						.then (function() {
							eventBus.eventBus.trigger('userLoggedIn');
							goToStartPage ();
						})
					})
				} else {
				}
			})
		})
	})
}

function changeStateLogIn (user, firebaseUser) {
	const promise = new Promise ((resolve, reject) => {
		let role = user.role;
		let key = user.key
		state.state.user = firebaseUser;
		state.state.userRole = role;
		state.state.userKey = key;
		resolve()
	})
	return promise
}

function changeStateSignUp (firebaseUser, role) {
	const promise = new Promise ((resolve, reject) => {
		state.state.user = firebaseUser;
		state.state.userRole = role;
		console.log (state.state.user)
		resolve()
	})
	return promise
}

function createUserInFirestore () {
	const promise = new Promise ((resolve, reject) => {
		let user = {};
		user.uid = state.state.user.uid;
		user.email = state.state.user.email;
		user.role = state.state.userRole;
		let dbRef = firebase.database().ref('users/');
		var newDbRef = dbRef.push();
		newDbRef.set({
		  user
		});
		let key = newDbRef.getKey();
		resolve(key)
	})
	return promise
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

function createTemplateHtml (templateId, parentId, data) {
	let template = $('#' + templateId).html();
	let compiledTemplate = Handlebars.compile(template);
	$('#' + parentId).append(compiledTemplate(data));
}

function createTemplate (templateId, parentId, data) {
	let template = $('#' + templateId).html();
	let compiledTemplate = Handlebars.compile(template);
	$('#' + parentId).append(compiledTemplate(data));
}

