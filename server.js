var express = require('express');
var path = require('path');
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://rando:butterchicken1@ds113799.mlab.com:13799/crimebaba')

var incidentSchema = mongoose.Schema({
  lon: String,
  lat: String,
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



