// Init Map
var map;
var currentPosition = initValues.position;

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

// AppViewModel
var AppViewModel = function() {
  var self = this;
  var wikipediaContent = {};

  // Wikipedia API
  self.requestWikipedia = function() {
    var pagesids = [];

    locations.forEach(function(location) {
      pagesids.push(location.wikipediaPageid);
    });

    var url = 'https://pt.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&pageids=' + pagesids.join('%7C') + '&exintro=1&callback=?';

    $.ajax({
      url: url,
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      async: false,
      dataType: 'json',
    })
    .done(function(data) {
      $.each(data.query.pages, function(key, value) {
        wikipediaContent[key] = {
          description: value.extract
        };
      });
    });
  };

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
  };

  // Default values in Single Box
  self.title = ko.observable(initValues.title);
  self.description = ko.observable(initValues.description);

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

  // Open Informations about the location
  self.openLocation = function(location) {

    // Animate clicked marker
    location.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      location.marker.setAnimation(null);
    }, 1500);

    // Update currentPosition
    currentPosition = location.position;

    // Transition to Pan
    map.panTo(currentPosition);

    // Update Single Box
    var wikipediaLink = '<a href="http://pt.wikipedia.org/?curid=' + location.wikipediaPageid + '" target="_blank">Wikipedia</a>';

    self.title(location.title);

    if(Object.keys(wikipediaContent).length) {
      self.description(wikipediaContent[location.wikipediaPageid].description + wikipediaLink);
    } else {
      self.description('Infelizmente não foi possível trazer informações sobre este local no momento, tente mais tarde ou acesse a página na ' + wikipediaLink + '.');
    }

    // Close Sidebar on click on smartphone
    if (document.body.clientWidth < 600) {
      self.navigation(false);
    }
  };

  // Init Request Wikipedia API
  self.requestWikipedia();
};
