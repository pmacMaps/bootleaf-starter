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
var homeCoords = [];
var initZoom = ;
var container;
var zoomHome;
// layer control
var basemapGroup;
var overlayGroup;
var layerControl;