// Locations
var locations = [
  {
    name: 'estadio',
    position: {lat: -15.796, lng: -47.95},
    title: "Estadio de Futebol",
    description: "Estádio Nacional de Brasília Mané Garrincha, também conhecido como simplesmente Mané Garrincha, é um estádio de futebol e arena multiuso brasileiro, situado em Brasília, no Distrito Federal."
  },
  {
    name: 'museu',
    position: {lat: -15.796, lng: -47.90},
    title: "Museu",
    description: "Museus de Brasília O Museu da Fotografia Documental www.mfd.mus.br é um web museu nascido em Brasília com características bem definidas"
  },
  {
    name: 'whatever',
    position: {lat: -15.796, lng: -47.85},
    title: "Whatever",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever "
  },
];

function AppViewModel() {
  var self = this;

  self.locations = ko.observableArray(locations);

  self.title = ko.observable("Brasília");
  self.description = ko.observable("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever");

  // Array containing only the markers based on search
  self.visible = self.locations;

  // Track user input
  self.userInput = ko.observable('');

  // If user input is included in the place name, make it and its marker visible
  // Otherwise, remove the place & marker
  self.filterMarkers = function () {

    // Set all markers and places to not visible.
    var searchInput = self.userInput().toLowerCase();

    self.visible.removeAll();

    self.locations().forEach(function (place) {
      //place.marker.setVisible(false);
      // Compare the name of each place to user input
      // If user input is included in the name, set the place and marker as visible
      if (place.name().toLowerCase().indexOf(searchInput) !== -1) {
        self.visible.push(place);
      }
    });
    self.visible().forEach(function (place) {
      place.marker.setVisible(true);
    });
  };



  // Open Informations About the Location
  self.openLocation = function(key) {
    //var marker = locations[key].marker;

    // Remove animation from all markers
    /*for(i in locations) {
      locations[i].marker.setAnimation(null);
    }*/

    // Animate clicked marker
    /*if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }*/

    // Create Single Box
    self.title(locations[key].title);
    self.description(locations[key].description);
  }
};

ko.applyBindings(new AppViewModel());

// Init Map
//function initMap() {

var clickMarker = function(index) {
  locations[index].marker.addListener('click', function() {
    openLocation(index);
  });
};

  var uluru = {lat: -15.79, lng: -47.91};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: uluru,
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER
    }
  });

  // Center map on Resize
  google.maps.event.addDomListener(window, 'resize', function() {
    map.setCenter(uluru);
  })

  // Create Markers
  for (var i = 0; i < locations.length; i++) {
    locations[i].marker = new google.maps.Marker({
      position: locations[i].position,
      map: map,
      animation: google.maps.Animation.DROP
    });
    clickMarker(i);
  }
//};



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
