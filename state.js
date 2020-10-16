

export let eventBus = {
	subscribe: function() {
		subscribeFunction(this);
	},
	trigger: function(){
		function2(this.user)
	},
	user: undefined,
	userRole: undefined,
}

function subscribeFunction (eventBus) {
	let user = {};
	user.uid = eventBus.user.uid;
	user.email = eventBus.user.email;
	user.role = eventBus.userRole
	let dbRef = firebase.database().ref('users/');
	var newDbRef = dbRef.push();
	newDbRef.set({
	  user
	});
	let key = newDbRef.getKey();
	return key
}

function function2 (user) {
	let userNameBox = document.getElementById('user-name-box');
	userNameBox.innerText = eventBus.user.email
}


export function changeEventBus (role) {
	const promise = new Promise ((resolve, reject) => {
		firebase.auth().onAuthStateChanged(firebaseUser => {
			if (firebaseUser) {
				eventBus.user = firebaseUser;
				eventBus.userRole = role;
				resolve()
			}
		})
	});
	return promise
}