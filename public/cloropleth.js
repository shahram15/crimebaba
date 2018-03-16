
// MAP CONFIGURATION
// var mapStyle = [{
//   'stylers': [{'visibility': 'off'}]
// }, {
//   'featureType': 'landscape',
//   'elementType': 'geometry',
//   'stylers': [{'visibility': 'on'}, {'color': '#fcfcfc'}]
// }, {
//   'featureType': 'water',
//   'elementType': 'geometry',
//   'stylers': [{'visibility': 'on'}, {'color': '#bfd4ff'}]
// }];

var mapStyle = [];

var map;
var censusMin = Number.MAX_VALUE, censusMax = -Number.MAX_VALUE;

var mapOptions = {
  center: {lat: 41.3851, lng: 2.1734},
  zoom: 14,
  styles: mapStyle
};

var geocoder;
var zoomLevel = 14;



function initMap() {

  // load the map
  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  // set up the style rules and events for google.maps.Data
  map.data.setStyle(styleFeature);

  map.data.addListener('mouseover', mouseInToRegion);
  map.data.addListener('mouseout', mouseOutOfRegion);
  map.data.addListener('click', mouseClickToRegion);


  geocoder = new google.maps.Geocoder();

  // wire up the button
  var selectBox = document.getElementById('census-variable');
  google.maps.event.addDomListener(selectBox, 'change', function() {
    clearCensusData();

    loadCensusData(selectBox.options[selectBox.selectedIndex].value);
  });

  google.maps.event.addListener(map, 'zoom_changed', zoomLevelChanged);



  // state polygons only need to be loaded once, do them now
  loadMapShapes();

}

/** Loads the state boundary polygons from a GeoJSON source. */
function loadMapShapes() {
  // load US state outline polygons from a GeoJson file
  map.data.loadGeoJson('barrios.json', { idPropertyName: 'STATE' });

  // wait for the request to complete by listening for the first feature to be
  // added
  google.maps.event.addListenerOnce(map.data, 'addfeature', function() {
    google.maps.event.trigger(document.getElementById('census-variable'),
        'change');
  });
}

/**
 * Loads the census data from a simulated API call to the US Census API.
 *
 * @param {string} variable
 */
function loadCensusData(variable) {
  // load the requested variable from the census API (using local copies)
  var xhr = new XMLHttpRequest();

  var mongoData = new XMLHttpRequest();
  mongoData.open("GET", "/incidents");
  
  console.log("getting mongo data");
  mongoData.onload = function() {
    var incidentData = JSON.parse(mongoData.responseText);
    console.log("incidentData");
    console.log(incidentData);

    var incidentMarker;

    if(zoomLevel > 14){
      for(var i = 0; i < incidentData.length; i++){
        console.log("lat:" +  Number(incidentData[i].lat) + " lng:" +  Number(incidentData[i].lon))
        incidentMarker = new google.maps.Marker({
          position: { lat: Number(incidentData[i].lat), lng: Number(incidentData[i].lon)},
          map: map,
          title: ('incident#' + String(i))
        });
        incidentMarker.setMap(map);
      }
    }
    
    
  }
  mongoData.send();

  console.log("variable");
  console.log(variable);
  if(variable == "year"){
    console.log("loading annual data");
    xhr.open('GET','data/year.json');
  } if(variable == "january"){
    console.log("loading january data");
    xhr.open('GET','data/crime_01.json');
  } if(variable == "february"){
    console.log("loading february data");
    xhr.open('GET','data/crime_02.json');
  } if(variable == "march"){
    console.log("loading march data");
    xhr.open('GET','data/crime_03.json');
  } if(variable == "april"){
    console.log("loading april data");
    xhr.open('GET','data/crime_04.json');
  } if(variable == "may"){
    console.log("loading may data");
    xhr.open('GET','data/crime_05.json');
  } if(variable == "june"){
    console.log("loading june data");
    xhr.open('GET','data/crime_06.json');
  } if(variable == "july"){
    console.log("loading july data");
    xhr.open('GET','data/crime_07.json');
  } if(variable == "august"){
    console.log("loading august data");
    xhr.open('GET','data/crime_08.json');
  } if(variable == "september"){
    console.log("loading september data");
    xhr.open('GET','data/crime_09.json');
  } if(variable == "october"){
    console.log("loading october data");
    xhr.open('GET','data/crime_10.json');
  } if(variable == "november"){
    console.log("loading november data");
    xhr.open('GET','data/crime_11.json');
  } if(variable == "december"){
    console.log("loading december data");
    xhr.open('GET','data/crime_12.json');
  } 
  // else {
  //   xhr.open('GET', 'data/' + variable + '.json');
  // }
    
  
  


  xhr.onload = function() {
    var censusData = JSON.parse(xhr.responseText);
    censusData.shift(); // the first row contains column names

    censusData.forEach(function(row) {
      var censusVariable = parseFloat(row[0]);
      console.log("censusVariable: " + censusVariable);
      var stateId = row[1];
      console.log("stateId: " + stateId);

      // keep track of min and max values
      if (censusVariable < censusMin) {
        censusMin = censusVariable;
      }
      if (censusVariable > censusMax) {
        censusMax = censusVariable;
      }

      // update the existing row with the new data
      map.data
        .getFeatureById(stateId)
        .setProperty('census_variable', censusVariable);
    });

    // update and display the legend
    document.getElementById('census-min').textContent =
        censusMin.toLocaleString();
    document.getElementById('census-max').textContent =
        censusMax.toLocaleString();
  };
  xhr.send();
}

/** Removes census data from each shape on the map and resets the UI. */
function clearCensusData() {
  censusMin = Number.MAX_VALUE;
  censusMax = -Number.MAX_VALUE;
  map.data.forEach(function(row) {
    row.setProperty('census_variable', undefined);
  });
  document.getElementById('data-box').style.display = 'none';
  document.getElementById('data-caret').style.display = 'none';
}

/**
 * Applies a gradient style based on the 'census_variable' column.
 * This is the callback passed to data.setStyle() and is called for each row in
 * the data set.  Check out the docs for Data.StylingFunction.
 *
 * @param {google.maps.Data.Feature} feature
 */
function styleFeature(feature) {
  var high = [5, 65, 53];  // color of smallest datum
  var low = [92, 68, 38];

//  var low = [92, 68, 38];
  
//  var low = [151, 83, 34];   // color of largest datum

  // delta represents where the value sits between the min and max
  var delta = (feature.getProperty('census_variable') - censusMin) /
      (censusMax - censusMin);

  var color = [];
  for (var i = 0; i < 3; i++) {
    // calculate an integer color based on the delta
    color[i] = (high[i] - low[i]) * delta + low[i];
  }

  // determine whether to show this shape or not
  var showRow = true;
  if (feature.getProperty('census_variable') == null ||
      isNaN(feature.getProperty('census_variable'))) {
    showRow = false;
  }

  var outlineWeight = 0.5, zIndex = 1;
  if (feature.getProperty('state') === 'hover') {
    outlineWeight = zIndex = 2;
  }

  return {
    strokeWeight: outlineWeight,
    strokeColor: '#fff',
    zIndex: zIndex,
    fillColor: 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)',
    fillOpacity: 0.75,
    visible: showRow
  };
}

/**
 * Responds to the mouse-in event on a map shape (state).
 *
 * @param {?google.maps.MouseEvent} e
 */
function mouseInToRegion(e) {
  
  // set the hover state so the setStyle function can change the border
  e.feature.setProperty('state', 'hover');

  var percent = (e.feature.getProperty('census_variable') - censusMin) /
      (censusMax - censusMin) * 100;

  // update the label
  document.getElementById('data-label').textContent =
      e.feature.getProperty('NAME');
  document.getElementById('data-value').textContent =
      e.feature.getProperty('census_variable').toLocaleString();
  document.getElementById('data-box').style.display = 'block';
  document.getElementById('data-caret').style.display = 'block';
  document.getElementById('data-caret').style.paddingLeft = percent + '%';
}

/**
 * Responds to the mouse-out event on a map shape (state).
 *
 * @param {?google.maps.MouseEvent} e
 */
function mouseOutOfRegion(e) {
  // reset the hover state, returning the border to normal
  e.feature.setProperty('state', 'normal');
}



/**
 * Responds to the mouse-in event on a map shape (state).
 *
 * @param {?google.maps.MouseEvent} e
 */
function mouseClickToRegion(e) {
  
  // update the label
  var receivedCoordinates = e.feature.getProperty('center');

  console.log(receivedCoordinates);
  var centerCoordinates = { lng: Number(receivedCoordinates[0]), lat: Number(receivedCoordinates[1])};
  
  map.setCenter(centerCoordinates);
  map.setZoom(15);
  
}


function zoomLevelChanged(){
  zoomLevel = map.getZoom();
  console.log(zoomLevel);
  clearCensusData();
  loadCensusData("year");
}