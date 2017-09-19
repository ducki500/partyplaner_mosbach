//Partyplaner
var express  = require('express');
var app      = express();                               // EXPRESS APP ERSTELLEN
var mongoose = require('mongoose');                     // MONGOOSE FÜR DATENBANKVERBINDUNG
var morgan = require('morgan');             // ANZEIGEN VON REQUESTS IM TERMINAL
var bodyParser = require('body-parser');    // REQUEST INFORMATIONEN AUSLESEN
var methodOverride = require('method-override');


// KONFIGURATION

mongoose.connect('mongodb://localhost:27017/eventdb');     // VERBINDUNG ZUR DATENBANK

app.use(express.static(__dirname + '/public'));                 // STANDARDEINSTELLUNGEN NODE
app.use(morgan('dev'));                                         // STANDARDEINSTELLUNGEN NODE
app.use(bodyParser.urlencoded({'extended':'true'}));            // STANDARDEINSTELLUNGEN NODE
app.use(bodyParser.json());                                     // STANDARDEINSTELLUNGEN NODE
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // STANDARDEINSTELLUNGEN NODE
app.use(methodOverride());


// STARTE APP AUF PORT 8080
app.listen(8080);
console.log("laeuft auf 8080");


// DATENBANK MODELL FESTLEGEN

var Event = mongoose.model('Event', {
    name : String,
    location: String,
    date: Date,
    host: String,
    info: String,
    time: String,
    participants: [],
    isChecked: Boolean
});


// API ADRESSEN

// API
// ALLE EVENTS VERSENDEN
app.get('/api/events', function(req, res) {

    // NUTZE MONGOOSE UM ALLE EVENTS ZU ERHALTEN
    Event.find(function(err, events) {

        // WENN EIN FEHLER AUFTRITT SENDE FEHLERMELDUNG
        if (err)
            res.send(err)

        res.json(events); // SENDE ALLE EVENTS
    });
});

// ERSTELLE EVENTS UND SENDE ALLE EVENTS ZURÜCK
app.post('/api/events', function(req, res) {
    // ERSTELLE TOOD (INFORMATIONEN AUS ANFRAGE AUSLESEN)
    Event.create({
        name : req.body.name,
        participants: req.body.participants,
        date: req.body.date,
        info: req.body.info,
        location: req.body.location,
        host: req.body.host,
        date: req.body.date,
        time: req.body.time,
        isChecked: false,
        done : false
    }, function(err, event) {
        if (err)
            res.send(err); // WENN FEHLER AUFTRITT SENDE FEHLER ZURÜCK

        // EMPFANGE UND SENDE ALLE EVENTS NACHDEM EIN NEUES ERSTELLT WURDE
        Event.find(function(err, events) {
            if (err)
                res.send(err) // WENN FEHLER AUFTRITT SENDE FEHLER ZURÜCK
            res.json(events); // SONST SENDE EVENTS
        });
    });

});

// FÜGE TEILNEHMER ZU EVENT HINZU
app.put('/api/events/add/:event_id', function(req, res) {
    // AKTUALISIERE EVENT (NEUE TEILNEHMER)
    Event.update({
        _id : req.params.event_id
    },
    {$push: {participants: req.body.participant}}, // AKTUALISIERE TEILNEHMER VARIABLE
    function(err, event) {
        if (err)
            res.send(err);

        // EMPFANGE UND SENDE ALLE EVENTS NACHDEM EIN NEUES ERSTELLT WURDE
        Event.find(function(err, events) {
            if (err)
                res.send(err)
            res.json(events);
        });
    });

});

// LÖSCHE EVENT
app.delete('/api/events/:event_id', function(req, res) {
    Event.remove({
        _id : req.params.event_id
    }, function(err, event) {
        if (err)
            res.send(err);

        // EMPFANGE UND SENDE ALLE EVENTS NACHDEM EIN NEUES ERSTELLT WURDE
        Event.find(function(err, events) {
            if (err)
                res.send(err)
            res.json(events);
        });
    });
});

// ANWENDUNG
app.get('*', function(req, res) {
   res.sendfile('./public/index.html'); // EGAL WELCHE ADRESSE AUFGERUFEN WIRD ZEIGE IMMER DIE STARTSEITE AN
});
