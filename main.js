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
]

function AppViewModel() {
  var self = this;

  self.locations = ko.observableArray(locations);
}

ko.applyBindings(new AppViewModel());

// Init Map
function initMap() {
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
  for(key in locations) {
    locations[key].marker = new google.maps.Marker({
      position: locations[key].position,
      map: map,
      animation: google.maps.Animation.DROP
    });
    clickMarker(key);
  }
}

var clickMarker = function(key) {
  locations[key].marker.addListener('click', function() {
    openLocation(key);
  });
}

// Open Informations About the Location
var openLocation = function(key) {
  var marker = locations[key].marker;
  // Remove animation from all markers
  for(i in locations) {
    locations[i].marker.setAnimation(null);
  }

  // Animate clicked marker
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }

  // Create Single Box
  var singleBox = document.querySelector('.single-box');
  singleBox.innerHTML = '';
  appendContent('h1', locations[key].title, singleBox);
  appendContent('p', locations[key].description, singleBox);
}

// Update Content
var appendContent = function(tag, content, container){
  var tag = document.createElement(tag);
  var content = document.createTextNode(content);
  tag.appendChild(content);
  container.appendChild(tag);
};

// Show and Hide Navigation
var toggleNavigation = function() {
  var body = document.querySelector('body');

  if ( body.classList.contains('closed-navigation')){
    body.setAttribute('class', '');
  } else {
    body.setAttribute('class', 'closed-navigation');
  }
}

// Closed Navigation for Mobile
if (document.body.clientWidth > 600) {
  toggleNavigation();
}
var toggleButton = document.querySelector('.navigation__toggle');
toggleButton.addEventListener('click', function() {
  toggleNavigation();
})

// Click item in Sidebar
var sidebarItem = document.querySelector('.navigation__item');
