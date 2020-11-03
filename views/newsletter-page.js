import * as eventBus from '../eventBus.js';

export function createNewsletterTemplate () {
	let template = $('#newsletter-page-template').html();
	let compiledTemplate = Handlebars.compile(template);
	$('#application').html(compiledTemplate());
}

export function enableSubmitClick () {
	const button = document.getElementById('button');
	button.onclick = function () {
		eventBus.eventBus.trigger('submit');
	}
}

export function savePersonalData () {
	console.log('zupa')
	const emailInput = document.getElementById('email-input');
	const nameInput = document.getElementById('name-input');
	const nappiesUserInput = document.getElementById('nappies-user-checkbox');
	const producerInput = document.getElementById('producer-checkbox');
	const shopOwnerInput = document.getElementById('shop-owner-checkbox')
	let email = emailInput.value;
	let name = nameInput.value;
	let nappiesUser = false;
	let producer = false;
	let shopOwner = false;
	if (nappiesUserInput.checked == true) {
		nappiesUser = true;
	};
	if (producerInput.checked == true) {
		producer = true;
	};
	if (shopOwnerInput.checked == true) {
		shopOwner = true;
	};
	var forms = document.getElementsByClassName('needs-validation');
	Array.from(forms).forEach(function(form){
		if (form.classList.contains('was-validated') == true) {
			console.log('grzybek')
		}
	})
	
	let dbRef = firebase.database().ref('newsletter/');
	var newDbRef = dbRef.push();
	newDbRef.set({
	  	'email': email,
		'name': name,
		'nappiesUser': nappiesUser,
		'producer': producer,
		'shopOwner': shopOwner
	});
}

export function disableFormSubmission () {
	    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
    	console.log('form')

      	form.addEventListener('submit', function(event) {
      		console.log('form', form)
	        if (form.checkValidity() === false) {
	          event.preventDefault();
	          event.stopPropagation();
	        }
	        form.classList.add('was-validated');
	        console.log('form', form)
      	}, false);
	});
}




