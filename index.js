
$(document).ready(function(){
	createTemplate ('structure', 'application');
	createTemplate ('main-page', 'main');
	$('#newsletter-button').click(goToNewsletter);
//	window.location.href = "https://pielo.pl#newsletter";
	adjustBgImage ();
	window.addEventListener('resize', adjustBgImage );
	for (let i=0; i<brands.length; i++) {
		createTemplate ('badge', 'brands-propositions-wrapper', {'brand-name': brands[i]['brand-name']});
	}
})

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


let brands = [
	{
		'brand-name': 'Pieluszki Ratuski', 
	},
	{
		'brand-name': 'Anavy', 
	},
	{
		'brand-name': 'Eko Manufaktura', 
	},
	{
		'brand-name': 'Anna Luna', 
	},
	{
		'brand-name': 'Bee3', 
	},
]



