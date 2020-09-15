import * as menu from '../mocks/menu.js';
import * as productPage from '../views/productpage.js';

let database = firebase.database();
let storage = firebase.storage();

export function createForm () {
	let imageNumber = 1;
	const promise = getCategories ();
	promise.
	then(function(data) {
		createPage1 (data);
		let diaper = {}
		$('#input-image').change(function(event) {
			if (event.target.files.length > 0) {
				showPreview (event);
				addImageToStorage (imageNumber, diaper);
				imageNumber = imageNumber + 1;
			}
		});
		let firebaseData = data;
		let button = document.getElementById('page1-button');
		button.onclick = function () {
			let validation = layersValidation ();
			if (validation == true) {
				createPage2 (firebaseData, diaper);
				let buttonPage2 = document.getElementById('page2-button');
				buttonPage2.onclick = function () {
					saveInputsPage2 (diaper);
					addMockDiaper (diaper);
					productPage.fillMockDiaperPreview (diaper)
				}
			}
		}
	})
}

function showPreview (event) {
	let source = URL.createObjectURL(event.target.files[0]);
	let image = document.createElement('img');
	let box = document.getElementById('file-preview');
	image.className = 'small-image mx-auto img-fluid img-thumbnail m-1';
	image.src = source;
	box.appendChild(image);
}

function addImageToStorage (imageNumber, diaper) {
	const selectedFile = document.getElementById('input-image').files[0];
	let imageRef = storage.ref().child('brand' + imageNumber);
	imageRef.put(selectedFile)
	.then(function(snapshot) {
	  	return imageRef.getDownloadURL();
	})
	.then(function(downloadURL) {
		diaper.url = downloadURL;
		return downloadURL
	})
}

function createUploadFileTemplate (data) {
	let uploadFileTemplate = $('#upload-file-template').html();
	let compiledUploadFileTemplate = Handlebars.compile(uploadFileTemplate);
	$('#file-preview').append(compiledUploadFileTemplate(data));
}

function createPage1 (data) {
	createPage1Template ();
	createNewInput (data, 'diaper-categories', 'diaper-categories-input');
	createNewInput (data, 'sizes', 'sizes-input');
	createNewInput (data, 'composition', 'outside-fabrics-input');
	createNewInput (data, 'composition', 'inner-fabrics-input');
}

function layersValidation () {
	let validation;
	let outsideCheckbox = document.getElementById('outside-layer-input');
	let innerCheckbox = document.getElementById('inner-layer-input');
	let outsideFabrics = document.getElementById('outside-fabrics-input');
	let innerFabrics = document.getElementById('inner-fabrics-input');
	if (outsideCheckbox.checked == false && innerCheckbox.checked == false) {
		validation = false;
	} else {
		validation = true;
	}
	if (outsideCheckbox.checked == true) {
		outsideFabrics.setAttribute('required', 'required');
	} else {
		outsideFabrics.removeAttribute('required');
	}
	if (innerCheckbox.checked == true) {
		innerFabrics.setAttribute('required', 'required');
	} else {
		innerFabrics.removeAttribute('required');
	}
	return validation
}

function createPage2 (firebaseData, diaper) {
	saveInputs (diaper);
	createPage2Template (diaper);
	$('.page2input').selectpicker();
	createNewInput (firebaseData, 'closures', 'closures-input');
	return
}

function createPage1Template () {
	let page1Template = $('#form-page1-template').html();
	let compiledPage1Template = Handlebars.compile(page1Template);
	$('#page').html(compiledPage1Template());
}

function createPage2Template (diaper) {
	let page2Template = $('#form-page2-template').html();
	let compiledPage2Template = Handlebars.compile(page2Template);
	$('#page').html(compiledPage2Template(diaper));
}

function saveInputs (diaper) {
	let brand = $('#brand-input');
	let diaperCategory = $('#diaper-categories-input');
	let sizes = $('#sizes-input');
	let outsideFabrics = $('#outside-fabrics-input');
	let innerFabrics = $('#inner-fabrics-input');
	let outside = document.getElementById('outside-layer-input');
	let inner = document.getElementById('inner-layer-input');
	diaper.diaperCategory = diaperCategory.val();
	diaper.sizes = sizes.val();
	diaper.brand = brand.val();

	if (outside.checked == true && outsideFabrics.val().length > 1){
		diaper.outsideMoreThan1 = true;
		diaper.outside = true;
		diaper.outsideFabrics = outsideFabrics.val();
	};
	if (outside.checked == true && outsideFabrics.val().length == 1){
		diaper.outsideMoreThan1 = false;
		diaper.outside = true;
		diaper.outsideFabrics = outsideFabrics.val();
	};
	if (outside.checked == false){
		diaper.outside = false;
	};

	if (inner.checked == true && innerFabrics.val().length > 1){
		diaper.innerMoreThan1 = true;
		diaper.inner = true;
		diaper.innerFabrics = innerFabrics.val();
	};
	if (inner.checked == true && innerFabrics.val().length == 1){
		diaper.innerMoreThan1 = false;
		diaper.inner = true;
		diaper.innerFabrics = innerFabrics.val();
	};
	if (outside.inner == false){
		diaper.inner = false;
	};
	return diaper
}

function addMockDiaper (diaper) {
	let dbRef = firebase.database().ref('diapers-mocks/');
	var newDbRef = dbRef.push();
	newDbRef.set({
	  diaper
	});
	let key = newDbRef.getKey();
	fillProductMainInfo ();
	createPreviewTemplate (key)
}

function fillProductMainInfo () {
	let itemPreview = $('#item-preview').html();
	Handlebars.registerHelper('printnewinfo', function(){
		return this.diaperCategory[0] + ' ' + this.outsideFabrics[0]
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
	createPreviewTemplate (key);
}

function saveInputsPage2 (diaper) {
	saveFabInputPage2 (diaper, 'outsideFabrics', 'outsideFabPers', 'page2-outside-fab-input');
	saveFabInputPage2 (diaper, 'innerFabrics', 'innerFabPers', 'page2-inner-fab-input');
	saveSizesInputsPage2 (diaper, 'page2-sizes-min', 'page2-sizes-max');
	saveCountry (diaper);
	saveAttestsInputPage2 (diaper);
}

function saveAttestsInputPage2 (diaper) {
	let attestsInput = document.getElementById('attests');
	diaper.attests = attestsInput.value;
}

function saveCountry (diaper) {
	let country;
	let polandInput = document.getElementById('country-poland');
	let otherInput = document.getElementById('country-other-text-input');
	if (polandInput.checked == true) {
		country = 'Polska';
	} else {
		country = otherInput.value
	};
	diaper.country = country;
}

function saveFabInputPage2 (diaper, diaperFabId, diaperNumId, id) {
	let fabrics = diaper[diaperFabId];
	if (fabrics == undefined ) {
		return
	} else {
		diaper[diaperNumId] = [];
		let fabricPer = {};
		if (diaper[diaperFabId].length == 1) {
			fabricPer.name = fabrics[0];
			fabricPer.percentage = 100;
			diaper[diaperNumId].push(fabricPer);
		} else {
			let inputs = document.getElementsByClassName(id);
			let numbers = [];
			Array.from(inputs).forEach(function(input){
			    let number = input.value;
			    numbers.push(number)
			  })
			for (let i=0; i<fabrics.length; i++) {
				let fabricPer = {};
				fabricPer.name = fabrics[i];
				fabricPer.percentage = numbers[i];
				diaper[diaperNumId].push(fabricPer);
			}
		}
	}
}

function saveSizesInputsPage2 (diaper, minId, maxId) {
	let sizes = diaper.sizes;
	let minInputs = document.getElementsByClassName(minId);
	let numbersMin = [];
	Array.from(minInputs).forEach(function(minInput){
	    let number = minInput.value;
	    numbersMin.push(number)
	})
	let numbersMax = [];
	let maxInputs = document.getElementsByClassName(maxId);
	Array.from(maxInputs).forEach(function(maxInput){
	    let number = maxInput.value;
	    numbersMax.push(number)
	})
	diaper.sizesRange = [];
	for (let i=0; i<sizes.length; i++) {
		let sizesNum = {};
		sizesNum.name = sizes[i];
		sizesNum.min = numbersMin[i];
		sizesNum.max = numbersMax[i];
		diaper.sizesRange.push(sizesNum);
	}
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

function addCategoryToDatabase (newName, newId) {
	let dbRef = firebase.database().ref('categories/');
	let newDbRef = dbRef.push();
	newDbRef.set({
	  name: newName,
	  id: newId
	});
}

function addClosuresToDatabase (newName, newId) {
	let dbRef = firebase.database().ref('closures/');
	let newDbRef = dbRef.push();
	newDbRef.set({
	  name: newName,
	  id: newId
	});
}

function createPreviewTemplate (key) {
	let dbRef = firebase.database().ref('diapers-mocks/' + key + '/');
	let previewTemplate = $('#item-preview').html();
	let compiledPreviewTemplate = Handlebars.compile(previewTemplate);
	dbRef.on('value', function(snap){
		$('#page').html(compiledPreviewTemplate(snap.val()))
	})
	
}



function deleteDiapers () {
	let dbRef = firebase.database().ref('diapers/');
	dbRef.set(null);
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

export function getCategoryData (category) {
	const promise1 = new Promise ((resolve, reject) => {
		let dbRef = firebase.database().ref(category + '/');
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

function createNewInput (data, category, inputId) {
	let categoryData;
	for (let i=0; i<data.length; i++) {
		if (data[i].id == category) {
			categoryData = data[i];
		}
	}
	let categoryReference = categoryData.reference;
	const promise = getCategoryData (categoryReference);
	promise
	.then(function(data) {
	  	createNewInputTemplate (categoryReference, data, inputId);
	  	$('#' + inputId).selectpicker();
	})
}

function createNewInputTemplate (category, data, inputId) {
	let inputCategory = {category: data};
	let inputTemplate = $('#new-input-template').html();
	let compiledInputTemplate = Handlebars.compile(inputTemplate);
	$('#' + inputId).html(compiledInputTemplate(inputCategory));
}



