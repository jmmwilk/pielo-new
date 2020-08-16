import * as menu from '../mocks/menu.js';

let database = firebase.database();
let storage = firebase.storage();

export function createForm () {
	const promise2 = getSizes();
	promise2
	.then(function(data) {
	  	let newSizes = {'sizes': data};
	  	createSizesTemplate (newSizes);
	})
	const promise3 = getFabrics();
	promise3
	.then(function(data) {
		let newFabrics = {'fabrics': data};
		createFabricsTemplate (newFabrics);
	})

	const promise4 = getCategories ();
	promise4
	.then(function(data) {
		let formCategories = {'categories': data};
		createNewFormTemplate (formCategories);
		createNewInputs (formCategories);
	})

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
	  	return imageRef.getDownloadURL();
	})
	.then(function(downloadURL) {
		return downloadURL
	})
	.then(function(downloadURL){
		addDiaper (downloadURL, newDiaper)
	})
}

function addCategoryToDatabase (newName, newId) {
	let dbRef = firebase.database().ref('categories/');
	let newDbRef = dbRef.push();
		newDbRef.set({
		  name: newName,
		  id: newId
		});
}

function createPreviewTemplate (key) {
	let dbRef = firebase.database().ref('diapers/' + key);
	let previewTemplate = $('#item-preview').html();
	let compiledPreviewTemplate = Handlebars.compile(previewTemplate);
	dbRef.on('value', function(snap){
		$('#form-screen').html(compiledPreviewTemplate(snap.val()))
	})
	
}

function addDiaper (downloadURL, newDiaper) {
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

function addFabricsToDatabase () {
	let fabrics = menu.sideBarMenu.categories[1].submenu1;
	let dbRef = firebase.database().ref('fabrics/');
	for (let i=0; i<fabrics.length; i++) {
		let value1 = fabrics[i].name;
		let value2 = fabrics[i].id;
		var newDbRef = dbRef.push();
		newDbRef.set({
		  name: value1,
		  id: value2
		});
	}
}

function addSizesToDatabase () {
	let sizes = menu.sideBarMenu.categories[3].submenu1;
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
}

function addBrandsToDatabase () {
	let brands = menu.sideBarMenu.categories[4].submenu1;
	let dbRef = firebase.database().ref('brands/');
	for (let i=0; i<brands.length; i++) {
		let value1 = brands[i].name;
		let value2 = brands[i].id;
		var newDbRef = dbRef.push();
		newDbRef.set({
		  name: value1,
		  id: value2
		});
	}
}

function addCategoriesToDatabase () {
	let categories = [
		{'name': 'Rozmiar', 'id': 'size'},
	 	{'name': 'Materiał', 'id': 'fabric'},
	 	{'name': 'Producent', 'id': 'brand'}
	];
	let dbRef = firebase.database().ref('categories/');
	for (let i=0; i<categories.length; i++) {
		let value1 = categories[i].name;
		let value2 = categories[i].id;
		var newDbRef = dbRef.push();
		newDbRef.set({
		  name: value1,
		  id: value2
		});
	}
}

function getSizes () {
	const promise1 = new Promise ((resolve, reject) => {
		let dbRef = firebase.database().ref('sizes/');
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

function getFabrics () {
	const promise1 = new Promise ((resolve, reject) => {
		let dbRef = firebase.database().ref('fabrics/');
		let data = [];
		dbRef.once('value', function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
			var childData = childSnapshot.val();
		      data.push(childData);
			});
			resolve (data)
		})
	});
	return promise1
}

function createSizesTemplate (newSizes) {
	let sizesBox = $('#sizes-template').html();
	let compiledsizesBox = Handlebars.compile(sizesBox);
	$('#new-sizes').html(compiledsizesBox(newSizes));
}

function createFabricsTemplate (newFabrics) {
	let fabricsBox = $('#fabrics-template').html();
	let compiledFabricsBox = Handlebars.compile(fabricsBox);
	$('#new-fabrics').html(compiledFabricsBox(newFabrics))
}

function createNewFormTemplate (formCategories) {
	let formTemplate = $('#form-input-template').html();
	let compiledFormTemplate = Handlebars.compile(formTemplate);
	$('#new-form').html(compiledFormTemplate(formCategories));
}

function getCategories () {
	const promise1 = new Promise ((resolve, reject) => {
		let dbRef = firebase.database().ref('categories/');
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

function getCategoryData (category) {
	const promise1 = new Promise ((resolve, reject) => {
		let dbRef = firebase.database().ref(category + 's/');
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

function createNewInputs (formCategories) {
	let categories = formCategories["categories"];
	for (let i=0; i<categories.length; i++) {
		let category = categories[i].id;
		const promise2 = getCategoryData (category);
		promise2
		.then(function(data) {
		  	createNewInputTemplate (category, data);
		})
	}
}

function createNewInputTemplate (category, data) {
	let inputCategory = {category: data};
	let inputTemplate = $('#new-input-template').html();
	let compiledInputTemplate = Handlebars.compile(inputTemplate);
	$('#' + category + '-input').html(compiledInputTemplate(inputCategory));
}


