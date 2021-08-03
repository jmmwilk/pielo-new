import * as brandsList from './brands-list.js';
import * as state from './state.js';

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

function removeBrand (selectedBrand) {
	let brandId = $(selectedBrand).attr('brand-id');
	for (let i=0; i<state.selectedBrands.length; i++) {
		if (state.selectedBrands[i]['brand-id'] == brandId) {
			state.selectedBrands.splice(i,1);
			$(selectedBrand).parent().remove();
			return
		};
	};
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
	};
	$('.selected-brand-badge').on('click',function(e){
   		removeBrand (this);
	});
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
		brandName = results[i]['brand-name'];
		brandId = results[i]['brand-id'];
		badgeType = 'filtered-brand-badge';
		createTemplate ('badge', 'filtered-brands-wrapper', {'brand-name': brandName, 'brand-id': brandId, 'badge-type': badgeType});
		adjustBrandBadgeSize (brandId, badgeType);
	};
}

function filterBrands () {
	let searchTerm = $('#search-box-input').val().toLowerCase();
	$("#filtered-brands-wrapper *").filter(function() {
  		$(this).toggle($(this).text().toLowerCase().indexOf(searchTerm) > -1)
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
	if ($(window).width() >= 768 && $(window).width() < 992) {
		bgImage = $('#md-background-image');
	  	$(bgImage).css("height", $('#left-column').width() + 'px');
		$(bgImage).parent().css("right", 1/4*$('#left-column').width() + 'px');
	}
	if ($(window).width() < 768) {
		bgImage = $('#circle');
	  	$(bgImage).css("height", 3/2 * $(window).width() + 'px');
	  	$(bgImage).parent().css("top", 3/4*$(window).height() + 'px');
	  	$(bgImage).parent().css("left", -1/10*$(window).width() + 'px');
	  	$(bgImage).parent().css("height", 1/4*$(window).height() + ($('#footer').outerHeight(true)) + 'px');
	  	$(bgImage).parent().css("width", 11/10*$(window).width() + 'px');
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





