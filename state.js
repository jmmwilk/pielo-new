export let state = {
	user: undefined,
	userRole: undefined,
}



// function subscribeFunction (eventBus) {
// 	let user = {};
// 	user.uid = eventBus.user.uid;
// 	user.email = eventBus.user.email;
// 	user.role = eventBus.userRole
// 	let dbRef = firebase.database().ref('users/');
// 	var newDbRef = dbRef.push();
// 	newDbRef.set({
// 	  user
// 	});
// 	let key = newDbRef.getKey();
// 	return key
// }

// function function2 (user) {
// 	let userNameBox = document.getElementById('user-name-box');
// 	userNameBox.innerText = eventBus.user.email
// }


export function changeState (role) {
	const promise = new Promise ((resolve, reject) => {
		firebase.auth().onAuthStateChanged(firebaseUser => {
			if (firebaseUser) {
				state.user = firebaseUser;
				state.userRole = role;
				console.log('state', state)
				resolve()
			}
		})
	});
	return promise
}

// names.add('mietek')
// names.exists('justyna')


// let names = {
// 	add: function (name) {
// 		this.list.push(name)
// 	},
// 	get: function() {
// 		return this.list
// 	},
// 	exists: function(name) {
// 		for (i=0; i<this.list.lenth; i++) {
// 			if (this.list[i] == name) {
// 				return true
// 			}
// 		}
// 		return false
// 	},
// 	list: []
// }






