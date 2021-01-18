import * as login from '/test/views/login/login.js';
import * as mainPage from '/test/views/main-page/main-page.js';






$(document).ready(function(){
// 	addDataToDatabase ();
	login.goToLoginScreen ();
	// mainPage.createMainPage ();
//	eventBus.eventBus.subscribe('userLoggedIn', fillUserName);
})

function addDataToDatabase () {
		// let dbRef = firebase.database().ref('diaper-categories/-MF0Ea0U4Yi9TXqG1WSw/');
	// dbRef.once('value',   function(snapshot) {
	//     snapshot.forEach(function(childSnapshot) {
	//       var childData = childSnapshot.val();
	//       console.log('childData', childData)
	//       let answer = childData['answer'];
	//       if (!answer) {
	//       	return
	//       }
	//       var childKey = childSnapshot.key
	//       console.log('childKey', childKey)

	//       let newDbRef = firebase.database().ref('diaper-categories/-MF0Ea0U4Yi9TXqG1WSw/attributes/' + childKey)
	//       newDbRef.update(childData)

	//       let newDbRef = firebase.database().ref('diaper-categories/-MF0Ea0U4Yi9TXqG1WSw/' + childKey)
	//       newDbRef.set(null)

	//     });
 //  	});

// 	let dbRef = firebase.database().ref('form-categories/');
// 	let newDbRef = dbRef.push();
// 	newDbRef.set({
// 	  'id': 'production-country-poland',
// 	  'input-type': 'checkbox',
// //	  'question-type': 'dependent',
// 	  'form-page-name': 'others',
// //	  'dependent-questions': [{'id': 'waterproof-layer-fabrics'}],
// //		'parent-id': ''
// 	});


	// let dbRef = firebase.database().ref('form-questions/');
	// let newDbRef = dbRef.push();
	// let key = newDbRef.key
	// newDbRef.set({
	//   'attribute-id': 'applications',
	// });
	// let groupRef = firebase.database().ref('form-questions/' + key +'/text-groups')
	// let newGroupRef = groupRef.push();
	// newGroupRef.set({
	// 	'id': 'applications-main',
	//  	'text': 'Aplikacje',
	// })

	// let dbRef = firebase.database().ref('attributes-titles/');
	// let newDbRef = dbRef.push();
	// let key = newDbRef.key
	// newDbRef.set({
	//   'attribute-id': 'applications',
	// });
	// let groupRef = firebase.database().ref('attributes-titles/' + key +'/text-groups')
	// let newGroupRef = groupRef.push();
	// newGroupRef.set({
	// 	'id': 'applications-main',
	//  	'text': 'Aplikacje',
	// })

	
// 	let dbbRef = firebase.database().ref('form-answers/');
// 	let newDbbRef = dbbRef.push();
// 	newDbbRef.set({
// 	  'id': 'applications',
// //	  'for-multiple-questions': true,
// 	  'options': [
// 	  		{	
// 	  		'name': 'Aplikacja wełniana',
// 	  		},
// 	  		{	
// 	  		'name': 'Aplikacja z chusty',
// 	  		},
// 	  		{	
// 	  		'name': 'Haft',
// 	  		},
// 	  	]
// 	});
}

