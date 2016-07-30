'use strict';

/****************
*** Variables ***
****************/

// viewport
var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var windowArea = windowWidth * windowHeight;
// map and controls
var map;
var homeCoords = [40.263044, -76.896423]; // can use instead of function
var initZoom = 15;
var container;
var zoomHomeControl;
// layer control
var basemapGroup;
var overlayGroup;
var layerControl;
// Layers 
var osm;
var esriTopo;
var paMPO;
var paRoadsideSprings;
var septaLines;

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
osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap'
}).addTo(map);


/*** ESRI Services ***/
//ESRI Leaflet v 1.0.2 - add link

// ArcGIS Online Basemap
// See https://esri.github.io/esri-leaflet/api-reference/layers/basemap-layer.html
esriTopo = L.esri.basemapLayer('Topographic');
    
// ESRI Map Service
// Pennsylvania Metropolitan and Rural Planning Organization Boundaries
paMPO = L.esri.dynamicMapLayer({
    // service url
    url: 'http://maps.pasda.psu.edu/ArcGIS/rest/services/pasda/PennDOT/MapServer',
    // image format
    format: 'png24',
    // attribution
    attribution: 'Pennsylvania Department of Transportation',
    // layers to include from service
    layers: [15]    
}).addTo(map);

// Add popup
paMPO.bindPopup(function (error, featureCollection) {
    if(error || featureCollection.features.length === 0) {
      return false;
    } else {
      var popupContent = L.Util.template('<h3>{AGENCY_NAM}</h3><ul><li>Agency Type: {AGENCY_TYP}</li><li>Contact: {CONTACT_PE}</li></ul>', featureCollection.features[0].properties);
    
      return popupContent;      
    }
  });

// ESRI Feature Service
// See https://esri.github.io/esri-leaflet/api-reference/layers/feature-layer.html
// Location of PaGWIS and PennState roadside springs. Roadside springs surveyed by PennState in 2013-15 
paRoadsideSprings = L.esri.featureLayer({
    url: 'https://www.gis.dcnr.state.pa.us/agsprod/rest/services/topo/Springs_Collector/FeatureServer/0', // service url
    // is sometimes required if CORS does not work for a GIS service
    useCors: false,
    // style point layers
    //pointToLayer: function (feature, latlng) {}, // use this to get custom style
    // style line or polygon features
    //style: function (feature, layer) {},
    // bind pop-up, mouse-over effect, etc
    onEachFeature: function (feature, layer) {
        var popupContent = L.Util.template('<h3>{SPRINGNAME}</h3><p>This is a {SPRING_TYPE} type of spring. It is located in the municipality of {MUNICIPALITY}, and the reference USGS quadrangle is {QUADRANGLE}.</p>', feature.properties);
        layer.bindPopup(popupContent, {closeOnClick: true});
    }
}).addTo(map);

/****************************************/

/*** GeoJSON ***/
// create sample with $.getJSON()
// Sample depends upon Leaflet AJAX v 2.0.0
// SEPTA Regional Lines
septaLines = new L.GeoJSON.AJAX('assets/geojson/SEPTAGISRegionalRailLines2012.geojson', {
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
// depends on Leaflet Awesome Markers v 2.0.2
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
    'Open Street Map': osm,
    'ESRI Topographic': esriTopo
};

overlayGroup = {
    'MPO/RPO': paMPO,
    'Roadside Springs': paRoadsideSprings,
    'SEPTA Rail Lines': septaLines
};

layerControl = L.control.layers(basemapGroup, overlayGroup, {
    collapsed: setLayerControlCollapsedValue(windowWidth) 
}).addTo(map);

// GeoLocate module
geoLocater();

// Address Locator
addressLocator();