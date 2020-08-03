import * as menu from '../mocks/menu.js';

let database = firebase.database();

export function createForm () {
	let formScreen = document.createElement('div');
	formScreen.id = 'form-screen';
	formScreen.className = 'row';
	let application = document.getElementById('application');
	application.appendChild(formScreen);
	createFormTemplate ();
	createInputsContainersTemplate ();
	createFormInputTemplate ();
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
		console.log (valueName, valueSize, valueFabric, valueBrand);
		addDiaper (valueName, valueSize, valueFabric, valueBrand);
	}
}

function addDiaper (valueName, valueSize, valueFabric, valueBrand) {
	let dbRef = firebase.database().ref('diapers/');
	var newDbRef = dbRef.push();
	newDbRef.set({
	  name: valueName,
	  size: valueSize,
	  fabric: valueFabric,
	  brand: valueBrand
	});
	let key = newDbRef.getKey();
	console.log(key);
	printData (key);
}

function printData (key) {
	let result = document.getElementById('form-result');
	console.log(key)
	 let dbRef = firebase.database().ref('diapers/' + key + '/brand/');
	 dbRef.on('value', snap => console.log(snap.val()));
	 dbRef.on('value', snap => result.innerText = snap.val());
	 //to pod spodem działa a to na górze nie działa
	 // let dbRef = firebase.database().ref('zupy/1/');
	 // dbRef.on('value', snap => console.log(snap.val()));
	 // dbRef.on('value', snap => result.innerText = snap.val());
}





