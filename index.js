import * as brandsList from './brands-list.js';
import * as state from './state.js';
import * as stores from './stores.js';

let searchTermCount = 0;


$(document).ready(function(){
	createTemplate ('structure', 'application');
	createTemplate ('main-page', 'main');
	$('#newsletter-button').click(goToNewsletter);
//	window.location.href = "https://pielo.pl#newsletter";
	adjustBgImage ();
	window.addEventListener('resize', adjustBgImage );
	$('#search-box-input').on("keyup", function() {
		searchBrands ();
  	});
  	$('#search-button').on('click',function(){
   		searchStores ();
	});
	$('#right-column').height($(window).height() - $('#header').height());

})

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

	let brandId = $(selectedBrand).attr('brand-id');
	for (let i=0; i<state.selectedBrands.length; i++) {
		if (state.selectedBrands[i]['brand-id'] == brandId) {
			state.selectedBrands.splice(i,1);
			$(selectedBrand).parent().remove();
			{ break; }
		};
	};
	setSearchBoxPlaceholder ();
	$('#search-button').addClass('d-none');
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
		let badgeType = 'selected-brand-badge';
		createTemplate ('badge', 'selected-items-wrapper', {'brand-name': selectedBrandName, 'brand-id': brandId, 'badge-type': badgeType});
		adjustBrandBadgeSize (brandId, badgeType);
		$('#filtered-brands-wrapper').html('');
		$('#search-box-input').val('');
		$('#search-button').removeClass('d-none');
	};
	$('.selected-brand-badge').on('click',function(e){
   		removeBrandFromSelected (this);
	});
	setSearchBoxPlaceholder ();

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
			createTemplate ('badge', 'filtered-brands-wrapper', {'brand-name': brandName, 'brand-id': brandId, 'badge-type': badgeType});
			adjustBrandBadgeSize (brandId, badgeType);
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

function searchStores () {
	$('#stores-wrapper').removeClass('d-none');
	$('#search-box-container').addClass('d-none');
	$('#search-button').addClass('d-none');
	$('#matching-stores-wrapper').html('');
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
		$('#stores-text').html('Żaden sklep nie spełnia kryteriów. Spróbuj usunąć niektóre wyszukiwania.')
		return
	}
	$('#stores-text').html('Sklepy:')
	matchingStores.forEach(function(store){
		let logo = 'images/stores-logos/' + store['store-src'];
		createTemplate ('matching-stores', 'matching-stores-wrapper', {'store-logo': logo, 'store-url': store['store-url']});
	});
}

function adjustBgImage () {
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

function goToNewsletter () {
	window.location.href = "#newsletter";
	$('#main').html('');
	createTemplate ('newsletter-page', 'main');
}


function createTemplate (templateId, parentTemplate, data) {
	let template = Handlebars.templates[templateId];
	$('#' + parentTemplate).append(template(data));
}





