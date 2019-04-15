'use strict';

/****************
*** Variables ***
****************/

// viewport
var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
windowArea = windowWidth * windowHeight,
// GeoJSON search
// update var names
muniSearch = [],
returnMuni = [],
muniBounds,
// map and controls
map,
homeCoords = [40.263044, -76.896423],
container, // what is this?
zoomHomeControl,
// layer control
basemapGroup,
overlayGroup,
layerControl,
// Layers - not sure about this
// open stree map
osm,
// ESRI service
wildTroutStreams,
localParks,
// GeoJSON
pmgMembers;

// Map
map = L.map('map', {
    center: homeCoords,
    zoom: setInitialMapZoom(windowWidth),
    zoomControl: false       
});

// Zoom Home Control
zoomHomeControl = L.Control.zoomHome({
    position: 'topleft',
    zoomHomeTitle: 'Full map extent',
    homeCoordinates: homeCoords,
    homeZoom: setInitialMapZoom(windowWidth)
}).addTo(map);

// Open Street Map
osm = L.tileLayer('//{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/*** ESRI Services ***/
// ESRI Dynamic Map Service
// rasterized display; don't add number at end of service url
// Pennsylvania Fish & Boat Comission
wildTroutStreams = L.esri.dynamicMapLayer({
    // service url
    // https does not work for this domain
    url: '//maps.pasda.psu.edu/ArcGIS/rest/services/pasda/PAFishBoat/MapServer',
    // image format
    format: 'png24',
    // attribution
    attribution: 'Pennsylvania Fish & Boat Comission',
    // layers to include from service
    // 9 = Class A Trout Streams
    layers: [9]
    // set useCors to false if you get CORS error
    //useCors: false
}).addTo(map);

// ESRI Feature Service
// vector display; add number at end of service url
// Local parks in Pennsylvania
localParks = L.esri.featureLayer({
    // https does not work for this domain
    url: '//maps.pasda.psu.edu/arcgis/rest/services/pasda/DCNR/MapServer/18',// service url
    // attribution
    attribution: "Pennsylvania DCNR",
    // set useCors to false if you get CORS error
    //useCors: false
    // style point layers
    //pointToLayer: function (feature, latlng) {},
    // style line or polygon features
    style: function (feature, layer) {
        return {
            // outline color
            color: '#fff',
            // weight of outline
            weight: 2.5,
            // opacity of outline
            opacity: 0.75,
            // fill color
            fillColor: '#1EB300',
            // fill opacity
            fillOpacity: 0.5
        }
    }    
}).addTo(map);

// add popup to feature service
// add conditional test for pop-up content 
// false urls
// format decimals for acres
// add popup options for max width and max height functions
localParks.bindPopup(function(layer) {
    return L.Util.template('<div class="feat-popup"><h2>{PARK_NAME}</h2><p>This park is a {PARK_TYPE} is {Acres} acres in area.  You can visit the park <a href="{URL}" target="_blank">website</a> for more information.</p></div>', layer.feature.properties)
});

/****************************************/

/*** GeoJSON ***/
// create sample with $.getJSON()
// Sample depends upon Leaflet AJAX v x.x.x
pmgMembers = new L.GeoJSON.AJAX('./assets/data/pamagic_members_06_2017.geojson', {
    // style point layers
    //pointToLayer: function (feature, latlng) {}
}).addTo(map);

/*** Awesome Markers ***/
// depends on Leaflet Awesome Markers v x.x.x
// Disposal Sites Icon
/*
L.AwesomeMarkers.icon({
    icon: 'icon you want',
    prefix: 'fa', // uses font awesome icon set
    markerColor: 'darkred', // red, darkred, orange, green, darkgreen, blue, purple, darkpurple, cadetblue
    iconColor: '#fff' // hex color
});
*/
    
/****************************************/

/*** Layer Control ***/
// basemap group
basemapGroup = {
    "Open Street Map": osm
};

// thematic layers group
overlayGroup = {
    "Wild Class A Trout Streams": wildTroutStreams,
    "Local Parks": localParks,
    "PaMAGIC Members": pmgMembers
};

layerControl = L.control.layers(basemapGroup, overlayGroup, {
    collapsed: setLayerControlCollapsedValue(windowWidth) 
}).addTo(map);

// GeoLocate module
geoLocater();

// Address Locator
//addressLocator();