var locations = {
  stadium: {
    position: {lat: -15.796, lng: -47.95},
    title: "Estadio de Futebol",
    description: "Estádio Nacional de Brasília Mané Garrincha, também conhecido como simplesmente Mané Garrincha, é um estádio de futebol e arena multiuso brasileiro, situado em Brasília, no Distrito Federal."
  },
  museum: {
    position: {lat: -15.796, lng: -47.90},
    title: "Museu",
    description: "Museus de Brasília O Museu da Fotografia Documental www.mfd.mus.br é um web museu nascido em Brasília com características bem definidas"
  },
  whatever: {
    position: {lat: -15.796, lng: -47.85},
    title: "Whatever",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever "
  },
}

function initMap() {
  var uluru = {lat: -15.79, lng: -47.91};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: uluru
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

// Recreates Content
var appendContent = function(tag, content, container){
  var tag = document.createElement(tag);
  var content = document.createTextNode(content);
  tag.appendChild(content);
  container.appendChild(tag);
};

// List Sidebar
var appendSidebar = function() {
  var listSidebar = document.querySelector('.navigation__list');
  for(i in locations) {
    var item = document.createElement('li');
    item.setAttribute('class', 'navigation__item');
    item.setAttribute('data-item', i);
    item.setAttribute('onclick', 'openLocation("' + i + '")');
    var a = document.createElement('a');
    var title = document.createTextNode(locations[i].title);
    item.appendChild(a);
    a.appendChild(title);

    listSidebar.appendChild(item);
  }
}

appendSidebar();

// Click item in Sidebar
var sidebarItem = document.querySelector('.navigation__item');
