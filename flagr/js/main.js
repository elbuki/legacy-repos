$(function() {
	$('.card-image, .upload-button').click(function() {
		$('input').click();
	});
	$('.download-button').click(function() {
		
		/*	
		html2canvas($('.card-image'), {
			onrendered: function(canvas) {
				document.body.appendChild(canvas)
				canvas.toBlob(function(blob) {
					saveAs(blob, "result.png");
				});
			}
		}); */
	});
	$('input:file').change(function(a) {		
		var file = $(this).prop('files')[0];
		if(typeof file != 'undefined') {
			var img = document.createElement('img');
			img.src = window.URL.createObjectURL(file);		
			img.onload = function() {
				window.URL.revokeObjectURL(this.src);
				resizeWindow();
			}	
			$('.card-image .container').hide();
			document.querySelector('.card-image').appendChild(img);
		}		
	});
	$('.flags img').each(function(a, b) {		
		$(b).click(addFilter);
	});
	$(window).resize(resizeWindow);
	resizeWindow();
	function resizeWindow() {		
		$('.flags').height($(window).height() / 10);
		$('.flags img').width($('.flags').height() * 2);
		$('.card-image')
			.height(evaluateProperties([$(window).height(),
								'-' + $('.card-content').height(),
								'-' + $('.card').css('margin-top'),
								-30]));
		$('.card .container .valign')
			.css('font-size', ($('.card-image').height() / 16))
			.find('i').css('font-size', ($('.card-image').height() / 4) + 'px');		
		$('.card-image img').each(function(a, b) {
			$(b).css({
				'max-width': $(this).parent().width(),
				'max-height': $(this).parent().height()
			});
		});
		$('.card-image .filter-container div').css({
			'width': $('.card-image img').width(),
			'height': $('.card-image img').height()
		});
	}
	function evaluateProperties(properties, inPixels) {
		var result = 0;
		properties.forEach(function(element) {
			if(typeof element !== 'number') {
				if(element.indexOf('px') > 0) {
					element = element.substring(0, element.length - 2);
				}
			}
			result += parseFloat(element);
		});
		return inPixels ? result + 'px' : result;
	}
	function addFilter() {
		var uploadedImage = $('.card-image img');
		var div = $('<div>').addClass('filter-container');
		$(this).css({
			'height': uploadedImage.height(),
			'width': 'auto',
			'opacity': '0.5'
		});
		if($(uploadedImage).length) {
			div.append($('<div>').css({
				'position': 'relative',
				'margin': '0 auto',
				'width': uploadedImage.width(),
				'height': uploadedImage.height(),
				'overflow': 'hidden'
			}).append(this));
			$(uploadedImage).parent().append(div);
		}		
	}
});