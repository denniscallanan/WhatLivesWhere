var shareOpen = false;

function info(tex){
	$("#info").html(tex);
	$("#info").addClass('info_active');
	setTimeout(function(){$("#info").removeClass('info_active')}, 700);
	
}

function cancelShare(){

	if(shareOpen == true){

		shareOpen = false;

		$('#share').css('display','none');
		$('#share_black').css('display','none');

	}

}

function share(){
	
	$('#share_inp').val(window.location.href);

	if(shareOpen == false){

		shareOpen = true;

		$('#share').css('display','block');
		$('#share_black').css('display','block');

	}

}