var shareOpen = false;

function cancelShare(){

	if(shareOpen == true){

		shareOpen = false;

		$('#share').css('display','none');
		$('#share_black').css('display','none');

	}

}

function share(){

	if(shareOpen == false){

		shareOpen = true;

		$('#share').css('display','block');
		$('#share_black').css('display','block');

	}

}