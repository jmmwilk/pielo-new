
$(document).ready(function(){
	createTemplate ('structure', 'application');
	createTemplate ('main-page', 'main');
	$('#newsletter-button').click(goToNewsletter);
//	window.location.href = "https://pielo.pl#newsletter";
	$('#background-image').css("height", $('#left-column').width() + 'px');
	$('#background-image').css("width", 7/6*$('#left-column').width() + 'px');
	$('#background-image-container').css("right", 1/6*$('#left-column').width() + 'px');
})

function goToNewsletter () {
	console.log ('cebula');
	window.location.href = "#newsletter";
	$('#main').html('');
	createTemplate ('newsletter-page', 'main');
}


function createTemplate (templateId, parentTemplate, data) {
	let template = Handlebars.templates[templateId];
	$('#' + parentTemplate).append(template(data));
}




