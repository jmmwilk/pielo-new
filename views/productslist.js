import * as diaperslist from '../mocks/diapers.js';
import * as productpage from '../views/productpage.js';
import * as eventBus from '../eventBus.js';
import * as state from '../state.js';

let database = firebase.database();

let clickedMenuItem;

export function createProductsList () {
	const promise = getDatabaseDiapers ();
	promise
	.then(function(diapers) {
	  	let loadedDiapers = {'data': diapers};
	  	eventBus.eventBus.subscribe('heartClick', changeHeartClicked);
	  	eventBus.eventBus.subscribe('heartUnClick', changeHeartUnClicked);
	  	eventBus.eventBus.subscribe('heartClick', addDiaperToFavourites);
//	  	eventBus.eventBus.subscribe('heartunClick', removeHeartFromFavourites);
	  	fillSizesInCard ();
		fillDiaperCards ();
		createDiapersTemplate (loadedDiapers);
		enableCardClick ();
		enableHeartChange ();
	})
}

function addDiaperToFavourites (heart) {
	console.log('state', state.state)
	let diaperKey = heart.getAttribute('key')
	console.log('diaperKey', diaperKey)
	let userKey = state.state.userKey;
	console.log('userKey', userKey)
	let dbRef = firebase.database().ref('users/' + userKey + '/favourites');
	var newDbRef = dbRef.push();
	newDbRef.set({
	  'key': diaperKey,
	});


	// let key = newDbRef.getKey();
	// return key
}

function enableHeartChange () {
	let hearts = document.getElementsByClassName('heart');
	Array.from(hearts).forEach(function(heart){
		let userClick = false;
		heart.onclick = function () {
			userClick = !userClick
			if (userClick == false) {
				eventBus.eventBus.trigger('heartUnClick', heart);
			} else {
				eventBus.eventBus.trigger('heartClick', heart);
			}
		}
		heart.onmouseover = function () {
			if (userClick == true) {
				return
			}
			heart.src = "/images/heart-red-border.png";
		}
		heart.onmouseout = function () {
			if (userClick == true) {
				return
			}
			heart.src = "/images/hear2.png";
		}
	});
	$('.heart-box').click(function( event ) {
	  	event.stopPropagation();
	});
}

function changeHeartClicked (heart) {
	heart.src = "/images/heart-red-filled.png";
}

function changeHeartUnClicked (heart) {
	heart.src = "/images/hear2.png";
}

export function createNewProductsList (navCategoryGroup, navCategory) {
	const promise = getDatabaseDiapers ();
	promise
	.then(function(diapers) {
	  	let loadedDiapers = {'data': diapers};
	  	console.log('loadedDiapers', loadedDiapers)
	  	let databaseDiapers = loadedDiapers.data;
	  	console.log('diapers', diapers)
	  	let items = [];
	  	console.log('navCategory', navCategory)
	  	databaseDiapers.forEach(function(databaseDiaper) {
	  		if (navCategoryGroup == 'sizes') {
	  			for (let i=0; i<databaseDiaper.sizes.length; i++) {
	  				if (databaseDiaper.sizes[i].id == navCategory) {
	  					console.log(databaseDiaper)
	  					items.push(databaseDiaper);
	  				}
	  			}
	  		}
	  		if (navCategoryGroup == 'diaper-categories') {
  				if (databaseDiaper.diaperCategory.id == navCategory) {
  					console.log(databaseDiaper)
  					items.push(databaseDiaper);
  				}
	  		}
	  		if (navCategoryGroup == 'brands') {
  				if (databaseDiaper.brand.id == navCategory) {
  					console.log(databaseDiaper)
  					items.push(databaseDiaper);
  				}
	  		}
	  		if (navCategoryGroup == 'fabrics') {
	  			if (databaseDiaper.outsideFabrics !== undefined) {
	  				for (let i=0; i<databaseDiaper.outsideFabrics.length; i++) {
		  				if (databaseDiaper.outsideFabrics[i].id == navCategory) {
		  					console.log(databaseDiaper)
		  					items.push(databaseDiaper);
		  				}
		  			}
	  			}
	  			if (databaseDiaper.innerFabrics !== undefined) {
	  				for (let i=0; i<databaseDiaper.innerFabrics.length; i++) {
		  				if (databaseDiaper.innerFabrics[i].id == navCategory) {
		  					console.log(databaseDiaper)
		  					items.push(databaseDiaper);
		  				}
		  			}
	  			}
	  		}
	  	})
	  	let newItems = {'data': items}
//		fillDiaperCards ();
		removeProductsList ();
		createDiapersTemplate (newItems);
		enableCardClick ();
	})
}

export function removeProductsList () {
	let page = document.getElementById('page');
	let main = document.getElementById('main');
	page.removeChild(main);
}

function fillDiaperCards () {
	let pieluchaTemplate = $('#pielucha-template').html();
	Handlebars.registerHelper('printdiaper', function(){
		return this.name + ' ' + this.type + ' ' + this.fabricprint
	})
}

function getDatabaseDiapers () {
	const promise1 = new Promise ((resolve, reject) => {
		let ref = firebase.database().ref('diapers-mocks/');
		let diapers = [];
		ref.once('value', function(snapshot) {
		    snapshot.forEach(function(childSnapshot) {
		    	var key = childSnapshot.key;
		      	var childData = childSnapshot.val().diaper;
		      	childData.key = key;
		      	diapers.push(childData);
		    });
		    resolve (diapers)
	  	});
	});
	return promise1
}

function createDiapersTemplate (loadedDiapers) {
	let pieluchaTemplate = $('#pielucha-template').html();
	let compiledPieluchaTemplate = Handlebars.compile(pieluchaTemplate);
	$('#page').append(compiledPieluchaTemplate(loadedDiapers))
}


// function createNewDiapersTemplate (newItems) {
// 	let pieluchaTemplate = $('#pielucha-template').html();
// 	let compiledPieluchaTemplate = Handlebars.compile(pieluchaTemplate);
// 	$('#page').append(compiledPieluchaTemplate(newItems));
// }

// function printDiapers () {
// 	let menuItems = document.getElementsByClassName('menu-item');
// 	Array.from(menuItems).forEach(function(menuItem) {
// 		menuItem.onclick = function() {
// 			clickedMenuItem = menuItem;
// 			let category = findCategory ();
// 			let newItems = {'diapers': []} ;
// 			let dpr;
// 			for (let i=0; i<diaperslist.items.diapers.length; i++) {
// 				dpr = diaperslist.items.diapers[i][category].toLowerCase();
// 				if (dpr == clickedMenuItem.id) {
// 					newItems.diapers.push(diaperslist.items.diapers[i]);
// 				} else {
// 				}
// 			}
// 			removeProductsList ();
// 			createNewDiapersTemplate (newItems);
// 			fillDiaperCards ();
// 			enableCardClick ();
// 		}
// 	})
// }

export function enableAllDiapersClick () {
	let allDiapers = document.getElementById('all-diapers-nav');
	allDiapers.onclick = function () {
		removeProductsContainer ();
		createProductsList ();
	}
}

function enableCardClick () {
	let cards = document.getElementsByClassName('card');
	Array.from(cards).forEach(function(card) {
		card.onclick = function () {
			removeProductsContainer ();
			let key = card.dataset.key;
			productpage.createProductScreen (key, 'productScreen');
		}
	})
}

function removeProductsContainer () {
	let page = document.getElementById('page');
	let main = document.getElementById('main');
	page.removeChild(main);
}

function findCategory () {
	let category;
	let isItType = clickedMenuItem.classList.contains('type');
	let isItFabric = clickedMenuItem.classList.contains('fabric');
	let isItSize = clickedMenuItem.classList.contains('size');
	let isItBrand = clickedMenuItem.classList.contains('brand');
	if (isItType == true) {
		category = 'name';
		return category
	};
	if (isItFabric == true) {
		category = 'fabric';
		return category
	};
	if (isItSize == true) {
		category = 'size';
		return category
	};
	if (isItBrand == true) {
		category = 'brand';
		return category
	};
}

function removeCards () {
	let productsContainer = document.getElementById('products-container')
	let cards = document.getElementsByClassName('card');
	Array.from(cards).forEach(function(card) {
		productsContainer.removeChild(card)
	})
}

function fillSizesInCard () {
	let itemPreview = $('#pielucha-template').html();
	Handlebars.registerHelper('printsizes', function(){
		return this.shortcut + ', '
	})
}




