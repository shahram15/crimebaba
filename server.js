var express = require('express');
var path = require('path');
var app = express();

var bodyParser = require('body-parser')

var mongoose = require('mongoose');
mongoose.connect('mongodb://rando:butterchicken1@ds113799.mlab.com:13799/crimebaba')

var incidentSchema = mongoose.Schema({
  lon: String,
  lat: String,
  address: String,
  date: String,
  year: String,
  month: String,
  time: String,
  hour: String,
  typeOfStolen: String,
  gender: String,
  age: String
});

var Incident = mongoose.model('Incident', incidentSchema);



// Define the port to run on
app.set('port', 3000);

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.static(path.join(__dirname, 'public')));

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    // we're connected!
    console.log('connected to database');

    console.log('creating random incident');
    var currentTime = new Date();
    console.log(currentTime); 
    console.log(currentTime.getMonth()); 
    
    var sampleIncident = new Incident({
      lat: "41.381487",
      lon: "2.182197",
      address: "Placa Catalunya",
      date: currentTime,
      year: currentTime.getYear(),
      month: currentTime.getMonth(),
      time:  currentTime.getTime(),
      hour: currentTime.getHours(),
      typeOfStolen: "phone",
      gender: "male",
      age: "25"
    });

    sampleIncident.save(function (err, sampleIncident) {
      if (err) {
        return console.error(err);
      } else {
        console.log("sucessfully saved");
      }
    });

  })


  console.log('Listening on port ' + port);
});



app.post('/incidents',function(req,res){

  console.log("request");
  console.log(req.body);

  var newIncident = new Incident({
    lat: req.body.lat,
    lon: req.body.lon,
    address: req.body.address,
    date: req.body.date,
    year: req.body.year,
    month: req.body.month,
    time:  req.body.time,
    hour: req.body.hour,
    typeOfStolen: req.body.typeOfStolen,
    gender: req.body.gender,
    age: req.body.age
  });

  newIncident.save(function (err, sampleIncident) {
    if (err) {
      return console.error(err);
    } else {
      console.log("sucessfully saved");
    }
  });
  

});