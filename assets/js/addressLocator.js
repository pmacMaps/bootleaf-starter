function addressLocator() {
    'use strict';

    // can limit seach bounds for geocoder
    //const addressSearchBounds = L.latLngBounds([39.803052, -77.820029],[40.453170, -76.799358]);

    // Esri World Geocoding Service
    // Nominatim is another option, but I haven't had good experiences with it
    const esriWorldGeocodingService = L.esri.Geocoding.arcgisOnlineProvider();

    const addressSearchControl = L.esri.Geocoding.geosearch({
        useMapBounds: false,
        providers: [esriWorldGeocodingService],
        placeholder: 'example: 123 Main Street',
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
            const popup = L.popup({closeOnClick: true}).setLatLng(data.results[0].latlng).setContent(data.results[0].text).openOn(map);
        } else {
            consol.warn('No results found for geocode search');
        }
    });
}