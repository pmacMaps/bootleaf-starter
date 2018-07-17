/*============================
*** Navigation UI Controls ***
=============================*/

// Fade out loading screen
$(document).ready(function(){
  setTimeout(function(){
    $('#back-cover').fadeOut("slow");  
    $('#cog-icon').fadeOut("slow");
  }, 5000);
});

/*** Toggle hamburger navigation menu ***/
$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

/*** Navigation Modal Windows ***/
// Open About info window 
$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

// Open Layers info window 
$("#layers-btn").click(function() {
  $("#layersModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

// Open Legend info window
$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

// Open Discliamer info window
$("#disclaimer-btn").click(function() {
  $("#disclaimerModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

/*** Municipal Search Controls ***/
function toggleFocus(e){
    if( e.type == 'focus' ) {
        $('#search-icon').removeClass("fa-search").addClass("fa-spinner fa-pulse");
    } else {
        $('#search-icon').removeClass("fa-spinner fa-pulse").addClass("fa-search");
    }
}

$('#feature-search').on('focus blur', toggleFocus);

/* Prevent hitting enter from refreshing the page */
$("#feature-search").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});