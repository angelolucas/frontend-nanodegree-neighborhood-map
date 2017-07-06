// Default location
var currentPosition = {lat: -15.794157, lng: -47.882529};

// Init Map
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: currentPosition,
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER
    }
  });

  // Center map on resize
  google.maps.event.addDomListener(window, 'resize', function() {
    map.panTo(currentPosition);
  });

  // Init AppViewModel after Google Maps
  ko.applyBindings(new AppViewModel());
};

var AppViewModel = function() {
  var self = this;

  // Navigation view
  self.navigation = ko.observable(true);

  if (document.body.clientWidth < 600) {
    self.navigation(false);
  }

  self.toggleNavigation = function() {
    if (self.navigation() === true) {
      self.navigation(false);
    } else {
      self.navigation(true);
    }
  }

  // Default values in Single Box
  self.title = ko.observable('Brasília');
  self.description = ko.observable('Brasília é a capital federal do Brasil e a sede do governo do Distrito Federal. A capital está localizada na região Centro-Oeste do país, ao longo da região geográfica conhecida como Planalto Central.');

  // Open Location by clicking the map marker
  self.clickMarker = function(location) {
    location.marker.addListener('click', function() {
      self.openLocation(location);
    });
  };

  // Array to all places and filtered places
  self.allPlaces = ko.observableArray();
  self.filteredPlaces = ko.observableArray();

  locations.forEach(function(location) {

    // Filling the array for all places. Useful for searching filtered places
    self.allPlaces.push(location);

    // Filling the array to filtered places. Useful to start with the complete list
    self.filteredPlaces.push(location);

    // Create Markers
    location.marker = new google.maps.Marker({
      position: location.position,
      map: map,
      animation: google.maps.Animation.DROP
    });
    self.clickMarker(location);
  });

  // Filter input
  self.userInput = ko.observable('');

  // On Change input filter
  self.filterMarkers = function () {

    // LowerCase input filter
    var searchInput = self.userInput().toLowerCase();

    // Remove all places
    self.filteredPlaces.removeAll();

    // Includes only filtered places
    self.allPlaces().forEach(function(place) {
      if(place.title.toLowerCase().indexOf(searchInput) !== -1) {
        self.filteredPlaces.push(place);
      }
    });
  };

  // Open Informations About the Location
  self.openLocation = function(location) {

    // Remove animation from all markers
    locations.forEach(function(locationMarker) {
      locationMarker.marker.setAnimation(null);
    });

    // Animate clicked marker
    if (location.marker.getAnimation() !== null) {
      location.marker.setAnimation(null);
    } else {
      location.marker.setAnimation(google.maps.Animation.BOUNCE);
    }

    // Update currentPosition
    currentPosition = location.position;

    // Transition to Pan
    map.panTo(currentPosition);

    // Update Single Box
    var content = location.wikipageid;
    var wikipediaLink = '<a href="http://pt.wikipedia.org/?curid=' + content + '" target="_blank" class="wikipedia">Wikipedia</a>';

    self.title(location.title);
    self.description(wikiContent[content].extract + wikipediaLink);

    // Close Sidebar on click on smartphone
    if (document.body.clientWidth < 600) {
      self.navigation(false);
    }
  };
};

// Request Wikipedia API
var ids = [];
var wikiContent = {};

locations.forEach(function(location) {
  ids.push(location.wikipageid);
});

var url = 'https://pt.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&pageids=' + ids.join('%7C') + '&exintro=1&callback=?';

$.ajax({
  url: url,
  type: 'GET',
  contentType: 'application/json; charset=utf-8',
  async: false,
  dataType: 'json',
  success: function(data, status, jqXHR) {
    $.each(data.query.pages, function(key, value) {
      wikiContent[key] = {
        title: value.title,
        extract: value.extract
      };
    });
  }
});
