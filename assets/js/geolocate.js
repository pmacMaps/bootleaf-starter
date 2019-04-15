/*********************************************************************
* Name: Leaflet Locate Me Widget
* Version: 1.0
* Created by: Patrick McKinney, Cumberland County GIS
* Notes: for use with Leaflet Locate Control version 0.52
**********************************************************************/

function geoLocater() {
    'use strict';
    
    var locateControl = L.control.locate({
      position: "topleft",
      drawCircle: true,
      follow: false,
      setView: true,
      keepCurrentZoomLevel: true,
      markerStyle: {
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.8
      },
      circleStyle: {
        weight: 1,
        clickable: false
      },
      icon: "fa fa-location-arrow",
      iconLoading: "fa fa-spinner fa-spin",
      metric: false,
      onLocationError: function(err) {
          alert(err.message);
      },
      onLocationOutsideMapBounds: function(context) {
          alert(context.options.strings.outsideMapBoundsMsg);
      },
      strings: {
        title: "Show my current location",
        popup: "You are within {distance} {unit} from this point",
        outsideMapBoundsMsg: "You seem to be located outside the boundaries of the map"
      },
      locateOptions: {
        maxZoom: 18,
        watch: true,
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000
      }
    }).addTo(map);
}