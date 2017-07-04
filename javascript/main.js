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

  // Default values in Single Box
  self.title = ko.observable('Brasília');
  self.description = ko.observable('Brasília é a capital federal do Brasil e a sede do governo do Distrito Federal. A capital está localizada na região Centro-Oeste do país, ao longo da região geográfica conhecida como Planalto Central.');

  // Array to all places and filtered places
  self.allPlaces = ko.observableArray();
  self.filteredPlaces = ko.observableArray();
  locations.forEach(function(place) {
    self.allPlaces.push(place);
    self.filteredPlaces.push(place);
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
  self.openLocation = function(key) {

    // Remove animation from all markers
    for(i in locations) {
      locations[i].marker.setAnimation(null);
    }

    // Animate clicked marker
    var marker = locations[key].marker;
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }

    // Update currentPosition
    currentPosition = locations[key].position;

    // Transition to Pan
    map.panTo(currentPosition);

    // Update Single Box
    var content = locations[key].wikipageid;
    var wikipediaLink = '<a href="http://pt.wikipedia.org/?curid=' + content + '" target="_blank" class="wikipedia">Wikipedia</a>';

    self.title(locations[key].title);
    self.description(wikiContent[content].extract + wikipediaLink);

    // Close Sidebar on Click
    if (document.body.clientWidth < 600) {
      showHideNavigation('hide');
    }
  };

  self.clickMarker = function(index) {
    locations[index].marker.addListener('click', function() {
      self.openLocation(index);
    });
  };

  // Create Markers
  for (var i = 0; i < locations.length; i++) {
    locations[i].marker = new google.maps.Marker({
      position: locations[i].position,
      map: map,
      animation: google.maps.Animation.DROP
    });
    self.clickMarker(i);
  }
};

// Request Wikipedia API
var ids = [];
var wikiContent = {};

for (var i = 0; i < locations.length; i++) {
  ids.push(locations[i].wikipageid);
};

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

// Show and Hide Navigation
var showHideNavigation = function(event) {
  var body = document.querySelector('body');

  if (event === 'show') {
    body.setAttribute('class', 'show-navigation');
  } else if (event === 'hide') {
    body.setAttribute('class', 'hide-navigation');
  } else if (event === 'toggle') {
    if (body.classList.contains('hide-navigation')) {
      body.setAttribute('class', '');
    } else {
      body.setAttribute('class', 'hide-navigation');
    }
  }
};

// Hide Navigation for Mobile
if (document.body.clientWidth > 600) {
  showHideNavigation('show');
};

// Open/Close navigation
var toggleButton = document.querySelector('.navigation__toggle');
toggleButton.addEventListener('click', function() {
  showHideNavigation('toggle');
});
