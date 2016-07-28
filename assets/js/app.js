'use strict';

/****************
*** Variables ***
****************/

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
var homeCoords = [40.263044, -76.896423]; // can use instead of function
var initZoom = 15;
var container;
var zoomHomeControl;
// layer control
var basemapGroup;
var overlayGroup;
var layerControl;
// Layers - not sure about this
// ESRI service
// GeoJSON
// simple vector format

// Create map
mapInit();

// Add layers
layersInit();

// GeoLocate module
geoLocater();

// Address Locator
addressLocator();