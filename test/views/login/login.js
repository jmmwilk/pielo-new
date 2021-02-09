// import * as index from '/test/index.js';
import * as mainPage from '/test/views/main-page/main-page.js';
import * as general from '/test/general.js';
import * as state from '/test/state.js';
import * as eventBus from '/test/eventBus.js';

let user;


export function goToLoginScreen () {
		document.getElementById('application').innerHTML = '';
		createTemplate ('page', 'application');
		createTemplate('login-page', 'page');
		firebase.auth().signOut();
		enablelogIn ();
		enableLogOut ();
		enableGoToSignUpPage ();
}

function enableGoToSignUpPage () {
	let createAccountButton = document.getElementById('create-account');
	createAccountButton.onclick = function(){
		clearPage ();
		createTemplate ('subscribe', 'page');
		enableSignUp ();
	};
}

function clearPage () {
	let page = document.getElementById('page');
	page.innerHTML = '';
}

function findUserInDatabase (firebaseUser) {
	const promise = new Promise ((resolve, reject) => {
		const promise2 = getAllUsersFromDatabase ();
		promise2.then(function(usersData) {
			let user = Array.from(usersData).find(function(userData){
				return (firebaseUser.uid == userData.data[0].user.uid)
			});
			if (user) {
				resolve(user.data[0].user)
			} else {
				resolve(undefined)
			}
		});
	});
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
			    childData.user.key = key;
			    data.push(childData);
			    let userData = {'data': data};
			   	usersData.push(userData);
		    });
		    resolve (usersData)
	  	});
	});
	return promise1
}

function enablelogIn () {
	const btnLogIn = document.getElementById('log-in');
	btnLogIn.addEventListener ('click', e => {
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		const auth = firebase.auth();
		const promise = auth.signInWithEmailAndPassword(email, password);
		promise.then(function() {
			window.location.href='#main-page';
			general.updateHistory('#main-page');
			mainPage.createMainPage ();
		});
	})
}

function enableSignUp () {
	const btnSignUp = document.getElementById('sign-up');
	btnSignUp.addEventListener ('click', e => {
		const email = document.getElementById('email').value;
		const password1 = document.getElementById('password1').value;
		const password2 = document.getElementById('password2').value
		if (password1 !== password2) {
			return
		};
		const roleCheckbox = document.getElementById('producer');
		let role;
		if (roleCheckbox.checked == true) {
			role = 'producer';
		} else {
			role = 'normal-user';
		};
		const name = document.getElementById('name').value;
		const auth = firebase.auth();
		const promise = auth.createUserWithEmailAndPassword(email, password1);
		promise.then(function() {
			state.newUser.name = name;
			state.newUser.role = role;
			state.newUser.email = email;
			window.location.href='#main-page';
			general.updateHistory('#main-page');
			mainPage.createMainPage ();
		});
	})
}

function changeStateLogIn (user, firebaseUser) {
	const promise = new Promise ((resolve, reject) => {
		state.state.user = firebaseUser;
		state.state.userRole = user.role;
		state.state.userKey = user.key;
		state.state.userName = user.name;
		if (user.role == 'normalUser') {
			state.state.normalUser = true
		};
		if (user.role == 'producer') {
			state.state.producer = true
		};
		resolve()
	})
	return promise
}

function changeStateSignUp (firebaseUser, role) {
	const promise = new Promise ((resolve, reject) => {
		state.state.user = firebaseUser;
		state.state.userRole = role;
		resolve()
	})
	return promise
}

function createUserInFirestore (firebaseUser) {
	const promise = new Promise ((resolve, reject) => {
		let user = {};
		user.uid = firebaseUser.uid;
		user.email = state.newUser.email;
		user.role = state.newUser.role;
		user.name = state.newUser.name;
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

export function checkForAuthStateChange () {
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if (firebaseUser && !state.state.userLoggedIn) {
			state.state.userLoggedIn = true;
			const promise2 = findUserInDatabase (firebaseUser);
			promise2.then(function(user) {
				if (user) {
					changeStateLogIn (user, firebaseUser);
					eventBus.eventBus.trigger('userLoggedIn');
				} else {
					const promise3 = createUserInFirestore (firebaseUser);
					promise3.then (function(key) {
						state.newUser.key = key;
						changeStateLogIn (state.newUser, firebaseUser)
						eventBus.eventBus.trigger('userLoggedIn');
					});
				};
			});
		};
	});
}

function enableLogOut () {
	const btnLogOut = document.getElementById('log-out');
	btnLogOut.addEventListener ('click', e => {
		firebase.auth().signOut()
	})
}

function createTemplate (templateName, parentId, data) {
	let template = Handlebars.templates[templateName];
	$('#' + parentId).append(template(data));
}

