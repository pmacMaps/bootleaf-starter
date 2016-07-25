/*===============
*** Functions ***
===============*/

// Set the initial map zoom level based upon viewport width
function setInitialMapZoom(windowWidth) {
    var mapZoom;    
    if (windowWidth < 500) {
        mapZoom = 9; 
    } else if (windowWidth >= 500 && windowWidth < 1000) {
        mapZoom = 10; 
    } else {
        mapZoom = 11;  
    }
    return mapZoom;
}

// Change map zoom level based upon viewport width
function viewportChangeMapZoom(windowWidth) {
    if (windowWidth < 500) {
        map.setZoom(9);
    }  else if (windowWidth >= 500 && windowWidth < 1000) {
        map.setZoom(10);
    }  else {
       map.setZoom(11);
    }
}

// Set the layer control to be expanded or collapsed based upon viewport width
function setLayerControlCollapsedValue(windowWidth) {
    var isCollapsed;
    if (windowWidth < 768) {
        isCollapsed = true;
    } else {
        isCollapsed = false;
    }
    return isCollapsed;
}

// Set max height of pop-up window 
function setPopupMaxHeight(windowArea) {
    var maxHeight;
    if (windowArea < 315000 ) {
        maxHeight = 150;
    } else {
        maxHeight = 500;
    }
    return maxHeight;
}

// Set max width of pop-up window 
function setPopupMaxWidth(windowWidth) {
    var maxWidth;
    if (windowWidth < 450 ) {
        maxWidth = 240;
    } else {
        maxWidth = 300;
    }
    return maxWidth;
}

/* Search and Zoom to Municipality */
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function(){
    for (var i=0; i < muniSearch.length ; i++){
      returnMuni.push(muniSearch[i]["name"]);
    }
    return returnMuni;
  }, 5500);
}, false);

//autocomplete search for municipalities
$( "#muni-search" ).autocomplete({
  autoFocus:true,
  minLength:2,   
  delay:300,   
  source: returnMuni,
  select: function(event, ui){
    //get the entered text and pass it to to corresponding bounds
    new function(){
      for (var i=0; i < muniSearch.length; i++){
        if (ui.item.value === muniSearch[i]["name"]){
          muniBounds = muniSearch[i]["bounds"];
        }
      }
      map.fitBounds(muniBounds);
    };
  }
});

var geocodeInput = $('.geocoder-control-input');

// Hides attribution when geosearch is expanded
function geocodeInputHideAttribution() {
    var geocodeInput = $('.geocoder-control-input');
    var testString = "Search for an address";
    if (geocodeInput.attr('placeholder') === testString) {
        $('div.leaflet-bottom').css('z-index', -1);
    }
}

// Shows attribution when geosearch is collapsed
function geocodeInputShowAttribution() {
    $('div.leaflet-bottom').css('z-index', 1000);
}

function geocodeInputDisplayFix(windowArea) {
    if (windowArea < 315000) {
        geocodeInput.focus(geocodeInputHideAttribution);
        geocodeInput.focusout(geocodeInputShowAttribution);
    }
}

/**********************
*** Event Listeners ***
***********************/

// DOM Content Loaded
window.addEventListener('DOMContentLoaded', function() {
    geocodeInputDisplayFix(windowArea);
}, false);

// Resize Event
window.addEventListener('resize', function() {
    viewportChangeMapZoom();
}, false);