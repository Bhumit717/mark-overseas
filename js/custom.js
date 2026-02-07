// Hide loader on window load or fallback after 2 seconds
function hideLoader() {
	$("body").addClass("loaded");
}

$(window).on('load', hideLoader);
// Safety fallback: almost immediate show if load event is quirky
setTimeout(hideLoader, 100);

$(window).scroll(function () {
	var height = $(window).scrollTop();
	if (height > 50) {
		$('html').addClass('sticky');
	} else {
		$('html').removeClass('sticky');
	}

	// Groundnut Rotation Effect
	var $groundnut = $('.scroll-rotate-groundnut');
	if ($groundnut.length) {
		var scrollTop = $(window).scrollTop();
		var windowHeight = $(window).height();
		var elementOffset = $groundnut.offset().top;
		var elementHeight = $groundnut.height();

		// Calculate how far the element is from being centered in the viewport
		var scrollCenter = scrollTop + (windowHeight / 2);
		var elementCenter = elementOffset + (elementHeight / 2);

		// If element is in viewport, rotate it
		if (scrollTop + windowHeight > elementOffset && scrollTop < elementOffset + elementHeight) {
			var distance = scrollCenter - elementCenter;
			// Map distance to rotation (e.g., -300px to 300px -> -15deg to 15deg, total 30deg)
			var rotation = (distance / 10) * (30 / 60); // Simplified logic for roughly 30deg total range
			rotation = Math.max(-15, Math.min(15, rotation)); // Bound to 30deg total swing
			$groundnut.css('transform', 'rotate(' + rotation + 'deg)');
		}
	}
});
$(document).ready(function () {
	$(".scrollToTop").click(function (event) {
		event.preventDefault();
		$("html, body").animate({ scrollTop: 0 }, "slow");
		return false;
	});
	$('.close_menu').click(function () {
		$("body").removeClass("courses_show");
	});
	$('.submenu-toggle').click(function () {
		$(this).parent().toggleClass('submenu_active');
	});
	$('.navbar-toggle').click(function () {
		$("html").toggleClass("menu-show");
	});
	$('.header-menu-overlay').click(function () {
		$("html").removeClass("menu-show");
	});

	// Contact Form Submission Handler (Connected to Live API)
	$('#contact_form').on('submit', function (e) {
		e.preventDefault();

		var name = $('#name').val();
		var email = $('#email').val();
		var phone = $('#phone').val();
		var subject = $('#subject').val();
		var message = $('#message').val();

		var $btn = $('#btn_submit');
		var originalBtnText = $btn.text();
		$btn.prop('disabled', true).text('Sending...');

		$.ajax({
			type: 'POST',
			url: 'https://www.mark-overseas.com/contact-action.php',
			data: $(this).serialize(),
			success: function (response) {
				alert('Thank you! Your message has been sent successfully to Mark Overseas.');
				$('#contact_form')[0].reset();
			},
			error: function (xhr, status, error) {
				console.error('API Submission failed:', error);
				// Fallback to mailto if direct API call fails (common for local files due to CORS)
				var emailBody = "New Inquiry from Mark Overseas Website\n\n";
				emailBody += "Name: " + name + "\n";
				emailBody += "Email: " + email + "\n";
				emailBody += "Phone: " + phone + "\n\n";
				emailBody += "Message:\n" + message;

				var mailtoLink = "mailto:info@mark-overseas.com" +
					"?subject=" + encodeURIComponent(subject || "Website Inquiry") +
					"&body=" + encodeURIComponent(emailBody);

				alert('Direct submission encountered a connection issue (likely CORS). Opening your email client instead.');
				window.location.href = mailtoLink;
			},
			complete: function () {
				$btn.prop('disabled', false).text(originalBtnText);
			}
		});
	});
	// Product Tab Switching
	$('.product-tab-btn').click(function () {
		var tabId = $(this).data('tab');

		$('.product-tab-btn').removeClass('active');
		$(this).addClass('active');

		$('.tab-pane').removeClass('active');
		$('#' + tabId).addClass('active');
	});
});
