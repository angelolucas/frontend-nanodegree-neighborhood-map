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
      map: map
    });
    openInfo(key);
  }
}

var openInfo = function(key) {
  locations[key].marker.addListener('click', function() {

    var singleBox = document.querySelector('.single-box');
    singleBox.innerHTML = '';

    appendContent('h1', locations[key].title, singleBox);
    appendContent('p', locations[key].description, singleBox);
  });
}

var appendContent = function(tag, content, container){
  var tag = document.createElement(tag);
  var content = document.createTextNode(content);
  tag.appendChild(content);
  container.appendChild(tag);
};
