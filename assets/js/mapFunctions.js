/*===============
*** Functions ***
===============*/
// Attach layers control to modal
    function attachLayersControl() {
        var layerControl = $(".leaflet-control-layers"),
        layerModalBody = $('#layersControlBox');

        layerControl.detach();
        layerModalBody.append(layerControl);
    }

// function to handle load event for map services
function processLoadEvent(service) {
   // service request success event
   service.on('requestsuccess', function(e) {     
      // set isLoaded property to true
      service.options.isLoaded = true;      
   });   
  
   // request error event
   service.on('requesterror', function(e) {      
      // if the error url matches the url for the map service, display error messages
      // without this logic, various urls related to the service appear
      if (e.url == service.options.url) {          
         // set isLoaded property to false
         service.options.isLoaded = false; 
        
         // add warning messages to console
         console.warn('Layer failed to load: ' + service.options.url);
         console.warn('Code: ' + e.code + '; Message: ' + e.message);
                              
         // show modal window
         $('#layerErrorModal').modal('show'); 
      }
   });
}

// Set the initial map zoom level based upon viewport width
// fine tune viewport width values and zoom levels based upon
// extent of your map
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

// Related to geocoder
// Put in geocoder module?
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
$(document).ready(function() {    
    geocodeInputDisplayFix(windowArea);
    attachLayersControl();
    
    // window resize event
    // resize event
    $(window).resize(function() {
        attachLayersControl();
    });
});