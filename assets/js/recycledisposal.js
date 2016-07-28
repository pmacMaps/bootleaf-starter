'use strict';

/*============================
*** Navigation UI Controls ***
=============================*/

// Fade out loading screen
$(document).ready(function(){
  setTimeout(function(){
    $('#back-cover').fadeOut("slow");  
    $('#cog-icon').fadeOut("slow");
  }, 5000);
});

/*** Toggle hamburger navigation menu ***/
$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

/*** Navigation Modal Windows ***/
// Open About info window 
$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

// Open Compost info window
$("#compost-btn").click(function() {
  $("#compostModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

// Open Legend info window
$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

// Open Discliamer info window
$("#disclaimer-btn").click(function() {
  $("#disclaimerModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

/*** Municipal Search Controls ***/
function toggleFocus(e){
    if( e.type == 'focus' ) {
        $('#search-icon').removeClass("fa-search").addClass("fa-spinner fa-pulse");
    } else {
        $('#search-icon').removeClass("fa-spinner fa-pulse").addClass("fa-search");
    }
}

$('#muni-search').on('focus blur', toggleFocus);

/* Prevent hitting enter from refreshing the page */
$("#muni-search").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});


/*===============
*** Variables ***
================*/

// viewport
var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var windowArea = windowWidth * windowHeight;
// municipal search
var muniSearch = [];
var returnMuni = [];
var muniBounds;
// map and controls
var map;
var container;
var zoomHome;
var locateControl;
// address search
var addressSearchIcon;
var addressSearchResults;
var addressSearchControl;
// layer control
var basemapGroup;
var overlayGroup;
var layerControl;
// layers
var disposalIcon;
var reycleIcon;
var compostIcon;
var esriTopo;
var esriGray;
var disposalSites;
var recycleSites;
var compostSites;
var municipalDefaultStyle;
var municipalHoverStyle;
var municipalPrograms;


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

/*** Pop-up Content Functions ***/

// Return content for municipal program service provider phone number
function municipalProviderPhoneContent(providerPhone) {
    var providerPhoneContent;
    if (!providerPhone) {
        providerPhoneContent = '';
    } else {
        //providerPhoneContent = '<li><span class="att-title">Provider Phone Number:</span> ' + providerPhone + '</li>';
        providerPhoneContent = '<tr>';
        providerPhoneContent += '<td class="light-gray">Provider Phone Number</td>';
        providerPhoneContent += '<td>' + providerPhone + '</td>';
        providerPhoneContent += '</tr>';
    }
    return providerPhoneContent;
}

// Return content for conditional municipal program note
function municipalSpecialNoteContent(municipal) {
    var specialNoteContent;
    if (municipal === 'Hopewell Township' || municipal === 'Newburg Borough' || municipal === 'North Newton Township') {
        specialNoteContent = '<h4>Note:</h4>';
        specialNoteContent += '<p>Free disposal of up to five 30 gallon trash bags per week at Cumberland County Landfill.</p>';
    } else {
        specialNoteContent = '';
    }
    return specialNoteContent;
}

// Return content for compost sites note
function compostSitesNoteContent(municipal) {
    var compostNoteContent;
    if (municipal === 'Shippensburg Borough') {
        compostNoteContent = "<p>Shippensburg Borough's site is open to residents of Shippensburg Borough, Southampton Township (Cumberland and Franklin Counties), Shippensburg Township, Newburg Borough, and Hopewell Township.</p>";
        compostNoteContent += "<p>Site users must show an identification card to gain entry to the site. Non-Shippensburg Borough residents must buy an ID card at the Shippensburg Borough office for $20. The card is renewable annually. Shippensburg Borough residents already pay for use of the site in their quarterly sanitation bill.</p>";
    } else {
        compostNoteContent = '<p>Only residents of this municipality may use the compost site.</p>';
    }
    return compostNoteContent;
}


/*=====================
*** Map Application ***
=====================*/

/*** Icons for Sites ***/
// Disposal Sites Icon
disposalIcon = L.AwesomeMarkers.icon({
    icon: 'trash',
    prefix: 'fa',
    markerColor: 'darkred',
    iconColor: '#fff'
});

// Drop-off Recycle Sites Icon
reycleIcon = L.AwesomeMarkers.icon({
    icon: 'recycle',
    prefix: 'fa',
    markerColor: 'blue',
    iconColor: '#fff'
});

// Compost Sites Icon
compostIcon = L.AwesomeMarkers.icon({
    icon: 'database',
    prefix: 'fa',
    markerColor: 'green',
    iconColor: '#fff'
});

/*** Basemap Layers ***/
// ESRI Topo
esriTopo = L.esri.basemapLayer('Topographic');

// ESRI Gray
esriGray = L.esri.basemapLayer('Gray');

/*** Overlay Layers ***/
// Disposal Sites
disposalSites = new L.GeoJSON.AJAX('assets/json/DisposalFacilities.geojson', {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: disposalIcon    
        }).setZIndexOffset(1200);
    },
    onEachFeature: function (feature, layer) {
        if (windowArea < 315000 ) {
            // Hide leaflet controls when pop-up opens
            layer.on('popupopen', function() {
                $('div.leaflet-top').css('z-index', -1);
                $('div.leaflet-bottom').css('z-index', -1);
            });            
            // Display Leaflet controls when pop-up closes
            layer.on('popupclose', function() {
                $('div.leaflet-top').css('z-index', 1000);
                $('div.leaflet-bottom').css('z-index', 1000);
            });            
        }
        // Create pop-up content
        var popupContent = '<div class="feature-popup">';
        popupContent += '<h2>' + feature.properties.SITE + '</h2>';
        popupContent += '<p>This disposal facility is located at ';
        popupContent += feature.properties.ADDRESS + ', ' + feature.properties.CITY + ', PA ' + feature.properties.ZIP + '.';
        popupContent += '</p>';
        popupContent += '<p>The phone number is ';
        popupContent += feature.properties.PHONE + '.</p>';
        popupContent += '</div>';
        // Bind pop-up to features
        layer.bindPopup(popupContent, {
            maxHeight: setPopupMaxHeight(windowArea),
            maxWidth: setPopupMaxWidth(windowWidth),
            closeOnClick: true
        });
    }
});

// Drop-off Recycling Sites
recycleSites = new L.GeoJSON.AJAX('assets/json/DropOffRecyclingSites.geojson', {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: reycleIcon    
        });
    },
    onEachFeature: function (feature, layer) {
       if (windowArea < 315000 ) {
            // Hide leaflet controls when pop-up opens
            layer.on('popupopen', function() {
                $('div.leaflet-top').css('z-index', -1);
                $('div.leaflet-bottom').css('z-index', -1);
            });            
            // Display Leaflet controls when pop-up closes
            layer.on('popupclose', function() {
                $('div.leaflet-top').css('z-index', 1000);
                $('div.leaflet-bottom').css('z-index', 1000);
            });            
        }
        // Create pop-up content
        var popupContent = '<div class="feature-popup">';
        popupContent += '<div>';
        popupContent += '<h2>' + feature.properties.SITE + '</h2>';
        popupContent += '<p>This drop-off recycling site is located at ';
        popupContent += feature.properties.ADDRESS + ', ' + feature.properties.CITY + ', PA ' + feature.properties.ZIP + '.';
        popupContent += '</p>';
        popupContent += '<p>The phone number is ';
        popupContent += feature.properties.PHONE + '.</p>';
        popupContent += '</div>';
        popupContent += '<div><h4>Notes:</h4>';
        popupContent += '<p>'+ feature.properties.NOTES + '</p></div>';
        popupContent += '</div>';
        // Bind pop-up to features
        layer.bindPopup(popupContent, {
            maxHeight: setPopupMaxHeight(windowArea),
            maxWidth: setPopupMaxWidth(windowWidth),
            closeOnClick: true
        });
    }
});

// Municipal Compost Sites
compostSites = new L.GeoJSON.AJAX('assets/json/MunicipalCompostSites.geojson', {
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
            icon: compostIcon    
        });
    },
    onEachFeature: function (feature, layer) {
        if (windowArea < 315000 ) {
            // Hide leaflet controls when pop-up opens
            layer.on('popupopen', function() {
                $('div.leaflet-top').css('z-index', -1);
                $('div.leaflet-bottom').css('z-index', -1);
            });            
            // Display Leaflet controls when pop-up closes
            layer.on('popupclose', function() {
                $('div.leaflet-top').css('z-index', 1000);
                $('div.leaflet-bottom').css('z-index', 1000);
            });            
        }
        // Create pop-up content
        var municipal = feature.properties.MUNI;
        var popupContent = '<div class="feature-popup">';
        popupContent += '<h2>' + municipal + '</h2>';
        popupContent += '<p>This municipal compost facility is located at ';
        popupContent += feature.properties.ADDRESS + ', ' + feature.properties.CITY + ', PA ' + feature.properties.ZIP + '.';
        popupContent += '</p>';
        popupContent += compostSitesNoteContent(municipal);
        popupContent+= '</div>';
        // Bind pop-up to features
        layer.bindPopup(popupContent, {
            maxHeight: setPopupMaxHeight(windowArea),
            maxWidth: setPopupMaxWidth(windowWidth),
            closeOnClick: true
        });
    }
});

// Municipal Programs
// Default style for municipalities
municipalDefaultStyle = {
    weight: 3,
    fillOpacity: 0.30
};

// Mouseover style for municipalities
municipalHoverStyle = {
    weight: 6,
    fillOpacity: 0
};

municipalPrograms = new L.GeoJSON.AJAX('assets/json/MunicipalPrograms.geojson', {
    style: function (feature) {
        var fillColor;
        var participation = feature.properties.PARTYPE;        
        
        switch (participation) {
            
            case 'Mandatory under Act 101':
                fillColor = '#DF73FF';
                break;
            
            case 'Mandatory by municipal decision':
                fillColor = '#DF73FF';
                break;
            
            case 'Optional':
                fillColor = '#FFFF00';
                break;
            
        }
        
        if (participation !== 'Mandatory under Act 101') {
            return {
                color: '#000',
                weight: 3,
                opacity: 1,
                fillColor: fillColor,
                fillOpacity: 0.30               
            }
        } else {
            return {
                color: '#000',
                weight: 3,
                opacity: 1,
                fillColor: fillColor,
                fillOpacity: 0.30,
                fill: 'url(assets/images/purple-hatch.gif)'
            }
        }
    },
    onEachFeature: function (feature, layer) {
        // Container for municipal label
        var muniLabelContainer = $('#muni-label');
        var municipal = feature.properties.MUNIC;
        var providerPhone = feature.properties.SERVPROVPH;
        
        // Add municipality to search form
        muniSearch.push({
            name: municipal,
            bounds: layer.getBounds()
        });
        
        if (windowArea > 315000 ) {
            // Mouseover events
            layer.on('mouseover', function() {
                layer.setStyle(municipalHoverStyle);
                muniLabelContainer.html(municipal);
                muniLabelContainer.show();
            });
            // Mouse Out
            layer.on('mouseout', function() {
                layer.setStyle(municipalDefaultStyle);
                muniLabelContainer.hide();
            });
        }
        // Place pop-up above controls on smaller screens
        if (windowArea < 315000 ) {
            // Hide leaflet controls when pop-up opens
            layer.on('popupopen', function() {
                $('div.leaflet-top').css('z-index', -1);
                $('div.leaflet-bottom').css('z-index', -1);
            });            
            // Display Leaflet controls when pop-up closes
            layer.on('popupclose', function() {
                $('div.leaflet-top').css('z-index', 1000);
                $('div.leaflet-bottom').css('z-index', 1000);
            });            
        }
        // Create pop-up content
        var popupContent = '<div class="feature-popup">';
        popupContent += '<h2>' + municipal + '</h2>';
        popupContent += '<hr />';
        popupContent += '<table>';
        popupContent += '<tbody>';
        popupContent += '<tr>';
        popupContent += '<td class="light-gray">Municipal Phone Number</td>';
        popupContent += '<td>' + feature.properties.PHONE + '</td>';
        popupContent += '</tr>';
        popupContent += '<tr>';
        popupContent += '<td class="light-gray">Participation</td>';
        popupContent += '<td>' + feature.properties.PARTYPE + '</td>';
        popupContent += '</tr>';
        popupContent += '<tr>';
        popupContent += '<td class="light-gray">Type of Service</td>';
        popupContent += '<td>' + feature.properties.SERVTYPE + '</td>';
        popupContent += '</tr>';
        popupContent += '<tr>';
        popupContent += '<td class="light-gray">Service Provider</td>';
        popupContent += '<td>' + feature.properties.SERPROV + '</td>';
        popupContent += '</tr>';
        popupContent += municipalProviderPhoneContent(providerPhone);
        popupContent += '</tbody>';
        popupContent += '</table>';
        popupContent += municipalSpecialNoteContent(municipal);
        popupContent += '</div>';
        // Bind pop-up to features
        layer.bindPopup(popupContent, {
            maxHeight: setPopupMaxHeight(windowArea),
            maxWidth: setPopupMaxWidth(windowWidth),
            closeOnClick: true
        });
    }    
});

/*** Map & Controls ***/
map = L.map("map", {
    center: [40.15, -77.25],
	zoom: setInitialMapZoom(windowWidth),
    layers: [esriTopo, disposalSites, recycleSites, compostSites, municipalPrograms],
    zoomControl: false
});

/*** Zoom Home Control ***/
zoomHome = L.Control.zoomHome({
    position: 'topleft',
    zoomHomeTitle: 'Full map extent',
    homeCoordinates: [40.15, -77.25],
    homeZoom: setInitialMapZoom(windowWidth)
}).addTo(map);

/*** Layer Control ***/
basemapGroup = {
  "Topographic": esriTopo,
  "Grayscale": esriGray
};

overlayGroup = {
  "Disposal Facilities": disposalSites,
  "Municipal Compost Sites": compostSites,
  "Drop-off Recycling Sites": recycleSites
};

layerControl = L.control.layers(basemapGroup, overlayGroup, {
    collapsed: setLayerControlCollapsedValue(windowWidth) 
}).addTo(map);

/*** GPS enabled geolocation control ***/
locateControl = L.control.locate({
  position: "topleft",
  drawCircle: true,
  follow: false,
  setView: true,
  //keepCurrentZoomLevel: true,
  keepCurrentZoomLevel: false,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  iconLoading: "fa fa-spinner fa-spin",
  metric: false,
  onLocationError: function(err) {
      alert(err.message);
  },
  onLocationOutsideMapBounds: function(context) {
      alert(context.options.strings.outsideMapBoundsMsg);
  },
  strings: {
    title: "Find my location",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem to be located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/*** Address Geosearch ***/
// ESRI Geosearch tool
addressSearchControl = new L.esri.Geocoding.Controls.Geosearch({
	zoomToResult: true,
    collapseAfterResult: true,
    expanded: false,
	allowMultipleResults: true,
	maxResults: 5,
	useArcgisWorldGeocoder: true,	
	placeholder: 'Search for an address',
	title: 'Address Search',
    useMapBounds: false
}).addTo(map);
		
addressSearchResults = new L.LayerGroup().addTo(map);

addressSearchIcon = L.AwesomeMarkers.icon({
    icon: 'map',
    prefix: 'fa',
    markerColor: 'orange',
    iconColor: '#fff'
});

addressSearchControl.on('results', function(data) {  
    addressSearchResults.clearLayers();
    
    var resultLocation = data.results[0].latlng;
    var resultText = data.results[0].text;
	
    addressSearchResults.addLayer(L.marker(resultLocation, {
        icon: addressSearchIcon
    }));
    
    addressSearchResults.getLayers()[0].bindPopup(resultText, {
        maxWidth: setPopupMaxWidth(windowWidth),
        closeOnClick: true
    });
    
   addressSearchResults.getLayers()[0].on('popupopen', function() {
        if (windowArea < 315000 ) {
            $('div.leaflet-top').css('z-index', -1);
            $('div.leaflet-bottom').css('z-index', -1);
        }            
    });

    addressSearchResults.getLayers()[0].on('popupclose', function() {
        if (windowArea < 315000 ) {
            $('div.leaflet-top').css('z-index', 1000);
            $('div.leaflet-bottom').css('z-index', 1000);
        }            
    });     
});

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