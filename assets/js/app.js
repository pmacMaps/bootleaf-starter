'use strict';

/*** Variables ***/
// viewport
var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var windowArea = windowWidth * windowHeight;
// boolean for if device is mobile or note
var isMobileDevice = L.Browser.mobile;
// map and controls
var map;
var homeCoords = [40.263044, -76.896423]; // can use instead of function
var initZoom = 15;
// zoomHome control
var zoomHomeControl;
// layer control
var basemapGroup;
var overlayGroup;
var layerControl;
<<<<<<< HEAD
// Layers - not sure about this
// open stree map
var osm;
// ESRI service
var esriTopo;
var pfbc;
var localParks;
// GeoJSON
// simple vector format
=======
// Layers 
var osm;
var esriTopo;

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
osm = L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/*** ESRI Services ***/
//ESRI Leaflet v x.x.x - add link
// Esri Topographic Base Map
esriTopo = L.esri.basemapLayer('Topographic');
    
// ESRI Dynamic Map Service
// rasterized display; don't add number at end of service url
// Pennsylvania Fish & Boat Comission
pfbc = L.esri.dynamicMapLayer({
    // service url    
    url: '//maps.pasda.psu.edu/ArcGIS/rest/services/pasda/PAFishBoat/MapServer',
    // image format
    format: 'png24',
    // attribution
    attribution: 'Pennsylvania Fish & Boat Comission',
    // layers to include from service
    // 9 = Class A Trout Streams
    // 24 = Hatcheries
    layers: [9,24]
    // set useCors to false if you get CORS error
    //useCors: false
}).addTo(map);

// ESRI Feature Service
// vector display; add number at end of service url
// Local parks in Pennsylvania
localParks = L.esri.featureLayer({
    // service url
    url: '//maps.pasda.psu.edu/arcgis/rest/services/pasda/DCNR/MapServer/18',
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

// add popup to feature service
// update pop-up
localParks.bindPopup(function(layer) {
    return L.Util.template('<h2>{PARK_NAME}</h2>', layer.feature.properties)
});

/****************************************/

/*** GeoJSON ***/
// create sample with $.getJSON()
<<<<<<< HEAD
// Sample depends upon Leaflet AJAX v x.x.x
/*
new L.GeoJSON.AJAX('path/to/data', {
=======
// Sample depends upon Leaflet AJAX v 2.0.0
// SEPTA Regional Lines
septaLines = new L.GeoJSON.AJAX('assets/geojson/SEPTAGISRegionalRailLines2012.geojson', {
>>>>>>> ad6dc19f616ec612c5ae02287d87974eb95950b1
    // style point layers
    //pointToLayer: function (feature, latlng) {},
    // style line or polygon features
    style: function (feature, layer) {
        return {
            color: '#ff0000',
            weight: 3.5,
            opacity: 1,
            clickable: false
        }
    }
    // bind pop-up, mouse-over effect, etc
    //onEachFeature: function (feature, layer) {}
}).addTo(map);
*/

/****************************************/

/*** Basic Point ***/
/*
L.marker([lat,  long], {
    icon: berkeyIcon, // or path to icon
    title: 'Map Feature',
    alt: 'alt text for image'
}).addTo(map);
*/
    
/*** Basic Polyline ***/
/*
L.polyline(arrayVariableStoringGeometry, {
    color: '#20E167',
    weight: 1.5,
    opacity: 1,
    dashArray: '5, 10'
}).addTo(map);
*/

/*** Basic Polygon ***/
/*
L.polygon(arrayVariableStoringGeometry, {
    color: '#20E167',
    weight: 2.5,
    opacity: 1,
    fillColor: '#9AFFDE',
    fillOpacity: 0.5  
}).addTo(map);
*/

/****************************************/
    
/*** Default Icon ***/
// for use in point layers
/*
L.icon({
    iconUrl: 'path/to/image',
    iconSize: [25, 25]    
});
*/

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
basemapGroup = {
    "Open Street Map": osm,
    "Esri Topographic": esriTopo
};

overlayGroup = {};

layerControl = L.control.layers(basemapGroup, overlayGroup, {
    collapsed: setLayerControlCollapsedValue(windowWidth) 
}).addTo(map);

// GeoLocate module
geoLocater();

// Address Locator
addressLocator();