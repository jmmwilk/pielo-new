export function goToLoginScreen () {
	let loginIcon = document.getElementById('login-icon');
	loginIcon.onclick = function () {
		clearPage ();
		createLoginPage ();
		firebase.auth().signOut()
		checkForAuthStateChange ();
		enablelogIn ();
		enableSignUp ();
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

function enablelogIn () {
	const btnLogIn = document.getElementById('log-in');
	btnLogIn.addEventListener ('click', e => {
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		const auth = firebase.auth();
		const promise = auth.signInWithEmailAndPassword(email, password);
	})
}

function enableSignUp () {
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
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if (firebaseUser) {
			console.log(firebaseUser)
			btnLogOut.classList.remove('d-none');
		} else {
			console.log('not logged in')
			btnLogOut.classList.add('d-none');
		}
	})
}

function enableLogOut () {
	const btnLogOut = document.getElementById('log-out');
	btnLogOut.addEventListener ('click', e => {
		firebase.auth().signOut()
	})
}


