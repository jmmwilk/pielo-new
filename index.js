import * as brandsList from './brands-list.js';
import * as state from './state.js';
import * as stores from './stores.js';

let searchTermCount = 0;

$(document).ready(function(){
	createFrame ();
	var url = new URL(window.location.href);
	var params = new URLSearchParams(url.search);
	if (params.get('page') === 'stores') {
		createStoresPage ();
	}
	if (params.get('page') === 'newsletter') {
		createTemplate ('newsletter-page', 'main');
	}
	if (params.get('page') === 'o-pielo') {
		createTemplate ('about-pielo', 'main');
	}
	if (params.get('page') === 'lista-marek') {
		createBrandsListPage ();
	}
	if (params.get('page') === 'start' || !params.get('page')) {
		createStartPage ();
	}
})

function createFrame () {
	createTemplate ('structure', 'application');
	// $('#newsletter-button').click(function(){
	// 	window.location.href = '?page=newsletter';
	// });
}

function createStartPage () {
	createTemplate ('main-page', 'main');
	createTemplate ('search-box', 'search-box-container');
	createTemplate ('search-button', 'search-button-wrapper');
	createTemplate ('selected-brands', 'selected-brands-wrapper');
	adjustBgImage ();
	window.addEventListener('resize', adjustBgImage );
	var url = new URL(window.location.href);
	var params = new URLSearchParams(url.search);
	let brandsFromURL = params.getAll('brand');
	brandsFromURL.forEach(function(brandFromURL){
		state.selectedBrands.push({'brand-id': brandFromURL})
	})
	if (state.selectedBrands.length > 0) {
		$('#search-button').removeClass('d-none');
		for (let i=0; i<state.selectedBrands.length; i++) {
			let brandId = state.selectedBrands[i]['brand-id'];
			let selectedBrandName =  brandsList.sortedBrands.find(function(brand){
				return brand['brand-id'] == brandId;
			})['brand-name'];
			createSelectedBrandBadge (selectedBrandName, brandId);
		};
	};
	setSearchBoxPlaceholder ();
	$('#search-box-input').on("keyup", function() {
		searchBrands ();
  	});
  	$('#search-button').on('click',function(){
  		goToNewURL('?page=stores')
	});
	$('#right-column').height($(window).height() - $('#header').height());
}

function createBrandsListPage () {
	createTemplate ('brands-list', 'main', {'brands-number': brandsList.sortedBrands.length});
	brandsList.sortedBrands.forEach(function(brand){
		createTemplate ('brand', 'brands-list-wrapper', brand);
	})
}

// document.onmouseover = function() {
//     //User's mouse is inside the page.
//     window.innerDocClick = true;
// }

// document.onmouseleave = function() {
//     //User's mouse has left the page.
//     window.innerDocClick = false;
// }

function searchBrands () {
	let newCount = $('#search-box-input').val().length;
	if (newCount < 2) {
		$("#filtered-brands-wrapper").html('');
		return
	}
	if (newCount === 2) {
		$("#filtered-brands-wrapper").html('');
		suggestBrands ();
		$('.filtered-brand-badge').on('click',function(e){
	   		selectBrand (this);
		});
	};
	if (newCount > 2 && newCount > searchTermCount) {
		filterBrands ();
	};
	if (newCount > 2 && newCount < searchTermCount) {
		$("#filtered-brands-wrapper").html('');
		suggestBrands ();
		$('.filtered-brand-badge').on('click',function(e){
	   		selectBrand (this);
		});
	}
	searchTermCount = newCount;
}

function removeBrandFromSelected (selectedBrand) {
	var url = new URL(window.location.href);
	var params = new URLSearchParams(url.search);
	if (params.get('page') !== 'stores') {
		let brandId = $(selectedBrand).attr('brand-id');
		for (let i=0; i<state.selectedBrands.length; i++) {
			if (state.selectedBrands[i]['brand-id'] == brandId) {
				state.selectedBrands.splice(i,1);
				goToNewURL ('?page=start');
			};
		};
		setSearchBoxPlaceholder ();
	}
}

function goToNewURL (parametersString) {
	for (let i=0; i<state.selectedBrands.length; i++) {
		parametersString = parametersString + '&brand=' + state.selectedBrands[i]['brand-id'];
	}
	window.location.href = parametersString;
}

function selectBrand (selectedBrand) {
	let brandId = $(selectedBrand).attr('brand-id');
	let selectedBrandName =  brandsList.sortedBrands.find(function(brand){
		return brand['brand-id'] == brandId
	})['brand-name'];
	let isAlreadySelected = false
	for (let i=0; i<state.selectedBrands.length; i++) {
		if (state.selectedBrands[i]['brand-id'] == brandId) {
			isAlreadySelected = true;
			return
		};
	};
	if (!isAlreadySelected) {
		state.selectedBrands.push({'brand-id': brandId});
		goToNewURL ('?page=start');
	};
}

function createSelectedBrandBadge (selectedBrandName, brandId) {
	createBrandBadge ('selected-brand-badge', selectedBrandName, brandId, 'selected-items-wrapper');
	let badgeId = brandId + '-selected-brand-badge';
	$('#' + badgeId).on('click',function(e){
   		removeBrandFromSelected (this);
	});
}

function setSearchBoxPlaceholder () {
	if (state.selectedBrands.length > 0) {
		$('#search-box-input').attr("placeholder", "Wpisz kolejną markę pieluszek");
	} else {
		$('#search-box-input').attr("placeholder", "Wpisz dowolną markę pieluszek");
	}
}

function adjustBrandBadgeSize (brandId, badgeType) {
	let badgeTextId = brandId + '-' + badgeType + '-text';
	let badgeTextWidth = $('#' + badgeTextId).width();
	let badgeWidth = $('#' + badgeTextId).parent().width();
	if (badgeTextWidth + 15 > badgeWidth) {
		$('#' + badgeTextId).parent().width(badgeTextWidth + 15)
		$('#' + badgeTextId).parent().parent().removeClass('col').addClass('col-auto');
	}
}

function suggestBrands () {
	let searchTerm = $('#search-box-input').val().toLowerCase();
	let results = $.grep(brandsList.sortedBrands, function(elem) {
	    return elem['brand-name'].toLowerCase().indexOf(searchTerm) > -1;
	});
	let brandName;
	let brandId;
	let badgeType;
	for (let i=0; i<results.length; i++) {
		brandId = results[i]['brand-id'];
		let isAlreadySelected = isThisBrandSelected (brandId)
		if (!isAlreadySelected) {
			brandName = results[i]['brand-name'];
			badgeType = 'filtered-brand-badge';
			createBrandBadge ('filtered-brand-badge', brandName, brandId, 'filtered-brands-wrapper');
		};
	};
}

function isThisBrandSelected (brandId) {
	let isAlreadySelected = false
	for (let i=0; i<state.selectedBrands.length; i++) {
		if (state.selectedBrands[i]['brand-id'] == brandId) {
			isAlreadySelected = true;
			return isAlreadySelected
		};
	};
	return isAlreadySelected
}

function filterBrands () {
	let searchTerm = $('#search-box-input').val().toLowerCase();
	$("#filtered-brands-wrapper *").filter(function() {
  		$(this).toggle($(this).text().toLowerCase().indexOf(searchTerm) > -1)
	});
}


function createStoresPage () {
	var url = new URL(window.location.href);
	var params = new URLSearchParams(url.search);
	let brandsFromURL = params.getAll('brand');
	brandsFromURL.forEach(function(brandFromURL){
		state.selectedBrands.push({'brand-id': brandFromURL})
	})
	createTemplate ('main-page', 'main');
	createTemplate ('stores', 'stores-wrapper');
	createTemplate ('go-back-text', 'go-back-text-wrapper');
	createTemplate ('selected-brands', 'selected-brands-wrapper');
	for (let i=0; i<state.selectedBrands.length; i++) {
		let brandId = state.selectedBrands[i]['brand-id'];
		let brandName =  brandsList.sortedBrands.find(function(brand){
			return brand['brand-id'] == brandId
		})['brand-name'];
		createBrandBadge ('selected-brand-badge', brandName, brandId, 'selected-items-wrapper')
	};
	adjustBgImage ();
	window.addEventListener('resize', adjustBgImage );
	$('#matching-stores-wrapper').html('');
	$('.selected-brand-badge').each(function(badge) {
	  	$(this).removeAttr('role');
	});
	let matchingStores = stores.storesList.filter(function(store){
		let areAllItems = true;
		state.selectedBrands.forEach(function(selectedBrand){
			let brandInStore = store['store-brands'].find(function(brand){
				return brand == selectedBrand['brand-id']
			});
			if (!brandInStore) {
				areAllItems = false
				return
			};
		});
		return areAllItems === true
	});
	if (matchingStores.length === 0) {
		$('#go-back-text').html('Żaden sklep nie spełnia kryteriów. Spróbuj usunąć niektóre marki z wyszukiwania')
	} else {
		$('#go-back-text').html('Dodaj kolejną markę do wyszukiwania')
		$('#stores-text').html('Sklepy:')
		matchingStores.forEach(function(store){
			let logo = 'images/stores-logos/' + store['store-src'];
			createTemplate ('matching-stores', 'matching-stores-wrapper', {'store-logo': logo, 'store-id': store['store-id']});
			$('#' + store['store-id'] + '-store-logo-wrapper').on('click',function(){
				window.open(store['store-url']);
			});
		});
		$('#galotki-store-logo').height(150);
	};
	$('#go-back-text').on('click',function(){
		goToNewURL ('?page=start');
	});

}

function createBrandBadge (badgeType, brandName, brandId, wrapperId) {
	createTemplate ('badge', wrapperId, {'brand-name': brandName, 'brand-id': brandId, 'badge-type': badgeType});
	adjustBrandBadgeSize (brandId, badgeType);
}

function adjustBgImage () {
	$('#right-column').css('height', $(window).height() - $('#header').height() + 'px');
	let bgImage;
	if ($(window).width() >= 992) {
		bgImage = $('#lg-background-image');
	  	$(bgImage).css("height", $('#left-column').width() + 'px');
		$(bgImage).css("width", 7/6*$('#left-column').width() + 'px');
		$(bgImage).parent().css("right", 1/6*$('#left-column').width() + 'px');
	}
	if ($(window).width() < 992) {
		bgImage = $('#md-background-image');
	  	$(bgImage).css("height", $('#left-column').width() + 'px');
	  	// czy tu nie trzeba powiekszyc szerokosci??
		$(bgImage).parent().css("right", 1/4*$('#left-column').width() + 'px');
	}
}


function createTemplate (templateId, parentTemplate, data) {
	let template = Handlebars.templates[templateId];
	$('#' + parentTemplate).append(template(data));
}

// newsletter button (in structure.handlebars)
// <button id="newsletter-button" class="btn btn-outline-warning" type="button">
// 				        NEWSLETTER</button>




