import * as menu from '../mocks/menu.js';

let database = firebase.database();
let storage = firebase.storage();

export function createForm () {
	let formScreen = document.createElement('div');
	formScreen.id = 'form-screen';
	formScreen.className = 'row';
	let application = document.getElementById('application');
	application.appendChild(formScreen);
	createFormTemplate ();
	createInputsContainersTemplate ();
	createFormInputTemplate ();
//	deleteDiapers ();
	printValue ();
}

let formInputs = {
	'inputs': [
		{
			'text': 'Nazwa',
			'id': 'input-name',
			'source': menu.sideBarMenu.categories[0]
		},
		{
			'text': 'Rozmiar',
			'id': 'input-size',
			'source': menu.sideBarMenu.categories[3]
		},
		{
			'text': 'Materiał',
			'id': 'input-fabric',
			'source': menu.sideBarMenu.categories[1]
		},
		{
			'text': 'Producent',
			'id': 'input-brand',
			'source': menu.sideBarMenu.categories[4]
		},
	]
}

function createFormInputTemplate () {
	for (let i=0; i<4; i++) {
		let src = formInputs.inputs[i].source;
		let id = formInputs.inputs[i].id;
		let formInputTemplate = $('#input-template').html();
		let compiledFormInputTemplate = Handlebars.compile(formInputTemplate);
		$('#' + id).html(compiledFormInputTemplate(src));
	}
}

function createInputsContainersTemplate () {
	let inputsContainersTemplate = $('#inputs-container').html();
	let compiledInputsContainersTemplate = Handlebars.compile(inputsContainersTemplate);
	$('#inputs-container').html(compiledInputsContainersTemplate(formInputs))
}

function createFormTemplate () {
	let form = $('#form-template').html();
	let compiledForm = Handlebars.compile(form);
	$('#form-screen').html(compiledForm(formInputs));
}

function printValue () {
	let button = document.getElementById('form-add');

	button.onclick = function () {
		let valueName = document.getElementById('input-name').value;
		let valueSize = document.getElementById('input-size').value;
		let valueFabric = document.getElementById('input-fabric').value;
		let valueBrand = document.getElementById('input-brand').value;
		let valueImage = document.getElementById('input-image').value;
		console.log (valueName, valueSize, valueFabric, valueBrand, valueImage);
		addImage().then(function(url){
			addDiaper (valueName, valueSize, valueFabric, valueBrand, url)
		});
	}
}

function addImage () {
	const selectedFile = document.getElementById('input-image').files[0];
	let imageRef = storage.ref().child('drimi.jpg');
	imageRef.put(selectedFile).then(function(snapshot) {
  		console.log('Uploaded a blob or file!');
	});
	let url = imageRef.getDownloadURL().then(function(downloadURL) {
		console.log('File available at', downloadURL);
		return downloadURL
  	});
  	return url

	// let img = document.getElementById('image');
	// console.log(img)
 //  	img.src = 'https://firebasestorage.googleapis.com/v0/b/wielo-pielo.appspot.com/o/puppi2.jpg?alt=media&token=fe6b5281-721b-48f4-b840-a0a4f756f6c0';

	// let gsReference = storageRef.getReferenceFromUrl("gs://wielo-pielo.appspot.com/puppi2.jpg");


	// // Upload the file and metadata
	// var uploadTask = storageRef.child('puppi2.jpg').put(gsReference, metadata);
}

function createPreviewTemplate (key) {
	let dbRef = firebase.database().ref('diapers/' + key);
	console.log('key', key)
	console.log('dbRef', dbRef)
	let previewTemplate = $('#item-preview').html();
	let compiledPreviewTemplate = Handlebars.compile(previewTemplate);
	dbRef.on('value', function(snap){
		$('#form-screen').html(compiledPreviewTemplate(snap.val()))
	})
	
}

function addDiaper (valueName, valueSize, valueFabric, valueBrand, url) {
	console.log('uuurl', url)
	let imageUrl = url;
	let dbRef = firebase.database().ref('diapers/');
	var newDbRef = dbRef.push();
	newDbRef.set({
	  name: valueName,
	  size: valueSize,
	  fabric: valueFabric,
	  brand: valueBrand,
	  image: imageUrl
	});
	let key = newDbRef.getKey();
//	printData (key);
	createPreviewTemplate (key)
}

function printData (key) {
	let result = document.getElementById('form-result');
	 let dbRef = firebase.database().ref('diapers/' + key + '/brand/');
	 let imgRef = firebase.database().ref('diapers/' + key + '/image/')
	 dbRef.on('value', snap => result.innerText = snap.val());
	 //to pod spodem działa a to na górze nie działa
	 // let dbRef = firebase.database().ref('zupy/1/');
	 // dbRef.on('value', snap => console.log(snap.val()));
	 // dbRef.on('value', snap => result.innerText = snap.val());
}

function deleteDiapers () {
	let dbRef = firebase.database().ref('diapers/');
	dbRef.set(null);
}




