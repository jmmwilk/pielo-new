import * as menu from '../mocks/menu.js';

let database = firebase.database();
let storage = firebase.storage();

export function createForm () {
	// const promise2 = getSizes();
	// promise2
	// .then(function(data) {
	//   	let newSizes = {'sizes': data};
	//   	createSizesTemplate (newSizes);
	// })
	// const promise3 = getFabrics();
	// promise3
	// .then(function(data) {
	// 	let newFabrics = {'fabrics': data};
	// 	createFabricsTemplate (newFabrics);
	// })

// 	const promise4 = getCategories ();
// 	promise4
// 	.then(function(data) {
// 		let formCategories = {'categories': data};
// //		createNewFormTemplate ();
// 		createNewInputs (formCategories);
// 	})

	// let formScreen = document.createElement('div');
	// formScreen.id = 'form-screen';
	// formScreen.className = 'row';
	// let application = document.getElementById('application');
	// application.appendChild(formScreen);
//	createFormTemplate ();
	// createInputsContainersTemplate ();
	// createFormInputTemplate ();
	// printValue ();

	// const promise = getCategory ('diaper-categories');
	// promise.
	// then(function(data) {
	// 	createPage1 (data);
	// 	let button = document.getElementById('page1-button');
	// 	button.onclick = function () {
	// 		createPage2 ();
	// 	}
	// })
	const promise = getCategories ();
	promise.
	then(function(data) {
		createPage1 (data);
		showPreview ();
//		createUploadPhotoTemplate ();
//		enablePhotoButton ();
		let firebaseData = data;
		let button = document.getElementById('page1-button');
		button.onclick = function () {
			let validation = layersValidation ();
			if (validation == true) {
				let diaper = createPage2 (firebaseData);
				let buttonPage2 = document.getElementById('page2-button');
				buttonPage2.onclick = function () {
					saveInputsPage2 (diaper);
					addMockDiaper (diaper)
					console.log ('diaper', diaper)
				}
			}
		}
	})
}



// function enablePhotoButton () {
// 	$('#btnfile').click(function () {
// 	    $('#new-input-image').click();
// 	});
// 	$('#new-input-image').change(function(event) {
// 		showNewPreview (event);
// 		createUploadPhotoTemplate ();
// 	});
// }

// function showNewPreview (event) {
// 	if (event.target.files.length > 0) {
// 		let src = URL.createObjectURL(event.target.files[0]);
// 		let preview = document.getElementById('upload-img');
// 		preview.src = src;
// 		let button = document.getElementById('btnfile');
// 		button.setAttribute('disabled', 'disabled');
// 	}
// }

function showPreview () {
	$('#input-image').change(function(event) {
		if (event.target.files.length > 0) {
			let source = URL.createObjectURL(event.target.files[0]);
			console.log('source', source)
			let data = {'file':{'src': source}};
			createUploadFileTemplate (data);
		};
	});
}

function createUploadFileTemplate (data) {
	console.log('data', data)
	let uploadFileTemplate = $('#upload-file-template').html();
	let compiledUploadFileTemplate = Handlebars.compile(uploadFileTemplate);
	$('#file-preview').append(compiledUploadFileTemplate(data));
}

// function createUploadPhotoTemplate () {
// 	let uploadPhotoTemplate = $('#upload-photo-template').html();
// 	let compiledUploadPhotoTemplate = Handlebars.compile(uploadPhotoTemplate);
// 	$('#upload-photos-container').append(compiledUploadPhotoTemplate());
// }

// function createOutsideTemplate () {
// 	let outsideTemplate = $('#outside-template').html();
// 	let compiledOutsideTemplate = Handlebars.compile(outsideTemplate);
// 	$('#outside-container').append(compiledOutsideTemplate);
// }

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

// 	if (checkbox.checked == true){
// //		createOutsideTemplate ();
// 	    // outsideFabrics.removeAttribute('disabled');
// 	    // $('#outside-fabrics-input').selectpicker('refresh');
// 	} else {
// 	     // outsideFabrics.setAttribute('disabled', 'disabled');
// 	     // $('#outside-fabrics-input').selectpicker('refresh');
// 	}

	return validation
}

function createPage2 (firebaseData) {
	let diaper = {}
	saveInputs (diaper);
	createPage2Template (diaper);
	$('.page2input').selectpicker();
	createNewInput (firebaseData, 'closures', 'closures-input');
	return diaper
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
	let diaperCategory = $('#diaper-categories-input');
	let sizes = $('#sizes-input');
	let outsideFabrics = $('#outside-fabrics-input');
	let innerFabrics = $('#inner-fabrics-input');
	let outside = document.getElementById('outside-layer-input');
	let inner = document.getElementById('inner-layer-input');
	diaper.diaperCategory = diaperCategory.val();
	diaper.sizes = sizes.val();

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
//	let imageUrl = downloadURL;
	let dbRef = firebase.database().ref('diapers-mocks/');
	var newDbRef = dbRef.push();
	newDbRef.set({
	  diaper
	});
//	let key = newDbRef.getKey();
//	createPreviewTemplate (key)
}

// function addFabricToDatabase () {
// 	let dbRef = firebase.database().ref('fabrics/');
// 	var newDbRef = dbRef.push();
// 	newDbRef.set({
// 	  name: 'Poliester',
// 	  id: 'poliester'
// 	});
// }

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

// function createFormInputTemplate () {
// 	for (let i=0; i<4; i++) {
// 		let src = formInputs.inputs[i].source;
// 		let id = formInputs.inputs[i].id;
// 		let formInputTemplate = $('#input-template').html();
// 		let compiledFormInputTemplate = Handlebars.compile(formInputTemplate);
// 		$('#' + id).html(compiledFormInputTemplate(src));
// 	}
// }

// function createInputsContainersTemplate () {
// 	let inputsContainersTemplate = $('#inputs-container').html();
// 	let compiledInputsContainersTemplate = Handlebars.compile(inputsContainersTemplate);
// 	$('#inputs-container').html(compiledInputsContainersTemplate(formInputs))
// }

// function createFormTemplate () {
// 	let form = $('#form-template').html();
// 	let compiledForm = Handlebars.compile(form);
// 	$('#page').html(compiledForm(formInputs));
// }

// function printValue () {
// 	let button = document.getElementById('form-add');

// 	button.onclick = function () {
// 		let valueName = document.getElementById('input-name').value;
// 		let valueSize = document.getElementById('input-size').value;
// 		let valueFabric = document.getElementById('input-fabric').value;
// 		let valueBrand = document.getElementById('input-brand').value;
// 		let newDiaper = {
// 			name: valueName,
// 			size: valueSize,
// 			fabric: valueFabric,
// 			brand: valueBrand
// 		}
// 		addImage(newDiaper)
// 	}
// }

// function addImage (newDiaper) {
// 	const selectedFile = document.getElementById('input-image').files[0];
// 	let imageRef = storage.ref().child('nowapielucha.jpg');

//   	imageRef.put(selectedFile)
// 	.then(function(snapshot, newDiaper) {
// 	  	return imageRef.getDownloadURL();
// 	})
// 	.then(function(downloadURL) {
// 		return downloadURL
// 	})
// 	.then(function(downloadURL){
// 		addDiaper (downloadURL, newDiaper)
// 	})
// }

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

// function getSizes () {
// 	const promise1 = new Promise ((resolve, reject) => {
// 		let dbRef = firebase.database().ref('sizes/');
// 		let data = [];
// 		dbRef.once('value',   function(snapshot) {
// 		    snapshot.forEach(function(childSnapshot) {
// 		      var childData = childSnapshot.val();
// 		      data.push(childData);
// 		    });
// 		    resolve (data)
// 	  	});
// 	});
// 	return promise1
// }

// function getFabrics () {
// 	const promise1 = new Promise ((resolve, reject) => {
// 		let dbRef = firebase.database().ref('fabrics/');
// 		let data = [];
// 		dbRef.once('value', function(snapshot) {
// 			snapshot.forEach(function(childSnapshot) {
// 			var childData = childSnapshot.val();
// 		      data.push(childData);
// 			});
// 			resolve (data)
// 		})
// 	});
// 	return promise1
// }

// function createSizesTemplate (newSizes) {
// 	let sizesBox = $('#sizes-template').html();
// 	let compiledsizesBox = Handlebars.compile(sizesBox);
// 	$('#new-sizes').html(compiledsizesBox(newSizes));
// }

// function createFabricsTemplate (newFabrics) {
// 	let fabricsBox = $('#fabrics-template').html();
// 	let compiledFabricsBox = Handlebars.compile(fabricsBox);
// 	$('#outside-fabrics-input').html(compiledFabricsBox(newFabrics))
// }

// function createNewFormTemplate () {
// 	let formTemplate = $('#form-input-template').html();
// 	let compiledFormTemplate = Handlebars.compile(formTemplate);
// 	$('#new-form').html(compiledFormTemplate());
// }

// function getCategories () {
// 	const promise1 = new Promise ((resolve, reject) => {
// 		let dbRef = firebase.database().ref('categories/');
// 		let data = [];
// 		dbRef.once('value',   function(snapshot) {
// 		    snapshot.forEach(function(childSnapshot) {
// 		      var childData = childSnapshot.val();
// 		      data.push(childData);
// 		    });
// 		    resolve (data)
// 	  	});
// 	});
// 	return promise1
// }

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

// function getCategory (category) {
// 	const promise = new Promise ((resolve, reject) => {
// 		let dbRef = firebase.database().ref('categories/');
// 		let data;
// 		dbRef.once('value',   function(snapshot) {
// 		    snapshot.forEach(function(childSnapshot) {
// 		      var childData = childSnapshot.val();
// 		      if (childData.id == category) {
// 		      	data = childData;
// 		      };
// 		    });
// 		    resolve (data)
// 	  	});
// 	});
// 	return promise
// }

function getCategoryData (category) {
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

// function getCategoryData (category) {
// 	const promise1 = new Promise ((resolve, reject) => {
// 		let dbRef = firebase.database().ref(category + '/');
// 		let data = [];
// 		dbRef.once('value',   function(snapshot) {
// 		    snapshot.forEach(function(childSnapshot) {
// 		      var childData = childSnapshot.val();
// 		      data.push(childData);
// 		    });
// 		    resolve (data)
// 	  	});
// 	});
// 	return promise1
// }

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

// function createNewInputTemplate (category, data, categories, i) {
// 	let inputCategory = {category: data};
// 	let inputTemplate = $('#new-input-template').html();
// 	let compiledInputTemplate = Handlebars.compile(inputTemplate);
// 	$('#' + categories[i].id + '-input').html(compiledInputTemplate(inputCategory));
// }

// function createNewInputs (formCategories) {
// 	let categories = formCategories["categories"];
// 	console.log ('categories', categories)
// 	for (let i=0; i<categories.length; i++) {
// 		let category = categories[i].reference;
// 		const promise2 = getCategoryData (category);
// 		promise2
// 		.then(function(data) {
// 		  	createNewInputTemplate (category, data, categories, i);
// 		  	createSelectPicker (categories, i)
// 		})
// 	}
// }

// function createSelectPicker (categories, i) {
// 	let category = categories[i];
// 	// if (category['multiple-choice'] == true) {
// 	// 	$('#' + category.id + '-input').selectpicker();
// 	// }
// 	$('#' + category.id + '-input').selectpicker();
// }




