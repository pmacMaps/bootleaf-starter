/********************************************************************************
* Name: Initialize Map
* Version: 1.0
* Created by: Patrick McKinney, Cumberland County GIS
* requires Leaflet ZoomHome plugin - https://github.com/torfsen/leaflet.zoomhome
**********************************************************************************/

// change map zoom to function based upon viewport variables

function mapInit() {
    'use strict';
    
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
}