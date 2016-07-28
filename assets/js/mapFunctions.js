/*===============
*** Functions ***
===============*/

// Fade out loading screen
setTimeout(function() {
    $('#back-cover').fadeOut("slow");  
    $('#cog-icon').fadeOut("slow");
}, 4000);

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
window.addEventListener('DOMContentLoaded', function() {
    geocodeInputDisplayFix(windowArea);
}, false);