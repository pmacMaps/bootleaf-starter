/*********************************************************************
* Name: ESRI Leaflet Address Search
* Version: 1.0
* Created by: Patrick McKinney, Cumberland County GIS
* Notes: for use with ESRI Leaflet Geocoder version 1.0.2
* requires variable windowArea which is window height * window width
* requires jQuery
**********************************************************************/

/*** Variables ***/
var addressSearchControl;
var addressSearchResult;
var addressSearchIcon;

/*** Map icon for search result ***/
// depends upon Leaflet Awesome Markers plugin
addressSearchIcon = L.AwesomeMarkers.icon({
    icon: 'map',
    prefix: 'fa',
    markerColor: 'orange',
    iconColor: '#fff'
});

/*** Address Search Tool ***/
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

/*** Layer to hold search results ***/
addressSearchResults = new L.LayerGroup().addTo(map);

/*** Address search results event ***/
addressSearchControl.on('results', function(data) {  
    // clear previous map icon
    addressSearchResults.clearLayers();
    // store data for results
    var resultLocation = data.results[0].latlng;
    var resultText = data.results[0].text;
	// create icon for results and add to map
    addressSearchResults.addLayer(L.marker(resultLocation, {
        icon: addressSearchIcon
    }));
    // add a popup with geocoded address
    addressSearchResults.getLayers()[0].bindPopup(resultText, {
        maxWidth: setPopupMaxWidth(windowWidth),
        closeOnClick: true
    });
   // hide map controls and attribution when popup opens on smaller screens    
   addressSearchResults.getLayers()[0].on('popupopen', function() {
        if (windowArea < 315000 ) {
            $('div.leaflet-top').css('z-index', -1);
            $('div.leaflet-bottom').css('z-index', -1);
        }            
    });
    // show map controls and attribution when popup closes on smaller screens 
    addressSearchResults.getLayers()[0].on('popupclose', function() {
        if (windowArea < 315000 ) {
            $('div.leaflet-top').css('z-index', 1000);
            $('div.leaflet-bottom').css('z-index', 1000);
        }            
    });     
});