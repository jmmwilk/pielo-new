import * as brandsList from './brands-list.js';

let searchTermCount = 0;


$(document).ready(function(){
	createTemplate ('structure', 'application');
	createTemplate ('main-page', 'main');
	$('#newsletter-button').click(goToNewsletter);
//	window.location.href = "https://pielo.pl#newsletter";
	adjustBgImage ();
	window.addEventListener('resize', adjustBgImage );
	createBrandsList ();
})

function createBrandsList () {
	$('#search-box-input').on("keyup", function() {
		let newCount = $(this).val().length;
		if (newCount < 2) {
			$("#filtered-brands-wrapper").html('');
			return
		}
		if (newCount === 2) {
			$("#filtered-brands-wrapper").html('');
			loadBrands ();
		};
		if (newCount > 2 && newCount > searchTermCount) {
			filterBrands ();
		};
		if (newCount >= 2 && newCount < searchTermCount) {
			$("#filtered-brands-wrapper").html('');
			loadBrands ();
		}
		searchTermCount = newCount;
  	});
}

function enableSelectBrand () {
	$('.brand-badge').on('click',function(){
   		console.log('this', $(this))
   		let name = $(this).attr('brand-name');
   		let brandId = $(this).attr('brand-id');
   		let selectedBrandName =  brandsList.sortedBrands.find(function(brand){
			return brand['brand-id'] == brandId
		})['brand-name'];
   		createTemplate ('badge', 'selected-items-wrapper', {'brand-name': selectedBrandName, 'brand-id': brandId, 'badge-type': 'selected-brand-badge'});
	});  
}

function loadBrands () {
	let searchTerm = $('#search-box-input').val().toLowerCase();
	let results = $.grep(brandsList.sortedBrands, function(elem) {
	    return elem['brand-name'].toLowerCase().indexOf(searchTerm) > -1;
	}); 
	for (let i=0; i<results.length; i++) {
		createTemplate ('badge', 'filtered-brands-wrapper', {'brand-name': results[i]['brand-name'], 'brand-id': results[i]['brand-id'], 'badge-type': 'filtered-brand-badge'});
		enableSelectBrand ();
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





