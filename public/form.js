var buttonText = "tbd";

var formActivated = false;
var mapClickListener;

function formButtonHandler(){
  console.log("button handler");
  if(formActivated){
    deactivateForm();

  }else {
    clearCensusData();
    formActivated = true;

    document.getElementsByClassName("incidentForm")[0].className += " visibleForm";

    mapClickListener = google.maps.event.addListener(map, 'click', function(event) {
      geocoder.geocode({
        'latLng': event.latLng
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            document.getElementsByClassName("addressInput")[0].value = results[0].formatted_address;
            document.getElementsByClassName("latInput")[0].value = results[0].geometry.location.lat();
            document.getElementsByClassName("lonInput")[0].value = results[0].geometry.location.lng();
            console.log(results[0]);
          }
        }
      });
    });
  


  }
  
}

function deactivateForm(){
  loadCensusData("year");
  formActivated = false;
  document.getElementsByClassName("visibleForm")[0].className = "incidentForm";
  google.maps.event.removeListener(mapClickListener);
}

function incidentFormSubmit(event){
  event.preventDefault();
  console.log("BABA RANDO");
  
  console.log(document.incidentDetails);

  var newIncident = {
    lat: document.incidentDetails.lat.value,
    lon: document.incidentDetails.lon.value,
    date: document.incidentDetails.date.value,
    year: document.incidentDetails.date.value,
    month: document.incidentDetails.date.value,
    time:  document.incidentDetails.time.value,
    hour: document.incidentDetails.time.value,
    typeOfStolen: document.incidentDetails.typeofstolen.value,
    gender: document.incidentDetails.gender.value,
    age: document.incidentDetails.age.value
  };

  var params =  "lat=" + newIncident.lat + "&" +
                "lon=" + newIncident.lon + "&" +
                "date=" + newIncident.date + "&" +
                "year=" + newIncident.year + "&" +
                "month=" + newIncident.month + "&" +
                "time=" + newIncident.time + "&" +
                "hour=" + newIncident.hour + "&" +
                "teypeOfStolen=" + newIncident.typeOfStolen + "&" +
                "gender=" + newIncident.gender + "&" +
                "age=" + newIncident.age;
                

  var xhttpReq = new XMLHttpRequest();
  xhttpReq.open("POST", "/incidents", true);
  xhttpReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttpReq.send(params);


  console.log(newIncident);
  console.log(params);

  deactivateForm();
  
  return false;
}