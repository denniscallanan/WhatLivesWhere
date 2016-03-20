function isCirclesInverted(){
	if($('#invert').hasClass('tool_cb_checked')){return true;}
	else{return false;}
}

function isMapUsed(){
	if($('#usemap').hasClass('tool_cb_checked')){return true;}
	else{return false;}
}

$(document).ready(function(){

	$('.tool_cb').click(function(){

		el = $(this);

		if(el.hasClass('tool_cb_checked')){
			el.removeClass('tool_cb_checked');
		} else{
			el.addClass('tool_cb_checked');
		}

		hideDataIfNeeded();

	})

})