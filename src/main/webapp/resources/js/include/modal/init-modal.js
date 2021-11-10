let initModal = function(id, num) {
	let modal = $('<div>').addClass('modal');
	
	if(num == 1) {
		modal.addClass('width_modal');
	}else if(num == 2) {
		modal.addClass('height_modal');
	}else if(num == 3) {
		modal.addClass('simple_modal');
	}else if(num == 4) {
		modal.addClass('address_modal');
	}
	
	let parent = '#' + id;
	
	$(parent).append(modal);
	
	return modal;
}

let appendTitle = function(modal, title, center) {
	let titDiv = $('<div>' + title + '</div>')
					.addClass('modal_tit');
	
	if(center) titDiv.addClass('modal_tit_center');
	modal.append(titDiv);
}

let setButton = function(modal, left, right) {
	let wrapBtn = $('<div>').addClass('modal_btn_wrap');
	
	let leftBtn = $('<button>' + left + '</button>')
					.addClass('modal_left_btn').width('48%');
	
	let rightBtn = $('<button>' + right + '</button>')
					.addClass('modal_right_btn').width('48%');
	
	wrapBtn.append(leftBtn);
	
	if(!right) {
		leftBtn.css('background-color', 'rgb(106, 176, 223)')
				.width('100%');
		modal.append(wrapBtn);
		return;
	}
	
	wrapBtn.append(rightBtn);
	modal.append(wrapBtn);
}

let setContent = function(modal, title, button) {
	let height = modal.height();
	
	if(title) height -= $('.modal_tit').height();
	if(button) height -= $('.modal_btn_wrap').height();
	
	let contentDiv = $('<div>').height(height).addClass('modal_content');
	
	if(!title && !button) {
		modal.append(contentDiv);
		return;
	}else if(!title) {
		$('.modal_btn_wrap').before(contentDiv);
		return;
	}
	$('.modal_tit').after(contentDiv);
}

let addPiggyBackground = function(modal) {
	let piggyDiv = $('<div>').height(modal.height() + 5).width(modal.width() + 5)
				.addClass('modal piggy_modal')
				.css('z-index', '997')
				.css('box-shadow', '');
	
	let piggy = $('<div>').addClass(modal.attr('class') + ' piggy')
							.removeClass('modal');
	
	piggyDiv.append(piggy);
	
	modal.removeClass('modal')
			.css('z-index', '999')
			.css('background-color', 'rgba(255, 255, 255, 0.8)')
			.wrap(piggyDiv);
}

let modalBlock = function() {
	$('#modal').css('display', 'block');
	$('#modal').children().css('display', 'block');
}

let modalNone = function() {
	$('#modal').html('');
	$('#modal').css('display', 'none');
}


