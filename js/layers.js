/*** ESRI Services ***/
// depends on ESRI Leaflet v 1.0.2

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

// Sample
// Use https for https websites
// use http for http websites
var mdjBoundaryLabels = L.esri.dynamicMapLayer({
	url: 'https://gis.ccpa.net/arcgiswebadaptor/rest/services/ArcGIS_Online/MDJJurisdictionsData/MapServer',
	layers: [0], // include any sub-layers of service to include
	
}).addTo(map);


// ESRI Feature Service
L.esri.featureLayer({
    // service url
    url: '',
    // style point layers
    pointToLayer: function (feature, latlng) {},
    // style line or polygon features
    style: function (feature, layer) {},
    // bind pop-up, mouse-over effect, etc
    onEachFeature: function (feature, layer) {}
}).addTo(map);

// Sample
// Use https for https websites
// use http for http websites
// Use ESRI Leaflet Renderers plugin to use symbology as published
var municipalBoundaries = L.esri.featureLayer({
	url: 'http://gis.ccpa.net/arcgiswebadaptor/rest/services/ArcGIS_Online/MunicipalBoundaries/FeatureServer/0',
    // style point layers
    pointToLayer: function (feature, latlng) {},
    // style line or polygon features
    style: function (feature, layer) {},
    // bind pop-up, mouse-over effect, etc
    onEachFeature: function (feature, layer) {}
}).addTo(map);


/****************************************/


/*** GeoJSON ***/
// Sample depends upon Leaflet AJAX v 2.0.0
new L.GeoJSON.AJAX('path/to/data', {});

// Sample
var disposalSites = new L.GeoJSON.AJAX('assets/json/DisposalFacilities.geojson', {
    // style point layers
    pointToLayer: function (feature, latlng) {},
    // style line or polygon features
    style: function (feature, layer) {},
    // bind pop-up, mouse-over effect, etc
    onEachFeature: function (feature, layer) {}
});


/****************************************/


/*** Basic Point ***/
L.marker([lat,  long], {});

// Sample
var berkey = L.marker([40.8036,  -77.8625], {
    icon: berkeyIcon, // or path to icon
    title: 'Penn State Berkey Creamery',
    alt: 'popsicle representing Penn State Berkey Creamery'
});


/*** Basic Polyline ***/
L.polyline(arrayVariableStoringGeometry, {});

// Sample
var pennStaterPath = L.polyline(arrayVariableStoringGeometry, {
    color: '#f00',
    weight: 3.5,
    opacity: 1,
    dashArray: '5, 10'
});

/*** Basic Polygon ***/
L.polygon(arrayVariableStoringGeometry, {});

// Sample
var lubert = L.polygon(arrayVariableStoringGeometry, {
    color: '#20E167',
    weight: 2.5,
    opacity: 1,
    fillColor: '#9AFFDE',
    fillOpacity: 0.5    
});


/****************************************/

/*** Default Icon ***/
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