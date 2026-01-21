$(window).load(function(){
	$("body").addClass("loaded");
})
$(window).scroll(function() {
	var height = $(window).scrollTop();
	if (height > 50) 
	{
		$('html').addClass('sticky');				
	} else {					
		$('html').removeClass('sticky');				
	}							
});	
$(document).ready(function() {				
	$(".scrollToTop").click(function(event) {
		event.preventDefault();					
		$("html, body").animate({ scrollTop: 0 }, "slow");
		return false;				
	});
	$('.close_menu').click(function() {
		$("body").removeClass("courses_show");
	});
	$('.submenu-toggle').click(function() {
		$(this).parent().toggleClass('submenu_active');
	});
	$('.navbar-toggle').click(function() {
		$("html").toggleClass("menu-show");
	});
	$('.header-menu-overlay').click(function() {
		$("html").removeClass("menu-show");
	});

	// Contact Form Submission Handler
	$('#contact_form').on('submit', function(e) {
		e.preventDefault();
		
		var name = $('#name').val();
		var email = $('#email').val();
		var phone = $('#phone').val();
		var subject = $('#subject').val();
		var message = $('#message').val();
		
		var emailBody = "New Inquiry from Mark Overseas Website\n\n";
		emailBody += "Name: " + name + "\n";
		emailBody += "Email: " + email + "\n";
		emailBody += "Phone: " + phone + "\n\n";
		emailBody += "Message:\n" + message;
		
		var mailtoLink = "mailto:info@mark-overseas.com" +
						 "?subject=" + encodeURIComponent(subject || "Website Inquiry") +
						 "&body=" + encodeURIComponent(emailBody);
		
		window.location.href = mailtoLink;
	});
});
