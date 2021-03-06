var areas = [];
var currentPos;
var map;

var mouseIsDown = false;

function Area(lt,ln, pt){

  this.circles=[];
  this.lat = lt;
  this.lng = ln;
  this.point = pt;
}

function newcircle(rad, pos, m) {

  mouseIsDown = true;
  if(rad==1){
    areas.push(new Area(pos.lat(), pos.lng(), pos));
    createCircle(pos, rad, map, areas.length-1);
  }else{
    createCircle(pos, rad, map, areas.length-1);
    areas[areas.length-1].circles.shift().setMap(null);
    setCircleListener(areas.length-1);

  }
  setTimeout(function() {
    if(mouseIsDown) {
      rad+=m*90000/map.getZoom();
      if(rad<=0){
        areas.pop().circles[0].setMap(null); 
        mouseIsDown = false;
		performRequest();
        return;
      }
      newcircle(rad, pos, m);
    } else{
		performRequest();
	} 
  }, 20)
}


function oldcircle(a, p, r, m) {

  mouseIsDown = true;

  createCircle(p, r, map, a);
  areas[a].circles.shift().setMap(null);
  setCircleListener(a);
  
  setTimeout(function() {
    if(mouseIsDown) {
      r+=m*90000/map.getZoom();
      if(r<=0){
        areas.splice(a,1)[0].circles[0].setMap(null); 
        mouseIsDown = false; 
		performRequest();
        return;
      } else{
	  }
      oldcircle(a, p, r, m);
    } else{
		performRequest();
	}   
  }, 20)
}

window.addEventListener('mousedown',function(e){ 

  var isRightMB;
  e = e || window.event;

  if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
    isRightMB = e.which == 3; 
  else if ("button" in e)  // IE, Opera 
    isRightMB = e.button == 2; 

  if(isRightMB){

    var mult = 1;

    if(e.shiftKey){mult=-1;};

    var exists = pointExistsInCircle(currentPos);
    if(exists == -1){
      newcircle(1,new google.maps.LatLng(currentPos.lat(), currentPos.lng()), mult);
    }else{
      oldcircle(exists, areas[exists].point, areas[exists].circles[0].radius, mult);
    }
  }

});

window.addEventListener('mouseup', function(e) {
  mouseIsDown = false;
});


function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40, lng: 0},
    zoom: 3,
    backgroundColor:'#000000',
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    styles: [{
      featureType: 'poi',
      stylers: [{ visibility: 'off' }]  // Turn off points of interest.
    }, {
      featureType: 'transit.station',
      stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
    }],
    disableDoubleClickZoom: true
  });

  google.maps.event.addListener(map, 'mousemove', function (event) {
    currentPos = event.latLng;
    //console.log(currentPos.lat() + ", " + currentPos.lng());
  });
}

function createCircle(pos,rad, map, arval){

  areas[arval].circles.push(new google.maps.Circle({
    strokeColor: '#FF0000',
    strokeOpacity: 0,
    strokeWeight: 2,
    fillColor: '#000000',
    fillOpacity: 0.4,
    map: map,
    center: pos,
    radius: rad,
    clickable: true,
    draggable: true
  }));
}

function loopThrough(){

  var info = "";
  for(x in areas){

    var curLat = areas[x].lat;
    var curLng = areas[x].lng;
    var curRad = areas[x].circles[0].radius;
    info += ("Circle centered at (" + curLat + ", " + curLng +  ") with radius " + curRad + "\n");
  }
  //console.log(info);
}

function pointExistsInCircle(pt){
  for(x in areas){

    if(pointInCircle(pt, areas[x].circles[0].radius, areas[x].point)){
      //console.log("going to return " + x);
      return x;
    }
  }
  //console.log("going to return false"); 
  return -1;
  
}

function pointInCircle(point, radius, center)
{
    return (google.maps.geometry.spherical.computeDistanceBetween(point, center) <= radius)
}

function clearCircles(){

  for(x in areas){
    areas[x].circles[0].setMap(null);
  }
  areas.length = 0;
  
  info('Selection has been cleared!');
  
  createBaseCircleData();
  makeHtml();
  hideDataIfNeeded();
  
}

function setCircleListener(a){

  areas[a].circles[0].addListener('mousemove', function(e) {
    google.maps.event.trigger(this.getMap(), 'mousemove', {
      latLng: e.latLng
    })
  });

  areas[a].circles[0].addListener('dragend',function(event) {
    //console.log("DRAG FINISHED - landed on " + event.latLng.lat() + ", " + event.latLng.lng());
    areas[a].lat = event.latLng.lat();
    areas[a].lng = event.latLng.lng();
    areas[a].point = event.latLng; 
  });

}


function resetCamera(){

  map.setZoom(3);
  map.panTo(new google.maps.LatLng(40, 0));
  
  info('Camera set to longitude:0 latitude:40 zoom:3... Reset...');

}

function clearSearch(){

  $('.searchpiece_input').val('');

  info('Search has been cleared!');
  
  search(false);

}

function showLoadingIfNeeded(){
  if(showLoading == true){
	$("#loading").css('display','block');
  }
}

function hideData(){
  $("#wrapper").css('display','none');
  $("#tips").css('display','block');
  $("#loading").css('display','none');
}

function showData(){
  $("#wrapper").css('display','block');
  $("#tips").css('display','none');
  showLoadingIfNeeded();
}

function hideDataIfNoData(){
	if(circles.length > 0){showData();}
	else{hideData();}
}

function hideDataIfNeeded(){
	if(isMapUsed()){
		hideDataIfNoData();
	} else{
		showData();
	}
}



function search(inf){
	inf = typeof inf !== 'undefined' ? inf : true;
	if(inf==true){info('Searching...');}
}


















var circles = [];

var circle_data = {};

var circle_list = [];

var animal_list = [];

var plant_list = [];

var animal_html = '';
var plant_html = '';
var the_html = '';

showLoading = false;

function getCircles(){
	circles=[];
	for(x in areas){
		var info = "";
		var curLat = areas[x].lat;
		var curLng = areas[x].lng;
		var curRad = areas[x].circles[0].radius;
		info += ("" + curLat + "," + curLng + "," + curRad);
		circles.push(info);
	}
}

function clearUselessCircleData(){
	for(var key in circle_data){
		if(!(circles.indexOf(key) >= 0)){
			delete circle_data[key];
		}
	}
}

function addNewCircleData(){
	for(var cid in circles){
		circle = circles[cid];
		if(!(circle in circle_data)){
			circle_data[circle] = 'animal:mammals:dogs:dog.png:Dachschund:General household regions' + randint(1,56)+'_plant:flowers:panda.png:Birch Tree:Ireland<br>and other areas!' + randint(1,4)+'';
			if(circle_data[circle].slice(-1) == '~'){
				circle_data[circle] = circle_data[circle].slice(0,circle_data[circle].length-1);
				showLoading = false;
			} else{
				showLoading = true;
			}
			
		}
	}
}

function createBaseCircleData(){
	getCircles();
	clearUselessCircleData();
}

function createCircleList(){
  circle_list=[];
  for(var key in circle_data){
    var val = circle_data[key];
    var splited = val.split('_');
    for(var sid in splited){
      var spl = splited[sid];
      if(!(circle_list.indexOf(spl) >= 0)){
        circle_list.push(spl);
      }
    }
  }
}

function createAnimalPlantLists(){
	animal_list = [];
	plant_list = [];
	for(lid in circle_list){
		var livthing = circle_list[lid];
		var livtype = livthing.split(':')[0];
		if(livtype == "animal"){
			animal_list.push(livthing);
		} else{
			plant_list.push(livthing);
		}
	}
}

function convertAnimalToHtml(){
	animal_html += '<div class="scrolldiv">\n\n';
	for(var aid in animal_list){
		animal_html += '	<div class="scrolldiv_el clickable">\n';
		var animal = animal_list[aid];
		var aninfo = animal.split(':');
		var group = aninfo[1];
		var class_ = aninfo[2];
		var image_ = aninfo[3];
		var name = aninfo[4];
		var locations = aninfo[5];
		animal_html += '		<div class="scrolldiv_el_img" style="content:url(\''+image_+'\')" ></div>\n';
		animal_html += '		<div class="scrolldiv_el_w"><div class="scrolldiv_el_title">'+name+'</div>\n';
		animal_html += '		<div class="scrolldiv_el_loctext">'+locations+'</div></div>\n'
		animal_html += '	</div>\n\n';
	}
	animal_html += '</div>\n\n';
}

function convertPlantToHtml(){
	plant_html += '<div class="scrolldiv">\n\n';
	for(var pid in plant_list){
		plant_html += '	<div class="scrolldiv_el clickable">\n';
		var plant = plant_list[pid];
		var pinfo = plant.split(':');
		var group = pinfo[1];
		var image_ = pinfo[2];
		var name = pinfo[3];
		var locations = pinfo[4];
		plant_html += '		<div class="scrolldiv_el_img" style="content:url(\''+image_+'\')" ></div>\n';
		plant_html += '		<div class="scrolldiv_el_w"><div class="scrolldiv_el_title">'+name+'</div>\n';
		plant_html += '		<div class="scrolldiv_el_loctext">'+locations+'</div></div>\n'
		plant_html += '	</div>\n\n';
	}
	plant_html += '</div>\n\n';
}

function convertDataToHtml(){
	animal_html = '';
	plant_html = '';
	the_html = '';
	convertAnimalToHtml();
	convertPlantToHtml();
	mergeHtml();
}

function mergeHtml(){
	the_html = animal_html + plant_html;
}

function updateHtml(){
	$('#wrapper').html(the_html);
}

function makeHtml(){
	createCircleList();
	createAnimalPlantLists();
	convertDataToHtml();
	updateHtml();
}

function performRequest(){
	createBaseCircleData();
	addNewCircleData();
	makeHtml();
	hideDataIfNeeded();
}

















function randint(min,max){
	return Math.floor((Math.random() * (max-min+1)) + min)
}