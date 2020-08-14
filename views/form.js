import * as menu from '../mocks/menu.js';

let database = firebase.database();
let storage = firebase.storage();

export function createForm () {
//	addSizesToDatabase ()
	let data = getSizes ();
	console.log('data', data)
	let newSizes = {'sizes': data};
	console.log('newSizes', newSizes)
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
	createSizesTemplate (newSizes)
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
		let newDiaper = {
			name: valueName,
			size: valueSize,
			fabric: valueFabric,
			brand: valueBrand
		}
		addImage(newDiaper)
	}
}

function addImage (newDiaper) {
	const selectedFile = document.getElementById('input-image').files[0];
	let imageRef = storage.ref().child('nowapielucha.jpg');

  	imageRef.put(selectedFile)
	.then(function(snapshot, newDiaper) {
		console.log('Uploaded a blob or file!');
	  	return imageRef.getDownloadURL();
	})
	.then(function(downloadURL) {
		return downloadURL
	})
	.then(function(downloadURL){
		addDiaper (downloadURL, newDiaper)
	})
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

function addDiaper (downloadURL, newDiaper) {
	console.log('downloadURL', downloadURL)
	let imageUrl = downloadURL;
	let dbRef = firebase.database().ref('diapers/');
	var newDbRef = dbRef.push();
	newDbRef.set({
	  name: newDiaper.name,
	  size: newDiaper.size,
	  fabric: newDiaper.fabric,
	  brand: newDiaper.brand,
	  image: imageUrl
	});
	let key = newDbRef.getKey();
	createPreviewTemplate (key)
}

function deleteDiapers () {
	let dbRef = firebase.database().ref('diapers/');
	dbRef.set(null);
}

function addSizesToDatabase () {
	let sizes = menu.sideBarMenu.categories[3].submenu1;
	console.log(sizes);
	let dbRef = firebase.database().ref('sizes/');
	for (let i=0; i<sizes.length; i++) {
		let value1 = sizes[i].name;
		let value2 = sizes[i].id;
		var newDbRef = dbRef.push();
		newDbRef.set({
		  name: value1,
		  id: value2
		});
	}
//	createSizesTemplate (keys)
}

function getSizes () {
	let dbRef = firebase.database().ref('sizes/');
	let keys = [];
	let data = [];
	dbRef.once('value',   function(snapshot) {
	    snapshot.forEach(function(childSnapshot) {
	      var childKey = childSnapshot.key;
	      var childData = childSnapshot.val();
//	      console.log(childKey);
//	      console.log(childData);
	      keys.push(childKey);
	      data.push(childData);
	    });
  	});
  	console.log('data', data)
  	return data
}

function createSizesTemplate (newSizes) {
	let sizesBox = $('#sizes-template').html();
	let compiledsizesBox = Handlebars.compile(sizesBox);
	$('#new-sizes').html(compiledsizesBox(newSizes));
}


