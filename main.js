// Locations
var locations = [
  {
    id: 0,
    name: 'estadio',
    position: {lat: -15.796, lng: -47.95},
    title: "Estadio de Futebol",
    description: "Estádio Nacional de Brasília Mané Garrincha, também conhecido como simplesmente Mané Garrincha, é um estádio de futebol e arena multiuso brasileiro, situado em Brasília, no Distrito Federal."
  },
  {
    id: 1,
    name: 'museu',
    position: {lat: -15.796, lng: -47.90},
    title: "Museu",
    description: "Museus de Brasília O Museu da Fotografia Documental www.mfd.mus.br é um web museu nascido em Brasília com características bem definidas"
  },
  {
    id: 2,
    name: 'whatever',
    position: {lat: -15.796, lng: -47.85},
    title: "Whatever",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever "
  },
];

var currentPosition = {lat: -15.79, lng: -47.91};

// Init Map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: currentPosition,
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER
    }
  });

  // Center map on Resize
  google.maps.event.addDomListener(window, 'resize', function() {
    map.panTo(currentPosition);
  });

  // Init AppViewModel after Google Maps
  ko.applyBindings(new AppViewModel());
};

var AppViewModel = function() {
  var self = this;

  // Default values in Single Box
  self.title = ko.observable("Brasília");
  self.description = ko.observable("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever");

  // Array to all places and filtered places
  self.allPlaces = ko.observableArray();
  self.filteredPlaces = ko.observableArray();
  locations.forEach(function(place) {
    self.allPlaces.push(place);
    self.filteredPlaces.push(place);
  })

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
      if(place.name.indexOf(searchInput) !== -1) {
        self.filteredPlaces.push(place);
      }
    })
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

    currentPosition = locations[key].position;

    map.panTo(currentPosition);

    // Create Single Box
    self.title(locations[key].title);
    self.description(locations[key].description);
  }

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

// Show and Hide Navigation
var toggleNavigation = function() {
  var body = document.querySelector('body');

  if ( body.classList.contains('closed-navigation')){
    body.setAttribute('class', '');
  } else {
    body.setAttribute('class', 'closed-navigation');
  }
};

// Closed Navigation for Mobile
if (document.body.clientWidth > 600) {
  toggleNavigation();
};

var toggleButton = document.querySelector('.navigation__toggle');
toggleButton.addEventListener('click', function() {
  toggleNavigation();
});
