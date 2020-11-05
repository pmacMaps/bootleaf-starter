'use strict';

// viewport
// width
const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
// height
const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
// area
const windowArea = windowWidth * windowHeight;

// GeoJSON search
// update var names
const muniSearch = [];
const returnMuni = [];

// map and controls
const homeCoords = [40.263044, -76.896423];

// Map
const map = L.map('map', {
    center: homeCoords,
    zoom: setInitialMapZoom(windowWidth),
    zoomControl: false
});

// Zoom Home Control
const zoomHomeControl = L.Control.zoomHome({
    position: 'topleft',
    zoomHomeTitle: 'Full map extent',
    homeCoordinates: homeCoords,
    homeZoom: setInitialMapZoom(windowWidth)
}).addTo(map);

// Open Street Map
const osm = L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Esri Topographic Basemap (raster, in mature support)
const esriTopo = L.esri.basemapLayer('Topographic');

/*** ESRI Services ***/
// ESRI Dynamic Map Service
// rasterized display; don't add number at end of service url
// Pennsylvania Fish & Boat Comission
const wildTroutStreams = L.esri.dynamicMapLayer({
    // service url
    url: '//maps.pasda.psu.edu/ArcGIS/rest/services/pasda/PAFishBoat/MapServer',
    // image format
    format: 'png24',
    // attribution
    attribution: 'Pennsylvania Fish & Boat Comission',
    // layers to include from service
    // 9 = Class A Trout Streams
    layers: [9],
    // 24 = Hatcheries
    //layers: [9,24],
    isLoaded: false
    // set useCors to false if you get CORS error
    //useCors: false
});

// ESRI Feature Service
// vector display; add number at end of service url
// Local parks in Pennsylvania
const localParks = L.esri.featureLayer({
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
    },
    isLoaded: false
});

// add popup to feature service
// add conditional test for pop-up content
// false urls
// format decimals for acres
// add popup options for max width and max height functions
localParks.bindPopup(function(layer) {
    return L.Util.template('<div class="feat-popup"><h2>{PARK_NAME}</h2><p>This park is a {PARK_TYPE} is {Acres} acres in area.  You can visit the park <a href="{URL}" target="_blank">website</a> for more information.</p></div>', layer.feature.properties)
});

// array containing map/feature services
const mapServicesArray = [wildTroutStreams, localParks];

// process map/feature services
for (var i = 0; i < mapServicesArray.length; i++) {
    processLoadEvent(mapServicesArray[i]);
    mapServicesArray[i].addTo(map);
}

/*** GeoJSON ***/
// create sample with $.getJSON()

// Sample depends upon Leaflet AJAX v x.x.x
const pmgMembers = new L.GeoJSON.AJAX('./assets/data/pamagic_members_06_2017.geojson', {
    // style point layers
    //pointToLayer: function (feature, latlng) {}
}).addTo(map);

/*** Layer Control ***/
// basemap group
const basemapGroup = {
    "Open Street Map": osm,
    "Esri Topographic": esriTopo
};

// thematic layers group
const overlayGroup = {
    "Wild Class A Trout Streams": wildTroutStreams,
    "Local Parks": localParks,
    "PaMAGIC Members": pmgMembers
};

const layerControl = L.control.layers(basemapGroup, overlayGroup, {
    collapsed: false
}).addTo(map);

// GeoLocate module
geoLocater();

// Address Locator
addressLocator();

/*** Remove loading screen after services loaded ***/
const loadScreenTimer = window.setInterval(function() {
    const backCover = $('#back-cover');
    let  troutStreamsLoaded = wildTroutStreams.options.isLoaded;
    let  localParksLoaded = localParks.options.isLoaded;

    if (troutStreamsLoaded && localParksLoaded) {
        // remove loading screen
        window.setTimeout(function() {
        backCover.fadeOut('slow');
       }, 4000);

        // clear timer
        window.clearInterval(loadScreenTimer);
    } else {
      console.log('layers still loading');
    }
}, 2000);

// Remove loading screen when warning modal is closed
$('#layerErrorModal').on('hide.bs.modal', function(e) {
   // remove loading screen
   $('#back-cover').fadeOut('slow');
   // clear timer
   window.clearInterval(loadScreenTimer);
});