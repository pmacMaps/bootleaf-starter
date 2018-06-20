function addressLocator() {
    'use strict';
    
    /*** Variables ***/
    // geocode control
    var addressSearchControl;
    // can limit seach bounds for geocoder
    //var addressSearchBounds = L.latLngBounds([39.803052, -77.820029],[40.453170, -76.799358]);
    
    // Esri World Geocoding Service
    // Nominatim is another option, but I haven't had good experiences with it
    var esriWorldGeocodingService = L.esri.Geocoding.arcgisOnlineProvider();
    
    addressSearchControl = L.esri.Geocoding.geosearch({
        useMapBounds: false,
        providers: [esriWorldGeocodingService],
        placeholder: '400 Market Street, Harrisburg, PA',
        title: 'Search for a Street Address',
        //searchBounds: addressSearchBounds,
        expanded: true,
        collapseAfterResult: false,
        zoomToResult: false
    }).addTo(map);
    
    /*** Address search results event ***/
    addressSearchControl.on('results', function(data) {  
        // make sure there is a result
        if (data.results.length > 0) {
            // set map view
            map.setView(data.results[0].latlng, 18);
            
            // open pop-up for location
            var popup = L.popup({closeOnClick: true}).setLatLng(data.results[0].latlng).setContent(data.results[0].text).openOn(map);    
        } else {
            consol.warn('No results found for geocode search');
        }    
    });
}