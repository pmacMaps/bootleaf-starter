/********************************************************************************
* Name: Initialize Layers
* Version: 1.0
* Created by: Patrick McKinney, Cumberland County GIS
* Notes: calls setLayerControlCollapsedValue(windowWidth) from mapFunctions.js
**********************************************************************************/

function layersInit() {
    
    'use strict';
    
    /*** ESRI Services ***/
    //ESRI Leaflet v 1.0.2 - add link
    
    // ESRI Map Service
    L.esri.dynamicMapLayer({
        // service url
        url: '',
        // image format
        format: '',
        // attribution
        attribution: '',
        // layers to include from service
        layers: [],    
    });

    // ESRI Feature Service
    L.esri.featureLayer({
        url: '', // service url
        // style point layers
        pointToLayer: function (feature, latlng) {},
        // style line or polygon features
        style: function (feature, layer) {},
        // bind pop-up, mouse-over effect, etc
        onEachFeature: function (feature, layer) {}
    }).addTo(map);

    /****************************************/

    /*** GeoJSON ***/
    // create sample with $.getJSON()
    // Sample depends upon Leaflet AJAX v 2.0.0
    new L.GeoJSON.AJAX('path/to/data', {
        // style point layers
        pointToLayer: function (feature, latlng) {},
        // style line or polygon features
        style: function (feature, layer) {},
        // bind pop-up, mouse-over effect, etc
        onEachFeature: function (feature, layer) {}
    }).addTo(map);

    /****************************************/

    /*** Basic Point ***/
    L.marker([lat,  long], {
        icon: berkeyIcon, // or path to icon
        title: 'Map Feature',
        alt: 'alt text for image'
    }).addTo(map);
    
    /*** Basic Polyline ***/
    L.polyline(arrayVariableStoringGeometry, {
        color: '#20E167',
        weight: 1.5,
        opacity: 1,
        dashArray: '5, 10'
    }).addTo(map);

    /*** Basic Polygon ***/
    L.polygon(arrayVariableStoringGeometry, {
        color: '#20E167',
        weight: 2.5,
        opacity: 1,
        fillColor: '#9AFFDE',
        fillOpacity: 0.5  
    }).addTo(map);

    /****************************************/
    
    /*** Default Icon ***/
    // for use in point layers
    L.icon({
        iconUrl: 'path/to/image',
        iconSize: [25, 25]    
    });

    /*** Awesome Markers ***/
    // depends on Leaflet Awesome Markers v 2.0.2
    // Disposal Sites Icon
    L.AwesomeMarkers.icon({
        icon: 'icon you want',
        prefix: 'fa', // uses font awesome icon set
        markerColor: 'darkred', // red, darkred, orange, green, darkgreen, blue, purple, darkpurple, cadetblue
        iconColor: '#fff' // hex color
    });
    
    /****************************************/

    /*** Layer Control ***/
    basemapGroup = {};

    overlayGroup = {};

    layerControl = L.control.layers(basemapGroup, overlayGroup, {
        collapsed: setLayerControlCollapsedValue(windowWidth) 
    }).addTo(map);
}